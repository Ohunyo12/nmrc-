
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AuthHttp } from '../../admin/services/token.service';
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class ChartOfAccountService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    saveChartOfAccount(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/chart-of-account`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllChartOfAccounts() {
        return this.http.get(`${AppConstant.API_BASE}setups/chart-of-account`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAccountsByCategory(catId) {
        return this.http.get(`${AppConstant.API_BASE}setups/chart-of-account/category/${catId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getFinancialStatementCaption() {
        return this.http.get(`${AppConstant.API_BASE}setups/chart-of-account/fs-captions`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCasaAccountStatus() {
        return this.http.get(`${AppConstant.API_BASE}setups/casa/account-status`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllAccountsAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}setups/chart-of-account/approvals/temp`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}setups/chart-of-account/approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateChartOfAccount(accountId, formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/chart-of-account/${accountId}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllChartOfAccountClasses() {
        return this.http.get(`${AppConstant.API_BASE}setups/chart-of-account/classes`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    // custom

    saveCustomChartOfAccount(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/custom-chart-of-account`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateCustomChartOfAccount(body, accountId) {
        return this.http.put(`${AppConstant.API_BASE}setups/custom-chart-of-account/${accountId}`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCustomChartOfAccounts() {
        return this.http.get(`${AppConstant.API_BASE}setups/custom-chart-of-account`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

}