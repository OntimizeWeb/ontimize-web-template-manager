import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridData } from './grid-data';
import { CheckboxData } from './checkbox-data';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute
  ) {

  }

  navigate() {
    this.router.navigate(['../', 'login'], { relativeTo: this.actRoute });
  }

  getStaticData(attr) {
    return GridData.getData(attr);
  }

  getCheckboxes() {
    return CheckboxData.getData();
  }

}
