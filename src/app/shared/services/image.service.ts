import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private activitiesImgUrl = environment.activitiesImgUrl;

  constructor() { }

  getActivitiesImg(img: string | undefined): string {
    if (img === undefined) {
      img = 'placeholder.png';
    }
    return this.activitiesImgUrl + img;
  }
}
