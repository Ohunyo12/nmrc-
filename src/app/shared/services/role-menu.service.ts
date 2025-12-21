
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { AuthenticationService } from '../../admin/services/authentication.service';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app.config.service';
import { AuthHttp } from '../../admin/services/token.service';
import { catchError, map } from 'rxjs/operators';




let AppConstant: any = {};

@Injectable()
export class MenuVisibiltyService {

    // constructor() { }

    constructor(private http: AuthHttp,private authService: AuthenticationService, 
         private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    hideOrShow(activities: any[]): boolean {
        let userActivities = this.authService.getLoggedInUserActivities();
        return this.checkActivities(activities, userActivities);
    }

    checkActivities(acceptedArr, incomingArr: string[]): boolean {
        if (acceptedArr.length == 0) return true;
        return incomingArr.some(v => acceptedArr.indexOf(v) >= 0) || incomingArr.indexOf('super admin') > -1;
    }
    
        // test(body) {
        //     return this.http.get(`${AppConstant.API_BASE}setups/tax`)
        //         .map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        // }

    test(id) {

        if (id == 1) {
            return this.http.get(`${AppConstant.API_BASE}test/company/turnover`)
                .pipe(
                    map((res: any) => res),
                    catchError((error: any) => observableThrowError(error.error || 'Server error')));
        }
        
        if (id == 2) {
            return this.http.get(`${AppConstant.API_BASE}test/company/interest-turnover`)
                .pipe(
                    map((res: any) => res),
                    catchError((error: any) => observableThrowError(error.error || 'Server error')));
        }

        if (id == 3) {
            const id = 18077;
            return this.http.get(`${AppConstant.API_BASE}credit/loan-application-details-product/${id}`)
                .pipe(
                    map((res: any) => res),
                    catchError((error: any) => observableThrowError(error.error || 'Server error')));
        }
        
        if (id == 4) {
            return this.http.get(`${AppConstant.API_BASE}test/unauthorized`)
                .pipe(
                    map((res: any) => res),
                    catchError((error: any) => observableThrowError(error.error || 'Server error')));
        }

    }


}