import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LogLevel } from '../model/logLevel';
import { Response } from '../model/serverResponse';
//import { TokenRefresh } from '../model/tokenRefresh';
import { User } from '../model/user';
import { UserRegistration, UserRegistrationResponse } from '../model/UserRegistration';
import { ApiURLService } from './api-url.service';
import { LogService } from './log.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<User | null>;
  private userLocalStorage = 'user';
  public user: Observable<User | null>;
  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpClient,
    private logService: LogService,
    private apiURL: ApiURLService
  ) {
    this.userSubject = new BehaviorSubject<User | null>(this.extractUser());
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    const eu = this.extractUser();
    if (eu !== this.userSubject.value && eu !== null) {
      this.userSubject.next(eu);
    }
    return this.userSubject.value;
  }

  private saveUser(user: User | null): void {
    if (user === null) {
      localStorage.removeItem(this.userLocalStorage);
    } else {
      localStorage.setItem(this.userLocalStorage, JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  private extractUser(): User | null {
    const u = localStorage.getItem(this.userLocalStorage);
    if (u !== null && !this.jwtHelper.isTokenExpired(JSON.parse(u).access_token)) {
      return JSON.parse(u);
    }
    this.saveUser(null);
    return null;
  }

  login(username: string, password: string): Observable<User | null> {
    console.log({ username, password });
    return this.http.post<User | null>(`${this.apiURL.baseApiUrl}/users/login`, { username, password })
      .pipe(map(u => {
        //console.log(u);
        this.saveUser(u);
        this.logService.log('Logged in properly');
        return u;
      }));
  }

  logout(message?: string): void {
    // remove user from local storage and set current user to null
    this.saveUser(null);
    if (message) { // User is logout for some unkown reason
      this.logService.log(message);
    } else { // User ask for logout
      this.logService.log('Logged out properly');
    }
    this.router.navigate(['/']);
  }

  register(user: UserRegistration): Observable<UserRegistrationResponse> {
    return this.http.post<Response<UserRegistrationResponse>>(`${this.apiURL.baseApiUrl}/users`, user)
      .pipe(map(u => u.data));
  }

  async updateEmail(newEmail: string): Promise<void> {
    const data = { email: newEmail };
    await this.update(data);
    return;
  }

  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const data = { oldPassword, password: newPassword };
    await this.update(data);
    return;
  }

  // tslint:disable-next-line: no-any
  private async update(data: any): Promise<void> {
    const user = this.extractUser();
    if (user === null) {
      this.logService.log('No user logged while try to update user info', LogLevel.Error);
      throw Error('Invalid user');
    }
    this.http.put(`${this.apiURL.baseApiUrl}/users/${user.user_id}`, data)
      .pipe(map(_ => {
        this.logService.log('Data updated correctly');
        return;
      })).pipe(first()).subscribe();
  }

  /*refreshToken(): Observable<TokenRefresh> {
    const user: User | null = this.userValue;
    if (user === null) {
      this.logService.log('No user logged while try to refresh token', LogLevel.Error);
      return throwError('No user logged');
    }
    return this.http.post<Response<TokenRefresh>>(`${this.apiURL.baseApiUrl}/users/refresh`, { token: user.token, refresh: user.refresh })
      .pipe(map(a => {
        user.token = a.data.token;
        user.refresh = a.data.refresh;
        this.saveUser(user);
        return a.data;
      }));
  }*/
  
  deleteUser(): Observable<User> {
    const user: User | null = this.userValue;
    if (user === null) {
      this.logService.log('No user logged while try to delete user', LogLevel.Error);
      return throwError('No user logged');
    }
    return this.http.delete<Response<User>>(`${this.apiURL.baseApiUrl}/users/${user.user_id}`)
      .pipe(map(a => {
        this.saveUser(null);
        return a.data;
      }));
  }
}
