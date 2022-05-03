import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Result } from 'src/app/models/result';
import { environment } from 'src/environments/environment';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = environment.apiUrl + "activities/"
  private logging: boolean = environment.loggingEnabled;
  constructor(private http: HttpClient,
    private imgService: ImageService) { }

  getActivities(pageNo: number = 0, pageSize: number = 10): Observable<Result<Activity[]>> {
    let url = this.apiUrl + `?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<Result<Activity[]>>(url)
      .pipe(
        tap(res => {
          if (this.logging) {
            console.log(`ActivityService | GetActivities | Status: ${res.status}`);
          }
        }),
        map(val => {
          if (val.data) {
            val.data.forEach(rec => rec.image = this.imgService.getActivitiesImg(rec.image));
          }
          return val;
        })
      );
  }

  getActivity(id: number): Observable<Result<Activity>> {
    let url = this.apiUrl + id;
    return this.http.get<Result<Activity>>(url)
      .pipe(
        tap(res => {
          if (this.logging) {
            console.log(`ActivityService | GetActivities | Status: ${res.status}`);
          }
        }),
        map(val => {
          if (val.data) {
            val.data.image = this.imgService.getActivitiesImg(val.data.image);
          }
          return val;
        })
      );
  }

  //Todo: add update method
}
