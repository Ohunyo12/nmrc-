
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';


import { AppConfigService } from '../../shared/services/app.config.service';
import { ProductFee } from '../models/product-fee';

let AppConstant: any = {};
@Injectable()
export class ProductFeeService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    get() {
        return this.http.get(`${AppConstant.API_BASE}setups/fee`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {

        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/fee`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    update(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/fee/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAccountCategories() {
        return this.http.get(`${AppConstant.API_BASE}setups/account-category`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductFeeTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/fee/fee-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductFeeIntervals() {
        return this.http.get(`${AppConstant.API_BASE}setups/fee/fee-interval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/product-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductFeeTargets() {
        return this.http.get(`${AppConstant.API_BASE}setups/fee/fee-target`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllChartOfAccounts() {
        return this.http.get(`${AppConstant.API_BASE}setups/chart-of-account`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAmortisationTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/fee-amortisation-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFees() {
        return this.http.get(`${AppConstant.API_BASE}setups/charge-fee`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUmappedFees(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-fee/unmapped/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getMappedFees(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-fee/all/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTempUnmappedFees(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-fee/temp/unmapped/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllMappedFeesByProduct(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-fee/all/mapped/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    mapFeeToProduct(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/product-fee`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeFeeFromProduct(productFeeId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/product-fee/${productFeeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}