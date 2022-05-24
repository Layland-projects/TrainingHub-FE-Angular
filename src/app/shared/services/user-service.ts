import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SignInDTO } from '../../dtos/sign-in-dto';
import { SignUpDTO } from '../../dtos/sign-up-dto';
import { ForgotPasswordDTO } from '../../dtos/forgot-password-dto';
import { SignOutDto } from '../../dtos/sign-out-dto';
import { UpdateEmailDto } from '../../dtos/update-email-dto';
import { UpdatePasswordDto } from '../../dtos/update-password-dto';
import { Result } from '../../models/result';
import { StorageService } from './storage.service';
import { GraphProfile } from 'src/app/models/azure/graph-profile';
import { Role } from 'src/app/models/azure/enums';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSignedIn$: EventEmitter<User>;
  userSignedOut$: EventEmitter<number>;
  displayName?: string = '';
  loggedInUser?: User;
  private apiUrl: string = environment.apiUrl + "users/";
  private logging: boolean = environment.loggingEnabled;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private storage: StorageService) {
      this.userSignedIn$ = new EventEmitter();
      this.userSignedOut$ = new EventEmitter();
   }

  getUsers(pageSize: number = 10, pageNum: number = 0) : Observable<Result<User[]>> {
    let queryString = `?pageSize=${pageSize}&pageNum=${pageNum}`;
    return this.http.get<Result<User[]>>(this.apiUrl + queryString)
    .pipe(
      tap(_ => {
        if (this.logging) {
          console.log('User Service | Getting users');
        }
      })
    );
  }

  register(profile: GraphProfile, roles: Role[]) : Observable<Result<any>> {
    let role = roles.includes(Role.Admin) ? 0 : roles.includes(Role.Dev) ? 1 : 2;
    return this.http.post<Result<any>>(this.apiUrl + 'register', 
    {
      id: profile.id,
      email: profile.userPrincipalName,
      firstName: profile.givenName,
      lastName: profile.surname,
      contactNumber: profile.mobilePhone,
      role: role
    },
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('User Service | Register', res);
        }
      })
    );
  }

  getUser(id: number) : Observable<Result<User>> {
    return this.http.get<Result<User>>(this.apiUrl + `${id}`)
    .pipe(
      tap(user => {
        if (this.logging) {
          console.log(`User Service | User retrieved | Id: ${id}`, user);
        }
      }),
      catchError(this.handleError<Result<User>>('getUser'))
    );
  }

  getUserByAzureId(azureId: string) : Observable<Result<User>> {
    return this.http.get<Result<User>>(this.apiUrl + `azure/${azureId}`)
    .pipe(
      tap(user => {
        if (this.logging) {
          console.log(`User Service | User retrieved | AzureId: ${azureId}`, user);
        }
      }),
      catchError(this.handleError<Result<User>>('getUserByAzureId'))
    );
  }

  handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed.`)
      console.error(error);

      return of(result as T);
    }
  }
}
