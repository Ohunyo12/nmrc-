
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';





import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CallMemoService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    // Searching through Loan Application table
    searchForLoan(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => this.searchForLoanByCallLimit(term)),);
    }

    searchForLoanByCallLimit(term) {
        return this.http
            .get(`${AppConstant.API_BASE}credit/loan-search/?searchQuery=${term}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getFrequencyTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/frequency-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllCallLimitType() {
        return this.http.get(`${AppConstant.API_BASE}credit/call-limit-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllCallLimit() {
        return this.http.get(`${AppConstant.API_BASE}credit/call-limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCallLimitByTypeId(limitId) {
        return this.http.get(`${AppConstant.API_BASE}credit/call-limit-type${limitId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addCallLimit(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/call-limit`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCallLimit(formObj, limitId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/call-limit/${limitId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCallLimit(limitId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/call-limit/${limitId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCallMemoById(callMemoId: Number) {
        return this.http.get(`${AppConstant.API_BASE}credit/call-getMemo/${callMemoId}/callMemoId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerCallMemo(customerId: Number) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-customer-call-memo/${customerId}/customerId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerApprovedCallMemo(customerId: Number) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-customer-approved-call-memo/${customerId}/customerId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCallMemo() {
        return this.http.get(`${AppConstant.API_BASE}credit/call-getMemo`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCallMemoTrail(applicationId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/call-memo/trail/${applicationId}/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    searchCallMemo(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/search-call-memo`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCallMemo(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/call-memo`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCallMemo(formObj, memoId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/call-memo/${memoId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); //goForApproval
    }

    goForApproval(callMemo) {
        let callMemoObj = JSON.stringify(callMemo);
        return this.http.post(`${AppConstant.API_BASE}credit/go-for-approval`, callMemoObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // submitApproval(callMemo) {
    //     let callMemoObj = JSON.stringify(callMemo);
    //     return this.http.post(`${AppConstant.API_BASE}credit/submit-approval`, callMemoObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));//
    // }

    // getCallMemoWaitingForApproval() {
    //     return this.http.get(`${AppConstant.API_BASE}credit/get-call-memo-waiting-for-approval`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }
}