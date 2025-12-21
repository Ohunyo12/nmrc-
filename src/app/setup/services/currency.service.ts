
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';


// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CurrencyService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getCurrencies() {
        return this.http.get(`${AppConstant.API_BASE}setups/currency`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCollateralLen(body){
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}finance/addcollateralsearchlien`, bodyObj)
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

    getAllFacilities() {
        return this.http.get(`${AppConstant.API_BASE}setups/product`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCurrenciesbyProduct(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/currency-by-product/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
   
}
