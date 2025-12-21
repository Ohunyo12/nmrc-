
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class LimitsService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    /**
     * Limits
     */

    getAllLimit() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addLimit(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/limit`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLimit(formObj, limitId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/limit/${limitId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLimit(limitId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/limit/${limitId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
    * Limits Details
    */

    getLimitDetailsObligor() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-detailObligor`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLimitDetailBranch() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-detailBranch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLimitDetailCustomerGroup() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-detailCustomerGroup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLimitDetailSector() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-detailSector`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLimitDetailRelationshipManager() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-detailRelationshipManager`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLimitdetailPrelimemaryEvaluationNote() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-detailPrelimemaryEvaluationNote`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addLimitDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/limit-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addMultipleLimitDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/limit-detail-multiple`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLimitDetail(formObj, limitDetailId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/limit-detail/${limitDetailId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLimitDetail(limitDetailId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/limit-detail/${limitDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Limits Metric
     */

    getAllLimitMetrics() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-metric`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Limits Type
     */

    getAllLimitTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Limits Value Type
     */

    getAllLimitValueTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-value-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Limits Frequency Type
     */

    getAllLimitFrequencyTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/limit-frequency-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}