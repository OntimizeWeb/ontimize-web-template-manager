import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CheckboxData } from './checkbox-data';
import { AppearanceService, Expression, FilterExpressionUtils, OCheckboxComponent } from 'ontimize-web-ngx';
import { DummyService } from '../../shared/services/dummy.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MainComponent } from '../main.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('sidenav', { static: false }) private sidenav: MatSidenav;
  @ViewChild('enableChk', { static: true }) private checkbox: OCheckboxComponent;

  service: DummyService;
  light: boolean;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected appeareanceService: AppearanceService,
    protected mainComponent: MainComponent
  ) {
    this.service = this.injector.get(DummyService);
    mainComponent.getDarkMode.subscribe(mode => {
      this.light = mode;
    });
  }

  ngOnInit(): void {
    this.configureService();
    this.checkbox.setValue(true);
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

  openDetail(templateId) {
    this.router.navigate(['main/detail/', templateId]);
  }
}
