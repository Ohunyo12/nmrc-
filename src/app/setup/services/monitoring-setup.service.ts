
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class MonitoringSetupService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

 
    getAllMonitoringSetups() {
         return this.http.get(`${AppConstant.API_BASE}setup/monitoringSetup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

      getAllMessageType() {
         return this.http.get(`${AppConstant.API_BASE}setup/message-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }


     GetAllProduct() {
         return this.http.get(`${AppConstant.API_BASE}setup/product`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    
    getMonitoringSetups(id) {
        return this.http.get(`${AppConstant.API_BASE}setup/getmonitoringSetup/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);

        return this.http.post(`${AppConstant.API_BASE}setup/addmonitoringSetup`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    update(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setup/updatemonitoringSetup/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}