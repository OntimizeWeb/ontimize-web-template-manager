import { Component, Injector, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckboxData } from './checkbox-data';
import { Expression, FilterExpressionUtils, OCheckboxComponent, OFormComponent } from 'ontimize-web-ngx';
import { DummyService } from '../../shared/services/dummy.service';
import { ArrayType } from '@angular/compiler';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChildren('checkbox') private checkboxes: QueryList<OCheckboxComponent>;

  service: DummyService;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    protected injector: Injector
  ) {
    this.service = this.injector.get(DummyService);
  }

  ngOnInit(): void {
    this.configureService();
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('templates');
    this.service.configureService(conf);
  }

  getCheckboxes() {
    return CheckboxData.getData();
  }

  createFilter(values: Array<{ attr, value }>): Expression {
    // Prepare simple expressions from the filter components values
    let filters: Array<Expression> = [];
    values.forEach(fil => {
      if (fil.value) {
        if (fil.attr == 1 || fil.attr == 2 || fil.attr == 3 || fil.attr == 4) {
          filters.push(FilterExpressionUtils.buildExpressionLike(fil.attr, fil.value));
        }
      }
    });

    // Build complex expression
    if (filters.length > 0) {
      return filters.reduce((exp1, exp2) => FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_AND));
    } else {
      return null;
    }
  }

  getCheckboxesValues() {
    let values: Array<{ attr, value }> = [];
    this.checkboxes.forEach((c) => {
      values.push({ attr: c.getAttribute(), value: c.getValue() });
    });
    return values;
  }

  query() {
    const filter = {
      "TYPE": 2
    };
    const columns = ['ID'];
    this.service.query(filter, columns, 'templates');
  }

}
