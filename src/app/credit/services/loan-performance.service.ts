
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { AuthHttp } from '../../admin/services/token.service';
//import { AppConstant } from '../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class LoanPerformanceService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  searchLoanPerformance(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchLoans(term)));
  }

  searchLoans(term) {
    return this.http
      .get(`${AppConstant.API_BASE}loan-management/loan-performance/search/${term}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  searchPerformingLoans(term) {
    return this.http
      .get(`${AppConstant.API_BASE}loan-management/loan-performance/search-loan/?searchQuery=${term}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllPrudentialGuildlineStatus() {
    return this.http.get(`${AppConstant.API_BASE}loan-management/loan-prudential-guildline-status`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllLoans(page: number, itemPerPage: number) {
    return this.http.get(`${AppConstant.API_BASE}loan-management/get-all-loans?page=${page}&itemsPerPage=${itemPerPage}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  loanPerformanceStatusChange(formObj) {
    let bodyObj = JSON.stringify(formObj);
    return this.http.post(`${AppConstant.API_BASE}loan-management/loan-performance-status-change`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
}
