import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SiteTheme } from '../../site-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme: SiteTheme;
  themeChanged$: EventEmitter<SiteTheme>;
  
  constructor() {
    this.themeChanged$ = new EventEmitter();
    this.theme = { background: 'light', text: 'dark' }
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
    this.themeChanged$.emit(this.theme);
  }
}
