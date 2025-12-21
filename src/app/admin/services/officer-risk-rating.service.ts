// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';

import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { AuthHttp } from './token.service';
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class OfficerRiskRatingService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    saveOfficerRating(body) {
        return this.http.post(`${AppConstant.API_BASE}risk/credit-officer-risk-rating`, body)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateOfficerRating(body, id) {
        return this.http.put(`${AppConstant.API_BASE}risk/credit-officer-risk-rating/${id}`, JSON.stringify(body))
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteOfficerRating(id) {
        return this.http.delete(`${AppConstant.API_BASE}risk/credit-officer-risk-rating/${id}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOfficerRatingAssessmentParameters() {
        return this.http.get(`${AppConstant.API_BASE}risk/key-indicator-assessment-parameters`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getOfficerRatings() {
        return this.http.get(`${AppConstant.API_BASE}risk/credit-officer-risk-rating`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRatingPeriods() {
        return this.http.get(`${AppConstant.API_BASE}risk/rating-period`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRatingPeriod(body) {
        return this.http.post(`${AppConstant.API_BASE}risk/rating-period`, JSON.stringify(body))
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateRatingPeriod(body, id) {
        return this.http.put(`${AppConstant.API_BASE}risk/rating-period/${id}`, JSON.stringify(body))
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitCreditOfficerSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}risk/credit-officer-search`, JSON.stringify(body))
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getCurrentCreditOfficerRiskRating(id) {
        return this.http.get(`${AppConstant.API_BASE}risk/current-credit-officer-risk-rating/${id}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}