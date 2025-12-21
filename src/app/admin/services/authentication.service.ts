import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable ,  Subject , throwError as observableThrowError } from 'rxjs';
import * as moment from 'moment';
import { AppConfigService } from '../../shared/services/app.config.service';
import { IUserProfile } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map ,  catchError } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class AuthenticationService {

    authKey = 'auth';
    token = '';
    redirectUrl = '';

    private username = new Subject<any>();

    private _userProfile: IUserProfile = {
        username: null,
        isLoggedIn: false,
        accessToken: null,
        staffId: null
    };

    constructor(
        private http: HttpClient,
        appconfigServ: AppConfigService,
        private router: Router
    ) {
        AppConstant = appconfigServ;
    }

    get lastUsername(): Observable<string> {
        return this.username.asObservable();
    }

    setLastUsername(username: string) {
        this.username.next(username);
    }

   

    getToken() {
        this.token = JSON.parse(window.sessionStorage.getItem(this.authKey));
        return this.token;
    }

    getRefreshToken() {
        let refreshToken = JSON.parse(window.sessionStorage.getItem('refreshToken'));
        return refreshToken;
    }

    getLoggedInUser() {
        return JSON.parse(window.sessionStorage.getItem(this.authKey));
    }

    setLoggedInUser(accessToken) {
        this._userProfile.accessToken = accessToken;
        this._userProfile.isLoggedIn = true;
        window.sessionStorage.setItem(this.authKey, JSON.stringify(accessToken));
    }

    setRefreshToken(refreshToken) {
        window.sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    }

    setTokenDuration(expires_in) {
        window.sessionStorage.setItem('expires_in', JSON.stringify(expires_in));
    }

    getTokenDuration() {
        return window.sessionStorage.getItem('expires_in');
    }

    setDateNow(){
        window.sessionStorage.setItem('date_now', JSON.stringify(Date.now()));
    }

    getDateNow(){
        return window.sessionStorage.getItem('date_now');
    }

   
    setLoggedInUserActivities(activities) {
        window.sessionStorage.setItem('userActivities', JSON.stringify(activities));
    }

    getLoggedInUserActivities() {
        return JSON.parse(window.sessionStorage.getItem('userActivities'));
    }

    getUserInfo() {
        return JSON.parse(window.sessionStorage.getItem('userInfo'));
    }

    setTokenExpirationTime(expDate) {
        

        window.sessionStorage.setItem('tokenExpiration', JSON.stringify(expDate));
    }

    getTokenExpirationTime() {
        return JSON.parse(window.sessionStorage.getItem('tokenExpiration'));
    }

    isUserLoggedIn(): boolean {
        if (window.sessionStorage.getItem(this.authKey)) {
            return true;
        } else {
            return false;
        }
    }

    signIn(userParams) {
        let bodyObj = JSON.stringify(userParams);
        return this.http.post(`${AppConstant.API_BASE}auth/token`, bodyObj, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(
            map((res: any) => res),
            catchError((error: any) =>  {
                return observableThrowError('Invalid Username or Password');})); //error.msg || error.message || error.error_description || 
    
            }

    getAuthToken(username, password) {
        let body = `username=${username}&password=${password}&grant_type=password`;
            
        return this.http.post(AppConstant.TOKEN_URL, body, 
            {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        }).pipe(
            map((res: any) => res),
            catchError((error: any) =>  {
                return observableThrowError('Invalid Username or Password');})); //error.msg || error.message || error.error_description || 
    }

    getAuthRefreshToken(username, refreshToken) {
        let body = `username=${username}&refresh_token=${refreshToken}&grant_type=refresh_token`;
       
        return this.http.post(AppConstant.TOKEN_URL, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        }).pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error.message || error.error.error_description || 'Server error. Please contact your administrator')));
    }


    get UserProfile(): IUserProfile {
        return this._userProfile;
    }

    setUserProfile(username: string, token: string) {
        this._userProfile.username = username;
        this._userProfile.accessToken = token;
        this._userProfile.isLoggedIn = true;
    }

    logOffSystem() {
        let bodyObj = {};
        return this.http.post(`${AppConstant.API_BASE}auth/logOut`, bodyObj, {
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
        }).pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error_description || 'Server error. Please contact your administrator')),);
    }

    logOffIdle() {
        let bodyObj = {};
    
        return this.http.post(`${AppConstant.API_BASE}auth/logout-idle`, bodyObj, 
        {
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
        }).pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error_description || 'Server error. Please contact your administrator')),);
    }
        
    endActiveSession(userParams) {
        let bodyObj = JSON.stringify(userParams);
        return this.http.post(`${AppConstant.API_BASE}auth/endpendingsession`, bodyObj, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.message ||  error.error_description || 'Server error. Please contact your administrator')),);
    }

    passwordChange(data) {
        let bodyObj = JSON.stringify(data);
       
        return this.http.post(`${AppConstant.API_BASE}auth/passwordchange`, bodyObj, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.message ||  error.error_description || 'Server error. Please contact your administrator')),);
    }

    verifyCorr(): boolean {
        if (this.getUserInfo().corrMatrixId > 0 && (this.getUserInfo().corrMatrixId == 4 || this.getUserInfo().corrMatrixId == 3)) {
            return false;
        }
        return true;
    }

    logOut() {
        this._userProfile.isLoggedIn = false;
        sessionStorage.removeItem(this.authKey);
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('tokenExpiration');
        sessionStorage.removeItem('refreshAt');
        this.unlockScreen();
        // this.removealliteminlocalStore();
    }

    bounceUserOut() {
        this.logOut();
        return this.router.navigate(['/auth/login']);
    }


    // SetUserSpecificTokenAccess(userSpecificTokenAccessEnabled){
    //     this._userProfile.userSpecificTokenAccessEnabled = userSpecificTokenAccessEnabled;
    //     window.sessionStorage.setItem(this.authKey, JSON.stringify(accessToken));
    // }

  


    setNextRefreshTime()   {
        const now   = moment();
        const future = now.add(10, 'minutes');
        const theTime =  future.format('YYYY-MM-DD HH:mm:ss');
        window.sessionStorage.setItem('refreshAt', JSON.stringify(theTime));
    }

    refreshToken()  {

    }

    setUserInfo(info) {
        this._userProfile.staffId = info.staffId;
        this._userProfile.username = info.userName;
        window.sessionStorage.setItem('userInfo', JSON.stringify(info));
        window.sessionStorage.setItem('userInfo', JSON.stringify(info));
        window.sessionStorage.setItem('lastLoggedInUser', info.userName);
        window.sessionStorage.setItem('lastLoggedInUser', info.userName);
    }
    getLastLoggedInUser() {
        return window.sessionStorage.getItem('lastLoggedInUser');
    }

    setLastLoggedInUser( userName: string) {
      window.sessionStorage.setItem('lastLoggedInUser', userName);
      window.sessionStorage.setItem('lastLoggedInUser', userName);
    }

    removealliteminlocalStore() {
        sessionStorage.clear();
        sessionStorage.clear();
    }






    getnextTimeToRefreshToken() {
        const time =  moment(JSON.parse(window.sessionStorage.getItem('refreshAt')));
        const now  = moment();
       // console.log( moment(time));
        // console.log( now);
        // console.log( time > now ? 'yes' : 'no');
        // console.log( time.isSameOrAfter(now) ? 'yes' : 'no');
        if (time) { return time; } else {
            return null;
        }
    }


    lockScreen() {
      sessionStorage.setItem('lockScreen','1');
    }
    screenWaslocked() {
      return  sessionStorage.getItem('lockScreen');
    }

    unlockScreen() {
      sessionStorage.removeItem('lockScreen');
    }



 
    refreshExpiredToken(): Observable<any> {
        const userInfo = this.getUserInfo();
        const refreshToken = this.getRefreshToken();
        const obs =  new Observable((observer) => {
          this.getAuthRefreshToken(userInfo.userName, refreshToken).subscribe((response: any) => {
            this.logOut();
            this.setLoggedInUser(response.access_token);
            this.setTokenExpirationTime(response.expiry_date);
            this.setRefreshToken(response.refresh_token);
  
            observer.next(response.access_token);
            observer.complete();
        }, (error) => {
          observer.error(error);
          observer.complete();
        });
    });
  
        return obs;
    }
}