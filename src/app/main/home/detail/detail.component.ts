import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppearanceService, Util } from 'ontimize-web-ngx';
import { GalleryImage } from 'ontimize-web-ngx-gallery';

import { DummyService } from '../../../shared/services/dummy.service';
import { ImageService } from '../../../shared/services/image.service';
import { GithubService } from '../../../shared/services/github.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [GithubService]
})
export class DetailComponent implements OnInit {
  protected templateId: string;
  protected templateImg: string;
  protected templateTitle: string;
  protected templateDescription: string;
  protected templateImages = [];
  protected templateBottomDescription: string;
  private service: DummyService;
  private imageService: ImageService;
  private appeareanceService: AppearanceService;
  private githubService: GithubService;
  protected galleryOptions = [
    {
      width: '100%',
      thumbnailsColumns: 3,
      aspectRatio: "5:3"
    }
  ];
  protected galleryImages: GalleryImage[];
  protected dark;
  templateURLReadme: string;
  templateURLGithub: string;

  constructor(
    protected injector: Injector,
    protected router: Router
  ) {
    this.templateId = window.location.href.split('/')[5];
    this.templateId = this.templateId.split('?')[0];
    this.service = this.injector.get(DummyService);
    this.imageService = this.injector.get(ImageService);
    this.appeareanceService = this.injector.get(AppearanceService);
    this.githubService = this.injector.get(GithubService);
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
        const currentData = response.data[0]
        if (Util.isDefined(currentData)) {
          this.templateImg = currentData.IMG;
          this.templateTitle = currentData.TITLE;
          this.templateDescription = currentData.DESCRIPTION;
          if (Util.isDefined(currentData.URLGITHUB)) {
            this.templateURLReadme = this.githubService.getGithubUrlReadme(currentData.URLGITHUB);
            this.templateURLGithub = this.githubService.getGithubUrl(currentData.URLGITHUB);
          }
          this.loadGallery(currentData.IMAGES);
          if (currentData.BOTTOM_DESCRIPTION != null) {
            this.templateBottomDescription = currentData.BOTTOM_DESCRIPTION;
          }
        }
      }
    });
  }

  public openRepository() {
    if (Util.isDefined(this.templateURLGithub)) {
      window.open(this.templateURLGithub, "_blank");
    }
  }
  public openHome() {
    this.router.navigate(['main/templates']);
  }
}
