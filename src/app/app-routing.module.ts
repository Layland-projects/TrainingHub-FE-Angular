import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
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
    canActivate: [
      UserNotLoggedInGuard
    ] 
  },
  { 
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [
      UserNotLoggedInGuard
    ]
  },
  { 
    path: 'password-recovery',
    component: PasswordRecoveryComponent,
    canActivate: [
      UserNotLoggedInGuard
    ]
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [
      UserLoggedInGuard
    ]
  },
  { 
    path: 'users/:id', 
    component: UserProfileComponent,
    canActivate: [
      UserProfileGuard, 
      UserLoggedInGuard
    ]
  },
  { 
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [
      UserLoggedInGuard
    ]
  },
  {
    path: 'activities/:id',
    component: ActivityEditComponent,
    canActivate: [
      UserLoggedInGuard
    ]
  },
  { path: "**", component: NotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
