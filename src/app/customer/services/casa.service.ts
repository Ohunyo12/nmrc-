
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';





import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CasaService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    searchForAccount(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.search(term)));
    }

    search(searchString) {
        return this.http.get(`${AppConstant.API_BASE}casa/account-number-name?accountNumberOrName=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchCustomerCasaLien(searchString) {
        return this.http.get(`${AppConstant.API_BASE}casa/find-customer-casa-lien/accountNumberOrName/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCasaLoans(casaAccountId: number) {
        return this.http.get(`${AppConstant.API_BASE}casa/get-all-casa-loans/casaAccountId/${casaAccountId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCasaLiens(accountNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}casa/get-all-casa-liens/accountNumber/${accountNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCasaLienTypes() {
        return this.http.get(`${AppConstant.API_BASE}casa/get-all-casa-lien-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addConsumerProtection(consumerProtectionObj) {
        //let consumerProtectionObj = JSON.stringify(consumerProtection);
        return this.http.post(`${AppConstant.API_BASE}casa/add-consumer-protection`, consumerProtectionObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllConsumerProtections() {
        return this.http.get(`${AppConstant.API_BASE}casa/get-all-consumer-protections`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentSectionConsumerProtection(operationId, targetId, sectionId) {
        return this.http.get(`${AppConstant.API_BASE}casa/get-document-section-consumer-protection/operation/${operationId}/target/${targetId}/section/${sectionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoadedDocumentationConsumerProtection(consumerProtectionById, operationId) {
        return this.http.get(`${AppConstant.API_BASE}casa/get-consumer-protection-memo/consumerProtectionById/${consumerProtectionById}/operationId/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCasaLien(casaLien) {
        let casaLienObj = JSON.stringify(casaLien);
        return this.http.post(`${AppConstant.API_BASE}casa/add-casa-lien`, casaLienObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
 
    removeCasaLien(casaLien) {
        let casaLienObj = JSON.stringify(casaLien);
        return this.http.post(`${AppConstant.API_BASE}casa/remove-casa-lien`, casaLienObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchGroupCASA(searchString, customerId) {
        return this.http.get(`${AppConstant.API_BASE}casa/group-account-number?accountNumberOrName=${searchString}&customerId=${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchOverdraftCASA(searchString, customerId) {
        return this.http.get(`${AppConstant.API_BASE}casa/overdraft-account-number?accountNumberOrName=${searchString}&customerId=${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAccountStatus(id) {
        let list: any = [
            { 'AccountStatusId': '1', 'AccountStatusName': 'Active' },
            { 'AccountStatusId': '2', 'AccountStatusName': 'Unapproved' },
            { 'AccountStatusId': '3', 'AccountStatusName': 'Dormant' },
            { 'AccountStatusId': '4', 'AccountStatusName': 'Closed' },
            { 'AccountStatusId': '5', 'AccountStatusName': 'Freeze' },
            { 'AccountStatusId': '6', 'AccountStatusName': 'Inactive' },
        ];
        let model = list.find(x => x.AccountStatusId == id);
        return (model == null) ? 'n/a' : model.AccountStatusName;
    }

    getOperation(id) {
        let list: any = [
            { 'OperationId': '1', 'Name': 'Revision' },
            { 'OperationId': '2', 'Name': 'Suspension' },
            { 'OperationId': '3', 'Name': 'Cancellation' },
            { 'OperationId': '4', 'Name': 'Termination' },
            { 'OperationId': '5', 'Name': 'Inactive' },
            { 'OperationId': '6', 'Name': 'Completed' },
        ];
        let model = list.find(x => x.OperationId == id);
        return (model == null) ? 'n/a' : model.Name;
    }

    getPostNoStatus(id) {
        let list: any = [
            { 'PostNoStatusId': '1', 'PostNoStatusName': 'None' },
            { 'PostNoStatusId': '2', 'PostNoStatusName': 'Post No Debit' },
            { 'PostNoStatusId': '3', 'PostNoStatusName': 'Post No Credit' },
            { 'PostNoStatusId': '4', 'PostNoStatusName': 'Post No Debit and Credit' },
        ];
        let model = list.find(x => x.PostNoStatusId == id);
        return (model == null) ? 'n/a' : model.PostNoStatusName;
    }

    getAccountByCustomerId(id) {
        return this.http.get(`${AppConstant.API_BASE}casa/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerAccountBalance(accountNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}casa/customer-accounts/balance/${accountNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCustomerAccountByCustomerId(id: number) {
        return this.http.get(`${AppConstant.API_BASE}casa/customer-accounts/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllCustomerAccountByCustomerIdandCurrency(id: number, currencyId: number) {
        return this.http.get(`${AppConstant.API_BASE}casa/customer-accounts/customer/${id}/currency/${currencyId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getBusinessAccounts() {
        return this.http.get(`${AppConstant.API_BASE}casa/business-accounts`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCompanyChartOfAccounts() {
        return this.http.get(`${AppConstant.API_BASE}setups/nostro-custom-chart-of-account/company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCustomerAccount(customerId: number, loantypeid: number) {
        return this.http.get(`${AppConstant.API_BASE}casa/customer-accounts/${customerId}/loantype/${loantypeid}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerDetailedAccountByCustomerId(customerId: number) {
        return this.http.get(`${AppConstant.API_BASE}casa/customer/${customerId}/account-details`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    fetchAndAddCustomerAccounts(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}casa/customer-account-pull`,bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

// for drawdown memo
getDrawdownDeferralMemo() {
    //getDrawdownDeferralMemo(operationId, targetId) {
    //return this.http.get(`${AppConstant.API_BASE}credit/get-drawdown-memo/${operationId}/operationId/${targetId}/targetId`)
    return this.http.get(`${AppConstant.API_BASE}credit/get-drawdown-memo`)
    .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
}