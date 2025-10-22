import { Injectable } from "@angular/core";

@Injectable()
export class ImageService {

  constructor() { }

  public getImgUrl(name: string) {
    return window.location.origin + '/assets/images/template-images/' + name;
  }
}