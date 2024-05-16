import { Component, Input, OnInit } from '@angular/core';
import { AppearanceService } from 'ontimize-web-ngx';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public light = new BehaviorSubject(false);
  getDarkMode = this.light.asObservable();
  constructor(protected appeareanceService: AppearanceService) { }

  ngOnInit(): void {
    this.light.next(!this.appeareanceService.isDarkMode());
  }

  setDarkMode(darkMode: boolean) {
    this.appeareanceService.setDarkMode(darkMode);
    this.light.next(!this.appeareanceService.isDarkMode());
  }
}

