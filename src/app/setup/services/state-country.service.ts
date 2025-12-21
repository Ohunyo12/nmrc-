
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CountryStateService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getStates() {
        return this.http.get(`${AppConstant.API_BASE}setups/state/country`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStatesByCompanyId() {
        return this.http.get(`${AppConstant.API_BASE}setups/state-by-company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCityByState(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/city/state/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLgaCity(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/city/lgacity/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCityByLGA(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/city/lga/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLGAByState(id) {
        return this.http.get(`${AppConstant.API_BASE}setups/lga/state/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCountries() {
        return this.http.get(`${AppConstant.API_BASE}setups/country`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCitiesByStateId(id: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/city/state/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCities() {
        return this.http.get(`${AppConstant.API_BASE}setups/city`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCityClass() {
        return this.http.get(`${AppConstant.API_BASE}setups/city-class`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCityClass(lgaId) {
        return this.http.get(`${AppConstant.API_BASE}setups/city-class/${lgaId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCity(body) {
        let bodyObj = JSON.stringify(body);
        
        return this.http.post(`${AppConstant.API_BASE}setups/city`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCity(body,cityId) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/city/${cityId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateStates(stateId, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}setups/state/${stateId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLocalGovt() {
        return this.http.get(`${AppConstant.API_BASE}setups/local-govt`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLocalGovtById(stateId) {
        return this.http.get(`${AppConstant.API_BASE}setups/local-govt/${stateId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLocalGovtByLgaId(localGovernmentId) {
        return this.http.get(`${AppConstant.API_BASE}setups/local-govt/${localGovernmentId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addAllLocalGovt(entity) {
        return this.http.post(`${AppConstant.API_BASE}setups/post-local-govt`,entity)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    updateAllLocalGovt(entity,localGovernmentId) {
        return this.http.put(`${AppConstant.API_BASE}setups/update-local-govt/${localGovernmentId}`,entity)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}