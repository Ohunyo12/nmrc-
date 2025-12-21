
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class LoanReviewApplicationService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    submitApplication(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/submit`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ImportFacility(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/add-existing-loan`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitTakeFee(body) {
        return this.http.post(`${AppConstant.API_BASE}chargefee/take-fee/submit`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getTakeFeeAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}chargefee/take-fee-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    takeFeeGoForApproval(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}chargefee/take-fee-approve`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    validateCustomer(loanApplicationDetailId,customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application/validatecustomer/${loanApplicationDetailId}/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    validateSubAllocation(loanApplicationDetailId,customerId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application/validatesuballocation/${loanApplicationDetailId}/${customerId}/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllSelectList() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application/select-list`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAllLMSApprovalOperationList() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application-approval/select-list`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAllLMSApprovalOperationListByProductTypeId(productTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application-approval/select-list/productTypeId/${productTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getChargeFeeDetails(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application/chargefeeid/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getProductTypeList() {
        let productType: any = [
            { 'id': '1', 'name': 'Loan' },
            { 'id': '2', 'name': 'Revolving' },
            { 'id': '3', 'name': 'Contigent' }
        ]
        return productType;
    }
    
    getSelectedReasignedAccount(data) {    
        return this.http.post(`${AppConstant.API_BASE}loanoperation/selected-reasigned-account`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveReasignAccount(data) {    
        return this.http.post(`${AppConstant.API_BASE}loanoperation/approve-reasign-account`, JSON.stringify(data))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllReasignedAccountByLoanIdAndProductType(loanId,productTypeId) {    
        return this.http.get(`${AppConstant.API_BASE}loanoperation/get-all-reasigned-account/loan/${loanId}/productType/${productTypeId}` )
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllReasignedAccount() {    
        return this.http.get(`${AppConstant.API_BASE}loanoperation/get-all-reasigned-account` )
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/loan-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    loanSearchFeeCharge(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/loan-search-fee`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    loanReviewSearchFeeCharge(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/term-and-revolving-loan-review-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveCamDocument(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/save-cam`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCamDocumentByLevel(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application/get-cam/?applicationId=${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCamDocuments(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application/get-cams/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardApplication(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/forward-application`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardLienRemovalApplication(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application/forward-lien-removal-application`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getRegions(regionTypeId) {
        return this.http.get(`${AppConstant.API_BASE}setups/region/type/${regionTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}