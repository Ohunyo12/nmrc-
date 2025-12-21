
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class DocumentService {
  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  getDocuments(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/credit-template`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDocumentByLevelProduct(levelId, productId) {
    return this.http.get(`${AppConstant.API_BASE}credit/credit-template/by-level-product?approvalLevelId=${levelId}&productClassId=${productId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDocumentByLevelId(approvalLevelId) {
    return this.http.get(`${AppConstant.API_BASE}credit/credit-template/level/${approvalLevelId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDocumentByProductClass(productClassId) {
    return this.http.get(`${AppConstant.API_BASE}credit/credit-template/product-class?productClassId=${productClassId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  save(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/credit-template`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  update(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/document-template/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  remove(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/credit-template?creditTemplateId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  savedocumenttemplate(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/document-template`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveAlertTemplate(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-title`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveLevel(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-group-email`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveLevelGroup(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-levelgroup`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveLevelGroupMapping(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-levelgroupmapping`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveAlertSetup(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-setup`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveAlertCondition(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-condition`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }



  updatedocumenttemplate(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/document-template/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateAlertTemplate(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-title/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateLevel(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-level/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateLevelGroup(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-levelgroup/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateLevelGroupMapping(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-levelgroupmapping/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateAlertSetup(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-setup/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateAlertCondition(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-condition/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeAlertLevel(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/alert-level/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeTitle(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/alert-title/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeLevelGroup(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/alert-levelgroup/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeLevelGroupMapping(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/alert-levelgroupmapping/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeAlertSetup(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/alert-setup/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeAlertCondition(id) {
    return this.http.delete(`${AppConstant.API_BASE}setups/alert-condition/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removedocumenttemplate(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/document-template?documentTemplateId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  savedocumenttemplatesection(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/document-template-section`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updatedocumenttemplatesection(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/document-template-section/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  removedocumenttemplatesection(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/document-template-section?documentTemplateSectionId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  savedocumenttemplatesectionrole(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/document-template-section-role`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updatedocumenttemplatesectionrole(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/document-template-section-role/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  removedocumenttemplatesectionrole(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/document-template-section-role?sectionRoleId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAllCreditDocuments() {
    return this.http.get(`${AppConstant.API_BASE}credit/credit-template`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAllDocumentTemplate() {
    return this.http.get(`${AppConstant.API_BASE}credit/document-template-setup`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllAlertTemplateForDropdown() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-title-dropdown`)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

getBindingMethods() {
  return this.http.get(`${AppConstant.API_BASE}setups/alert-binding-methods`)
  .pipe(
    map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

  getAllAlertTemplate() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-title`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllAlertsBindingMethods() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-all-binding-methods`)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

  updateActiveStatus(data) {
    return this.http.post(`${AppConstant.API_BASE}setups/update-alert-title-status`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAlerts() {
    return this.http.get(`${AppConstant.API_BASE}setups/load-alert-title`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllLevel() {
    return this.http.get(`${AppConstant.API_BASE}setups/load-staff-group-email`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }



  getAllAlertLevel() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-group-email-list`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllAlertLevelGroup() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-levelgroup`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAllAlertLevelGroupMapping() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-levelgroupmapping`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllAlertSetup() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-setup`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllFrequency() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-frequency`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllConditions() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-condition`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllOperations() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-operations`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllDocumentTemplateSection(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/document-template-section-setup?templateId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllAlertTemplateSection(id) {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-title/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAllDocumentTemplateSectionRole(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/document-template-section-role-setup?templateSectionId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getOperationID() {
    return this.http.get(`${AppConstant.API_BASE}setups/operation`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getStaffRoles() {
    return this.http.get(`${AppConstant.API_BASE}setups/staff-role/company`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateDocumentCategory(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/document-category/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateDocumentType(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}credit/document-type/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeDocumentCategory(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/document-category/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  removeDocumentType(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/document-type/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  addDocumentCategory(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/document-category`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  addDocumentType(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}credit/document-type`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  savePlaceholder(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-placeholder`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updatePlaceholder(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-placeholder/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveBindingMethod(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}setups/alert-binding-method`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateBindingMethod(body, id) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}setups/alert-binding-method-update/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAllAlertPlaceHolders() {
    return this.http.get(`${AppConstant.API_BASE}setups/alert-place-holders`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  /*uploadDigitalStampFile(file: File, body: any) {
    // let bodyObj = JSON.stringify(body);
    return new Promise((resolve, reject) => {

      let url = `${AppConstant.API_BASE}setups/add-digital-stamp`;
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
  }*/

  getAllDigitalStamps() {
    return this.http.get(`${AppConstant.API_BASE}setups/digital-stamp/all`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  downloadDigitalStamp(staffRoleId) {
    return this.http.get(`${AppConstant.API_BASE}setups/digital-stamp/${staffRoleId}`)
        .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}

uploadDigitalStampFile(body) {
  let bodyObj = JSON.stringify(body);
  return this.http.post(`${AppConstant.API_BASE}setups/add-digital-stamp`, bodyObj)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

deleteDigitalStamp(digitalStampid) {
  return this.http.delete(`${AppConstant.API_BASE}setups/delete-digital-stamp/${digitalStampid}`)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

}
