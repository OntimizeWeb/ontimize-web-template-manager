import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppearanceService, Util } from 'ontimize-web-ngx';
import { GalleryImage } from 'ontimize-web-ngx-gallery';

import { DummyService } from '../../../shared/services/dummy.service';
import { ImageService } from '../../../shared/services/image.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {
  protected templateId: string;
  protected templateImg: string;
  protected templateTitle: string;
  protected templateDescription: string;
  protected templateImages = [];
  public githubURLTemplate: string;
  protected templateBottomDescription: string;
  private service: DummyService;
  private imageService: ImageService;
  protected galleryOptions = [
    {
      width: '100%',
      thumbnailsColumns: 3,
      aspectRatio: "5:3"
    }
  ];
  protected galleryImages: GalleryImage[];
  protected dark;
  protected detail;
  templateURLReadme: string;
  teplateURLGithub: string;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected appeareanceService: AppearanceService
  ) {
    this.templateId = window.location.href.split('/')[5];
    this.templateId = this.templateId.split('?')[0];
    this.service = this.injector.get(DummyService);
    this.imageService = this.injector.get(ImageService);
    this.galleryImages = [];
  }


  ngOnInit(): void {
    this.configureService();
    this.queryTemplate();
    this.appeareanceService.isDarkMode$.subscribe(dark => {
      if (dark) {
        this.dark = "-dark";
      } else {
        this.dark = "";
      }
    });
  }

  private loadGallery(templateImages) {
    this.galleryImages = [];
    templateImages.forEach(img => {
      this.galleryImages.push({
        "small": this.imageService.getImgUrl(img.small),
        "medium": this.imageService.getImgUrl(img.big),
        "big": this.imageService.getImgUrl(img.big)
      });
    });
  }

  private configureService() {
    const conf = this.service.getDefaultServiceConfiguration('templates');
    this.service.configureService(conf);
  }

  private queryTemplate() {
    const filter = {
      "ID": +this.templateId
    };
    const columns = ["IMG", "TITLE", "DESCRIPTION", "TYPE", "IMAGES", "BOTTOM-DESCRIPTION", "URLGITHUB"];
    this.service.query(filter, columns, 'template').subscribe((response) => {
      if (response.code === 0 && Array.isArray(response.data)) {
        this.templateImg = response.data[0].IMG;
        this.templateTitle = response.data[0].TITLE;
        this.templateDescription = response.data[0].DESCRIPTION;
        if (Util.isDefined(response.data[0].URLGITHUB)) {
          this.templateURLReadme = '/ontimize-web-templates/develop/templates/' + response.data[0].URLGITHUB + '/README.md';
          this.teplateURLGithub = 'https://github.com/OntimizeWeb/ontimize-web-templates/blob/develop/templates/' + response.data[0].URLGITHUB ;
        }
        this.loadGallery(response.data[0].IMAGES);
        if (response.data[0].BOTTOM_DESCRIPTION != null) {
          this.templateBottomDescription = response.data[0].BOTTOM_DESCRIPTION;
          this.detail = true;
        }
      }
    });
  }

  public openRepository() {
    if (Util.isDefined(this.teplateURLGithub)) {
      window.open(this.teplateURLGithub, "_blank");
    }
  }
  public openHome() {
    this.router.navigate(['main/templates']);
  }
}
