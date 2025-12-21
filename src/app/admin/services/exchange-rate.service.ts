
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthHttp } from './token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class ExchangeRateService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    get() {
        return this.http.get(`${AppConstant.API_BASE}admin/currency-rate`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCurrencies() {
        return this.http.get(`${AppConstant.API_BASE}admin/currency`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRateCode() {
        return this.http.get(`${AppConstant.API_BASE}admin/rate-code`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCurrencyRateCode() {
        return this.http.get(`${AppConstant.API_BASE}admin/currency-ratecode`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBaseCurrency() {
        return this.http.get(`${AppConstant.API_BASE}admin/base-currency`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCurrencyExchangeRate(currencyId) {
        return this.http.get(`${AppConstant.API_BASE}admin/currency-exchange-rate/${currencyId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}admin/currency-rate`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    update(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/currency-rate/${id}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


}