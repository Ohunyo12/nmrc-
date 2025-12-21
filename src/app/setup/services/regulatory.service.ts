
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class RegulatoryService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAllRegulatorySetup() {
        return this.http.get(`${AppConstant.API_BASE}credit/regulatory/regulatory-setup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllRegulatoryType() {
        return this.http.get(`${AppConstant.API_BASE}credit/regulatory/regulatory-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllRegulatoryTypeById(crmsTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/regulatory/regulatory-type/regtype/${crmsTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveRegulatorySetup(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/regulatory/regulatory-setup`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateRegulatorySetup(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/regulatory/regulatory-setup/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeRegulatorySetup(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/regulatory/regulatory-setup?regulatoryId=${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }





}
