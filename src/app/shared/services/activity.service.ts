import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { UpdateActivityDTO } from 'src/app/dtos/update-activity-dto';
import { Activity } from 'src/app/models/activity';
import { ActivityType } from 'src/app/models/activity-type';
import { Result } from 'src/app/models/result';
import { environment } from 'src/environments/environment';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = environment.apiUrl + "activities/"
  private logging: boolean = environment.loggingEnabled;
  private httpOptions = { 
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

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

  getTypes(): Observable<Result<ActivityType[]>> {
    let types: ActivityType[] = [
      { name: 'Timed', value: 1 },
      { name: 'Repetitions', value: 2 }
    ];
    return of({
      data: types,
      status: 1,
      errors: []
    } as Result<ActivityType[]>)
  }

  updateActivity(id: number, activity: Activity): Observable<Result<any>> {
    let url = this.apiUrl + id;
    return this.http.put<Result<any>>(url, {
      title: activity.title,
      description: activity.description,
      isBodyWeight: activity.isBodyWeight,
      type: activity.type,
      image: activity.image
    } as UpdateActivityDTO,
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log(`ActivityService | UpdateActivity | ID: ${id} | Status: ${res.status}`);
        }
      }) 
    )
  }
}
