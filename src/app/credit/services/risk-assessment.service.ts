
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class RiskAssessmentService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    // generateSchedule(body) {
    //     let bodyObj = JSON.stringify(body);
    //     return this.http.post(`${AppConstant.API_BASE}loan/schedule`, bodyObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getRiskAssessmentIndexTitle() { // DUPLICATE!!!
        return this.http.get(`${AppConstant.API_BASE}setups/risk/risk-assessment-title`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplication() { // DUPLICATE
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAssessment(titleId,targetId) {
        return this.http.get(`${AppConstant.API_BASE}risk/risk-assessment/form?titleId=${titleId}&targetId=${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAssessmentResult() {
        return this.http.get(`${AppConstant.API_BASE}risk/assessment-result`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}risk/risk-assessment/save`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}