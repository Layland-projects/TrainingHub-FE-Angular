import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityService } from '../shared/services/activity.service';
import { ThemeService } from '../shared/services/theme-service';
import { SiteTheme } from '../site-theme';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  activities: Activity[] | undefined;
  subs: Subscription[] = [];
  theme: SiteTheme = this.themeService.theme;

  constructor(private activityService: ActivityService,
    private themeService: ThemeService) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(
      this.activityService.getActivities().subscribe(
        acts => this.activities = acts.data
      )
    );
    this.subs.push(
      this.themeService.themeChanged$.subscribe(
        theme => this.theme = theme
      )
    );
  }

}
