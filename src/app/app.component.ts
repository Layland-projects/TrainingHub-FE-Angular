import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme-service';
import { SiteTheme } from './site-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TrainingHub';
  theme: SiteTheme = this.themeService.theme;
  constructor(private themeService: ThemeService) {
    this.themeService.themeChanged$.subscribe(theme => this.theme = theme);
  }
}
