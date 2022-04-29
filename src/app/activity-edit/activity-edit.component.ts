import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityService } from '../shared/services/activity.service';
import { ThemeService } from '../shared/services/theme-service';
import { SiteTheme } from '../site-theme';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.css']
})
export class ActivityEditComponent implements OnInit, OnDestroy {
  activity?: Activity;
  theme: SiteTheme =  this.themeService.theme;
  subs: Subscription[] = [];

  constructor(private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.themeService.themeChanged$.subscribe(theme => this.theme = theme);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.subs.push(
      this.activityService.getActivity(id).subscribe(act => this.activity = act.data)
    );
  }

  updateForm = new FormGroup({
    field: new FormControl('')
  })

  submit(): void {

  }
}
