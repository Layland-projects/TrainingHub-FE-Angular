import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { UsersComponent } from './users/users.component';
import { SessionsComponent } from './sessions/sessions.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { MeComponent } from './me/me.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    HomeComponent,
    UserProfileComponent,
    SignUpComponent,
    PasswordRecoveryComponent,
    UsersComponent,
    SessionsComponent,
    NotFoundComponent,
    ActivitiesComponent,
    ActivityEditComponent,
    MeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.azureAD.clientId,
        authority: environment.azureAD.authority + environment.azureAD.tokenId,
        redirectUri: environment.hostedUrl,
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie:isIE
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: [
          "user.read",
          "Directory.Read.All",
          "user.readwrite",
          environment.azureAD.authUrl + 'AngularApp',
        ]
      }
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        [environment.azureAD.graphUrl + 'me', ['user.read']],
        [environment.azureAD.graphUrl + 'me/*', ['Directory.Read.All']],
        [environment.azureAD.graphUrl + 'users/*/memberOf', ['Directory.Read.All']],
        [environment.azureAD.graphUrl + 'users/*', ['user.readwrite']],
        [environment.apiUrl + '*', [ environment.azureAD.authUrl + 'AngularApp']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
