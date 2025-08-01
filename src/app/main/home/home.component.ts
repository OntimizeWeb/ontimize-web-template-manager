import { AfterViewInit, Component, Injector, OnDestroy, OnInit, QueryList, SimpleChange, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Expression, FilterExpressionUtils, OCheckboxComponent, OGridComponent, OSearchInputComponent } from 'ontimize-web-ngx';
import { DummyService } from '../../shared/services/dummy.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sidenav', { static: false }) private sidenav: MatSidenav;
  @ViewChild('grid', { static: false }) private grid: OGridComponent;
  @ViewChild('search', { static: false }) private search: OSearchInputComponent;
  @ViewChildren('checkbox') private checkbox: QueryList<OCheckboxComponent>;

  protected subscription: Subscription = new Subscription();
  protected media: MediaObserver;

  service: DummyService;
  imageService: ImageService;
  columns: number;
  hideBtn: boolean;

  constructor(
    protected injector: Injector,
    protected router: Router
  ) {
    this.service = this.injector.get(DummyService);
    this.imageService = this.injector.get(ImageService);
    this.media = this.injector.get(MediaObserver);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.filterChangesEvents();
    this.grid.registerQuickFilter(this.search);
  }

  ngOnInit(): void {
    this.configureService();
    this.subscribeToMediaChanges();
    this.hideBtn = true;
  }

  public subscribeToMediaChanges(): void {
    this.subscription.add(this.media.asObservable().subscribe((change: MediaChange[]) => {
      if (change && change[0]) {
        switch (change[0].mqAlias) {
          case 'xs':
          case 'sm':
            this.columns = 1;
            break;
          case 'md':
            this.columns = 2;
            break;
          case 'lg':
          case 'xl':
            this.columns = 3;
        }
      }
    }));
  }

  protected getImgUrl(name: string) {
    return this.imageService.getImgUrl(name);
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('templates');
    this.service.configureService(conf);
  }

  createFilter(values: Array<{ attr, value }>): Expression {
    // Prepare simple expressions from the filter components values
    let filters = [];
    values.forEach(fil => {
      if (fil.value) {
        if (fil.attr == "CHK_TABLES") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 1));
        }
        else if (fil.attr == "CHK_GRIDS") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 2));
        }
        else if (fil.attr == "CHK_LISTS") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 3));
        }
        else if (fil.attr == "CHK_TREES") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 4));
        }
        else if (fil.attr == "CHK_TAB") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 5));
        }
        else if (fil.attr == "CHK_DIALOG") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 6));
        }
        else if (fil.attr == "CHK_SPLIT_PANE") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 7));
        }
        else if (fil.attr == "CHK_CONTAINERS") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 8));
        }
        else if (fil.attr == "CHK_LOGIN") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 9));
        }
        else if (fil.attr == "CHK_FORM") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 10));
        }
        else if (fil.attr == "CHK_DASHBOARD") {
          filters.push(FilterExpressionUtils.buildExpressionEquals("TYPE", 11));
        }
      }
    });

    let ce: Expression;
    if (filters.length > 0) {
      ce = filters.reduce((exp1, exp2) => FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR));
    }
    return ce;

  }

  toogleSidenav() {
    this.sidenav.toggle()
  }

  clearSelection() {
    this.checkbox.forEach(chk => {
      if (chk.getValue() == true) {
        chk.clearValue();
      }
    });
    if (this.search.getValue() != "") {
      this.search.setValue("")
    }
  }

  filterChangesEvents() {
    let markedChk;
    let searchAct;
    this.checkbox.forEach(chk => {
      chk.onValueChange.subscribe(value => {
        markedChk = false;
        searchAct = false;
        this.checkbox.forEach(chk => {
          if (chk.getValue()) {
            markedChk = true;
          }
        });
        if (this.search.getValue() != '' && this.search.getValue() != null) {
          searchAct = true;
        }
        if (value.newValue) {
          this.hideBtn = false;
        } else if (!value.newValue && !markedChk && !searchAct) {
          this.hideBtn = true;
        }
      });
    });
    this.search.onSearch.subscribe(search => {
      if (search) {
        searchAct = true;
        this.hideBtn = false;
      } else if (!markedChk) {
        searchAct = false;
        this.hideBtn = true;
      }
    });
  }

}
