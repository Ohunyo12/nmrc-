import { Component, OnInit } from '@angular/core';
import { ProjectSiteReportService } from 'app/credit/services/project-site-report.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { CurrencyService } from 'app/setup/services/currency.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-site-report-approval',
  templateUrl: './project-site-report-approval.component.html'
})
export class ProjectSiteReportApprovalComponent implements OnInit {
  activeTabindex: any;
  performanceEvaluationsReport: any;
  ProjectSiteReports: any;
  performanceDetail: any;
  showPerformanceDetail: boolean = false;
  commentReport: any;
  observationReport: any;
  recommendationReport: any;
  taskReport: any;
  evaluationDetail: any;
  projectSiteReportId: any;
  comment: any;
  approvalStatusId: any;
  displayProjectSiteReportPopup: boolean = false;
  operationId: any;
  currencies: any[];
  facilities: any;
  showFacilieis: boolean;
  disableTab: boolean=true;
  psrReportTypeId: any;
  reportSrc: any;
  displayTestReport: boolean;
  displayReport: boolean;
  commentForm: FormGroup;
  showApprovalBottun:any ;
  displayCommentForm: boolean = false;
  targetId: any;
  rowSelected: boolean = false;
  performanceAnalysisReport: any[] = [];
  performanceAnalysisReportCount: number = 0;
  analysisDetail: any;
  showAnalysisDetail: boolean = false;
  showInput: boolean = true;

  constructor(private psrService: ProjectSiteReportService,
    private fb: FormBuilder,
              private currencyService: CurrencyService,private loadingService: LoadingService,
              private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getProjectSiteReportApproval();
    this.getAllCurrencies();
  }

  getProjectSiteReportApproval() {
      this.psrService.getProjectSiteReportApproval().subscribe((response: any) => {
      this.ProjectSiteReports = response.result;
     
    });
  }

  myAnalysisDetail(d) {
    this.analysisDetail = d;
    this.showAnalysisDetail = true;
    this.showInput = false;
}
  onTabChange($event) {
    this.activeTabindex = $event.index;
  }

  getPsrPerformanceAnalysis(projectSiteReportId) {
    this.loadingService.show();
    this.psrService.getPsrPerformanceAnalysis(projectSiteReportId).subscribe((response: any) => {
        this.performanceAnalysisReport = response.result;
        this.performanceAnalysisReportCount = this.performanceAnalysisReport.length;
        this.loadingService.hide();

    });
}

  detail(d) {
    this.projectSiteReportId = d.projectSiteReportId;
    this.refreshGrid();
    this.disableTab = false;
   this.activeTabindex = 1;
    this.showPerformanceDetail = true;
    this.performanceDetail = d;
    this.operationId = d.operationId;
    this.psrReportTypeId = d.psrReportTypeId;
  }

  refreshGrid() {
    this.getCommentReport(this.projectSiteReportId);
    this.getObservationReport(this.projectSiteReportId);
    this.getRecommendationReport(this.projectSiteReportId);
    this.getTaskReport(this.projectSiteReportId);
    this.getPsrPerformanceEvaluation(this.projectSiteReportId);
    this.getPsrPerformanceAnalysis(this.projectSiteReportId);
  }

  getCommentReport(projectSiteReportId) {
    this.psrService.getPsrComments(projectSiteReportId).subscribe((response: any) => {
      this.commentReport = response.result;
    });
  }
  getObservationReport(projectSiteReportId) {
    this.psrService.getPsrObservations(projectSiteReportId).subscribe((response: any) => {
      this.observationReport = response.result;
    });
  }
  getRecommendationReport(projectSiteReportId) {
    this.psrService.getPsrRecommendations(projectSiteReportId).subscribe((response: any) => {
      this.recommendationReport = response.result;
    });
  }
  getTaskReport(projectSiteReportId) {
    this.psrService.getPsrNextInspectionTasks(projectSiteReportId).subscribe((response: any) => {
      this.taskReport = response.result;
    });
  }
  getPsrPerformanceEvaluation(projectSiteReportId) {
    this.psrService.getPsrPerformanceEvaluations(projectSiteReportId).subscribe((response: any) => {
      this.performanceEvaluationsReport = response.result;
    });
  }

  getAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe((res) => {
        this.currencies = res.result;
    }, (err) => {
    });
}

  submitForApproval() {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success btn-move',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    }).then(function () {

      let data = {
        projectSiteReportId: __this.projectSiteReportId,
        comment:__this.comment,
        approvalStatusId: __this.approvalStatusId
      }
      __this.psrService.goForApproval(data).subscribe((response: any) => {
       
        if (response.success == true) {
          __this.getProjectSiteReportApproval();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approved Successfully!', 'success');
          __this.displayProjectSiteReportPopup = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
      
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
      });

  }

  viewPerformanceEvaluationsDetail(d) {
    this.evaluationDetail = d;
  }
  approve(d) {
    this.projectSiteReportId = d.projectSiteReportId;
    this.performanceDetail = d;
    this.targetId = d.projectSiteReportId;
    this.operationId = d.operationId;
    this.displayProjectSiteReportPopup = true;
  }

  viewFacilities(d){
    this.psrService.getFacilities(d.projectSiteReportId).subscribe((response: any) => {
       this.facilities = response.result;
       this.operationId = d.operationId;
    });

    this.showFacilieis = true;
  }
  
  psrReport() {
    this.loadingService.show();
    let data = {
        projectSiteReportId: this.projectSiteReportId,
        psrReportTypeId: this.psrReportTypeId
    }
    this.psrService.psrReport(data).subscribe((response: any) => {
     let   path = response.result;
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.displayTestReport = true;
        
    });
    this.loadingService.hide(10000);
    this.displayReport = true;
  }

showCommentForm() {
  this.rowSelected = true;
  this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      approvalLevelId: ['', Validators.required],
      searchedNameId: ['', Validators.required]
  });
  this.targetId = this.projectSiteReportId;
  this.operationId =  this.operationId;
   this.displayProjectSiteReportPopup = false;
  this.displayCommentForm = true;
}

modalControl(event) {
  if(event == true) {
      this.displayCommentForm = false;
  }
}

referBackResultControl(event) {
  if(event == true) {
      this.getProjectSiteReportApproval();
      this.displayCommentForm = false;
      this.showApprovalBottun = false;
  }
}

refreshApprovalCommentAndStatus() {
  this.approvalStatusId = 0;
  this.comment = "";
}


}
