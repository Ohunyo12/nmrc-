
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'app/admin/services';
import { AppConfigService } from 'app/shared/services/app.config.service';


let AppConstant: any = {};

@Injectable()
export class RacService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }



  getRiskAcceptanceCriteria(productId) {
    return this.http.get(`${AppConstant.API_BASE}rac/risk-acceptance-criteria/product/${productId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  getCategories() {
    return this.http.get(`${AppConstant.API_BASE}rac/category`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCategory(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/category/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCategoryType(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/category-type-id/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveCategory(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/category`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateCategory(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/category/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteCategory(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/category/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDefinitions() {
    return this.http.get(`${AppConstant.API_BASE}rac/definition`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getDefinition(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/definition/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveDefinition(data) {

    return this.http.post(`${AppConstant.API_BASE}rac/definition`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateDefinition(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/definition/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteDefinition(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/definition/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getInputTypes() {
    return this.http.get(`${AppConstant.API_BASE}rac/input-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getInputType(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/input-type/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveInputType(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/input-type`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateInputType(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/input-type/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteInputType(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/input-type/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }




  getDetails() {
    return this.http.get(`${AppConstant.API_BASE}rac/detail`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getDetail(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/detail/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveDetail(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/detail`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateDetail(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/detail/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteDetail(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/detail/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }




  getItems() {
    return this.http.get(`${AppConstant.API_BASE}rac/item`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getItem(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/item/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveItem(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/item`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateItem(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/item/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteItem(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/item/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  getOptions() {
    return this.http.get(`${AppConstant.API_BASE}rac/option`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getOption(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/option/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveOption(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/option`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateOption(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/option/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteOption(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/option/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }



  getOptionItems() {
    return this.http.get(`${AppConstant.API_BASE}rac/option-item`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getOptionItem(id) {
    return this.http.get(`${AppConstant.API_BASE}rac/option-item/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveOptionItem(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/option-item`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateOptionItem(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/option-item/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  deleteOptionItem(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/option-item/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getConditionOperator() {
    return this.http.get(`${AppConstant.API_BASE}rac/conditional-operator`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDefineFunction() {
    return this.http.get(`${AppConstant.API_BASE}rac/defined-function`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getProducts() {
    return this.http.get(`${AppConstant.API_BASE}setups/all-products`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  racItemSearchObservable(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.SearchForRACItem(term)));
  }

  SearchForRACItem(searchQuery) {
    return this.http
      .get(`${AppConstant.API_BASE}rac/item-search?searchQuery=${searchQuery}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getApprovalLevel() {
    return this.http.get(`${AppConstant.API_BASE}rac/approval-level`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getRacCategoryTypes() {
    return this.http.get(`${AppConstant.API_BASE}rac/category-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerType() {
    return this.http.get(`${AppConstant.API_BASE}customer/customertype`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveRacCategoryType(data) {
    return this.http.post(`${AppConstant.API_BASE}rac/category-type`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateRacCategoryType(data, id) {
    return this.http.put(`${AppConstant.API_BASE}rac/category-type/${id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteRacCategoryType(id) {
    return this.http.delete(`${AppConstant.API_BASE}rac/category-type/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

}


