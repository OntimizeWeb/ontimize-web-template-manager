import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppearanceService } from 'ontimize-web-ngx';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    protected appeareanceService: AppearanceService,
    protected router: Router
  ) { }

  private light = new BehaviorSubject(!this.appeareanceService.isDarkMode());
  public getDarkMode = this.light.asObservable();
  public lightBtn = this.light.value;

  ngOnInit(): void {
    this.light.next(!this.appeareanceService.isDarkMode());
  }

  setDarkMode(darkMode: boolean) {
    this.appeareanceService.setDarkMode(darkMode);
    this.light.next(!this.appeareanceService.isDarkMode());
    this.lightBtn = this.light.value;
  }

  openHome() {
    this.router.navigate(['main/templates']);
  }
}

