
import {throwError as observableThrowError,  Observable } from 'rxjs';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class RiskAcceptanceCriteriaService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    // saveRiskAcceptanceCriteria(body) {
    //     return this.http.post(`${AppConstant.API_BASE}credit/risk-acceptance-criteria`, JSON.stringify(body))
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    // updateRiskAcceptanceCriteria(body, id) {
    //     return this.http.put(`${AppConstant.API_BASE}credit/risk-acceptance-criteria/${id}`, JSON.stringify(body))
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    // deleteRiskAcceptanceCriteria(id) {
    //     return this.http.delete(`${AppConstant.API_BASE}credit/risk-acceptance-criteria/${id}`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getRiskAcceptanceCriteria(model) {
        return this.http.post(`${AppConstant.API_BASE}rac/risk-acceptance-criteria-input`, model)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getSavedRiskAcceptanceCriteria(model) {
        return this.http.post(`${AppConstant.API_BASE}rac/saved-rac-for-a-loan`, model)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getRiskAcceptanceCriteriaUpdate(productId,targetId) {
        return this.http.get(`${AppConstant.API_BASE}rac/risk-acceptance-criteria/product/${productId}/target/${targetId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
}