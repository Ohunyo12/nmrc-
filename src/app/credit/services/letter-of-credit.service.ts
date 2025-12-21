
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'app/admin/services/token.service';
import { AppConfigService } from 'app/shared/services/app.config.service';



let AppConstant: any = {};

@Injectable()
export class LetterOfCreditService {

	constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
		AppConstant = appConfigServ;
	}

	saveLcIssuance(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-issuance`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    updateLcIssuance(body, id) {
        //console.log(body);
        return this.http.put(`${AppConstant.API_BASE}credit/lc-issuance/${id}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    deleteLcIssuance(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-issuance/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    getLcIssuances() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesByLcIssuanceId(lcIssuanceId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/${lcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcEnhancementByLcEnhancementId(tempLcIssuanceId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance-enhancement/${tempLcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // getLcExtensionByLcEnhancementId(tempLcIssuanceId: number) {
    //     return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance-extension/${tempLcIssuanceId}`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getLcIssuancesForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReleasesForLcIssuance(lcIssuanceId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/releases/${lcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForReleaseApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/release-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLcDocument(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-document`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLcDocument(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-document/${id}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLcDocument(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-document/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcDocuments(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-document/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcDocumentsByLcIssuanceId(lcIssuanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-documents/${lcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLcShipping(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-shipping`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLcShipping(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-shipping/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLcShipping(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-shipping/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcShippings(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-shipping/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcShippingsByLcIssuanceId(lcIssuanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-shippings/${lcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLcCondition(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-condition`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLcCondition(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-condition/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLcCondition(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-condition/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcCondition(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-condition/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcConditionsByLcIssuanceId(lcIssuanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-conditions/${lcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcIssuance(body) {
       // console.log('forwarded =>');
        return this.http.post(`${AppConstant.API_BASE}credit/lc-approval/forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcRelease(body) {
       // console.log('forwarded =>');
        return this.http.post(`${AppConstant.API_BASE}credit/lc-release/forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getIFFLinesForLc(customerId) {
        //console.log('Lines =>');
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/lines/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getIFFLineDetails() {
        
    }

    getCurrentStaffActivities() {
        //console.log('activities => ');
        return this.http.get(`${AppConstant.API_BASE}admin/get-user-activities`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchForLC(searchString) {
       // console.log('activities => ');
        return this.http.get(`${AppConstant.API_BASE}credit/lc-search/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchForLCLMS(searchString) {
       // console.log('activities => ');
        return this.http.get(`${AppConstant.API_BASE}credit/lc-search/lms/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLcUssance(value) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-ussance`, JSON.stringify(value))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLcUssance(value, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-ussance/${id}`, JSON.stringify(value))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForUssance() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/ussance`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLcUssanceExtension(value) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-ussance-extension`, JSON.stringify(value))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLcUssanceExtension(value, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-ussance-extension/${id}`, JSON.stringify(value))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForUssanceExtension() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/ussance-extension`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForUssanceApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/ussance-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForUssanceExtensionApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-issuance/ussance-extension-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcUssancesByLcIssuanceId(lcIssuanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-ussance-lcIssuanceId/${lcIssuanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcUssanceByLcUsanceId(lcUsanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-ussance-lcUsanceId/${lcUsanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcUssanceExtensionByTempLcUsanceId(tempLcUsanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-ussance-extension/${tempLcUsanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcUssanceExtensionsByLcUsanceId(lcUsanceId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-ussance-extension/lcUsanceId/${lcUsanceId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcUssance(body) {
        //console.log('ussance =>');
        return this.http.post(`${AppConstant.API_BASE}credit/lc/ussance-forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcUssanceExtension(body) {
       // console.log('ussance =>');
        return this.http.post(`${AppConstant.API_BASE}credit/lc/ussance-extension-forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveReleaseAmount(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-release`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UpdateReleaseAmount(body) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-release`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcCancelation(body) {
       // console.log('cancel =>', body);
        return this.http.post(`${AppConstant.API_BASE}credit/lc-cancelation/forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForCancelationApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-cancelation/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    saveLcEnhancement(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-enhancement`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    updateLcEnhancement(body, id) {
        //console.log(body);
        return this.http.put(`${AppConstant.API_BASE}credit/lc-enhancement/${id}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    deleteLcEnhancement(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-enhancement/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    getLcIssuancesForEnhancement() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-enhancement`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForEnhancementApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-enhancement/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcEnhancement(body) {
       // console.log('cancel =>', body);
        return this.http.post(`${AppConstant.API_BASE}credit/lc/enhancement-forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // lc extension
    saveLcExtension(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-extension`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    updateLcExtension(body, id) {
       // console.log(body);
        return this.http.put(`${AppConstant.API_BASE}credit/lc-extension/${id}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
    deleteLcExtension(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-extension/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForLCExtension() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-extension`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcIssuancesForLCExtensionApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-extension/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLcExtension(body) {
        //console.log('cancel =>', body);
        return this.http.post(`${AppConstant.API_BASE}credit/lc/extension-forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    // lc extension
    //cash buildup
    saveLcCashBuildUpPlan(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lc-cashbuildupplan`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLcCashBuildUpPlan(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/lc-cashbuildupplan/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLcCashBuildUpPlan(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lc-cashbuildupplan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcCashBuildUpPlans(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-cashbuildupplan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcCashBuildUpReferenceTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-cashbuildupreferencetypes`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLcCashBuildUpPlan(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/lc-cashbuildupplan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //cash buildup
}
