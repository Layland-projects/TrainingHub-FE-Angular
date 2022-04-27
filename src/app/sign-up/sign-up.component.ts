import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from '../models/role';
import { RoleService } from '../shared/services/role.service';
import { SiteTheme } from '../site-theme';
import { ThemeService } from '../shared/services/theme-service';
import { TitleService } from '../shared/services/title.service';
import { UserService } from '../shared/services/user-service';

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
    email: new FormControl(''),
    password: new FormControl(''),
    title: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    role: new FormControl(''),
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

