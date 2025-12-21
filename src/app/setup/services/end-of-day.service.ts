
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class EndOfDayService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getPublicHoliday() {
        return this.http.get(`${AppConstant.API_BASE}setups/public-holiday`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getnextApplicationDate() {
        return this.http.get(`${AppConstant.API_BASE}setups/application-date`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getApplicationEODLastRefreshedDate() {
        return this.http.get(`${AppConstant.API_BASE}setups/application-last-refreshed-date`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/public-holiday`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEndOfDay() {
        return this.http.get(`${AppConstant.API_BASE}admin/end-of-day`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    // getEndofdayOperationLog(eodDate) {
    //     return this.http.get(`${AppConstant.API_BASE}admin/get_endofday_operation_log/${eodDate}`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getEndofdayOperationLog(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}admin/get_endofday_operation_log`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    // getEndofdayOperationLogMonitoring(body) {
    //     let bodyObj = JSON.stringify(body);
    //     return this.http.post(`${AppConstant.API_BASE}admin/get_endofday_operation_log_monitoring`, bodyObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }


    getEndofdayOperationLogMonitoring() {
        return this.http.get(`${AppConstant.API_BASE}admin/get-endofday-operation-log-monitoring`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    
    deactivateInactiveUsers() {
        return this.http.get(`${AppConstant.API_BASE}admin/deactivate-inactive-users`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    logOutActiveUsers() {
        return this.http.get(`${AppConstant.API_BASE}logout-all-users`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

   // ProcessRepaymentFromStaging

    runEodBukPosting() {
        return this.http.get(`${AppConstant.API_BASE}admin/process-repayment-from-staging`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    refreshLoanClassification() {
        return this.http.get(`${AppConstant.API_BASE}admin/refresh-loan-classification`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    runEodOperation(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}admin/end-of-day`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    loanYearWeekends(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/public-holiday/weekends-in-a-year`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    update(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/public-holiday/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    delete(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/public-holiday-delete/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}