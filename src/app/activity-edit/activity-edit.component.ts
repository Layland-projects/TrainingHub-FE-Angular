import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityType } from '../models/activity-type';
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
  types?: ActivityType[] = [];

  get isValid() { return this.updateForm.valid; }
  get form() { return this.updateForm; }
  get title() { return this.updateForm.get('title'); }
  get description() { return this.updateForm.get('description'); }
  get image() { return this.updateForm.get('image'); }
  get type() { return this.updateForm.get('type'); }
  get isBodyWeight() { return this.updateForm.get('isBodyWeight'); }

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
    this.subs.push(
      this.activityService.getTypes().subscribe(types => this.types = types.data)
    )
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
      ActivityValidators.validImg
    ]),
    isBodyWeight: new FormControl('', [
      Validators.required
    ])
  });

  submit(): void {
    this.subs.push(
      this.activityService.updateActivity(this.activity!.id, {
        title: this.title?.value,
        description: this.description?.value,
        type: this.type?.value,
        image: this.image?.value,
        isBodyWeight: this.isBodyWeight?.value
      } as Activity).subscribe({
        complete: () => this.router.navigate(['../'])
      })
    );
  }

  populateFormDefaults(): void {
    if (this.title) {
      this.title.setValue(this.activity?.title);
    }
    if (this.description) {
      this.description.setValue(this.activity?.description);
    }
    if (this.type) {
      this.type.setValue(this.activity?.type);
    }
    if (this.image) {
      this.image.setValue(this.activity?.image);
    }
    if (this.isBodyWeight) {
      this.isBodyWeight.setValue(this.activity?.isBodyWeight);
    }
  }
}
