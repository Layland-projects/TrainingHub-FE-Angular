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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSignedIn$: EventEmitter<User>;
  userSignedOut$: EventEmitter<number>;
  displayName?: string | null = '';
  loggedInUser?: User | null;
  private apiUrl: string = environment.apiUrl + "users/";
  private logging: boolean = environment.loggingEnabled;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router) {
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

  signIn(email: string, password: string) : Observable<Result<number>> {
    return this.http.post<Result<number>>(this.apiUrl + 'signin', 
    { 
      email: email, 
      password: password 
    } as SignInDTO, this.httpOptions).pipe(
      tap(res => {
        if (this.logging) {
          console.log(`User Service | SignIn received ID: ${res.data}`);
        }
        if (res.data !== undefined){
          this.getUser(res.data).subscribe(u => {
            let user = u.data;
            if (user !== undefined) {
              this.setDisplayName(user);
              this.loggedInUser = user;
              this.userSignedIn$.emit(user);
              this.router.navigate(['../'], { relativeTo: this.route });
            }
          });
        }
      }),
      catchError(this.handleError<Result<number>>('signIn')),
    );
  }

  signUp(email: string, password: string, 
    title: string, firstName: string, lastName: string, role: number) : Observable<Result<User>> {
    return this.http.post<Result<User>>(this.apiUrl + 'signup', {
      title: title,
      firstName: firstName, 
      lastName: lastName, 
      email: email, 
      username: email,
      password: password,
      role: role
    } as SignUpDTO,
    this.httpOptions)
    .pipe(
      tap(_ => {
        if (this.logging){
          console.log('User Service | SignUp Success');
        }
        this.signIn(email, password).subscribe();
      }),
      catchError(this.handleError<Result<User>>('signUp'))
    );
  }

  logout(id: number) : Observable<Result<any>> {
    return this.http.post<Result<any>>(this.apiUrl + 'signout',
    {
      id: id
    } as SignOutDto,
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('User Service | SignOut Success', res);
        }
        this.displayName = null;
        this.loggedInUser = null;
        this.userSignedOut$.emit(id);
      }),
      catchError(this.handleError<Result<any>>('logout'))
    )
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

  forgotPassword(email: string) : Observable<Result<any>> {
    return this.http.post<Result<any>>(this.apiUrl + 'forgotpassword',
    {
      email: email
    } as ForgotPasswordDTO,
    this.httpOptions)
    .pipe(
      tap(obj => {
        if (this.logging) {
          console.log('User Service | ForgotPassword sent', obj);
        }
        this.router.navigate(['../login'], { relativeTo: this.route });
      }),
      catchError(this.handleError<Result<any>>('forgotPassword'))
    );
  }

  updateEmail(id: number, email: string) : Observable<Result<any>> {
    return this.http.post<Result<any>>(this.apiUrl + 'updateEmail', 
    { 
      id: id,
      email: email
    } as UpdateEmailDto,
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('User Service | UpdateEmail sent', res);
        }
        if (id === this.loggedInUser?.id){
          this.getUser(this.loggedInUser?.id).subscribe(user => this.loggedInUser = user.data);
        }
      }),
      catchError(this.handleError<Result<any>>('updateEmail'))
    );
  }

  updatePassword(id: number, password: string) : Observable<Result<any>> {
    return this.http.post<Result<any>>(this.apiUrl + 'updatePassword', 
    {
      id: id,
      password: password
    } as UpdatePasswordDto,
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('User Service | UpdatePassword sent', res);
        }
        if (this.loggedInUser?.id === id){
          this.getUser(this.loggedInUser.id).subscribe(user => this.loggedInUser = user.data);
        }
      }),
      catchError(this.handleError<Result<any>>('updatePassword'))
    );
  }
 
  updateUserInfo(id: number, user: User) : Observable<Result<any>> {
    return this.http.put<Result<any>>(this.apiUrl + `${id}`, 
    user,
    this.httpOptions)
    .pipe(
      tap(res => {
        if (this.logging) {
          console.log('User Service | UpdateUser sent', res);
          console.log(`Success: ${res.status === 1}`);
        }
        if (res.status === 1 && id === this.loggedInUser?.id) {
          this.setDisplayName(user)
          this.getUser(id).subscribe(u => this.userSignedIn$.emit(u.data));
          //update worked server side so let's refresh the app display
        }
      }),
      catchError(this.handleError<Result<any>>('updateUser'))
    );
  }

  handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed.`)
      console.error(error);

      return of(result as T);
    }
  }

  private setDisplayName(user: User): void {
    this.displayName = user.username ? user.username : user.firstName;
  }
}
