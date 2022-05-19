import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';
import { GraphCollectionResponse } from 'src/app/models/azure/graph-collection-response';
import { GraphGroup } from 'src/app/models/azure/graph-group';
import { GraphProfile } from 'src/app/models/azure/graph-profile';
import { Role } from 'src/app/models/azure/enums';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const graphUrl = environment.azureAD.graphUrl;

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  logging = environment.loggingEnabled
  constructor(private http: HttpClient,
    private storageService: StorageService) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getProfile(): Observable<GraphProfile> {
    return this.http.get<GraphProfile>(graphUrl + 'me')
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('GraphService | Me', res);
        }
        this.storageService.add('username', res.givenName);
      })
    );
  }

  getCurrentUserGroups(): Observable<GraphGroup[]> {
    return this.http.get<GraphCollectionResponse<GraphGroup>>(graphUrl + 'me/memberOf/microsoft.graph.group',
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('GraphService | me/memberOf/microsoft.graph.group', res);
        }
        this.storageService.add('roles', JSON.stringify(res.value.map(x => x.id)));
      }),
      map(val => val.value)
    );
  }

  getGroups(id: string): Observable<GraphGroup[]> {
    return this.http.get<GraphCollectionResponse<GraphGroup>>(graphUrl + `users/${id}/memberOf/microsoft.graph.group`)
    .pipe(
      tap(
        res => {
          if (this.logging) {
            console.log(`GraphService | users/${id}/memberOf/microsoft.graph.group`, res);
          }
        }
      ),
      map((val) => val.value)
    );
  }
}
