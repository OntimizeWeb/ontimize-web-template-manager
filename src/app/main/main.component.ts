import { Component } from '@angular/core';
import { AppearanceService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  constructor(protected appeareanceService: AppearanceService) { }

  toggleDarkMode() {
    if (this.appeareanceService.isDarkMode()) {
      this.appeareanceService.setDarkMode(false);
    } else {
      this.appeareanceService.setDarkMode(true);
    }
  }
}

