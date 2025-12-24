
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class GeneralSetupService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getApprovalStatus() {
        return this.http.get(`${AppConstant.API_BASE}setup/approval-status`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllSectors() {
        return this.http.get(`${AppConstant.API_BASE}setups/sectors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
      //Get All Down Payment
      getAllDownPayment() {
        return this.http.get(`${AppConstant.API_BASE}admin/get-downpayments`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

  saveDownPayment(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}admin/add-downpayment`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

updateDownPayment(body: any, id: number) {
  return this.http.put(
    `${AppConstant.API_BASE}admin/update-downpayment?id=${id}`,
    body
  ).pipe(
    map((res: any) => res),
    catchError((error: any) =>
      observableThrowError(error.error || 'Server error')
    )
  );
}

  deleteDownpayment(id) {
    return this.http.delete(`${AppConstant.API_BASE}admin/delete-downpayment/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

    
  saveHousingExpense(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}admin/add-downpayment`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateHousingExpense(body: any, id: number) {
  return this.http.put(
    `${AppConstant.API_BASE}admin/update-downpayment?id=${id}`,
    body
  ).pipe(
    map((res: any) => res),
    catchError((error: any) =>
      observableThrowError(error.error || 'Server error')
    )
  );
}

  deleteHousingExpense(id) {
    return this.http.delete(`${AppConstant.API_BASE}admin/delete-downpayment/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
    getAllOperations() {
        return this.http.get(`${AppConstant.API_BASE}setups/operation`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getAllSubSectors() {
        return this.http.get(`${AppConstant.API_BASE}setups/subsectors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerSectorBySubSectorId(subSectorId) {
        return this.http.get(`${AppConstant.API_BASE}setups/subsector/${subSectorId}/sectors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //EMPLOYER SERVICE
    getEmployersList() {
        return this.http.get(`${AppConstant.API_BASE}setup/employers`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPendingEmployers() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-all-pending-employers`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovedEmployers() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-all-approved-employers`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRelatedEmployersWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-related-employer-waiting-for-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardRelatedEmployerForApproval(body) {
        //console.log('forwarded =>');
        return this.http.post(`${AppConstant.API_BASE}setup/forward-for-related-employer-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEmployerDetail(employerId) {
        return this.http.get(`${AppConstant.API_BASE}setup/employer/${employerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEmployerType() {
        return this.http.get(`${AppConstant.API_BASE}setup/employer-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addEmployerType(data) {
        return this.http.post(`${AppConstant.API_BASE}setup/add-employer-type`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addEmployerSubType(data) {
        return this.http.post(`${AppConstant.API_BASE}setup/add-employer-sub-type`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateEmployerType(employerTypeId, data) {
        return this.http.put(`${AppConstant.API_BASE}setup/update-employer-type/${employerTypeId}`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateEmployerSubType(employerSubTypeId, data) {
        return this.http.put(`${AppConstant.API_BASE}setup/update-employer-sub-type/${employerSubTypeId}`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllEmployerSubType() {
        return this.http.get(`${AppConstant.API_BASE}setup/all-employer-sub-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllEmployerSubTypes() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-all-employer-sub-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEmployerSubType(EmployerTypeId) {
        return this.http.get(`${AppConstant.API_BASE}setup/employer-sub-type/${EmployerTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addEmployer(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setup/add-employer`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UpdateEmployer(employerId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setup/update-employer/${employerId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteEmployert(employerId) {
        return this.http.delete(`${AppConstant.API_BASE}setup/delete-employer/${employerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //PRUDENTIAL GUIDELINE SERVICES
    getPrudentialGuidelineList() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-prudential-guidelines`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPrudentialGuidelineDetail(prudentialGuidelineId) {
        return this.http.get(`${AppConstant.API_BASE}setup/get-prudential-guideline/${prudentialGuidelineId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addPrudentialGuideline(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setup/add-prudential-guideline`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    UpdatePrudentialGuideline(prudentialGuidelineId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setup/update-prudential-guideline/${prudentialGuidelineId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deletePrudentialGuideline(prudentialGuidelineId) {
        return this.http.delete(`${AppConstant.API_BASE}setup/delete-prudential-guideline/${prudentialGuidelineId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getPrudentialType() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-prudential-guidelines-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    ///Limit and Monitoring
    getAlertList() {
        return this.http.get(`${AppConstant.API_BASE}setup/monitoring-alert-messages`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UpdateEmailAlertMessages(prudentialGuidelineId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setup/update-email-lert-message`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEmailMessagesList() {
        return this.http.get(`${AppConstant.API_BASE}setup/limit-and-monitoring`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEmailMessagesDetail(alertId) {
        return this.http.get(`${AppConstant.API_BASE}setup/limit-and-monitoring/${alertId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addEmailMessages(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setup/add-limit-and-monitoring`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    UpdateEmailMessages(prudentialGuidelineId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setup/update-limit-and-monitoring`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteEmailMessages(bodyObj) {
        return this.http.delete(`${AppConstant.API_BASE}setup/delete-limit-and-monitoring`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getProfileBusinessUnits() {
        return this.http.get(`${AppConstant.API_BASE}setups/profile-business-unit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCallMemoWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-call-memo-waiting-for-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSignatoryById(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/signatory/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllSignatories() {
        return this.http.get(`${AppConstant.API_BASE}setups/signatory`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateSignatory(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/signatory/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    saveSignatory(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/signatory`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    removeSignatory(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/signatory/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllInsuranceCompanies() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveInsuranceCompany(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/insurance`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateInsuranceCompany(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/insurance/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteInsuranceCompany(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/insurance/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllInsuranceTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-type-all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-type-all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCollateralSubTypes(collateralTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-sub-type-all/${collateralTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllInsuranceStatus() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-status-all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllInsurancePolicyTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-policy-type-all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllGPSCoordinatesCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/GPS-coordinates-collateral-type-all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    saveInsuranceType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/insurance-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveInsurancePolicyType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/insurance-policy-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveGPSCoordinatesCollateralType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/GPS-coordinates-collateral-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    updateInsuranceType(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/insurance-type/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateInsurancePolicyType(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/insurance-policy-type/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateGPSCoordinatesCollateralType(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/GPS-coordinates-collateral-type/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteInsuranceType(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/insurance-type/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteInsurancePolicyType(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/insurance-policy-type/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteGPSCollateralType(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/GPS-coordinates-collateral-type/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


}