import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckboxData } from './checkbox-data';
import { Expression, FilterExpressionUtils, OCheckboxComponent, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('checkbox', { static: false }) private checkbox: OCheckboxComponent;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
  }

  getCheckboxes() {
    return CheckboxData.getData();
  }

  createFilter(values: Array<{ attr, value }>): Expression {
    // Prepare simple expressions from the filter components values
    let filters: Array<Expression> = [];
    values.forEach(fil => {
      if (fil.value) {
        if (fil.attr == '1' || fil.attr == '2' || fil.attr == '3' || fil.attr == '4') {
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

}
