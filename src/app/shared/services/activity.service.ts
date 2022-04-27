import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Result } from 'src/app/models/result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = environment.apiUrl + "activities/"
  private logging: boolean = environment.loggingEnabled;
  private imgUrl = environment.activitiesImgUrl;
  constructor(private http: HttpClient) { }

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
            val.data.forEach(rec => rec.image = this.imgUrl + rec.image);
          }
          return val;
        })
      )
  }
}
