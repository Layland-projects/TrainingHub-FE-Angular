import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SiteTheme } from '../site-theme';
import { ThemeService } from '../shared/services/theme-service';
import { UserService } from '../shared/services/user-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  theme: SiteTheme = this.themeService.theme;

  constructor(
    private themeService: ThemeService,
    private userService: UserService
    ) {
      this.themeService.themeChanged$.subscribe(theme => this.updateTheme(theme));
     }

  ngOnInit(): void {
  }
  
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  updateTheme(theme: SiteTheme): void {
    this.theme = theme;
  }

  submit():void {
    this.userService.signIn(
      this.loginForm.controls['email'].value, 
      this.loginForm.controls['password'].value)
      .subscribe();
    console.log('form submitted', [ this.loginForm ])
  }
}
