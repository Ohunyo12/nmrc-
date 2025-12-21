
import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../shared/services/app.config.service';
import { ILoanApplication } from '../loans/application/loanApplicationInfo.interface';

let AppConstant: any = {};
@Injectable()
export class LoanApplicationService {

    private storageSource = new Subject<any>();

    storageData: any = {};

    storage$ = this.storageSource.asObservable();

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    storeCustomerData(data: any) {
        this.storageSource.next(data);

    }

    getCustomerLines(customerId: number) {
        return this.http.get(`${AppConstant.API_BASE}loan/customer-lines/${customerId}`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    updateLoanApplicationFees(body) {
        return this.http.put(`${AppConstant.API_BASE}credit/fee-concession-request/`, body)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationFees(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-fees/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getOfficers() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/names`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRelationshipManager(staffId) {
        return this.http.get(`${AppConstant.API_BASE}setup/customer-relationship-Manager/${staffId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBusinessManager(staffId) {
        return this.http.get(`${AppConstant.API_BASE}setup/customer-business-Manager/${staffId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationLists(page, itemPerPage) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application?page=${page}&itemsPerPage=${itemPerPage}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getRefferneceNumber() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-reference-number`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    documentDateValidation(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-validate-document-date`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    documentNoValidation(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-validate-document-number`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    validateInvoiceDetail(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/validate-invoice-details`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    ValidateBulkLoanInvoice(data){
        return this.http.post(`${AppConstant.API_BASE}credit/validate-bulk-invoice-details`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationinfo(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-info/application/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationList() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-list`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCollateralRequirement(id, colcurrencyId?) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan/collateralrequirement/${id}/${colcurrencyId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    //application-details
    updateLoanApplicationAmount(data) {
        return this.http.put(`${AppConstant.API_BASE}credit/update-loan-application`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationDetailSuggestion(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-detail-suggestion`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getLoanApplicationReferanceNumber() {
        return this.http.get(`${AppConstant.API_BASE}setups/loanApplicationReferance`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetailFees(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-detailFees/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductClass() {
        return this.http.get(`${AppConstant.API_BASE}setups/product-class`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplication() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetailById(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-detail/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetailByApplicationId(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-detail/application/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExistingLoanApplication(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroupLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamount/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getBranchLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamount/branch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamount/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRMLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validatecreditlimitnpl/RMBM/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getNPLLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamount/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getExchangeRate(currencyId: number) {
        return this.http.get(`${AppConstant.API_BASE}finance/getexchangerate/${currencyId}/${null}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getSegmentLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamount/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getSectorLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamount/sector/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFacilitySectorLimit(id: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validateamountfacility/sector/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getPendingLoanApplication(page, itemPerPage) {
        //return this.http.get(`${AppConstant.API_BASE}credit/loan/application/pending/page/${page}/itemsPerPage/${itemPerPage}`)
        return this.http.get(`${AppConstant.API_BASE}credit/loan/application/pending?page=${page}&itemsPerPage=${itemPerPage}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getValidateNPLByBranch(branchId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/validatenpl/branch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCRMSFundingSource() {
        return this.http.get(`${AppConstant.API_BASE}credit/crms-funding-source`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCRMSRepaymentSource() {
        return this.http.get(`${AppConstant.API_BASE}credit/crms-repayment-source`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getRevisedProcessFlowByProductClassId(productClassId,productId,productTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/revised-process-flow-by-product-class/${productClassId}/${productId}/${productTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 


    getRacDetails(targetId) {
        return this.http.get(`${AppConstant.API_BASE}rac/rac-details/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCashCollaterizedProcessFlowBy() {
        return this.http.get(`${AppConstant.API_BASE}credit/cash-collaterized-process-flow`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllSyndicationType() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-syndication-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getSector() {
        return this.http.get(`${AppConstant.API_BASE}setups/sector`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSubSector() {
        return this.http.get(`${AppConstant.API_BASE}setups/subsectors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllPrincipals() {
        return this.http.get(`${AppConstant.API_BASE}setups/subsectors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    findLoan(searchQuery) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan/application/search/${searchQuery}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
        getAllPreliminaryEvaluationsByLoanType(loanTypeId) {
            return this.http.get(`${AppConstant.API_BASE}credit/loan-preliminary-evaluation/loan-type/${loanTypeId}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }
        
        getPreliminaryEvaluations(applicationId) {
                return this.http.get(`${AppConstant.API_BASE}credit/loan-preliminary-evaluation/application/${applicationId}`)
                .pipe(
                    map((res: any) => res),
                  catchError((error: any) => observableThrowError(error.error || 'Server error')),);
            }

    getAllPreliminaryEvaluationsMappedToApplication() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-preliminary-evaluation-mapped-to-application`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getCustomerLoanPreliminaryEvaluations(customerId, loanTypeId, customerGroupId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-pen-code/${customerId}/${loanTypeId}/${customerGroupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerLoantermSheets(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/term-sheets/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerLoantermSheetsCorrection() {
        return this.http.get(`${AppConstant.API_BASE}credit/term-sheets`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getCheckCertificateOfOccupancy(cofown: string) {
        return this.http.get(`${AppConstant.API_BASE}credit/check-exiting-certificate-of-ownership/${cofown}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllPreliminaryEvaluationsAwaitingApprovalByLoanType(loanTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan/preliminary-evaluation/awaiting-approval/loan-type/${loanTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addPreliminaryEvaluation(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/loan/preliminary-evaluation`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendPreliminaryEvaluationForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan/preliminary-evaluation/approval`, formObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    validateApplication(body: ILoanApplication) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan/validate-application`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveApplication(body: ILoanApplication) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan/application`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteApplication(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/loanApplicationDetail/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteLoanApplication(id) {
        //  let bodyObj = JSON.stringify(body);
        return this.http.delete(`${AppConstant.API_BASE}credit/loanApplication/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExposures() {
        let list: any = [
            { 'group': '1', 'individual': '0', 'branch': 0, 'sector': 0 }
        ];
        return list;
    }

    updatePreliminaryEvaluation(loanPenId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/loan/preliminary-evaluation/${loanPenId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendForLoanApplication(loanPenId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/loan/preliminary-evaluation/${loanPenId}/loan-application`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generateOfferLetter(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loans/offer-letter-generation/customer/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationChecklist() {
        return this.http.get(`${AppConstant.API_BASE}setups/loan-application-checklist`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationdetails(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-eligibility/loanApplicationId/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationDetailsByReference(reference) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-details/reference/${reference}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSingleLoanApplicationdetail(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-eligibility/loanApplicationDetailId/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllloanApplicationdetails(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-details/loanApplicationId/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplication(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSingleLoanApplication(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/single-loan-application/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    
    UpdateloanApplication(id) {

        return this.http.post(`${AppConstant.API_BASE}credit/loan-application`, id)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    loanApplicationUpdate(body) {

        return this.http.put(`${AppConstant.API_BASE}credit/update-loan-application`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    populateLoanApplicationChecklist(data) {

        return this.http.post(`${AppConstant.API_BASE}setups/populate-loanapplication-checklist`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UpdateloanApplicationForCAM(body) {

        return this.http.put(`${AppConstant.API_BASE}credit/loan-application-for-cam`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    uploadFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}kyc/checklist-document-upload`;
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


    generateOfferLetterTemplate(applicationRefNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter-template/${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveDraftOfferLetter(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateDraftOfferLetter(documentId, bodyObj) {
        return this.http.put(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/${documentId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllDraftOfferLetters() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDraftOfferLetterByApplRefNumber(applicationRefNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductClassByCustomerId(customerTypeId: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-class/customer/${customerTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    validatePrecedenceChecklistCompleted(loanApplicationId: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/validate-precedence-checklist-completed?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveFinalOfferLetter(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/final`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    returnBackToBusinessAvailment(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/availment/loan-application/back-to-business`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    returnBackToPrevious(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/availment/refer-back-one-step`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    logAvailmentDecisionForApproval(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/availment/approval-decision`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    availmentChecklistValidation(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/availment-checklist-validation?loanApplicationId=${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFinalOfferLetters() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/final/all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFinalOfferLetterByLoanAppId(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/final/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    logApplicationForApproval(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/availment/approval`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getForm3800Template(applicationRefNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-form38b-template/${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getForm3800TemplateLMS(applicationRefNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/prepared-form38b-template-lms/${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addLoanApplicationCollateralMapping(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/collateral`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationCollateralMappingByLoanApplication(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-collateral/loan-application/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationById(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDocumentByApplicationNumber(invoiceNo, applicationNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-document-appNo-refNo?refNo=${invoiceNo}&applicationNumber=${applicationNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationProductDetails(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-details-product/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetailsByApplicationId(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/application-detail/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLmsLoanApplicationDetailsByApplicationId(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/application-detail-lms/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanApplicationDetails(applicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application-details/${applicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    logOfferLetterDecisionForApproval(bodyObj) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/offer-letter/approval`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationsUnderReview() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/credit-assessment-memorandum/under-review`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    //LOAN PRINCIPAL
    getLoanPrincipals() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-principals`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanPrincipal(applicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application-details/${applicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addLoanPrincipal(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/add-principal`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateLoanPrincipal(bodyObj) {
        return this.http.put(`${AppConstant.API_BASE}credit/update-principal`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    DeleteLoanPrincipal(documentId, bodyObj) {
        return this.http.put(`${AppConstant.API_BASE}credit/loan-application/prepared-offer-letter/${documentId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovedMarkets() {
        return this.http.get(`${AppConstant.API_BASE}credit/markets`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addApprovedMarket(formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/add-market`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateApprovedMarket(marketId, formObj) {
        const bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/update-market/${marketId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteApprovedMarket(marketId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/update-market/${marketId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    referBackForReview(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/rejection`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // referBackForCreditReview(body) {
    //     return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/refer-back`, JSON.stringify(body))
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    referBackForAppraisalReview(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/appraisal-review-referback`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCommentOnLoanAvailment(applicationRefNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/comments/${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    searchForLoan(searchString) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/search?searchString=${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCRMSSecuredCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/crms-secured-collateral-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllCRMSCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/crms-all-collateral-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCRMSUnsecuredCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/crms-unsecured-collateral-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    SaveCollateralType(body) {
        return this.http.put(`${AppConstant.API_BASE}credit/save-collateral-type-crms`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // updateApprovalRelief(id, body) {
    //     return this.http.put(`${AppConstant.API_BASE}setups/save-collateral-type-crms/${id}`, JSON.stringify(body))
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getRegions(regionTypeId) {
        return this.http.get(`${AppConstant.API_BASE}setups/region/type/${regionTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTotalExposureLimitReference(reference) {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/total-exposure-limit/reference/${reference}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getMaturityInstruction(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/maturityinstruction-operation/loanId/${loanId}/loanSystemTypeId/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getWrittenOffAccrualAmount(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/written-off-accrual-amount/loanId/${loanId}/loanSystemTypeId/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLmsOperation(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lms-operation/loanId/${loanId}/loanSystemTypeId/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExceptionalLoansForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-exceptional-loans-for-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardExceptionalLoanForApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/exceptional-loan/forward-for-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getApplicationDetailFields(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/application-detail-fields/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    loanApplicationFlowChange(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-flowchange/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLoanApplicationThatFailedRAC(loanApplicationDetailId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/loanApplicationDetail/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    uploadInvoiceRecords(file: File, body: any) {
        return new Promise((resolve, reject) => {
            let url = `${AppConstant.API_BASE}credit/multiple-invoice`;
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

    getFacilityRating(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-facility-rating/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetTotalBankExposureAndLimit() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-total-bank-exposure-and-limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendLoanToApplications(loanApplicationId: number, operationId: number){
        return this.http.get(`${AppConstant.API_BASE}credit/send-to-edit/${loanApplicationId}/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
   
    updateExposure(formObj, exposureId) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.put(`${AppConstant.API_BASE}credit/Exposure-update/${exposureId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }

    addExposure(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}credit/add-exposure`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllExposureManual() {
        return this.http.get(`${AppConstant.API_BASE}credit/exposure-manual`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }


    deleteExposure(exposureId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/delete-exposure/${exposureId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLoanDetailReviewTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }

    getAllApprovedCycles() {
        return this.http.get(`${AppConstant.API_BASE}credit/approved-trade-cycle`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }

    // modifyFacility(formObj, loanApplicationDetailId) {
    //     let bodyObj = JSON.stringify(formObj);
    //     return this.http.put(`${AppConstant.API_BASE}credit/modify-facility/${loanApplicationDetailId}`, bodyObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error')); 
    // }

    modifyLMSFacility(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}creditoperations/modify-lms-facility`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }

    approveFacilityModification(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/facility-modification/approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveFacilityModification(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/facility-modification`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateFacilityModification(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/facility-modification/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteFacilityModification(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/facility-modification/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFacilityModificationsForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/facility-modification/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveLMSFacilityModification(body) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/lms-facility-modification/approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLMSFacilityModificationsForApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/lms-facility-modification/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllPropertyTypes() {
      return this.http.get(`${AppConstant.API_BASE}credit/property-type`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
  }
}