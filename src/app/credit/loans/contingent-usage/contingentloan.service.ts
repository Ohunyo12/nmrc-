
import {throwError as observableThrowError,  Observable } from 'rxjs';
// import { AppConstant } from './../../shared/constant/app.constant';
 
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../../shared/services/app.config.service';
import { AuthHttp } from '../../../admin/services';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class ContingentLoanService {
 
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }


    getApprovalsContingentLoan() {
        return this.http.get(`${AppConstant.API_BASE}contingent/approvals/loanusage`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    
    // saveContingentLoan(data) {
    //     return this.http.post(`${AppConstant.API_BASE}contingent/loanusage`,data)
    //     .map((res: Response) => res.json())
    //     .catch((error: any) => Observable
    //         .throw(error.json().error || 'Server error'));
    // }

    // saveContingentLoan(file: File, body: any) {
    //     let bodyObj = JSON.stringify(body);


    //     return new Promise((resolve, reject) => {

    //         let url = `${AppConstant.API_BASE}contingent/loanusage`;
    //         // let url = `${AppConstant.API_BASE}media/upload-file`;
    //         let xhr: XMLHttpRequest = new XMLHttpRequest();

    //         xhr.onreadystatechange = () => {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     resolve(JSON.parse(xhr.response));
    //                 } else {
    //                     reject(xhr.response);
    //                 }
    //             }
    //         };

    //         xhr.open('POST', url, true);
    //         let formData = new FormData();

    //         formData.append("file", file, file.name);

    //         for (var key in body) {
    //             formData.append(key, body[key]);
    //         }

    //         let token = this.http.getAuthorizationHeader();
    //         xhr.setRequestHeader('Authorization', `Bearer ${token}`);



    //         xhr.send(formData);
    //     });
    // }

    saveContingentLoan(data) {
        return this.http.post(`${AppConstant.API_BASE}contingent/loanusage`,data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getContingentLoan() {
        return this.http.get(`${AppConstant.API_BASE}contingent/getcontingentloan`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getApproveContingentLoanUsage(body) {
        return this.http.post(`${AppConstant.API_BASE}contingent/loanusage-approval`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getContingentUsage(loanId) {
        return this.http.get(`${AppConstant.API_BASE}contingent/get-contingent-usage/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    //loanusage-approval
}