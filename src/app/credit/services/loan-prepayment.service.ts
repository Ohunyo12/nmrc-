
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from "../../admin/services/token.service";
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from "@angular/core";
//import { Http, Response, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { AppConfigService } from "../../shared/services/app.config.service";

let AppConstant: any = {};

@Injectable()
export class LoanPrepaymentService {
  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  getAccountOwner(refNo) {
    return this.http
      .get(`${AppConstant.API_BASE}casa/account-owner-by-account-number?accountNumber=${refNo}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getRunningLoanCurrentReversal(loanId) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/getrunningloanreversal/${loanId}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getGLNameByGLCode(accountCode) {
    return this.http
      .get(`${AppConstant.API_BASE}setups/chart-of-account/account-name-by-account-code?accountCode=${accountCode}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getCurrentPrepayment() {
    return this.http
      .get(`${AppConstant.API_BASE}operations/getrunningloan/`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getRunningLoan(refNo) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/getrunningloan/${refNo}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getRepaymentDate(refNo) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/get-repayment-date/${refNo}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getWriteOffLoan(refNo) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/getWiteOffloan/${refNo}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getRunningLoanOpeningBalance(refNo,effectiveDate) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/getrunningloanopeningbalance/${refNo}/${effectiveDate}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getRunningFXRevolvingLoan(refNo) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/get-running-fx-revolving-loan/${refNo}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    savePrepaymentReversal(body) {
    let bodyObj = JSON.stringify(body);
    return this.http
      .post(`${AppConstant.API_BASE}creditoperations/add-prepayment-reversal`, JSON.stringify(bodyObj))
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  saveBulkPrepaymentReversal(body) {
    let bodyObj = JSON.stringify(body);
    return this.http
      .post(`${AppConstant.API_BASE}creditoperations/add-bulk-prepayment-reversal`, JSON.stringify(bodyObj))
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  generatePeriodicSchedule(body) {
    let bodyObj = JSON.stringify(body);
    return this.http
      .post(`${AppConstant.API_BASE}loan/periodic-schedule`, bodyObj)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  SaveReassignAccount(data) {
    return this.http
      .post(`${AppConstant.API_BASE}loanoperation/reasign-account`, data)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPrincipalAndInterestDate(refNo,effectiveDate) {
    return this.http
      .get(`${AppConstant.API_BASE}operations/getPrincipalAndInterestDate/${refNo}/${effectiveDate}`)
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  
  save(body) {
    return this.http.post(`${AppConstant.API_BASE}creditoperations/add-loan-review`, JSON.stringify(body))
     .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  } 
  
}
