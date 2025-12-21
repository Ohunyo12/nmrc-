
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';


// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { AppConfigService } from '../../shared/services/app.config.service';
import { OriginalDocumentApprovalComponent } from './../../approvals/components/original-document-approval/original-document-approval.component';

let AppConstant: any = {};
@Injectable()
export class ApprovalService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

getReasignedAccount() {
        return this.http.get(`${AppConstant.API_BASE}loanoperation/get-reasigned-account-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getAllOperations() {
        return this.http.get(`${AppConstant.API_BASE}setups/operation`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getAllOperationsByOperationTypeId(operationTypeId) {
        return this.http.get(`${AppConstant.API_BASE}setups/operation/${operationTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllApprovalGroupList() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-group-list-for-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } getTempAllLevelStaffApproval() {
        return this.http.get(`${AppConstant.API_BASE}setups/temp-approval-level-staff`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    goForLevelStaffApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/go-for-level-staff-approval`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllApprovalLevelList() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level-list-for-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    goForLevelApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/go-for-workflow-level-approval`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    goForGorupApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/go-for-workflow-group-approval`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalGroups() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-group`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addApprovalGroup(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/approval-group`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateApprovalGroup(grpId, formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/approval-group/${grpId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteApprovalGroup(grpId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/approval-group/${grpId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteFromUploadList(id) {
        return this.http.delete(`${AppConstant.API_BASE}document/original-document-approval/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalLevel() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level/all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalReliefs() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-relief`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getApprovalReliefsAwaitingApprovals() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-relief-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalReliefsGoForApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/approval-relief-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addApprovalRelief(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/approval-relief`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateApprovalRelief(id, body) {
        return this.http.put(`${AppConstant.API_BASE}setups/approval-relief/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalUserLevels() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval/user-level`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOperationtypes() {
        // return [
        //     { "operationTypeId": "1", "operationTypeName": "CASA" },
        //     { "operationTypeId": "2", "operationTypeName": "Credit" },
        // ];

        return this.http.get(`${AppConstant.API_BASE}setups/operation-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // OG

    getOperationGroups(operationId, productClassId = null, productId = null) {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-group-mapping/operation/${operationId}/product-class/${productClassId}/product/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveOperationGroup(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/approval-group-mapping`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateOperationGroup(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/approval-group-mapping/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteOperationGroup(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/approval-group-mapping/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // OG end

    // AL

    getApprovalLevelByOperation(operationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level/operation/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalLevels(groupId) {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level/group/${groupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalLevelsAll() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level-detailed/all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveApprovalLevel(body) {
        let bodyObj = JSON.stringify(body)
        return this.http.post(`${AppConstant.API_BASE}setups/approval-level`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateApprovalLevel(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/approval-level/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteApprovalLevel(id: number) {
        return this.http.delete(`${AppConstant.API_BASE}setups/approval-level/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // AL end

    //wf Notification
    getWorkflowMappingNotification(id: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level/workflow-notification/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveWorkflowLevelNotification(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/approval-level/workflow-notification`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateWorkflowLevelNotification(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/approval-level/workflow-notification/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    //Wf notification end

    // SL

    getLevelStaff(approvalLevelId) {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-level-staff/staff-level/${approvalLevelId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLevelStaff(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/approval-level-staff`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateLevelStaff(body, id: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/approval-level-staff/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeStaff(id: number) {
        return this.http.delete(`${AppConstant.API_BASE}setups/approval-level-staff/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    // SL end

    // Workflow
    getApprovalTrailByOperation(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // work-flow-tracker/approval-trail/all
    GetAllRecordsOnApprovalTrail(page, itemPerPage) {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-trail/all?page=${page}&itemsPerPage=${itemPerPage}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getBusinessRules() {
        return this.http.get(`${AppConstant.API_BASE}setups/level-business-rule`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addBusinessRule(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/level-business-rule`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateBusinessRule(id, body) {
        return this.http.put(`${AppConstant.API_BASE}setups/level-business-rule/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteBusinessRule(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/level-business-rule/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  
  deleteDynamicBusinessRule(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/dynamic-business-rule/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

    saveOriginalDocumentApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}document/original-document-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateOriginalDocumentApproval(body, id) {
        return this.http.put(`${AppConstant.API_BASE}document/original-document-approval/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteOriginalDocumentApproval(id) {
        return this.http.delete(`${AppConstant.API_BASE}document/original-document-approval/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOriginalDocumentApprovals() {
        return this.http.get(`${AppConstant.API_BASE}document/original-document-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOriginalDocumentByCollateralCustomerId(id) {
        return this.http.get(`${AppConstant.API_BASE}document/approved-original-document-by-id/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOriginalDocument(id) {
        return this.http.get(`${AppConstant.API_BASE}document/original-document/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    search(parameter) {
        return this.http.get(`${AppConstant.API_BASE}document/loanapplication-search/${parameter}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    searchApprovedOriginalDocument(parameter) {
        return this.http.get(`${AppConstant.API_BASE}document/approved-original-document/${parameter}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    originalDocumentApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}document/original-document/approval`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    securityReleaseApproval(data) {
        // let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/security-release-go-for-approval`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    guaranteeReleaseApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/guarantee-cash-release-go-for-approval`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    goForApproval(data) {
        
        return this.http.post(`${AppConstant.API_BASE}document/original-document/submit-approval`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    submitCallMemoApproval(callMemo) {
        let callMemoObj = JSON.stringify(callMemo);
        return this.http.post(`${AppConstant.API_BASE}credit/submit-approval`, callMemoObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);//
    }
    
    getCallMemoWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-call-memo-waiting-for-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    changeStatusOfRejectedMailAndGoForApproval(Id) {
        return this.http.get(`${AppConstant.API_BASE}credit/reinitiate-rejected-release/${Id}`)
        .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getStaffReliefs(staffId) {
        return this.http.get(`${AppConstant.API_BASE}setups/staff-relief/staffId/${staffId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }

    addStaffRelief(body) {
        return this.http.post(`${AppConstant.API_BASE}setups/staff-relief`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }

  getDynamicWorkflowDataItem() {
    return this.http.get(`${AppConstant.API_BASE}setups/get-dynamic-workflow-data-item-definition`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  getDynamicWorkflowExpression() {
    return this.http.get(`${AppConstant.API_BASE}setups/get-dynamic-workflow-item-expression`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  getDynamicWorkflowDataItemByContextId(contextId) {
    return this.http.get(`${AppConstant.API_BASE}setups/get-dynamic-workflow-data-item-definition/${contextId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getValueTypeByItemId(dataItemId) {
    return this.http.get(`${AppConstant.API_BASE}setups/get-dynamic-workflow-value-type/${dataItemId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  saveDynamicWorkflow(body) {
    return this.http.post(`${AppConstant.API_BASE}setups/add-dynamic-workflow`, JSON.stringify(body))
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  updateDynamicWorkflow(body, expressionId) {
    return this.http.put(`${AppConstant.API_BASE}setups/update-dynamic-workflow/${expressionId}`, JSON.stringify(body))
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDynamicBusinessRuleItemValueListByItemId(dataItemId) {
    return this.http.get(`${AppConstant.API_BASE}setups/get-dynamic-business-rule-value-list/${dataItemId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDynamicWorkflowContext() {
    return this.http.get(`${AppConstant.API_BASE}setups/get-dynamic-workflow-context`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllOperators() {
    return this.http.get(`${AppConstant.API_BASE}setups/get-all-operators`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
}
