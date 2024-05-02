import { Component, Injector, OnInit } from '@angular/core';
import { DummyService } from '../../../shared/services/dummy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  protected templateId: string;
  protected templateImg: string;
  protected templateTitle: string;
  protected templateDescription: string;
  private service: DummyService;

  constructor(
    protected injector: Injector,
    protected router: Router
  ) {
    this.templateId = window.location.href.split('/')[5];
    this.service = this.injector.get(DummyService);
  }

  ngOnInit(): void {
    this.configureService();
    this.queryTemplate();
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('templates');
    this.service.configureService(conf);
  }

  queryTemplate() {
    const filter = {
      "ID": +this.templateId
    };
    const columns = ["IMG","TITLE", "DESCRIPTION", "TYPE"];
    this.service.query(filter, columns, 'template').subscribe((response) => {
      if (response.code === 0) {
        this.templateImg = response.data[0].IMG;
        this.templateTitle  = response.data[0].TITLE;
        this.templateDescription = response.data[0].DESCRIPTION;
      }
    });
  }

  openHome() {
    this.router.navigate(['main/home']);
  }
}
