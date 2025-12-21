
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

let AppConstant: any = {};
@Injectable()
export class CreditAppraisalService {
 private countryCode:string;

  constructor(private http: AuthHttp, private router: Router, private appConfigServ: AppConfigService) {
        
        AppConstant = appConfigServ;
  }
  
  setCountryCode(countryCode: string): void {
    this.countryCode = countryCode;
  }

    getConditionRoute(id) { return id === 1 ? 'condition-precedent' : 'lms-condition-precedent'; }

    getDynamicsRoute(id) { return id === 1 ? 'transaction-dynamics' : 'lms-transaction-dynamics'; }

    forwardCam(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum/forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardAdhoc(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/adhoc-appraisal/forward`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardCamStatus(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum/forward-status`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardContractorTiering(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/contractor-tiering`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardIBLChecklist(body) {
      return this.http.post(`${AppConstant.API_BASE}credit/ibl-checklist`, body)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    forwardProjectRiskRating(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/add-project-risk-rating`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetDelinquentAccounts() {
      return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/get-delinquent-accounts`)
          .pipe(
              map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  GetDelinquentDigitalAccounts() {
    return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/get-delinquent-digital-accounts`)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}


    forwardCamStatusLms(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum/forward-status-lms`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    reroute(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/reroute-workflow-target`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    route(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/route-workflow-target`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardCamLms(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/forward-appraisal`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardCamSecretariat(body) { // DEPRECATED
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum/forward-secretariat`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardBandg(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/forward-bonds-and-guarantee`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductPrograms() {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/pending-product-program`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getUntenoredStatus(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/untenored-status/application/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerbyApplication(applicationId, processtype) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-by-application/${applicationId}/${processtype}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTransaction(customerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-transactions/${customerId}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTransactionFilter(customerId, applicationId,froma,to,fYear,tYear) {
           return this.http.get(`${AppConstant.API_BASE}credit/customer-transactions-filter/${customerId}/${applicationId}/${froma}/${to}/${fYear}/${tYear}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerRatios(customerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-ratios/${customerId}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTurnover(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/load-customer-turnover/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTurnoverLms(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/load-customer-turnover-lms/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerRatiosFromBasel(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-customer-ratios-basel/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupRatiosFromBasel(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-customer-group-ratios-basel/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCorporateCustomerRatingFromBasel(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-corporate-customer-rating-basel/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFacilityRatingFromBasel(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-facility-rating-basel/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTransactionLms(customerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lms-customer-transactions/${customerId}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationJobs(operationId, page, itemPerPage, classId = null, searchString = null,isSpecific = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-approval-process?operationId=${operationId}&page=${page}&itemsPerPage=${itemPerPage}&classId=${classId}&searchString=${searchString}&isSpecific=${isSpecific}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPoolApplications(operationId, classId = null, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/pool-application-approval-process?operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignApplication(approvalTrailId: number, staffId: number) {
        return this.http.put(`${AppConstant.API_BASE}credit/reassign-application/${staffId}`, approvalTrailId)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignMultipleRequests(approvalTrailIds: number[], staffId: number) {
        let bodyObj = JSON.stringify(approvalTrailIds);
        return this.http.put(`${AppConstant.API_BASE}credit/reassign-multiple-requests/${staffId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    changeApplicationOwner(loanApplicationId: number, staffId: number) {
        return this.http.put(`${AppConstant.API_BASE}credit/reassign-application/owner/${staffId}`, loanApplicationId)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getApprovalTrailByTrailId(approvalTrailId: number){
        return this.http.get(`${AppConstant.API_BASE}credit/approval-trail/${approvalTrailId}`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignRequestToSelf(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/self-assign-multiple-approval-item`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ReturnTransactionToPool(body,trailId) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/revert-transaction-to-general-pool/${trailId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    

    selfAssignApplication(approvalTrailId: number) {
        return this.http.put(`${AppConstant.API_BASE}credit/selfAssign-application`, approvalTrailId)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAdhocApplications(operationId, classId = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/adhoc-approval/${operationId}/class/${classId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplications(operationId, classId = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/operation/${operationId}/class/${classId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationJobsByRegion(page, itemPerPage, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/regional-loan-application?page=${page}&itemsPerPage=${itemPerPage}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanReviewApplicationJobsByRegion(page, itemPerPage, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/lms-regional-loan-application?page=${page}&itemsPerPage=${itemPerPage}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateJobRequestReply(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/job-request/reply/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateJobRequestReassign(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/job-request/reassign/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCallMemoHtml(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-call-memo-html/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getInsurancePolicyConfirmationStatus(appDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/confirm-insurance-policy-approval-status/${appDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getInsurancePolicyConfirmationStatusByAppDetailId(appDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/confirm-insurance-policy-approval-status-by-appdetail-id/${appDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTrail(applicationId, operationId, all = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/trail/${applicationId}/operation/${operationId}/all/${all}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGlobalInterestRateChangeTrail(applicationId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/global-interest-rate-change-comments/trail/${applicationId}/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTrailLms(applicationId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum-lms/trail/${applicationId}/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTrailForReferBack(applicationId, operationId, currentLevelId, all = false, isClassified = false,isLMSCrossWorkflow = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/trail/${applicationId}/operation/${operationId}/currentLevel/${currentLevelId}/all/${all}/isClassified/${isClassified}/isLMSCrossWorkflow/${isLMSCrossWorkflow}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }

    getTrailForReferBackOld(applicationId, operationId, currentLevelId, all = false, isClassified = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/trail/${applicationId}/operation/${operationId}/currentLevel/${currentLevelId}/all/${all}/isClassified/${isClassified}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getTrailCallMemo(operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/trail/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalTrail(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/generic-approval-trail`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalLMSTrail(targetId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/generic-lms-approval-trail/${targetId}/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCurrentCommittee(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/current-committee/application/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getConditionsPrecedent(callerId, detailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}/application-detail/${detailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDefaultConditionsPrecedent(callerId, detailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}-template/application-detail/${detailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveConditionPrecedent(callerId, body) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveSelectConditionsChanges(callerId, ids) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}/selected`, JSON.stringify(ids))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    editConditionPrecedent(callerId, body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}-edit/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeConditionPrecedent(callerId, id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}-remove/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTransactionDynamics(callerId, detailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}/application-detail/${detailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveTransactionDynamics(callerId, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    editTransactionDynamics(callerId, body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}-edit/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeTransactionDynamics(callerId, id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}-remove/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDefaultTransactionDynamics(callerId, detailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}-template/application-detail/${detailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveSelectDynamicsChanges(callerId, ids) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}/selected`, JSON.stringify(ids))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getWorkflowStaff(operationId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/operation-staff/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestByDepartment() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/department`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestByGroup() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/group`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveJobRequest(body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPrivilege(body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum/privilege`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPrivilegeByCode(body) {
      const bodyObj = JSON.stringify(body);
      return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum/privilege-by-code`, bodyObj)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
    

    // getPrivilege(loanApplicationId, operationId) {
    //     return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/privilege/${loanApplicationId}/operation/${operationId}`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getLoanDetail(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/loan-detail/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTrancheDetail(bookingRequestId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/tranche-detail/${bookingRequestId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanLMSDetail(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/lms-loan-detail/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSingleLoanDetail(detailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/single-detail/${detailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTransacDynamics(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/transaction/dynamics/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLMSTransacDynamics(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/transaction/lms-dynamics/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanConditionPrecidents(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan/condition-precident/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLMSLoanConditionPrecidents(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan/lms-condition-precident/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationFees(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/loan-detail-fees/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanDetailChangeLog(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/loan-detail-change-log/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCamDocument(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/loan-application/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    confirmation(type, loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/confirmation/${type}/application/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    createNewDocument(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-memorandum`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UpdateRemoveLien(body, id) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/add-remove-lien/${id}`, JSON.stringify(body))
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
      }
    
    saveRemoveLien(file: File, body: any) {
        return new Promise((resolve, reject) => {
          let url = `${AppConstant.API_BASE}creditoperations/add-remove-lien`;
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

    saveDocument(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/appraisal-memorandum/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  
  updateSubBasicTransaction(id, body) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/update-subsidiary-basic-transaction/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getSubsidiaryBasicApprovalLevel(id) {
    
    return this.http.get(`${AppConstant.API_BASE}credit/get-subsidiary-basic-approvalLevelId/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

    getDocumentations(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/loan-application/${loanApplicationId}/documentation`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSupportingDocumentByApplication(applicationNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-document/application/${applicationNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSupportingDocumentByDocumentId(loanDocumentId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-document/${loanDocumentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getMinutesByApplication(applicationNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/committee-minutes/application/${applicationNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getMinutesByDocumentId(loanDocumentId) {
        return this.http.get(`${AppConstant.API_BASE}credit/committee-minutes/${loanDocumentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    uploadFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/loan-document`;
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


    uploadMinutes(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/committee-minutes`;
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
    /*
    
    */
    deleteLoanDocument(invoiceNo, applicationNumber) {
        return this.http.delete(`${AppConstant.API_BASE}credit/loan-document-delete?invoiceNo=${invoiceNo}&applicationNumber=${applicationNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCamProcessedLoanApplication() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application/credit-assessment-memorandum`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSupportingDocumentByApplicationRef(referenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-document/applicationRefNum/${referenceNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovedCamProcessedLoanApplications() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/credit-assessment-memorandum/approved-loans`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    // updateApplicationStatus(applicationRefNumber, applicationStatusId, formObj) {
    //     const bodyObj = JSON.stringify(formObj);
    //     return this.http.put(`${AppConstant.API_BASE}credit/loan-application/applicationRef/
    //     ${applicationRefNumber}/statusId/${applicationStatusId}`, formObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }


    update(body, loanApplicationId) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/updateFinalOfferLetter/${loanApplicationId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationsForReviewFromCreditUnit() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/credit-assessment-memorandum/due-for-review`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationsDueForAvailment() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/credit-assessment-memorandum/due-for-availment`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationsDueForAvailmentChecklist() {
        return this.http.get(`${AppConstant.API_BASE}credit/availment-due-for-checklist`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllStaffSignatures() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/signature/all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getMonitoringTriggers() {
        return this.http.get(`${AppConstant.API_BASE}loan/monitoring-trigger`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRoute(id, route) { return id === 1 ? route : 'lms-' + route; }

    getApplicationMonitoringTriggers(callerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'application-monitoring-triggers')}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationMonitoringTriggersByOperationId(operationId, applicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/application-monitoring-triggers-aps/${operationId}/applicationDetailId/${applicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveApplicationMonitoringTriggers(callerId, applicationId, body) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'application-monitoring-triggers')}/${applicationId}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllRepaymentSchedules() {
        return this.http.get(`${AppConstant.API_BASE}credit/repayment-schedule-terms`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllOldApplicationReference(data) {
      return this.http.get(`${AppConstant.API_BASE}credit/get-old-application-reference/${data}`)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


    saveRepaymentTerms(callerId, body) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'repayment-schedule-terms')}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveProductLimitValidation(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/product-limit-validation`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductLimitValidation(applicationId, classId) {
        return this.http.get(`${AppConstant.API_BASE}credit/product-limit-validation/${applicationId}/class/${classId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getRecommendedCollateralHistory(callerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'recommended-collateral-history')}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRecommendedCollateral(callerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'recommended-collateral')}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRecommendedCollateral(callerId, body) {
        return this.http.post(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'recommended-collateral')}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateRecommendedCollateral(callerId, body) {
        return this.http.put(`${AppConstant.API_BASE}credit/${this.getRoute(callerId, 'recommended-collateral')}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCreditBureauSupportingDocumentByCreditBureauId(customerCreditBureauId) {
        return this.http.get(`${AppConstant.API_BASE}credit/credit-bureau-report/${customerCreditBureauId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCreditBureauSupportingDocumentByDocumentId(customerCreditBureauId, documentId) {
        return this.http.get(`${AppConstant.API_BASE}credit/credit-bureau-report/${customerCreditBureauId}/${documentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    savePresetRoute(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/preset-route`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPresetCollection(operationId, classId) {
        return this.http.get(`${AppConstant.API_BASE}setups/preset-route-collection/operation/${operationId}/product-class/${classId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllproductTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/product-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllproductClass() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-product-class`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllproducts() {
        return this.http.get(`${AppConstant.API_BASE}setups/all-products`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllproduct() {
        return this.http.get(`${AppConstant.API_BASE}setups/loan-product-class`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    rerouteOperation(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/reroute-operation`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRoutableOperations(operationIds: number[]) {
        return this.http.post(`${AppConstant.API_BASE}setups/routable-operations`, JSON.stringify(operationIds))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOperationApprovalLevels(operationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/reroute-approval-levels/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRatings() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/obligor-limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerLimitValidation(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/validate-application-customer-rating`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCustomerRating(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/update-application-customer-rating`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalLevelByOperationByProduct(operationId, classId = null) {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-levels/operation/${operationId}/product-class/${classId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTranchDisbursmentApprovalLevels() {
        return this.http.get(`${AppConstant.API_BASE}setups/tranch-disbursment-approval-level`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveTranchDisbursmentApprovalLevel(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/tranch-disbursment-approval-level`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // ------------ form cam ------------------

    getDocumentSections(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-section/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentSection(operationId, targetId, sectionId) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-section/operation/${operationId}/target/${targetId}/section/${sectionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentSectionForThirdparty(operationId, targetId, sectionId) {
        return this.http.get(`${AppConstant.API_BASE}credit/third-party-loan-document-section/operation/${operationId}/target/${targetId}/section/${sectionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentSectionBulkLiquidation(operationId, targetId, sectionId) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-section-bulk-liquidation/operation/${operationId}/target/${targetId}/section/${sectionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentTemplates(operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-template/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loadDocumentTemplate(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/document-template/load`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loadDocumentTemplateLms(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/document-template-lms/load`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveSection(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/document-section`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    appendDigitalStamp(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/append-digital-stamp`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeDigitalStamp(body) {
      return this.http.post(`${AppConstant.API_BASE}credit/remove-digital-stamp`, JSON.stringify(body))
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    getDocumentBulkLiquidation(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/preview-document-bulk-liquidation/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentation(operationId: number, targetId: number,isThirdPartyFacility = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/documentation/operation/${operationId}/target/${targetId}/${isThirdPartyFacility}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDocumentationStamp(operationId: number, targetId: number, approvalLevelId: number,isThirdPartyFacility = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/documentation/operation/${operationId}/target/${targetId}/approvalLevelId/${approvalLevelId}/${isThirdPartyFacility}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    removeDocumentationStamp(operationId: number, targetId: number, approvalLevelId: number,isThirdPartyFacility = false) {
      return this.http.get(`${AppConstant.API_BASE}credit/remove-documentation/operation/${operationId}/target/${targetId}/approvalLevelId/${approvalLevelId}/${isThirdPartyFacility}`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    getExceptionDocumentation(operationId: number, targetId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/exception-documentation/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getIsLLLViolated(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/isLLLViolated/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // ------------ generic memo ------------------

    getDocumentSectionGeneric(operationId, targetId, targetIdForWorkFlow, sectionId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-section/operation/${operationId}/target/${targetId}/targetIdForWorkFlow/${targetIdForWorkFlow}/section/${sectionId}/generic/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentationGeneric(operationId: number, targetId: number, targetIdForWorkFlow: number, customerId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/documentation/operation/${operationId}/target/${targetId}/targetIdForWorkFlow/${targetIdForWorkFlow}/generic/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    // ------- management position --------------

    getManagementPosition(detailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/management-position/detailId/${detailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveManagementPosition(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/management-position`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // ------------ components ------------------

    getApplications(page, itemPerPage, operationId, classId = null, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/application?page=${page}&itemsPerPage=${itemPerPage}&operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReviewApplications(page, itemPerPage, operationId, classId = null, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/review-application?page=${page}&itemsPerPage=${itemPerPage}&operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReviewApplicationsSubsidiaries(page, itemPerPage, operationId, classId = null, searchString = null) {
      return this.http.get(`${AppConstant.API_BASE}credit/review-subsidiary-application?page=${page}&itemsPerPage=${itemPerPage}&operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    getReviewApplicationsByID(lmsApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/review-application/id/${lmsApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReviewAvailment(page, itemPerPage, operationId, classId = null, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/review-availment?page=${page}&itemsPerPage=${itemPerPage}&operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReviewDrawdown(page, itemPerPage, operationId, classId = null, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/review-drawdown?page=${page}&itemsPerPage=${itemPerPage}&operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReviewAvailmentForCRMS(page, itemPerPage, operationId, classId = null, searchString = null) {
        return this.http.get(`${AppConstant.API_BASE}credit/review-availment/crms?page=${page}&itemsPerPage=${itemPerPage}&operationId=${operationId}&classId=${classId}&searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentUploadByRefnoAppno(refNo, appNo) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-document-appNo-refNo?refNo=${refNo}&&applicationNumber=${appNo}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getAdditionalComment(applicationId, callerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/additional-comment/application/${applicationId}/caller/${callerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveAdditionalComment(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/additional-comment`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    editAdditionalComment(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/additional-comment/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteAdditionalComment(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/additional-comment/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // ------------ components ------------------

    // ------------------------------------- development only --------------------------------
    testWorkflow() {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/workflow-test`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    // ------------------------------------- development only --------------------------------

    getLoanApplicationDetail(loanId, loanTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-detail/loan/${loanId}/loan-type/${loanTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getStaffActivity(activity) {
        return this.http.get(`${AppConstant.API_BASE}admin/staff-activity/${activity}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralStampToCoverValues(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-stamp-to-cover-values/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTotalExposureLimit(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/total-exposure-limit`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // consultants

    saveLoanConsultant(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/loan-consultant`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLoanConsultant(body, id) {
        return this.http.put(`${AppConstant.API_BASE}setups/loan-consultant/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanConsultants(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/loan-consultant/application/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLoanConsultant(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/loan-consultant/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //

    getAccreditedConsultants() {
        return this.http.get(`${AppConstant.API_BASE}setups/accredited-solicitors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAccreditedStateConsultants() {
        return this.http.get(`${AppConstant.API_BASE}setups/accredited-consultant`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    agentSearchObservable(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.SearchForAgent(term)));
    }

   assignMultipleLoansToAgent(formObj, accreditedConsultantId, expCompletionDate, source,assignmentType) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-assignment/${accreditedConsultantId}/${expCompletionDate}/${source}/${assignmentType}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    assignMultipleLoansToAgentRem(formObj, accreditedConsultantId, expCompletionDate, source,assignmentType) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-assignment-rem/${accreditedConsultantId}/${expCompletionDate}/${source}/${assignmentType}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignMultipleLoansForReporting(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-reporting`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignMultipleLoansToAgentInitiateApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-assignment-initiate-approval`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLiquidationFormWithoutFile(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/collateral-liquidation-recovery-without-file`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    saveLiquidationForm(file: File, body: any) {
        return new Promise((resolve, reject) => {
          let url = `${AppConstant.API_BASE}loan/collateral-liquidation-recovery`;
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

      UpdateLiquidationForm(body, id) {
        return this.http.post(`${AppConstant.API_BASE}loan/collateral-liquidation-recovery/${id}`, JSON.stringify(body))
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
      }

      downloadLiquidationRecoveryReceipt(liquidationRecoveryReceiptId) {
        return this.http.get(`${AppConstant.API_BASE}loan/liquidation-receipt-download/${liquidationRecoveryReceiptId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    downloadLienDocument(lienRemovalId) {
        return this.http.get(`${AppConstant.API_BASE}loan/lien-document-download/${lienRemovalId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    SearchForAgent(term) {
        return this.http
            .get(`${AppConstant.API_BASE}setups/agent-search?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    

    getMaximumApplicationOutstandingBalance(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/maximum-application-outstanding-balance/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);


    }

    getDefaultConditionsPrecedentByOperation(callerId, detailId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getConditionRoute(callerId)}-template/application-detail/${detailId}/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDefaultTransactionDynamicsByOperation(callerId, detailId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/${this.getDynamicsRoute(callerId)}-template/application-detail/${detailId}/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    saveLoanApplicationTags(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-tags`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLoanApplicationTags(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/loan-application-tags/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  
  updateSubsidiaryBasicTransaction(body, id) {
    return this.http.put(`${AppConstant.API_BASE}subsidiary/update-subsidiary-basic-transaction/${id}`, JSON.stringify(body))
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

    getLoanApplicationTags(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-tags/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //=======================================================
    saveLoanApplicationTagsLMS(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-tags-lms`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLoanApplicationTagsLMS(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/loan-application-tags-lms/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationTagsLMS(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-tags-lms/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //=======================================================

    saveTermSheet(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/term-sheet`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateTermSheet(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/term-sheet/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTermSheets() {
        return this.http.get(`${AppConstant.API_BASE}credit/term-sheet`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTermSheetsCorrection(termSheetCode) {
        return this.http.get(`${AppConstant.API_BASE}credit/term-sheets-by-code/${termSheetCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTermSheet(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/term-sheet/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteTermSheet(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/term-sheet/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addDocument(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/document-usage`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    uploadDocumentx(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/document-upload`;
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


    // document man

    getDocument(id) {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDocuments() {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCustomerDocuments(body) {
        return this.http.post(`${AppConstant.API_BASE}document/customer-document`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentsByTarget(operationId, targetId, isOperationSpecific) {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload/operation/${operationId}/target/${targetId}/isOperationSpecific/${isOperationSpecific}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getDocumentsByTarget1(targetId) {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload1/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 
    
    getDocumentsByTargetLms(operationId, targetId, isOperationSpecific, isLms?) {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload/operation/${operationId}/target/${targetId}/isOperationSpecific/${isOperationSpecific}/isLms/${isLms}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCreditDocumentsByTarget(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getDeletedDocumentsByTarget(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}document/document-deleted/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getDocumentsByIds(data) {
        return this.http.post(`${AppConstant.API_BASE}document/document-uploads`, JSON.stringify(data))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


  deleteDocument(id, documentTypeId) {
        return this.http.delete(`${AppConstant.API_BASE}document/document-upload/${id}/${documentTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteRecoveryDocument(id) {
        return this.http.delete(`${AppConstant.API_BASE}document/delete-recovery-document-upload/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateDocument(body, id) {
        return this.http.post(`${AppConstant.API_BASE}document/document-upload/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addDocumentUsage(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/document-usage`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDocumentUsage(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-usage/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDocumentUsages() {
        return this.http.get(`${AppConstant.API_BASE}credit/document-usage`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteDocumentUsage(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/document-usage/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateDocumentUsage(body, id) {
        return this.http.post(`${AppConstant.API_BASE}credit/document-usage/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentCategories() {
        return this.http.get(`${AppConstant.API_BASE}credit/document-category`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

   

    getDocumentTypesByCategory(id) {
        return this.http.get(`${AppConstant.API_BASE}document/document-type/category/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentCategyType() {
        return this.http.get(`${AppConstant.API_BASE}credit/document-category-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentType() {
        return this.http.get(`${AppConstant.API_BASE}credit/document-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    documentUsageSearch(parameter) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-usage-search/${parameter}/parameter`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    downloadDocument(documentId) {
        return this.http.get(`${AppConstant.API_BASE}document/document-download/${documentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    downloadDocument1(documentId) {
        return this.http.get(`${AppConstant.API_BASE}document/document-download1/${documentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    downloadDocumentCreditBereau(documentId) {
        return this.http.get(`${AppConstant.API_BASE}document/document-download-credit-bereau/${documentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    originalDocumentStatus(id) {
        return this.http.get(`${AppConstant.API_BASE}document/original-document-status-by-id/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    originalFacilityDocumentStatus(id) {
        return this.http.get(`${AppConstant.API_BASE}document/original-facility-document-status-by-id/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // viewDocument(body) {
    //     return this.http.post(`${AppConstant.API_BASE}document/document-download`, JSON.stringify(body))
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

  uploadDocument2(file: File, body: any) {
    // let bodyObj = JSON.stringify(body);
    let url = `${AppConstant.API_BASE}document/document-upload`;
    const countryCode =
      this.router.url.indexOf("credit/appraisal/credit-appraisal") !== -1 &&
        this.countryCode
        ? this.countryCode
        : "NG";
   
      {

      // let url = `${AppConstant.API_BASE}media/upload-file`;
      

    
      
      let formData = new FormData();
      formData.append("file", file, file.name);

      for (var key in body) {
        formData.append(key, body[key]);
      }
      formData.append('X-COUNTRYCODE', countryCode);

      let token = this.http.getAuthorizationHeader();
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "multipart/form-data" 
        })
      };
      return this.http.postFile(url, formData);
      
      
    };
  }
  
  // uploadDocument2(file: File, body: any) {
  //   // let bodyObj = JSON.stringify(body);
  //   return new Promise((resolve, reject) => {

  //     let url = `${AppConstant.API_BASE}document/document-upload`;
  //     // let url = `${AppConstant.API_BASE}media/upload-file`;
  //     let xhr: XMLHttpRequest = new XMLHttpRequest();

  //     xhr.onreadystatechange = () => {
  //       if (xhr.readyState === 4) {
  //         if (xhr.status === 200) {
  //           resolve(JSON.parse(xhr.response));
  //         } else {
  //           reject(xhr.response);
  //         }
  //       }
  //     };

  //     xhr.open('POST', url, true);
  //     let formData = new FormData();
  //     formData.append("file", file, file.name);

  //     for (var key in body) {
  //       formData.append(key, body[key]);
  //     }


  //     let token = this.http.getAuthorizationHeader();
  //     xhr.setRequestHeader('Authorization', `Bearer ${token}`);

  //     xhr.send(formData);
  //   });
  // }

    uploadDocument(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
      let url = `${AppConstant.API_BASE}document/document-upload`;
      const countryCode =
        this.router.url.indexOf("credit/appraisal/credit-appraisal") !== -1 &&
          this.countryCode
          ? this.countryCode
          : "NG";
        return new Promise((resolve, reject) => {

            
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
          formData.append('X-COUNTRYCODE', countryCode);

            let token = this.http.getAuthorizationHeader();
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
         

            xhr.send(formData);
        });
    }

    getSecurityRelease(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/security-release/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addSecurityRelease(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/security-release`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/approval-security-release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveCashSecurityRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/approval-cash-security-release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRejectedAndReferredSecurityRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/rejected-referred-security-release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRejectedAndReferredCashSecurityRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/rejected-referred-cash-security-release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    SecurityReleaseGoForApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/security-release-approval`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    CashSecurityReleaseGoForApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/security-cash-release-approval`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    CollateralValuationGoForApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}valuation/go-for-approval`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    GetFacilityByApplicationId(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/facility-by-loanApplicationId/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetFacilityByApplicationDetailIdLos(loanApplicationDetailId) {
      return this.http.get(`${AppConstant.API_BASE}credit/facility-by-loanApplication-detail-id-los/${loanApplicationDetailId}`)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  GetFacilityByApplicationDetailIdLms(loanApplicationDetailId) {
    return this.http.get(`${AppConstant.API_BASE}credit/facility-by-loanApplication-detail-id-lms/${loanApplicationDetailId}`)
    .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

    // for drawdown memo
    getDrawdownMemoHtml(targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-drawdown-memo-html/${targetId}/targetId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

getCashBackMemoHtml(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-cashback-memo-html/${operationId}/operationId/${targetId}/targetId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
   
    getDrawdownMemoPdf(referenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}report/get-drawdown-memo-pdf/${referenceNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDrawdownMemo(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-drawdown-memo/${operationId}/operationId/${targetId}/targetId`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    deleteWorkFlowChange(id) {
        
        return this.http.delete(`${AppConstant.API_BASE}credit/loan-application-flow-change/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getWorkFlowChange() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-flow-change`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateWorkFlowChange(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/loan-application-flow-change/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveWorkFlowChange(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-flow-change`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTransactionAccounts(customerId, applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-transactions-accounts/${customerId}/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerTransactionLmsfiltered(customerId, applicationId,accountnumber,fromYear,fromMonth, toYear,toMonth) {
        return this.http.get(`${AppConstant.API_BASE}credit/lms-customer-transactions-filtered/${customerId}/${applicationId}/${accountnumber}/${fromYear}/${fromMonth}/${toYear}/${toMonth}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationsDueForAvailmentRoute() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/credit-assessment-memorandum/due-for-availment-route`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllDocumentTemplate() {
        return this.http.get(`${AppConstant.API_BASE}credit/document-template-setup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentsReleasedDocuments(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/security-release/${operationId}/document-released/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAvailableCollateralDocuments(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/security-release/${operationId}/available-documents/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
   
    flagPrinted(body) {
        return this.http.post(`${AppConstant.API_BASE}operations/flag-printed`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    flagPrintedLos(body) {
        return this.http.post(`${AppConstant.API_BASE}operations/flag-printed-los`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllContractorCriteria() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/contractor-criteria`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 
    
    getAllIBLChecklist() {
      return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/ibl-checklist`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  } 
    
    getAllContractorTiering(loanApplicationId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/contractor-tiering/${loanApplicationId}/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }   
    getIBLChecklistDetail(loanApplicationId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/ibl-checklist/${loanApplicationId}/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }   

    getAllContractorTieringComputation(loanApplicationId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/contractor-tiering-computation/${loanApplicationId}/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getContractorTieringForEdit(contractorTieringId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/contractor-tiering-update/${contractorTieringId}`)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getIBLChecklistDetailForEdit(iblChecklistDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/ibl-checklist-detail-update/${iblChecklistDetailId}`)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
 
    
    getAllProjectriskRatingCriteria() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/all-project-risk-rating-criteria`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }  

    getAllProjectRiskRating(loanApplicationId, loanApplicationDetailId,loanBookingRequestId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/project-risk-rating/${loanApplicationId}/${loanApplicationDetailId}/${loanBookingRequestId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }   

    getAllProjectRiskRatingComputation(loanApplicationId, loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/project-risk-rating-computation/${loanApplicationId}/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }  

    uploadRecoveryReportingDocument(file: File, body: any) {
        return new Promise((resolve, reject) => {
            let url = `${AppConstant.API_BASE}document/recovery-reporting-document-upload`;
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

    assignMultipleLoansRecoveryReportingApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-reporting-initiate-approval`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    downloadRecoveryReportDocument(loanRecoveryReportApprovalId) {
        return this.http.get(`${AppConstant.API_BASE}document/recovery-report-document-download/${loanRecoveryReportApprovalId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignMultipleLoansForCommission(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-commission`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignMultipleLoansRecoveryCommissionApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-commission-initiate-approval`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    addGuaranteeRelease(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/guarantee-release`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRecoveryAnalysisDocumentSection(operationId, targetId, referenceId, sectionId) {
        return this.http.get(`${AppConstant.API_BASE}credit/recovery-analysis-document-section/operation/${operationId}/target/${targetId}/referenceId/${referenceId}/section/${sectionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRecoveryAnalysisDocumentation(operationId: number, targetId: number,referenceId: string, templateId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/recovery-analysis-documentation/operation/${operationId}/target/${targetId}/referenceId/${referenceId}/templateId/${templateId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRecoveryReassignmentForm(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-re-assignment`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRecoveryReassignmentRemForm(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-re-assignment-remedial`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanRecoveryCommissionRetail(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/retail-loan-recovery-commission`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    autoAssign() {
        return this.http.get(`${AppConstant.API_BASE}setups/auto-assignment-loan-recovery`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveBulkRecoveryReassignmentForm(schemeSelections, expCompletionDate, accreditedConsultant, source) {
        return this.http.post(`${AppConstant.API_BASE}loan/multiple-loan-recovery-re-assignment/${expCompletionDate}/${accreditedConsultant}/${source}`, JSON.stringify(schemeSelections))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveBulkRetailRecoveryReassignmentForm(schemeSelections, expCompletionDate, accreditedConsultant, source) {
        return this.http.post(`${AppConstant.API_BASE}loan/multiple-retail-loan-recovery-re-assignment/${expCompletionDate}/${accreditedConsultant}/${source}`, JSON.stringify(schemeSelections))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRecoveryUnassignmentForm(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-loan-recovery-un-assignment`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRetailRecoveryUnassignmentForm(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/bulk-retail-loan-recovery-un-assignment`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    saveBulkRecoveryUnassignmentForm(schemeSelections) {
        return this.http.post(`${AppConstant.API_BASE}loan/multiple-loan-recovery-un-assignment`, JSON.stringify(schemeSelections))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveRetailBulkRecoveryUnassignmentForm(schemeSelections) {
        console.log("Hello "+ JSON.stringify(schemeSelections));
        return this.http.post(`${AppConstant.API_BASE}loan/multiple-retail-loan-recovery-un-assignment`, JSON.stringify(schemeSelections))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanRecoveryReportCollection(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/recovery-report-collection`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanRecoveryCommissionInternal(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/retail-loan-recovery-commission-internal`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExceptionalDocumentSection(operationId, targetId, sectionId) {
        return this.http.get(`${AppConstant.API_BASE}credit/document-exception-section/operation/${operationId}/target/${targetId}/section/${sectionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

  getSubsediaryApplicationJobs(operationId, page, itemPerPage, classId = null, searchString = null,isSpecific = false) {
      return this.http.get(`${AppConstant.API_BASE}credit/subsidiaries-loan-applications?operationId=${operationId}&page=${page}&itemsPerPage=${itemPerPage}&classId=${classId}&searchString=${searchString}&isSpecific=${isSpecific}`).pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getSubsediaryApplicationJobsPooled(operationId, page, searchString) {

    return this.http.get(`${AppConstant.API_BASE}credit/subsidiaries-loan-applications`).pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    
  } 

  getFacilityStampDuty(loanApplicationId) {
    return this.http.get(`${AppConstant.API_BASE}credit/get-facility-stamp-duty/${loanApplicationId}`)
        .pipe(
      map((res: any) => res), 
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getFacilityStampDutyId(loanApplicationId) {
    return this.http.get(`${AppConstant.API_BASE}credit/get-facility-stamp-duty-id/${loanApplicationId}`)
        .pipe(
      map((res: any) => res), 
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  addDocumentDeferal(Obj) {
    let bodyObj = JSON.stringify(Obj);
    return this.http.post(`${AppConstant.API_BASE}document/add-deferred-document`, bodyObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateDocumentDeferal(fsCaptionObj, id) {
    let bodyObj = JSON.stringify(fsCaptionObj);
    return this.http.put(`${AppConstant.API_BASE}document/deferred-document-update/${id}`, bodyObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDeferredDocumentByLoanApplicationId(loanApplicationId) {
    return this.http.get(`${AppConstant.API_BASE}document/deferred-document/${loanApplicationId}`)
        .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}
getAllDeferredDocument() {
    return this.http.get(`${AppConstant.API_BASE}document/deferred-document-all`)
        .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

deleteDeferredDocument(id) {
  return this.http.delete(`${AppConstant.API_BASE}document/delete-deferred-document/${id}`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

getCustomerCreditBureauDocument(customerId) {
  return this.http.get(`${AppConstant.API_BASE}document/get-customer-credit-bureau-documents/${customerId}`)
      .pipe(
    map((res: any) => res),
  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
} 
}