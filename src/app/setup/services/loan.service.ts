
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class LoanService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAllLoanTypes() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLoanScheduleCategory() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-schedule-category`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLoanScheduleType() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-schedule-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanScheduleTypeByCategory(categoryId: number) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-schedule-types/category/${categoryId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getBatchPostingDetails(model) {
        return this.http.post(`${AppConstant.API_BASE}finacle-integration/batch-posting/detail`, model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    generateDailyAccrualExcellReport(model) {
        return this.http.post(`${AppConstant.API_BASE}finacle-integration/daily-accrual-detail`, model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getBatchPostingMain(model) {
        return this.http.post(`${AppConstant.API_BASE}finacle-integration/batch-posting/main`, model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBatchPostingCount(model) {
        return this.http.post(`${AppConstant.API_BASE}finacle-integration/batch-posting/count`, model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBatchPostingDetailNew(model) {
        return this.http.post(`${AppConstant.API_BASE}finacle-integration/batch-posting/batchposting`, model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getEODErrorLog(model) {
        return this.http.post(`${AppConstant.API_BASE}finacle-integration/batch-posting/errorLog`, model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}