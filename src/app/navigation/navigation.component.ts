import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { ThemeService } from '../shared/services/theme-service';
import { SiteTheme } from '../site-theme';
import { UserService } from '../shared/services/user-service';
import { Router } from '@angular/router';
import { filter, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../shared/services/storage.service';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { GraphService } from '../shared/services/graph.service';
import { Role } from '../models/azure/enums';
import { GraphProfile } from '../models/azure/graph-profile';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit, OnDestroy {
  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router,
    private storageService: StorageService,
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private graphService: GraphService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
  ) 
  {
    
  }

  @Input() title: string = '';
  theme = this.themeService.theme;
  displayName?: string = this.storageService.get<string>('displayName');
  roles?: Role[] = this.storageService.get<Role[]>('roles');
  subs: Subscription[] = [];
  logging: boolean = environment.loggingEnabled;
  // new stuff
  loginDisplay: boolean = false;
  private readonly _destroying$ = new Subject<void>();

  //condtional displays
  get isDev() { 
    //this is using the guid generated to represent the dev role
    return this.roles?.includes(Role.Dev); 
  }
  get isAdmin() {
    return this.roles?.includes(Role.Admin);
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
    
  ngOnInit(): void {
    this.subs.push(this.themeService.themeChanged$.subscribe(theme => this.updateTheme(theme)));
    this.subs.push(this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })
    );

    //Init login subscription
    this.subs.push(this.broadcastService.msalSubject$
      .pipe(
        filter((event: EventMessage) => event.eventType === EventType.LOGIN_SUCCESS),
        tap(_ => {
          if (this.logging) {
            console.log('NavigationComponent | Login event received');
          }
        })
      )
      .subscribe(_ => {
        this.subs.push(this.graphService.getProfile().subscribe(p => {
          let profile = p;
            this.subs.push(this.graphService.getCurrentUserGroups()
            .subscribe(r => {
              this.roles = r.map(groups => groups.id as Role);
              let roles = this.roles;
              this.subs.push(this.userService.register(profile, roles).subscribe());
            }));
        }));
    }));

    //Init logout subscription
    this.subs.push(this.broadcastService.msalSubject$
      .pipe(
        filter((event: EventMessage) => event.eventType === EventType.LOGOUT_SUCCESS)
      )
      .subscribe(_ => {
        let profile = this.storageService.get<GraphProfile>('profile');
        if (profile) {
          this.storageService.remove('profile');
        }
        let roles = this.storageService.get<string[]>('roles');
        if (roles) {
          this.storageService.remove('roles');
        }
      })
    );
  }

  swapTheme(): void {
    this.themeService.toggleTheme();
  }

  updateTheme(theme: SiteTheme): void {
    this.theme = theme;
  }

  login() : void {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    }
    else {
      this.authService.loginRedirect();
    }
  }

  logout(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/'
    });
  }

  setLoginDisplay(): void {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    this.displayName = this.storageService.get<string>('displayName');
  }
}
