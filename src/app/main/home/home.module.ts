import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';

import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DummyService } from '../../shared/services/dummy.service';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    SharedModule,
    OntimizeWebModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    DetailComponent
  ],
  providers: [DummyService]
})
export class HomeModule { }
