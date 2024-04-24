import { Injectable, Injector } from '@angular/core';
import { AppConfig, AuthService, FilterExpressionUtils, Observable, OntimizeEEService, ServiceResponse, Util } from 'ontimize-web-ngx';
import { Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class DummyService extends OntimizeEEService {

  entity: string;

  static mappings: object = {
    template: '/templates-data.json',
    checkboxes: '/checkboxes-data.json'
  };

  constructor(protected injector: Injector) {
    super(injector);
  }

  public getDefaultServiceConfiguration(serviceName?: string): Object {

    const authService = this.injector.get(AuthService);
    const configuration = this.injector.get(AppConfig).getServiceConfiguration();

    let servConfig = {};
    if (serviceName && configuration.hasOwnProperty(serviceName)) {
      servConfig = configuration[serviceName];
    }
    servConfig['session'] = authService.getSessionInfo();
    return servConfig;
  }

  public configureService(config: any): void {
    super.configureService(config);
    this._urlBase = './assets/dummy-data';

    if (config.entity !== undefined) {
      this.entity = config.entity;
    }
  }

  public startsession(user: string, password: string): Observable<any> {
    return undefined;
  }

  public endsession(user: string, sessionId: number): Observable<any> {
    return undefined;
  }

  public hassession(user: string, sessionId: number): Observable<any> {
    return undefined;
  }

  public query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;

    const url = this._urlBase + DummyService.mappings[entity];
    const options = {
      headers: this.buildHeaders()
    };
    return this.doRequest({
      method: 'GET',
      url,
      options,
      successCallback: (resp, subscriber) => {
        this.customParseSuccessfulQueryResponse(kv, resp, subscriber);
      },
      errorCallBack: this.parseUnsuccessfulQueryResponse
    });
  }

  public filteredQuery(kv?: object, av?: Array<string>, entity?: string,
    sqltypes?: object): Observable<any> {
    entity = (Util.isDefined(entity)) ? entity : this.entity;

    const url = this._urlBase + DummyService.mappings[entity];
    const options = {
      headers: this.buildHeaders()
    };
    return this.doRequest({
      method: 'GET',
      url: url,
      options: options,
      successCallback: (resp, subscriber) => {
        const filtered = resp.data.filter(item => {
          const equal = Object.keys(kv).every(key => item[key] === kv[key]);
          return equal;
        });
        resp.data = filtered;
        this.customParseSuccessfulQueryResponse(kv, resp, subscriber);
      },
      errorCallBack: this.parseUnsuccessfulQueryResponse
    });
  }

  public queryWithDelay(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<any> {
    const dataObservable: Observable<ServiceResponse> = new Observable((observer: Subscriber<ServiceResponse>) => {
      setTimeout(() => {
        this.query(kv, av, entity, sqltypes).subscribe({
          next: (resp: ServiceResponse) => observer.next(resp),
          error: (err: any) => observer.error(err)
        })
      }, 3000);
    });
    return dataObservable.pipe(share());
  }

  protected customParseSuccessfulQueryResponse(kv: any, resp: ServiceResponse, subscriber: Subscriber<ServiceResponse>) {
    if (resp && resp.isUnauthorized()) {
      this.clientErrorFallback(401);
    } else if (resp && resp.isFailed()) {
      subscriber.error(resp.message);
    } else if (resp && resp.isSuccessful()) {
      resp.data = this.filterResponse(kv, resp);
      subscriber.next(resp);
    } else {
      subscriber.error('Service unavailable');
    }
  }

  private reduceFilter(kv: object, filter) {
    let kv2;
    if (kv.hasOwnProperty("@basic_expression")) {
      kv2 = (({ lop, rop }) => ({ lop, rop }))(kv["@basic_expression"]);
      if (kv2.lop != "TYPE") {
        this.reduceFilter(kv2, filter);
      } else if (typeof kv2.rop != "number") {
        this.reduceFilter(kv2, filter);
      } else {
        filter.push(kv2.rop);
      }
    }
    if (kv.hasOwnProperty("lop")) {
      kv2 = kv["lop"];
      if (kv2.lop != "TYPE") {
        this.reduceFilter(kv2, filter);
      } else {
        filter.push(kv2.rop);
      }
    }
    if (kv.hasOwnProperty("rop")) {
      kv2 = kv["rop"];
      if (typeof kv2.rop != "number") {
        this.reduceFilter(kv2, filter);
      } else {
        filter.push(kv2.rop);
      }
    }
  }

  private filterResponse(kv: object, resp) {
    if (kv.hasOwnProperty(FilterExpressionUtils.FILTER_EXPRESSION_KEY)) {
      return this.fetchRoots(resp);
    }
    let filters = [];

    this.reduceFilter(kv, filters);

    const result = [];
    resp.data.forEach(element => {
      if (filters.includes(element.TYPE)) {
        result.push(element);
      }
    });
    return result;
  }

  private fetchRoots(resp: any): Array<any> {
    const rootsArray = [];
    resp.data.forEach(element => {
      if (!element.hasOwnProperty('PARENT')) {
        rootsArray.push(element);
      }
    });
    return rootsArray;
  }

}
