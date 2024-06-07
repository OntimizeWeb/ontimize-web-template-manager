import { AfterViewInit, Component, Injector, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { DummyService } from '../../../shared/services/dummy.service';
import { Router } from '@angular/router';
import { ImageService } from '../../../shared/services/image.service';
import { GalleryImage } from 'ontimize-web-ngx-gallery';
import { AppearanceService } from 'ontimize-web-ngx';

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
  protected templateBottomDescription: string;
  private service: DummyService;
  private imageService: ImageService;
  protected galleryOptions = [
    {
      width: '100%',
      thumbnailsColumns: 3,
      aspectRatio: "4:3"
    }
  ];
  protected galleryImages: GalleryImage[];
  protected dark;
  protected detail;

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
        "small": this.imageService.getImgUrl(img),
        "medium": this.imageService.getImgUrl(img), "big": this.imageService.getImgUrl(img)
      });
    });
    console.log(this.galleryImages);
  }

  private configureService() {
    const conf = this.service.getDefaultServiceConfiguration('templates');
    this.service.configureService(conf);
  }

  private queryTemplate() {
    const filter = {
      "ID": +this.templateId
    };
    const columns = ["IMG", "TITLE", "DESCRIPTION", "TYPE", "IMAGES", "BOTTOM-DESCRIPTION"];
    this.service.query(filter, columns, 'template').subscribe((response) => {
      if (response.code === 0 && Array.isArray(response.data)) {
        this.templateImg = response.data[0].IMG;
        this.templateTitle = response.data[0].TITLE;
        this.templateDescription = response.data[0].DESCRIPTION;
        this.loadGallery(response.data[0].IMAGES);
        if (response.data[0].BOTTOM_DESCRIPTION != null) {
          this.templateBottomDescription = response.data[0].BOTTOM_DESCRIPTION;
          this.detail = true;
        }
      }
    });
  }

  public openHome() {
    this.router.navigate(['main/templates']);
  }
}
