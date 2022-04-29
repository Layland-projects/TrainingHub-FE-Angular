import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Role } from '../models/role';
import { RoleService } from '../shared/services/role.service';
import { SiteTheme } from '../site-theme';
import { ThemeService } from '../shared/services/theme-service';
import { TitleService } from '../shared/services/title.service';
import { UserService } from '../shared/services/user-service';
import { UserValidators } from '../shared/validators/user-validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  theme: SiteTheme = this.themeService.theme;
  roles?: Role[];
  titles?: string[];
  selectedRole: boolean = false;
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get title() { return this.signUpForm.get('title'); }
  get firstName() { return this.signUpForm.get('firstName'); }
  get lastName() { return this.signUpForm.get('lastName'); }
  get role() { return this.signUpForm.get('role'); }
  get isValid() { return this.signUpForm.valid; }

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private roleService: RoleService,
    private titleService: TitleService
    ) {
      this.themeService.themeChanged$.subscribe(theme => this.updateTheme(theme));
     }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe(roles => this.roles = roles);
    this.titleService.getTitles().subscribe(titles => this.titles = titles);
  }
  
  signUpForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.email,
    ]),
    password: new FormControl('', 
      Validators.required
    ),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      UserValidators.validTitle
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      //custom validator for no special characters e.g @!?
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
      //custom validator for no special characters e.g @!?
    ]),
    role: new FormControl('', [
      Validators.required,
      UserValidators.validRole
    ]),
  })

  updateTheme(theme: SiteTheme): void {
    this.theme = theme;
  }

  submit():void {
    this.userService.signUp(
      this.signUpForm.controls['email'].value, 
      this.signUpForm.controls['password'].value,
      this.signUpForm.controls['title'].value,
      this.signUpForm.controls['firstName'].value,
      this.signUpForm.controls['lastName'].value,
      this.signUpForm.controls['role'].value)
      .subscribe();
    console.log('form submitted', [ this.signUpForm ])
  }

  selectRole(): void {
    this.selectedRole = true;
    console.log(this.selectedRole);
  }
}

