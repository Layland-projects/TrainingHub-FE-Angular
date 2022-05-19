import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/azure/enums';
import { GraphGroup } from '../models/azure/graph-group';
import { GraphProfile } from '../models/azure/graph-profile';
import { GraphService } from '../shared/services/graph.service';
import { ThemeService } from '../shared/services/theme-service';
import { SiteTheme } from '../site-theme';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css']
})
export class MeComponent implements OnInit, OnDestroy {
  profile!: GraphProfile;
  theme: SiteTheme = this.themeService.theme;
  subs: Subscription[] = [];
  username!: string;
  groups?: GraphGroup[];

  constructor(private graphService: GraphService,
    private themeService: ThemeService
    ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.graphService.getProfile().subscribe(profile => {
      this.profile = profile;
      this.username = profile.givenName;
      this.subs.push(this.graphService.getCurrentUserGroups().subscribe(groups => {
        this.groups = groups;
      }));
    }));
    this.subs.push(this.themeService.themeChanged$.subscribe(theme => this.theme = theme));
  }

  //there is potential to do updates too rather than just display - https://docs.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0&tabs=http  
}
