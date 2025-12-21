
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CompanyService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAllCompanies() {
        return this.http.get(`${AppConstant.API_BASE}setups/company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
 getAllLoginCompany() {
        return this.http.get(`${AppConstant.API_BASE}setups/get-login-company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoginCompanySetup() {
        return this.http.get(`${AppConstant.API_BASE}setups/get-login-company-setup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getAllLanguages() {
        return this.http.get(`${AppConstant.API_BASE}setups/languages`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllNatureOfBusiness() {
        return this.http.get(`${AppConstant.API_BASE}setups/nature-of-business`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    // save(body) {
    //     let bodyObj = JSON.stringify(body);
    //     return this.http.post(`${AppConstant.API_BASE}setups/company`, bodyObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    save(file: File, body: any) {
        return new Promise((resolve, reject) => {
            let url = `${AppConstant.API_BASE}setups/company`;
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

    update(companyId, bodyObj) {

        return this.http.put(`${AppConstant.API_BASE}setups/company/${companyId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getAllCompanyDirectors() {
        return this.http.get(`${AppConstant.API_BASE}setups/company-director`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCompanyDirectorsByCompanyId() {
        return this.http.get(`${AppConstant.API_BASE}setups/company-director-by-companyId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerCompanyDirectorsByCompanyId(companyId) {
        return this.http.get(`${AppConstant.API_BASE}setups/company-director-by-companyId?companyId=${companyId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    appUpdateCompanyDirector(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/company-director`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteCompanyDirector(companyDirectoeId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/company-director?companyDirectorId=${companyDirectoeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}