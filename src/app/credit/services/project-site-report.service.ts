
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class ProjectSiteReportService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  facilitySearch(searchString) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-customer-account/${searchString}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  projectSiteLoans(searchQuery) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-customer-loans/${searchQuery}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  saveProjectSiteReport(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/project-site-report`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrForApproval(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/project-site-report`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updateProjectSiteReport(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/project-site-report/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deleteProjectSiteReport(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/project-site-report/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getProjectSiteReportApproval() {
    return this.http.get(`${AppConstant.API_BASE}credit/project-site-report-approval`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getProjectSiteReportApproved() {
    return this.http.get(`${AppConstant.API_BASE}credit/project-site-report-approved`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  getProjectSiteReports() {
    return this.http.get(`${AppConstant.API_BASE}credit/project-site-report`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getProjectSiteReport(projectSiteReportId) {
    return this.http.get(`${AppConstant.API_BASE}credit/project-site-report/${projectSiteReportId}/projectSiteReportId`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  editProjectSiteReport(data, selectedId) {
    return this.http.put(`${AppConstant.API_BASE}credit/project-site-report/${selectedId}`, data)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrReportTypes() {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-report-type`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrReportTypesById(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-report-type-by-id/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrComment(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/psr-comment`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrComment(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-comment/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrCommentImage(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-comment-image/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrImage(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-image/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrComments(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-comment/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  savePsrNextInspectionTask(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/psr-next-inspection-task`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  deletePsrNextInspectionTask(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-next-inspection-task/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrNextInspectionTasks(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-next-inspection-task/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrImages(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-images/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrCommentImages(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-comment-images/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrObservation(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/psr-observation`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrObservation(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-observation/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrObservations(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-observation/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrPerformanceEvaluation(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/psr-performance-evaluation`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrPerformanceAnalysis(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/psr-performance-analysis`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrPerformanceEvaluation(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-performance-evaluation/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrPerformanceAnalysis(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-performance-analysis/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrPerformanceEvaluations(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-performance-evaluation/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrPerformanceAnalysis(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-performance-analysis/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


  goForApproval(data) {
    return this.http.post(`${AppConstant.API_BASE}credit/project-site-gofor-approval`, data)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  goForAcceptance(data) {
    return this.http.post(`${AppConstant.API_BASE}credit/project-site-gofor-acceptance`, data)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updatePsrPerformanceEvaluation(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-performance-evaluation/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  updatePsrPerformanceAnalysis(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-performance-analysis/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrRecommendation(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/psr-recommendation`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  savePsrImage(file: File, body: any) {
    // let bodyObj = JSON.stringify(body);
    return new Promise((resolve, reject) => {

      let url = `${AppConstant.API_BASE}credit/psr-image`;
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

  saveCommentImage(file: File, body: any) {
    return new Promise((resolve, reject) => {
      let url = `${AppConstant.API_BASE}credit/psr-comment-image`;
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

  UpdateCommentImage(file: File, body: any, id: number) {
    return new Promise((resolve, reject) => {
      let url = `${AppConstant.API_BASE}credit/psr-comment-image/${id}`;
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

  scheduleForApproval(body) {
    return this.http.post(`${AppConstant.API_BASE}credit/project-site-schedule-for-approval`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  deletePsrRecommendation(id) {
    return this.http.delete(`${AppConstant.API_BASE}credit/psr-recommendation/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getPsrRecommendations(id) {
    return this.http.get(`${AppConstant.API_BASE}credit/psr-recommendation/${id}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getFacilities(projectSiteReportId) {
    return this.http.get(`${AppConstant.API_BASE}credit/facilities/${projectSiteReportId}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getCurrencyRates() {
    return this.http.get(`${AppConstant.API_BASE}admin/currency`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  UpdatePsrNextInspectionTask(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-next-inspection-task/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  UpdatePsrComment(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-comment/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  UpdatePsrPerformanceEvaluation(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-performance-evaluation/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  UpdatePsrObservation(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-observation/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  UpdatePsrRecommendation(body, id) {
    return this.http.put(`${AppConstant.API_BASE}credit/psr-recommendation/${id}`, JSON.stringify(body))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  UpdatePsrImage(file: File, body: any,id:number) {
    return new Promise((resolve, reject) => {
      let url = `${AppConstant.API_BASE}credit/psr-image/${id}`;
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


  psrReport(data) {
    return this.http.post(`${AppConstant.API_BASE}report/psr-report`, JSON.stringify(data))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  AddProjectReport(data) {
    return this.http.post(`${AppConstant.API_BASE}credit/project-report`, JSON.stringify(data))
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
}
