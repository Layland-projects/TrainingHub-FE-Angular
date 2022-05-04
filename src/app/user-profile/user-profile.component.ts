import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteTheme } from '../site-theme';
import { ThemeService } from '../shared/services/theme-service';
import { User } from '../models/user';
import { UserService } from '../shared/services/user-service';
import { TitleService } from '../shared/services/title.service';
import { UserValidators } from '../shared/validators/user-validators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  theme: SiteTheme = this.themeService.theme;
  user?: User | null | undefined;
  subs: Subscription[] = [];
  titles: string[] = [];

  get isValid() { return this.updateForm.valid; }
  get form() { return this.updateForm; }
  get title() { return this.updateForm.get('title'); }
  get firstName() { return this.updateForm.get('firstName'); }
  get lastName() { return this.updateForm.get('lastName'); }
  get email() { return this.updateForm.get('email'); }
  get password() {return this.updateForm.get('password'); }

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: TitleService,
    private location: Location) {
      this.updateForm.controls['firstName'].valueChanges.subscribe(val => {
        if (this.user != undefined) {
          this.user.firstName = val;
        }
      });
      this.titleService.getTitles().subscribe(titles => this.titles = titles);
    }

  ngOnDestroy(): void {
    this.subs.forEach((x: Subscription) => x.unsubscribe());
  }
  
  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      let id = Number(params['id']);
      if (id !== undefined && id > 0) {
        this.userService.getUser(id).subscribe(user => {
          this.user = user.data;
          this.refreshFormDefaults();
        });
      }
    }));
  }

  updateForm = new FormGroup({
    title: new FormControl(this.user?.title, [
      Validators.required,
      UserValidators.validTitle
    ]),
    firstName: new FormControl(this.user?.firstName, [
      Validators.required
    ]),
    lastName: new FormControl(this.user?.lastName, [
      Validators.required
    ]),
    email: new FormControl(this.user?.email, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(this.user?.password, [
      Validators.required
    ]),
  })

  refreshFormDefaults(): void {
    this.updateForm.controls['title'].setValue(this.user?.title);
    this.updateForm.controls['firstName'].setValue(this.user?.firstName);
    this.updateForm.controls['lastName'].setValue(this.user?.lastName);
    this.updateForm.controls['email'].setValue(this.user?.email);
    this.updateForm.controls['password'].setValue(this.user?.password);
  }

  submit(): void {
    let textualInfo: AbstractControl[] = [];
    let title = this.updateForm.get('title');
    if (title !== null) { textualInfo.push(title); }
    let firstName = this.updateForm.get('firstName');
    if (firstName !== null) { textualInfo.push(firstName); }
    let lastName = this.updateForm.get('lastName');
    if (lastName !== null) {textualInfo.push(lastName); }
    let email = this.updateForm.get('email');
    let password = this.updateForm.get('password');
    if (email && email.dirty && email.valid) {
      this.userService.updateEmail(this.user!.id, email.value).subscribe();
    }
    if (password && password.dirty && password.valid) {
      this.userService.updatePassword(this.user!.id, password.value).subscribe();
    }
    if (textualInfo.length > 0) {
      this.subs.push(this.userService.updateUserInfo(this.user!.id, {
        id: this.user?.id,
        title: title?.value,
        firstName: firstName?.value,
        lastName: lastName?.value
      } as User).subscribe({
        complete: () => this.location.back()
      }));
    }
  }
}
