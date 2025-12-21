
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';





import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CustomerRealTimeSearchService {
    constructor(private http: AuthHttp, private appConfigService: AppConfigService) {
        AppConstant = appConfigService;
    }

    // Searching through CASA based on customer type (group, batch, single)

    search(terms: Observable<any>) {

        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}casa/customer/search/${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // Searching through Customer table
    searchForCustomer(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForCustomerAccount(term)));
    }

    searchForCustomerAccount(term) {
        return this.http
            .get(`${AppConstant.API_BASE}casa/customer-account/${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchForCustomerGroup(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchCustomerGroupEntries(term)));
    }

    searchCustomerGroupEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}customers/customer-group/search/?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    // working code - others seem to be broken!

    searchForCustomerRealTime(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchCustomerRealtime(term)));
    }
    searchCustomerRealtime(search) {
        return this.http.get(`${AppConstant.API_BASE}customer/customer-information/?searchQuery=${search}`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}