import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MeComponent } from './me/me.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { UserLoggedInGuard } from './shared/guards/user-logged-in.guard';
import { UserNotLoggedInGuard } from './shared/guards/user-not-logged-in.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileGuard } from './user-profile/user-profile.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'login', 
    component: LoginComponent,
    // canActivate: [
    //   UserNotLoggedInGuard
    // ] 
  },
  { 
    path: 'sign-up',
    component: SignUpComponent,
    // canActivate: [
    //   UserNotLoggedInGuard
    // ]
  },
  { 
    path: 'password-recovery',
    component: PasswordRecoveryComponent,
    // canActivate: [
    //   UserNotLoggedInGuard
    // ]
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [
      MsalGuard
    ]
  },
  { 
    path: 'users/:id', 
    component: UserProfileComponent,
    canActivate: [
      UserProfileGuard, 
      MsalGuard
    ]
  },
  { 
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: 'activities/:id',
    component: ActivityEditComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: 'me',
    component: MeComponent,
    canActivate: [
      MsalGuard
    ]
  },
  { path: "**", component: NotFoundComponent },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: !isIframe ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
