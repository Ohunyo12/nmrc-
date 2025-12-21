
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class LimitMaintenanceService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }


    getAllBranchLimits() {
        return this.http.get(`${AppConstant.API_BASE}setups/branch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getAllCompanyLimits() {
        return this.http.get(`${AppConstant.API_BASE}setups/company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getAllObligorLimits() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/obligor-limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllSectorLimits() {
        return this.http.get(`${AppConstant.API_BASE}setups/sectors`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }
    getAllGlobalSectorLimits() {
      return this.http.get(`${AppConstant.API_BASE}setups/global-sectors`)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);

  }


    updateBranchLimits(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/branches/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCompanyLimits(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/companys/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addSector(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/sectors`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateSectorLimits(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/sectors/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    updateGlobalSectorLimits(body, id) {
      let bodyObj = JSON.stringify(body);
      return this.http.put(`${AppConstant.API_BASE}setups/global-sectors/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
    deleteSector(sectorId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/sectors/${sectorId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addUpdateObligorLimits(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/obligor-limit`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // updateObligorLimits(body, riskRatingId) {
    //     let bodyObj = JSON.stringify(body);
    //     return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/obligor-limit/${riskRatingId}`, bodyObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    deleteObligor(riskRatingId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/limitvalidations/obligor-limit/${riskRatingId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    updateSingleObligorLimits(body, Id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/single/obligor-limit/${Id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCurrencyLimits(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/currency-limit`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCurrencyLimits(body, currencyLimitId) {
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/currency-limit/${currencyLimitId}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCurrencyLimits() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/currency-limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    deleteCurrencyLimit(currencyLimitId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/limitvalidations/currency-limit/${currencyLimitId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addGroupLimits(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/group-limit`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateGroupLimits(body, groupLimitId) {
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/group-limit/${groupLimitId}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllGroupLimits() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/group-limit`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    deleteGroupLimit(groupLimitId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/limitvalidations/group-limit/${groupLimitId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllProjectRiskRatingCategories() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/project-risk-rating-categories`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addContractorCriteria(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/add-contractor-criteria`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addIblChecklist(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/add-ibl-checklist`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateContractorCriteria(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/update-contractor-criteria/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateIBLChecklist(body, iblChecklistId) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/update-ibl-checklist/${iblChecklistId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addProjectRiskCriteria(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/add-project-risk-criteria`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateProjectRiskCriteria(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/update-project-risk-criteria/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    addProjectRistRatingCategoryForm(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/add-project-risk-category`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateProjectRistRatingCategoryForm(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/update-project-risk-category/${id}`, bodyObj)
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

    getAllProjectRiskRatingCriteria() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/project-risk-rating-criteria`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCriteriaList() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/all-criteria-list`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addContractorCriteriaOption(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/add-contractor-criteria-option`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addIBLChecklistOption(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/limitvalidations/add-ibl-checklist-option`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateContractorCriteriaOption(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/update-contractor-criteria-option/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateIBLChecklistOption(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}credit/limitvalidations/update-ibl-checklist-option/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllContractorCriteriaOption() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/contractor-criteria-option`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllIBLChecklistOption() {
        return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/ibl-checlist-option`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCronJobs() {
        return this.http.get(`${AppConstant.API_BASE}setups/collection-retail-cron-setup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getAllComputationVariables() {
        return this.http.get(`${AppConstant.API_BASE}setups/collection-retail-computation-variables-setup`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    addRetailCollectionCronJob(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/add-collection-retail-cron-setup`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addRetailCollectionComputationVariables(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/add-collection-retail-computation-variable-setup`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateRetailCollectionCronJob(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/collection-retail-cron-setup/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateRetailCollectionComputationVariables(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/collection-retail-computation-variable-setup/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteRetailCollectionComputationVariables(id) {
        return this.http.delete(`${AppConstant.API_BASE}setups/collection-retail-computation-variables-setup/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteRetailCollectionCronJob(cronJobId) {
        return this.http.delete(`${AppConstant.API_BASE}setups/collection-retail-cron-setup/${cronJobId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}