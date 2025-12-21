
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class AccreditedConsultantsService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAccreditedConsultantType() {
        return this.http.get(`${AppConstant.API_BASE}setups/accreditedConsultantType`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getSolicitors(accreditedConsultantId) {
        return this.http.get(`${AppConstant.API_BASE}setups/accredited-solicitors-list/${accreditedConsultantId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),
            );
    }
    accreditedSolicitorGoForApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/accredited-solicitors-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getSolicitorsAwaitingApproval(accreditedConsultantId) {
        return this.http.get(`${AppConstant.API_BASE}setups/accredited-solicitors-awaiting-approval/${accreditedConsultantId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),
            );
    }
    getSalesAgents() {
        return this.http.get(`${AppConstant.API_BASE}setups/sales-agents`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveConsultantTypes(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/consultant-type-add`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveSolicitors(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/accredited-solicitors`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateSolicitors(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/accredited-solicitors/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } //End of solicitor class

    deleteSolicitors(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/accredited-solicitors/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getPrincipals() {
        return this.http.get(`${AppConstant.API_BASE}setups/accredited-principals`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    savePrincipals(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/accredited-principals`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updatePrincipals(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/accredited-principals/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteSolicitorsState(id) {
      return this.http.delete(`${AppConstant.API_BASE}setups/accredited-solicitors/${id}`)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deleteSolicitor(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/accredited-consultant/${id}`)
    .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

}