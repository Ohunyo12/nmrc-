
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/switchMap';
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class ProductService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  getProductsFees(id) {
    return this.http.get(`${AppConstant.API_BASE}setups/fee/product/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getSavedFacilityFees(loanApplicationDetailId, forModifyFacility) {
    return this.http.get(`${AppConstant.API_BASE}setups/fee/saved-Facility/${loanApplicationDetailId}/${forModifyFacility}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProducts() {
    return this.http.get(`${AppConstant.API_BASE}setups/product`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

      getAllProducts1() {
        return this.http.get(`${AppConstant.API_BASE}setups/all-products`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // searchForProducts(terms: Observable<any>) {
    //     return terms.debounceTime(400)
    //         .distinctUntilChanged()
    //         .switchMap(term => this.searchProductRealtime(term));
    // }

  searchProductRealtime(search) {
    return this.http.get(`${AppConstant.API_BASE}setups/product/?searchQuery=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductsLite() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-lite`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllLoanProducts() {
    return this.http.get(`${AppConstant.API_BASE}setups/loan-product`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getCustomerProductFees(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-product-fee/customer/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductsByProductClass(productclassId, customerTypeId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-by-productclass/${productclassId}/customerType/${customerTypeId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductsByProductClassAndCustomerType(productclassId, customerTypeId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product/product-class/${productclassId}/customer-type/${customerTypeId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductsBehaviourByProductId(id) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-behaviour/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductPriceIndexByProductId(productId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-by-productId/${productId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getAllProductTypes() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getAllProductsByProductGroup() {
    return this.http.get(`${AppConstant.API_BASE}setups/product/group`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductClasses() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-class`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductClassType() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-class-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getRevolvingTypes() {
    return this.http.get(`${AppConstant.API_BASE}loan/revolving-types`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getTemporaryOverdraftRevolvingTypes() {
    return this.http.get(`${AppConstant.API_BASE}loan/temporary-overdraft-revolving-types`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductClassification() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-classification`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getAllProductClassesByProductProcessid(id) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-class/product-processid/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductClassByProcessidAndcustomertypeid(customertypeid, processId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-class/customertype/${customertypeid}/process/${processId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductProcess() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-process`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductProcessById(id) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-process/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  addUpdateProductClassification(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/product-classification`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  addProductProcess(formObj) {
    return this.http.post(`${AppConstant.API_BASE}setups/product-process`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateProductProcess(productProcessId, formObj) {
    return this.http.put(`${AppConstant.API_BASE}setups/product-process/${productProcessId}`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductByGroupAndCategory(pGroupId, pCatId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product/group/${pGroupId}/category/${pCatId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductByTypeAndCategory(pTypeId, pCatId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product/type/${pTypeId}/category/${pCatId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductsByProductClassProcess(productClassProcessId: number) {
    return this.http.get(`${AppConstant.API_BASE}setups/product/productClassProcessId/${productClassProcessId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductById(prodId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product/${prodId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getProductCurrencyPriceIndexes(currencyId: number) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-by-currencyId?currencyId=${currencyId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  // getProductPriceIndexesByProductId(productId: number) {
  //     return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-by-productId?productId=${productId}`)
  //         .map((res: Response) => res.json())
  //         .catch((error: any) => Observable
  //             .throw(error.json().error || 'Server error'));
  // }

  getProductPriceIndexByCurrencyId(currencyId: number) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-by-currency/${currencyId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductPriceIndex() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getProductPriceIndexGlobal() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-global`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getProductPriceIndexGlobalAwaitingApproval() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-global-approval`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  addProductPriceIndex(formObj) {
    return this.http.post(`${AppConstant.API_BASE}setups/product-price-index`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateProductPriceIndex(productPriceIndexId, formObj) {
    return this.http.put(`${AppConstant.API_BASE}setups/product-price-index/${productPriceIndexId}`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  addProductPriceIndexGlobal(formObj) {
    return this.http.post(`${AppConstant.API_BASE}setups/product-price-index-global`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  sendForApproval(formObj) {
    return this.http.post(`${AppConstant.API_BASE}setups/product-price-index-global-approval`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  updateProductPriceIndexGlobal(productPriceIndexGlobalId, formObj) {
    return this.http.put(`${AppConstant.API_BASE}setups/product-price-index-global/${productPriceIndexGlobalId}`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getProductPriceIndexCurrency(productPriceIndexId) {
    return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-currency/${productPriceIndexId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  addProductPriceIndexCurrency(formObj) {
    return this.http.post(`${AppConstant.API_BASE}setups/product-price-index-currency`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateProductPriceIndexCurrency(formObj) {
    return this.http.put(`${AppConstant.API_BASE}setups/product-price-index-currency`, formObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  deleteProductPriceIndexCurrency(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/product-price-index-currency/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  deleteProductPriceIndex(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/product-price-index/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getProductPriceIndexHistory(data) {
    return this.http.post(`${AppConstant.API_BASE}setups/product-price-index-history`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getAllDayCount() {
    return this.http.get(`${AppConstant.API_BASE}setups/day-count`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductsAwaitingApproval() {
    return this.http.get(`${AppConstant.API_BASE}setups/product/approvals/temp`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getCRMSTypes() {
    return this.http.get(`${AppConstant.API_BASE}setups/crms-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getRiskRatingTypes() {
    return this.http.get(`${AppConstant.API_BASE}setups/risk-rating-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  addProduct(prodObj) {
    let bodyObj = JSON.stringify(prodObj);

    return this.http.post(`${AppConstant.API_BASE}setups/product`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getDocumentDefinition() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-document-definition`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  addDocumentDefinition(prodObj) {
    let bodyObj = JSON.stringify(prodObj);

    return this.http.post(`${AppConstant.API_BASE}setups/add-product-document-definition`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllProductDocumentMappings() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-document-mapping`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  addProductDocumentMapping(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/product-document-mapping`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateProductDocumentMapping(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/product-document-mapping/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  removeProductDocumentMapping(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/product-document-mapping/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  addCustomerProductFee(custProdFeeObj) {
    let bodyObj = JSON.stringify(custProdFeeObj);

    return this.http.post(`${AppConstant.API_BASE}customer/customer-product-fee`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateProduct(prodId, prodObj) {
    let bodyObj = JSON.stringify(prodObj);
    return this.http.put(`${AppConstant.API_BASE}setups/product/${prodId}`, prodObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  approveProduct(prodObj) {
    return this.http.post(`${AppConstant.API_BASE}setups/product/approval`, prodObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProductBehaviorTypes() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-behaviour-types`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  GetRacCategoryTeirs(productId) {
    return this.http.get(`${AppConstant.API_BASE}rac/defined-category-type/${productId}/productId`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  RacCategoryTypeExist(productId, racCategoryTypeId) {
    return this.http.get(`${AppConstant.API_BASE}rac/exit-rac-category-type/${productId}/productId/${racCategoryTypeId}/racCategoryTypeId`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  // ========================== NMRC Product Setup ======================================
  getProductTypes() {
    return this.http.get(`${AppConstant.API_BASE}setups/all-products`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));;
  }

  getAllOriginationFeeSetup() {
    return this.http.get(`${AppConstant.API_BASE}admin/get-originationfee`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  addOriginationFeeSetup(Obj) {
    let bodyObj = JSON.stringify(Obj);
    return this.http.post(`${AppConstant.API_BASE}admin/add-originationfeesetup`, bodyObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateOriginationFeeSetup(fsCaptionObj: any, originationId: number) {
    return this.http.put(`${AppConstant.API_BASE}admin/update-originationfee?id=${originationId}`,fsCaptionObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')
      )
    );
  }

  deleteOriginationFeeSetup(originationId) {
    return this.http.delete(`${AppConstant.API_BASE}admin/delete-originationfee/${originationId}`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllServiceFeeSetup() {
    return this.http.get(`${AppConstant.API_BASE}admin/get-servicefee`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  addServiceFeeSetup(Obj) {
    let bodyObj = JSON.stringify(Obj);
    return this.http.post(`${AppConstant.API_BASE}admin/add-servicefee`, bodyObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateServiceFeeSetup(fsCaptionObj: any, serviceId: number) {
    return this.http.put(`${AppConstant.API_BASE}admin/update-servicefee?id=${serviceId}`,fsCaptionObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')
      )
    );
  }

  deleteServiceFeeSetup(serviceId) {
    return this.http.delete(`${AppConstant.API_BASE}admin/delete-servicefee/${serviceId}`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getAllSeasonFeeSetup() {
    return this.http.get(`${AppConstant.API_BASE}admin/get-refinanceperiod`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  addSeasonFeeSetup(Obj) {
    let bodyObj = JSON.stringify(Obj);
    return this.http.post(`${AppConstant.API_BASE}admin/add-refinanceperiod`, bodyObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateSeasonFeeSetup(fsCaptionObj: any, seasonId: number) {
    return this.http.put(`${AppConstant.API_BASE}admin/update-refinanceperiod?id=${seasonId}`,fsCaptionObj).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')
      )
    );
  }

  deleteSeasonFeeSetup(seasonId) {
    return this.http.delete(`${AppConstant.API_BASE}admin/delete-refinanceperiod/${seasonId}`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
}