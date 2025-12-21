
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};

@Injectable()
export class FeeConcessionService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }
  getLoanApplicationFeeConcession(id) {
    return this.http.get(`${AppConstant.API_BASE}fees/fee-concession?loanDetailId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getFeeConcessionCharges(id) {
    return this.http.get(`${AppConstant.API_BASE}fees/fee-concession-charges?loanApplicationDetailId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getFeeConcessionType() {
    return this.http.get(`${AppConstant.API_BASE}fees/fee-concession-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  addUpdateFeeConcession(data) {
    return this.http.post(`${AppConstant.API_BASE}fees/fee-concession`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  sendFeeConcessionForApproval(data) {
    return this.http.post(`${AppConstant.API_BASE}fees/fee-concession-approval`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getFeeConcessionAwaitingApproval() {
    return this.http.get(`${AppConstant.API_BASE}fees/fee-concession-awaiting-approval`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
}
