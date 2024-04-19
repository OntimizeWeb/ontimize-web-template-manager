import { Component, Injector, ViewChild } from '@angular/core';
import { CheckboxData } from './checkbox-data';
import { Expression, FilterExpressionUtils } from 'ontimize-web-ngx';
import { DummyService } from '../../shared/services/dummy.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('sidenav', { static: false }) private sidenav: MatSidenav;

  service: DummyService;

  constructor(
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
    let filters = [];
    values.forEach(fil => {
      if (fil.value) {
        if (fil.attr == "CHK_TABLES" || fil.attr == "CHK_GRIDS" || fil.attr == "CHK_LISTS" || fil.attr == "CHK_TREES") {
          filters.push(FilterExpressionUtils.buildExpressionEquals(fil.attr, fil.value));
        }
      }
    });
    let ce: Expression;
    if (filters.length > 0) {
      ce = filters.reduce((exp1, exp2) => FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_AND), null);
    }

    return ce;
  }

  toogleSidenav() {
    this.sidenav.toggle()
  }

}
