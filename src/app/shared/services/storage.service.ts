import { Injectable, KeyValueDiffers } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ThemeService } from './theme-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  logging: boolean = environment.loggingEnabled;
  constructor() { }

  get<T>(key: string): T {
    if (this.logging) {
      console.log(`StorageService | GET | Key: ${key}`, localStorage.getItem(key));
    }
    return localStorage.getItem(key) as unknown as T;
  }

  add(key: string, value: any) : void {
    if (this.logging) {
      console.log(`StorageService | SET | Key: ${key} Value: ${value}`);
    }
    localStorage.setItem(key, value);
  }

  clear(): void {
    localStorage.clear();
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
