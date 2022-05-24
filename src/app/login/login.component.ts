import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get isValid() { return this.loginForm.valid; }
  constructor(
    private themeService: ThemeService,
    private userService: UserService
  ){
    this.themeService.themeChanged$.subscribe(theme => this.updateTheme(theme));
  }

  ngOnInit(): void {
  }
  
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])
  })

  updateTheme(theme: SiteTheme): void {
    this.theme = theme;
  }

  submit():void {
    //this has been removed and maybe the whole component as this is handled by azure now
  }
}
