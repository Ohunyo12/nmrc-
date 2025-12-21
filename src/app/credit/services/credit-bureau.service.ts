import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';

import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { AppConfigService } from '../../shared/services/app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class CreditBureauService {

    private storageSource = new Subject<any>();

    storageData: any = {};

    storage$ = this.storageSource.asObservable();

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    customerCreditBureauReportLog(customerId,companyDirectorId) {
        return this.http.get(`${AppConstant.API_BASE}credit/credit-bureau-report-log/${customerId}/director/${companyDirectorId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCreditBureauInformation() {
        return this.http.get(`${AppConstant.API_BASE}credit/credit-bureau-information`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCustomerCreditBureauDocument(customerCreditBureauId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-credit-bureau-document/${customerCreditBureauId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    GetCRCBureauFacilities() {
        return this.http.get(`${AppConstant.API_BASE}credit/crc-products`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCRMSCreditCheck(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/crms-credit-check`, bodyObj)
        .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCreditBureauSearch(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan/customer/credit-bureau-charge`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    uploadCreditBureauReportFile(file: File,body:  any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/customer-credit-bureau-report-file-upload`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            let formData = new FormData();
            formData.append("file", file, file.name);

            for (var key in body) {
                formData.append(key, body[key]);
            }
            

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.send(formData);
        });
    }

    SearchCustomerXdsCreditBureauReport(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/xds-credit-bureau-search`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    SearchCustomerCrcCreditBureauReport(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/crc-credit-bureau-search`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    GetFullSearchResultInPDF(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/download-credit-bureau-search-result-in-pdf`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetCRCFullSearchResultInPDF(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/download-crc-credit-bureau-search-result-in-pdf`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerCreditBureauReportStatus(status, body){
        return this.http.put(`${AppConstant.API_BASE}credit/credit-bureau-customer-report-status/${status}`, body)
        .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSimpleCustomerDetailsByCustomerId(customerId) { 
        return this.http.get(`${AppConstant.API_BASE}credit/credit-bureau-customer-details/${customerId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    fetchAndAddCustomerAccounts(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}casa/customer-account-pull`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    uploadFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}kyc/checklist-document-upload`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            let formData = new FormData();
            formData.append("file", file, file.name);

            for (var key in body) {
                formData.append(key, body[key]);
            }

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.send(formData);
        });
    }

    twoFactorAuthEnabledCheckOverride() { 
        return this.http.get(`${AppConstant.API_BASE}credit/two-factor-auth-enabled`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getThirdPartyServiceChargeDetailsStatus() { 
        return this.http.get(`${AppConstant.API_BASE}credit/thirdparty-service-charge`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}