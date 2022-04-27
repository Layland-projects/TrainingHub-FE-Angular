import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subscription } from 'rxjs';
import { SiteTheme } from '../site-theme';
import { ThemeService } from '../shared/services/theme-service';
import { User } from '../models/user';
import { UserService } from '../shared/services/user-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  theme: SiteTheme = this.themeService.theme;
  user?: User | null | undefined;
  subs: Subscription[] = [];
  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
      this.updateForm.controls['firstName'].valueChanges.subscribe(val => {
        if (this.user != undefined) {
          this.user.firstName = val;
        }
      });
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
          if (user.status !== 1){
            this.router.navigate(['../'], { relativeTo: this.route });
          }
          else {
            this.refreshFormDefaults();
          }
        });
      }
    }));
  }

  updateForm = new FormGroup({
    title: new FormControl(this.user?.title),
    firstName: new FormControl(this.user?.firstName),
    lastName: new FormControl(this.user?.lastName),
    email: new FormControl(this.user?.email),
    password: new FormControl(this.user?.password),
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
      textualInfo.forEach(field => {
        if (field.dirty && field.valid) {
          this.subs.push(this.userService.updateUserInfo(this.user!.id, {
            id: this.user?.id,
            title: title?.value,
            firstName: firstName?.value,
            lastName: lastName?.value
          } as User).subscribe({
            complete: () => this.router.navigate([''], { relativeTo: this.route })
          }));
          return;
        }
      })
    }
  }
}
