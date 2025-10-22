import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';

import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DummyService } from '../../shared/services/dummy.service';
import { DetailComponent } from './detail/detail.component';
import { ImageService } from '../../shared/services/image.service';
import { OGalleryModule } from 'ontimize-web-ngx-gallery';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    MarkdownModule.forChild(),
    SharedModule,
    OntimizeWebModule,
    HomeRoutingModule,
    OGalleryModule,

  ],
  declarations: [
    HomeComponent,
    DetailComponent
  ],
  providers: [
    DummyService,
    ImageService
  ]
})
export class HomeModule { }
