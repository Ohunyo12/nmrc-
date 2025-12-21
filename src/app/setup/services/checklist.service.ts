
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class ChecklistService {
  

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    /**
     *  Checklist Definition
     */
    addChecklistDefinition(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-definition`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addChecklistDefinitionWithMultipleItems(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-definition/multiple-items`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addChecklistTypeMapping(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-type-mapping`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteChecklistTypeMapping(checklistTypeMappingId: number) {
        return this.http.delete(`${AppConstant.API_BASE}setups/checklist-type-mapping/${checklistTypeMappingId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllChecklistDefinition() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-definition`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllChecklistTypeMapping() {
        return this.http.get(`${AppConstant.API_BASE}setups/mapped-checklist-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getConditionPrededenceChecklist(loanApplicationId, isAvailment) {
        return this.http.get(`${AppConstant.API_BASE}setups/condition-prededence-checklist?loanApplicationId=${loanApplicationId}&isAvailment=${isAvailment}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getConditionPrededenceChecklistStatus(loanApplicationId, isAvailment) {
        return this.http.get(`${AppConstant.API_BASE}setups/condition-prededence-checklist-status?loanApplicationId=${loanApplicationId}&isAvailment=${isAvailment}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLMSConditionPrededenceChecklist(loanReviewApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/lms-condition-prededence-checklist?loanReviewApplicationId=${loanReviewApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLMSConditionPrededenceChecklistStatus(loanReviewApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/lms-condition-prededence-checklist-status?loanReviewApplicationId=${loanReviewApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getMappedChecklistDefinitionByApprovalLevelAndProduct(approvalLevelId, productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-definition/mapped/` +
            `approval-level/${approvalLevelId}/product/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUnMappedChecklistDefinitionByApprovalLevelAndProduct(approvalLevelId, productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-definition/unmapped/` +
            `approval-level/${approvalLevelId}/product/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateChecklistDefinition(formObj, CheckDefId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/checklist-definition/${CheckDefId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteChecklistDefinition(CheckDefId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/checklist-definition/${CheckDefId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     *  Checklist Details
     */
    addChecklistDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addMultipleChecklistDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-detail-multiple`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllChecklistDetail() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-detail`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getChecklistDetailByTargetId(targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-details-targetid?targetId=${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllChecklistDetailByProductId(targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-detail/?targetId=${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllChecklistDetailByProductAndTargetId(targetTypeId, productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-detail/target-type/${targetTypeId}/product/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ValidateChecklistDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/validate-checklist-details`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    validateConditionPrecedent(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/validate-condition-precedence`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateChecklistDetail(formObj, CheckId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/checklist-detail/${CheckId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteChecklistDetail(CheckId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/checklist-detail/${CheckId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLoanConditionPrecedenceStatus(conditionId, isLMSChecklist) {
        return this.http.delete(`${AppConstant.API_BASE}setups/delete-loan-condition-checkstatus/${conditionId}/${isLMSChecklist}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    /**
     * Checklist Items
     */

    addChecklistItem(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-item`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addMultipleChecklistItem(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-item/multiple`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllChecklistItem() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-item`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateChecklistItem(formObj, checklistId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/checklist-item/${checklistId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Checklist Status
     */

    getAllChecklistStatus() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-status`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
   * Checklist Status Yes or No
   */

    getChecklistStatusYesOrNo() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-status-yesorno`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
    * Checklist Target Type
    */
    getChecklistTypeByApprovalLevel(operationId, productClassProcessId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-type-byapprovallevel?operationId=${operationId}&productClassProcessId=${productClassProcessId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getChecklistType() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllChecklistTargetTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-target-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllChecklistResponseType() {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-response-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getChecklistDefinitionByChecklistType(operationId, checklistTypeId, productId, loanTargetId,customerId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-definition-checklisttype?operationId=${operationId}&checklistTypeId=${checklistTypeId}&productId=${productId}&loanTargetId=${loanTargetId}&customerId=${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getChecklistDefinitionByChecklistTypeView(operationId, checklistTypeId, productId, loanTargetId,customerId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-definition-checklisttype-view?operationId=${operationId}&checklistTypeId=${checklistTypeId}&productId=${productId}&loanTargetId=${loanTargetId}&customerId=${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getChecklistItemSimulationDetails(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-item-simulation?productId=${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getChecklistDetailsValidationList(targetId, checkListTypeId, isCamChecklist,customerId=null) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-detail-valitation?targetId=${targetId}&&checklistTypeId=${checkListTypeId}&&isCamChecklist=${isCamChecklist}&&customerId=${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getChecklistDocumentUpload(definitionId, statusId, detailId, isProductBased,customerId,checkListItemId,checkListTypeId,checklistDate) {
        return this.http.get(`${AppConstant.API_BASE}kyc/checklist-upload-view?definitionId=${definitionId}&statusId=${statusId}&detailId=${detailId}&isProductBased=${isProductBased}checklist-upload?definitionId=${definitionId}&statusId=${statusId}&detailId=${detailId}&isProductBased=${isProductBased}&customerId=${customerId}&checklistItemId=${checkListItemId}&checkListTypeId=${checkListTypeId}&checklistDate=${checklistDate}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getChecklistDocumentView(model) {
        return this.http.post(`${AppConstant.API_BASE}kyc/checklist-upload-view?`,model)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getConditionPrecedentChecklistUpload(conditionId,loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}kyc/loan-conditions-precedent-upload/conditionId/${conditionId}/loanApplicationId/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    removeChecklistDocumentUpload(definitionId, statusId, detailId, isProductBased) {
        return this.http.delete(`${AppConstant.API_BASE}kyc/checklist-upload-delete/definitionId/${definitionId}/statusId/${statusId}/detailId/${detailId}/isProductBased/${isProductBased}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeConditionPrecedentDocumentUpload(conditionId, loanApplicationId) {
        return this.http.delete(`${AppConstant.API_BASE}kyc/condition-precedent-upload-delete?conditionId=${conditionId}&loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    extendChecklistDeferralDate(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/extend-checklist-deferral-date`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateProvidedChecklist(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/update-provided-checklist`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UpdateLoanConditionPrecedenceStatus(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/update-loan-condition-precedence-status`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getChecklistAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}setups/deferred-checklist-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDeferralDocumentsWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}setups/get-deferred-documents-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDeferralExtensionsWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}setups/get-deferred-extensions-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitDeferralDocumentForApproval(deferral) {
        let deferralObj = JSON.stringify(deferral);
        return this.http.post(`${AppConstant.API_BASE}setups/submit-deferred-document-for-approval`, deferralObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitDeferralExtensionForApproval(deferral) {
        let deferralObj = JSON.stringify(deferral);
        return this.http.post(`${AppConstant.API_BASE}setups/submit-deferred-extension-for-approval`, deferralObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllDeferralChecklist() {
        return this.http.get(`${AppConstant.API_BASE}setups/deferred-checklist`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDeferralChecklistByConditionId(conditionId) {
        return this.http.get(`${AppConstant.API_BASE}setups/deferred-checklist-byContionId?conditionId=${conditionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    sendChecklistForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}setups/checklist-approval`, formObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getConditionPrecedentDocumentUpload(conditionId) {
        return this.http.get(`${AppConstant.API_BASE}kyc/loan-conditions-precedent?conditionId=${conditionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getConditionPrecedentDeletedDocumentUpload(conditionId) {
        return this.http.get(`${AppConstant.API_BASE}kyc/loan-conditions-precedent-deleted?conditionId=${conditionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    ViewConditionPrecedentDocumentUpload(documentId) {
        return this.http.get(`${AppConstant.API_BASE}kyc/loan-conditions-precedent-documentId/${documentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteUploadDocument(documentId) {
        return this.http.delete(`${AppConstant.API_BASE}kyc/delete-conditions-precedent-documentId?documentId=${documentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    RegulatoryChecklistAutomapping(customerId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/regulatory-checklist-automapping?customerId=${customerId}&targetId=${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    uploadFile(file: File, body: any) {
        return new Promise((resolve, reject) => {
            let url = `${AppConstant.API_BASE}kyc/loan-conditions-precedent-upload`;
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
    
    //ESG Checklist
    getESGType() {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getESGClass() {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-class`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getESGCategories() {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-categories`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getESGsubCategories(categoryId) {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-sub-categories?categoryId=${categoryId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteESGChecklistDefinition(esgChecklistDefinitionId) {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-checklist-definition/delete/${esgChecklistDefinitionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getESGChecklistDefinition() {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-checklist-definition`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getESGChecklistStatus(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-checklist-status?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getESGChecklistDetail(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/esg-checklist-detail?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getChecklistFacilityList(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-facility-detail?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addESGChecklistDefinition(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/esg-checklist-definition`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    calculateESGChecklistSummary(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/esg-checklist-calculate`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGreenRatingDefinition() {
        return this.http.get(`${AppConstant.API_BASE}setups/green-rating-definition`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAllChecklistItemBycheckListTypeId(checkListTypeId: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-item/${checkListTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCheckListScores(checkListTypeId: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/checklist-scores/${checkListTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGreenRatingStatus(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/green-rating-status?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGreenRatingDetail(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/green-rating-detail?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    calculateGreenRatingSummary(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/green-rating-calculate`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addGreenRatingDefinition(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/green-rating-definition`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addGreenRatingDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/green-rating-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addGreenRatingSummary(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/green-rating-summary`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteGreenRatingDefinition(esgChecklistDefinitionId) {
        return this.http.get(`${AppConstant.API_BASE}setups/green-rating-definition/delete/${esgChecklistDefinitionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addESGChecklistDetail(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/esg-checklist-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addESGChecklistSummary(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/esg-checklist-summary`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addESGCategory(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/esg-category`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addESGSubCategory(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setups/esg-subcategory`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    editESGCategory(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/esg-category`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    editESGSubCategory(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}setups/esg-subcategory`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteESGCategory(esgCategoryId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/esg-category/${esgCategoryId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteESGSubCategory(esgSubcategoryId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/esg-subcategory/${esgSubcategoryId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ForwardChecklistForApproval(array) {
        let bodyObj = JSON.stringify(array);
        return this.http.post(`${AppConstant.API_BASE}setups/submit-loan-condition-precedence-status`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    validateChecklist(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}setups/validate-checklist/${applicationId}`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

// for deferral waiver memo
getDrawdownDeferralMemo(operationId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}credit/get-drawdown-memo/${operationId}/operationId/${targetId}/targetId`)
    .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

   getDeferralWaiverPdf(operationId, targetId,loanApplicationDetailId) {
    return this.http.get(`${AppConstant.API_BASE}report/get-deferralwaiver-memo-pdf/${operationId}/${targetId}/${loanApplicationDetailId}`)
    .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getDeferralApprovalTrail(targetId, operationId) {
    return this.http.get(`${AppConstant.API_BASE}setups/get-deferral-approval-trail/targetId/${targetId}/operationId/${operationId}`)
    .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}