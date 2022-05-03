import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityService } from '../shared/services/activity.service';
import { ThemeService } from '../shared/services/theme-service';
import { ActivityValidators } from '../shared/validators/activity-validators';
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
      this.activityService.getActivity(id).subscribe(act => {
        this.activity = act.data;
        this.populateFormDefaults();
      })
    );
  }

  updateForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    type: new FormControl('', [
      Validators.required,
      ActivityValidators.validType
    ]),
    image: new FormControl('', [
      Validators.required,
      ActivityValidators.validImg
    ]),
    isBodyWeight: new FormControl('', [
      Validators.required
    ])
  })

  submit(): void {
    //todo: add call to service method to update using form
  }

  populateFormDefaults(): void {
    let title = this.updateForm.get('title');
    if (title) {
      title.setValue(this.activity?.title);
    }
    let description = this.updateForm.get('description');
    if (description) {
      description.setValue(this.activity?.description);
    }
    let type = this.updateForm.get('type');
    if (type) {
      type.setValue(this.activity?.type);
    }
    let image = this.updateForm.get('image');
    if (image) {
      image.setValue(this.activity?.image);
    }
    let isBodyWeight = this.updateForm.get('isBodyWeight');
    if (isBodyWeight) {
      isBodyWeight.setValue(this.activity?.isBodyWeight);
    }
  }
}
