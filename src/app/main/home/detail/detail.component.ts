import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  protected templateId: string;

  constructor(
    protected router: Router
  ) {
    this.templateId = window.location.href.split('/')[5];
  }

}
