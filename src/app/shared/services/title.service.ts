import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titles: string[] = [
    "Mr",
    "Mrs",
    "Miss",
    "Dr",
    "Mx"
  ]
  constructor() { }

  getTitles(): Observable<string[]> {
    return of(this.titles);
  }
}
