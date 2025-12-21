
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';

    
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class OverrideService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }    

    getAllOverrideRequest() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-all-override-request`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOverrideItems() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-all-override-items`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveOverRideRequest(data){
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/approve-override-request`,bodyObj)
        .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addOverrideRequest(data){
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/add-override-request`,bodyObj)
        .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOverridesAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/override-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}