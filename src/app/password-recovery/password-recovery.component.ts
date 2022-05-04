import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SiteTheme } from '../site-theme';
import { ThemeService } from '../shared/services/theme-service';
import { UserService } from '../shared/services/user-service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  theme: SiteTheme = this.themeService.theme;
  get email() { return this.recoveryForm.get('email'); }
  get isValid() { return this.recoveryForm.valid; }

  constructor(
    private themeService: ThemeService,
    private userService: UserService
    ) {
      this.themeService.themeChanged$.subscribe(theme => this.updateTheme(theme));
     }

  ngOnInit(): void {
  }
  
  recoveryForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.email
    ])
  })

  updateTheme(theme: SiteTheme): void {
    this.theme = theme;
  }

  submit():void {
    this.userService.forgotPassword(
      this.recoveryForm.controls['email'].value)
      .subscribe();
    console.log('form submitted', [ this.recoveryForm ])
  }
}
