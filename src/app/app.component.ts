import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme-service';
import { SiteTheme } from './site-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TrainingHub';
  theme: SiteTheme = this.themeService.theme;
  isIframe: boolean = false;
  constructor(private themeService: ThemeService) {
    this.themeService.themeChanged$.subscribe(theme => this.theme = theme);
  }
  ngOnInit(): void {
    this.isIframe = window !== window.parent && window.opener;
  }
}
