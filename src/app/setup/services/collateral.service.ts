
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';





import { AppConfigService } from '../../shared/services/app.config.service';
import { LoginComponent } from '../../auth/login.component';


let AppConstant: any = {};
@Injectable()
export class CollateralService {
    private countryCode:string;

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    setCountryCode(countryCode: string): void {
        this.countryCode = countryCode;
      }

    getCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCollateralDocumentTypes(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-document-type/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    addCollateralDocumentType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-document-type`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralTypeByApplication(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-type/loan-application/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateCollateralType(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/collateral-type/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getSubTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-sub-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    saveSubType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-sub-type`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateSubType(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/collateral-sub-type/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getValuerType() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-valuer-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getValuers() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-valuer`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralPerfectionStatus() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-perfection-status`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralUSageStatus() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-usage`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    saveValuer(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-valuer`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateValuer(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/collateral-valuer/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    // ------------------ LOANS COLLATERAL ------------------ \\

    // getLoanCollateral(id) {
    //     return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/loan/${id}`) // redundant
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getLoanApplicationCollateral(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-collateral/loan-application/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getActiveCustomerCollateral(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/active/${applicationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getActiveLoanCollateral(loanId, productTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/loan/${loanId}/productTypeId/${productTypeId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCustomerCollateral(id, applicationId?: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/customer/${id}/application/${applicationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCustomerFacility(id, applicationId?: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-facility/customer/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    getCustomerCashCollateral(id, applicationId?: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-cash-collateral/customer/${id}/application/${applicationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCustomerCashCollateralApplications(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-cash-collateral-applications/collateralCustomerId/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    getProposedCustomerCollateral(applicationId, currencyId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral/application/${applicationId}/currencyId/${currencyId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getProposedFacilitiesToCollateralByCollateralId(collateralId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral/failities/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getProposedCustomerCollateralByCustomerId(customerId, getAll = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral/application/${customerId}/${getAll}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getProposedCustomerCollateralByCustomerIdLMS(customerId, getAll = false) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-lms/application/${customerId}/${getAll}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCustomerCollateralReport(searchParam) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/searchParam/${searchParam}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCustomerFixedDepositCollateral(searchParam) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-customer-fixed-deposit-collateral/searchParam/${searchParam}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCustomerCollateralRep(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral/customer`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getTempCustomerCollateral() {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-customer-collateral`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCustomerCollateralByCollaterId(collaterId) {
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral-by-collateralId`, collaterId)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    postInsuranceTracking(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral-insurance-tracking`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateInsuranceTracking(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/customer-collateral-insurance-tracking-update/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    confirmCompleteInformation(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral-insurance-details-confirmation/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    deleteInsuranceInformation(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/delete-customer-collateral-insurance-details/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getDocumentUploadList() {
        return this.http.get(`${AppConstant.API_BASE}document/document-upload-list`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getAllValuationRequestWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuation-waiting-for-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    GetAllValuationRequest(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuation-waiting-for-approval/${collateralId}/collateralId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getTempItemPolicy() {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-item-policy`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getInsurancePoliciesWaitingForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-policy-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getTempItemPolicyList(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-item-policy/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getItemPolicyList(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/item-policy/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralInsurancePolicyList(data) {
        let dataObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-insurance-policy-list`, dataObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getProfileBusinessUnits() {
        return this.http.get(`${AppConstant.API_BASE}setups/profile-business-unit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerCollateralInformationById(customercollateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-information-view/${customercollateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getInsurancePolicyReport(trackingId) {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-policy-report/${trackingId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    // GetCollateralTypeByCollateral(collateralId, typeId) {
    //     console.log("the tracing collateral customer id =="+collateralId);
    //     return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/${collateralId}/collateral/${typeId}/type`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    GetCollateralDetailsByCollateral(collateralId, typeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/${collateralId}/collateral/${typeId}/type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralInfo(customercollateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-information-view/${customercollateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralInformationByCollateralType(collateralId, typeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/${collateralId}/collateral/${typeId}/type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getTempCollateralInformationByCollateralType(collateralId, typeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-customer-collateral/type/collateral/${collateralId}/type/${typeId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    mapCollateral(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/application-collateral/map`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    isMappedCollateral(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/application-collateral/mapped`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    unmapCollateral(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/application-collateral/unmap`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    deleteProposedCollateral(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/delete-proposed-collateral-coverage`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    deleteDuplicatedCollateral(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/delete-duplicate-collateral`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    saveCustomerCollateral(body) {

        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    addNewPolicy(body) {

        ////console.log('body <<>>',body.value);

        let bodyObj = JSON.stringify(body.value);
        return this.http.post(`${AppConstant.API_BASE}credit/add-insurance-policy`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateCustomerCollateral(body, collateralId) {
        // let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/customer-collateral/${collateralId}`, body)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    releaseCustomerCollateral(mappingId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/release/${mappingId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    assignCustomerCollateral(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral/assignment`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    // ------------------ TYPES ------------------ \\

    getValueBaseTypes(collateralType) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-value-base-type/${collateralType}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralSubTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-sub-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getFrequencyTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/frequency-types`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    // ------------------ PRODUCT MAPPING ------------------ \\

    getUnmappedCollateralToProduct(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-collateral-type/unmapped/${productId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getMappedCollateralToProduct(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-collateral-type/all/${productId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getAllMappedCollateralToProduct(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-collateral-type/all/mapped/${productId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    mapColateralToProduct(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/product-collateral-type`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    removeColateralFromProduct(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/product-collateral-type/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    // ------------------ DOCUMENT UPLOAD ------------------ \\
    getCollateralReleasedDocument(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-document-release/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCollateralDocument(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-document/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCollateralDocumentByCollaterCoe(collateralCode) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-document-by-collateralcode/${collateralCode}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getTempCollateralDocument(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-collateral-document/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralVisitationDetail(collateralCustomerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-visitation/${collateralCustomerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getTempCollateralVisitationDetail(collateralCustomerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-collateral-visitation/${collateralCustomerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getInsurancePolicies(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-policies/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    GetInsurancePolicyByCollateralid(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-policy/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getStockPrice() {
        return this.http.get(`${AppConstant.API_BASE}credit/stock-price`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralVisitationFile(collateralVisitationID) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-visitation-file/${collateralVisitationID}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getTempCollateralVisitationFile(collateralVisitationID) {
        return this.http.get(`${AppConstant.API_BASE}credit/temp-collateral-visitation-file/${collateralVisitationID}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralGuaranteeFile(targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-guarantee/${targetId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    getCollateralHistory(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-history/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralHistoryUsage(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-history-usage/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    uploadFile(file: File, body: any) {
        let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/collateral-document`;
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

    uploadTempFile(file: File, body: any) {
        let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/temp-collateral-document`;
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
    customerCollateralRelease(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral/release-collateral`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    sendtoApprovalCollateralRelease(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral/complete-job-request-release-collateral`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    sendtoCollateralReleaseForApproval(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral/go-for-approval-release-collateral`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCollateralReleaseAwaitingJobRequest() {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/release-collateral-awaiting-job-request`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCollateralReleaseAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/release-collateral-awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getSupportingDocumentByRelease(releaseId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/releaseId/${releaseId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getSupportingDocumentByDocumentId(documentId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/${documentId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    uploadAdditionalFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/customer-collateral/supporting-document-upload`;
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


    getCollateralReleaseById(collateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/release-collateral-awaiting-job-request/collateralId/${collateralId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    getCollateralInformation(collateralCustomerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/get-collateral-information/colateralcustomerId/${collateralCustomerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    postCollateralInformation(file: File, body: any) {
        let bodyObj = JSON.stringify(body);

        ////console.log('bodyObj >>>',bodyObj)

        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/customer-collateral`;
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

            ////console.log('formData >>>',formData)

            xhr.send(formData);
        });
    }


    postJoinCollateralInformation(file: File, body: any) {
        let bodyObj = JSON.stringify(body);

        ////console.log('bodyObj >>>',bodyObj)

        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/customer-join-collateral`;
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

            ////console.log('formData >>>',formData)

            xhr.send(formData);
        });
    }


    AddTempVisitationloadFile(file: File, body: any) {
        let bodyObj = JSON.stringify(body);

        ////console.log('body >>>',body)
        ////console.log('bodyObj >>>',bodyObj)

        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/temp-visitation-document`;
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

                ////console.log(key, body[key]);

            }

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            ////console.log('formData >>>',formData);

            xhr.send(formData);
        });
    }

    AddVisitationloadFile(file: File, body: any) {
        let bodyObj = JSON.stringify(body);

        ////console.log('body >>>',body)
        ////console.log('bodyObj >>>',bodyObj)

        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}credit/visitation-document`;
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

                ////console.log(key, body[key]);

            }

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            ////console.log('formData >>>',formData);

            xhr.send(formData);
        });
    }

    // ------------------ APPROVALS ------------------ \\

    getPendingCollateralRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-release/pending-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    approveCustomerCollateralRelease(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/customer-collateral/release-approval`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    approveCustomerCollateralCreation(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/temp/customer-collateral-approval`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    approveItemPolicyCreation(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/insurance-policy-approval`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    // ------------------ SEARCH ------------------ \\

    search(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/search/?queryString=${term}`)
            // return this.http.get(`${AppConstant.API_BASE}setup/staff/search/?queryString=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    //------------------------------------------------------------




    getMappedCollateralToLoanApplication(customerId, loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/mapped-collateral-application/customer/${customerId}/loanapplication/${loanApplicationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    getUnmappedCollateralToLoanApplication(customerId, loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/unmapped-collateral-application/customer/${customerId}/loanapplication/${loanApplicationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    deleteCollateralApplicationMapped(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/remove-mapped-collateral-application`, body)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    ///////////  GET LIENT AMOUNT FOR FIXED DEPOSIT 

    getLienAmountForFD(accountNo) {
        return this.http.post(`${AppConstant.API_BASE}credit/get-fixeddeposit-lien-amount`, accountNo)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getLienAmountForCASA(accountNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-casa-lien-amount/${accountNumber}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralSubTypesById(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-sub-type/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getFixedDepositAccountDetail(accountNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-casa-balance/${accountNumber}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    proposeCollateral(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/propose-collateral`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    proposeCollateralLMS(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/propose-collaterals-lms`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    rejectCollateral(collateralCustomerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/reject-propose/collateral/${collateralCustomerId}/collateralCustomerId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getInsuranceType() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getInsuranceCompany() {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-company`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    // Testing Collateral
    testCollateral(collateralId: number, typeId: number) {
        return this.http.get(`${AppConstant.API_BASE}test/get-collateral-types/collateral/${collateralId}/type/${typeId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getValuationReports() {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-all-valuation-reports`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getValuationRequestTypes() {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuation-request-types`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    addValuationReport(report) {
        let reportObj = JSON.stringify(report);
        return this.http.post(`${AppConstant.API_BASE}valuation/add-valuation-report`, reportObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    addCollateralValuation(valuation) {
        let valuationObj = JSON.stringify(valuation);
        return this.http.post(`${AppConstant.API_BASE}valuation/add-collateral-valuation`, valuationObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    addValuationPrerequisite(prerequisite) {
        let prerequisiteObj = JSON.stringify(prerequisite);
        return this.http.post(`${AppConstant.API_BASE}valuation/add-valuation-prerequisite`, prerequisiteObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    editValuationPrerequisite(valuationPrerequisiteId, prerequisite) {
        let prerequisiteObj = JSON.stringify(prerequisite);
        return this.http.put(`${AppConstant.API_BASE}valuation/edit-valuation-prerequisite/${valuationPrerequisiteId}/valuationPrerequisiteId`, prerequisiteObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    deleteValuationPrerequisite(valuationPrerequisiteId: number) {
        return this.http.delete(`${AppConstant.API_BASE}valuation/delete-valuation-prerequisite/${valuationPrerequisiteId}/valuationPrerequisiteId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    searchForCollateralValuation(searchString) {
        return this.http.get(`${AppConstant.API_BASE}valuation/search-for-collateral-valuation/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getSecurityReleaseSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}credit/approval-security-release-search/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCashSecurityReleaseSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}credit/approval-cash-security-release-search/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getOriginalDocumentSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}document/original-document-search/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    getCollateralValuation(collteralValuationId: number) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-collateral-valuation/${collteralValuationId}/collteralValuationId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getValuationPrerequisite(valuationPrerequisiteId: number) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuation-Prerequisite/${valuationPrerequisiteId}/valuationPrerequisiteId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateValuationPrerequisiteStatus(valuationPrerequisiteId: number, prerequisite) {
        let prerequisiteObj = JSON.stringify(prerequisite);
        return this.http.put(`${AppConstant.API_BASE}valuation/update-valuation-prerequisite-status/${valuationPrerequisiteId}/valuationPrerequisiteId`, prerequisiteObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCollateralValuations(collateralId: number) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-all-collateral-valuations/${collateralId}/collateralId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCollateralValuationsRequestList() {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-all-collateral-valuations-request-list`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getValuationPrerequisites(collateralValuationId: number) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-all-valuation-prerequisites/${collateralValuationId}/collateralValuationId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getValuationPrerequisitesList(collateralValuationId: number) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-all-valuation-prerequisites-list/${collateralValuationId}/collateralValuationId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    goForApproval(collateral) {
        let collateralObj = JSON.stringify(collateral);
        return this.http.post(`${AppConstant.API_BASE}valuation/go-for-collateral-valuation-approval`, collateralObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    addInsurancePolicy(data) {
        let collateralObj = JSON.stringify(data);
        //console.log('SERVICE', data);
        return this.http.post(`${AppConstant.API_BASE}credit/insurance-policy`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    GetinsuranceSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}credit/insurance-search/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }


    checkInsurancePolicy(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/check-insurance-policy`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    insuranceRequestGoForApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/insurance-request-go-for-approval`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }
    addCollateralValuerInfo(data) {
        return this.http.post(`${AppConstant.API_BASE}valuation/add-valuer`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateCollateralValuerInfo(data) {
        return this.http.post(`${AppConstant.API_BASE}valuation/update-valuer`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateCollateralNarration(data) {
        return this.http.post(`${AppConstant.API_BASE}valuation/update-valuer-narration`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    submitApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}valuation/submit-collateral-valuation-for-approval`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getAllCollateralValuerIformation() {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuer-info`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getAllCollateralValuerIformationById(id) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuer-info/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getCollateralValuerIformationById(id) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-single-valuer-info/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getAllCollateralValuerIformationDetailById(id) {
        return this.http.get(`${AppConstant.API_BASE}valuation/get-valuer-info-detail/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    GetCollateralCoverage(collateralSubTypeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-coverage/${collateralSubTypeId}/collateralSubTypeId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    AddCollateralCoverage(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-coverage`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    DeleteCollateralCoverage(collateralCoverageId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/delete-collateral-coverage/${collateralCoverageId}/collateralCoverageId`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    DeleteAddedValuer(valuerId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/delete-valuation-valuer/${valuerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    calculateCoverateOfCollateral(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/calculate-collateral-coverage`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    calculateCoverateOfCollateralLms(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/calculate-collateral-coverage-lms`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    addCollateralInsuranceRequest(data, id) {
        let dataObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}credit/insurance-policy-request/${id}`, dataObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    updateInsuranceRequest(data, id) {
        let dataObj = JSON.stringify(data);
        return this.http.put(`${AppConstant.API_BASE}credit/update-insurance-policy-request/${id}`, dataObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getInsuranceRequests() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-insurance-requests`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    removeInsuranceRequest(insuranceRequestId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/delete-insurance-request/${insuranceRequestId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));;
    }

    getLastComment(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-insurance-last-comment/${operationId}/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    savePolicy(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/policy-insurance-doc`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateInsurancePolicy(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/policy-insurance-doc/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteInsurancePolicy(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/policy-insurance-doc/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLienByApplicationDetailId(applicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}credit/lien-applicationDetailId/${applicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    placeLienOnInvestment(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/lien`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLienOnInvestment(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/lien/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerCollateralByCustomerCollateralId(customerCollateralId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-customer-collateral-by-customer-collateralId/${customerCollateralId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCollateralSwapRequest(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-swap`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralSwapRequests() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-swap`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralSwapRequestsForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-swap-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchForCollateralSwap(searchString) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-swap-search/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralSwapRequest(collateralSwapId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-swap/${collateralSwapId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCollateralSwapRequest(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/collateral-swap/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCollateralSwapRequest(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/collateral-swap/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardForCollateralSwap(body) {
        // console.log('forwarded =>');
        return this.http.post(`${AppConstant.API_BASE}credit/collateral-swap/forward-for-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralMappingDetails(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-mapping/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getNextLevelForCollateralSwap(collateralSwapId: number) {
        //let bodyObj = JSON.stringify(body);
        return this.http.get(`${AppConstant.API_BASE}credit/get-next-level-for-collateral-swap/${collateralSwapId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAddedInsurance(CollateralId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-insurance/${CollateralId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFacilityStampDuty(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-facility-stamp-duty/${loanApplicationId}`)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getFacilityStampDutyById(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-facility-stamp-duty-by-id/${loanApplicationId}`)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFacilityStampDuty() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-all-facility-stamp-duty`)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllFacilityStampDutyFixed() {
        return this.http.get(`${AppConstant.API_BASE}credit/get-all-facility-stamp-duty-fixed`)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllFacilityStampDutyReport(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/get-all-facility-stamp-duty-report`,data)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllFacilityStampDutyFiltered(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/get-all-facility-stamp-duty-filtered`,data)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllFacilityStampDutyFixedFiltered(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/get-all-facility-stamp-duty-fixed-filtered`,data)
            .pipe(
          map((res: any) => res), 
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveStampdutySharing(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/save-facility-stamp-sharing/`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveBulkCamsol(formObj) {
        let body = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}camsol/bulk-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    approveBulkStamp(formObj) {
        let body = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}document/sd-document-upload-bulk`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    uploadSDFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {
    
          let url = `${AppConstant.API_BASE}document/sd-document-upload`;
          // let url = `${AppConstant.API_BASE}media/document-excel`;
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
          formData.append('X-COUNTRYCODE', "NG");
    
          let token = this.http.getAuthorizationHeader();
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    
          xhr.send(formData);
        });
      }

    uploadSDFileBulk(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {
    
          let url = `${AppConstant.API_BASE}document/sd-document-upload-bulk`;
          // let url = `${AppConstant.API_BASE}media/document-excel`;
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
          formData.append('X-COUNTRYCODE', "NG");
    
          let token = this.http.getAuthorizationHeader();
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    
          xhr.send(formData);
        });
      }
    
      getAllStampSetup() {
        return this.http.get(`${AppConstant.API_BASE}credit/stamp-setup`).pipe(
          map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')));
      }

      addStampSetup(Obj) {
        let bodyObj = JSON.stringify(Obj);
        return this.http.post(`${AppConstant.API_BASE}credit/stamp-setup`, bodyObj).pipe(
          map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')));
      }

      updateStampSetup(fsCaptionObj, conditionId) {
        let bodyObj = JSON.stringify(fsCaptionObj);
        return this.http.put(`${AppConstant.API_BASE}credit/stamp-setup/${conditionId}`, bodyObj).pipe(
          map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')));
      }

      deleteStampSetup(conditionId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/delete-stamp/${conditionId}`) .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }

     
    
}
//