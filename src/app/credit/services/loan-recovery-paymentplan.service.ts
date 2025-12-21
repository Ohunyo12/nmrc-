
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class LoanRecoveryPaymentPlanService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

 
    getDistinctLoanRecoveryPaymentPlan() {
         return this.http.get(`${AppConstant.API_BASE}setup/getDistinctLoanRecoveryPaymentPlan`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    addLaonRecoveryPayment(data) {
        return this.http.post(`${AppConstant.API_BASE}setup/loan-recovery-new`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getAmountPaid(loanReviewOperationId) {
        return this.http
          .get(`${AppConstant.API_BASE}setup/recovery-amount-paid/${loanReviewOperationId}`)
          .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
      }
    


    getLoanRecoverySchedule(loanReviewOperationId) {
        return this.http.get(`${AppConstant.API_BASE}setup/recovery-payment-schedule/${loanReviewOperationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


getLoanRecoverySearch(searchValue) {
    return this.http.get(`${AppConstant.API_BASE}setup/loan-recovery-search/${searchValue}`)
        .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}


    // GetAllProductType() {
    //      return this.http.get(`${AppConstant.API_BASE}setup/product-type`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));

    // }


    // GetAllCasa() {
    //      return this.http.get(`${AppConstant.API_BASE}setup/casa`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));

    // }

    
    GetAllloanRecoveryPaymentPlan() {
        return this.http.get(`${AppConstant.API_BASE}setup/getAllLoanRecoveryPaymentPlan`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

   }

    
    getLoanRecoveryPamyentPlans(id) {
        return this.http.get(`${AppConstant.API_BASE}setup/getloanRecoveryPaymentPlan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setup/addloanRecoveryPaymentPlan`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getLoanRecoveryList() {
        return this.http.get(`${AppConstant.API_BASE}setup/recovery-repayment-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    recoveryPaymentGoForApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}setup/recovery-repayment-go-for-approval`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    update(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setup/updateloanRecoveryPaymentPlan/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}