import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ThemeService } from '../shared/services/theme-service';
import { SiteTheme } from '../site-theme';
import { UserService } from '../shared/services/user-service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit, OnDestroy {
  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router
  ) 
  {
    
  }

  @Input() title: string = '';
  theme = this.themeService.theme;
  displayName?: string = this.userService.displayName;
  user?: User;
  subs: Subscription[] = [];
  logging: boolean = environment.loggingEnabled;
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
    
  ngOnInit(): void {
    this.subs.push(this.themeService.themeChanged$.subscribe(theme => this.updateTheme(theme)));
      this.subs.push(this.userService.userSignedIn$.subscribe(user => {
        this.displayName = this.userService.displayName;
        this.user = user;
        if (this.logging) {
          console.log('user signed in event received', user);
        }
      }));
  }

  swapTheme(): void {
    this.themeService.toggleTheme();
  }

  updateTheme(theme: SiteTheme): void {
    this.theme = theme;
  }

  logout(): void {
    if (this.userService.loggedInUser){
      this.subs.push(this.userService.logout(this.userService.loggedInUser.id)
      .subscribe(
        res => {
          this.displayName = undefined;
          this.user = undefined;
          this.router.navigate(['']);
        }
      ));
    }
  }
}
