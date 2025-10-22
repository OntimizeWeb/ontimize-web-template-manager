import { Component, OnInit } from '@angular/core';
import { OntimizeMatIconRegistry } from 'ontimize-web-ngx';

const svgIcons = ["github-btn"];

@Component({
  selector: 'o-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private ontimizeMatIconRegistry: OntimizeMatIconRegistry
  ) { }

  ngOnInit() {
    if (this.ontimizeMatIconRegistry) {
      svgIcons.forEach(current => {
        this.ontimizeMatIconRegistry.addOntimizeSvgIcon(current, 'assets/images/' + current + '.svg');
        this.ontimizeMatIconRegistry.addOntimizeSvgIcon(current + '-dark', 'assets/images/' + current + '-dark.svg');
      })
    }
  }
}
