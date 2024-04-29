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
      }
    });

    if (filters.length > 0) {
      return filters.reduce((exp1, exp2) => FilterExpressionUtils.buildComplexExpression(exp1, exp2, FilterExpressionUtils.OP_OR));
    } else {
      return null;
    }
  }

  toogleSidenav() {
    this.sidenav.toggle()
  }

}
