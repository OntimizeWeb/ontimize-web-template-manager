import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MarkdownModule } from 'ngx-markdown';
import { APP_CONFIG, ONTIMIZE_PROVIDERS, OntimizeWebModule } from 'ontimize-web-ngx';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';
import { DummyService } from './shared/services/dummy.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Standard providers...
// Defining custom providers (if needed)...
export const customProviders: any = [
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OntimizeWebModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIG },
    ONTIMIZE_PROVIDERS,
    { provide: 'DummyService', useValue: DummyService },
    ...customProviders
  ]
})
export class AppModule { }
