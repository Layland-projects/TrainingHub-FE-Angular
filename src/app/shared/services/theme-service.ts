import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SiteTheme } from '../../site-theme';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme: SiteTheme;
  themeChanged$: EventEmitter<SiteTheme>;
  
  constructor(private storage: StorageService) {
    this.themeChanged$ = new EventEmitter();
    let storageBg = storage.get<string>('theme-bg');
    let storageTxt = storage.get<string>('theme-txt');
    this.theme = { background: 'light', text: 'dark' }
    if (storageBg) {
      this.theme.background = storageBg;
    }
    else {
      this.storage.add('theme-bg', 'light');
    }
    if (storageTxt) {
      this.theme.text = storageTxt;
    }
    else {
      this.storage.add('theme-txt', 'dark');
    }
    this.themeChanged$.emit(this.theme);
   }

  toggleTheme(): void {
    if (this.theme.background === 'light'){
      this.theme.background = 'dark';
      this.theme.text = 'light';
    }
    else {
      this.theme.background = 'light';
      this.theme.text = 'dark';
    }
    this.storage.add('theme-bg', this.theme.background);
    this.storage.add('theme-txt', this.theme.text);
    this.themeChanged$.emit(this.theme);
  }
}
