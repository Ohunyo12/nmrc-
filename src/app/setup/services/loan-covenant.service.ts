
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class LoanCovenantService {


    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAllLoanCovenantType() {
        return this.http.get(`${AppConstant.API_BASE}credit/covenant-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanCovenantDetail(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/covenant-detail/loan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCovenantType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/covenant-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCovenantType(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/covenant-type/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCovenantDetail(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/covenant-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCovenantDetail(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/covenant-detail/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetailCovenant(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/covenant/loan-application-detail/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCovenantDetailMaintenance(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-covenant`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCovenantDetailMaintenance(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/loan-application-covenant/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    getFrequencyTypes() {
        return this.http.get(`${AppConstant.API_BASE}loan/limit-frequency-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanSearch(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/loan-search`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRoute(id, route) { return id === 1 ? route : 'lms-' + route; }

    getLoanApplicationCovenant(callerId, id) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'covenant')}/loan-application/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLoanApplicationCovenant(callerId, body) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'loan-application-covenant')}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLoanApplicationCovenant(callerId, id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'loan-application-covenant')}/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }




}