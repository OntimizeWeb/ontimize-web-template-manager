import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DummyService } from '../../../shared/services/dummy.service';
import { Router } from '@angular/router';
import { OFormComponent } from 'ontimize-web-ngx';
import { ImageService } from '../../../shared/services/image.service';
import { GalleryComponent } from 'ontimize-web-ngx-gallery';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit, AfterViewInit {
  protected templateId: string;
  protected templateImg: string;
  protected templateTitle: string;
  protected templateDescription: string;
  protected templateImages = [];
  private service: DummyService;
  private imageService: ImageService;
  protected galleryOptions = [
    {
      height: "670px",
      width: "936px",
      thumbnailsColumns: 3,
      thumbnailsRows: 1,
      layout: "thumbnails-bottom"
    }
  ];
  protected galleryImages = [];
  protected gallerImages = [{}];
  @ViewChild("gallery", { static: false }) gallery: GalleryComponent;

  constructor(
    protected injector: Injector,
    protected router: Router
  ) {
    this.templateId = window.location.href.split('/')[5];
    this.templateId = this.templateId.split('?')[0];
    this.service = this.injector.get(DummyService);
    this.imageService = this.injector.get(ImageService);
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.configureService();
    this.queryTemplate();
  }

  private loadGallery(templateImages) {
    templateImages.forEach(img => {
      this.galleryImages.push({"small": "'"+this.imageService.getImgUrl(img)+"'",
        "medium":"'"+this.imageService.getImgUrl(img)+"'", "big": "'"+this.imageService.getImgUrl(img)+"'"});
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
    const columns = ["IMG", "TITLE", "DESCRIPTION", "TYPE", "IMAGES"];
    this.service.query(filter, columns, 'template').subscribe((response) => {
      if (response.code === 0) {
        this.templateImg = response.data[0].IMG;
        this.templateTitle = response.data[0].TITLE;
        this.templateDescription = response.data[0].DESCRIPTION;
        this.loadGallery(response.data[0].IMAGES);
      }
    });
  }

  public openHome() {
    this.router.navigate(['main/templates']);
  }
}
