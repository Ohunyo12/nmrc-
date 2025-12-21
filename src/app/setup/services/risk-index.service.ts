// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';

import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';



import { AppConfigService } from '../../shared/services/app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class RiskIndexService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getRiskAssessmentIndexByTitle(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/risk/risk-assessment-index/risktitle/${id}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllRiskAssessmentTitle() {
        return this.http.get(`${AppConstant.API_BASE}setups/risk/risk-assessment-title`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveAssessmentTitle(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/risk/risk-assessment-title`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    filter(body) { //FILTER
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/risk/filter-risk-index`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRiskAssessmentIndexTitle() { //FILTER
        return this.http.get(`${AppConstant.API_BASE}setups/risk/risk-assessment-title`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/risk/risk-assessment-index`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    update(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/risk/risk-assessment-index/${id}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProducts() {
        return this.http.get(`${AppConstant.API_BASE}setups/product-type`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}