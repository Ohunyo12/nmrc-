import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig, ApplicationStatus, ConvertString } from '../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { ProjectSiteReportService } from '../services/project-site-report.service';
import { StaffRoleService, GeneralSetupService, CurrencyService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Row } from 'primeng/primeng';
import { LoanService } from '../services';

@Component({
    selector: 'project-site-report',
    templateUrl: './project-site-report.component.html'

})
export class ProjectSiteReportComponent implements OnInit {
    overrideForm: FormGroup;
    showApplicationSearchForm: boolean = false;
    parameter: any;
    applicationSelection: any = {};
    psrFacilityList: any;
    activeTabindex: any;
    applications: any[] = [];
    approvalWorkflowData: any[] = [];
    ProjectSiteReports: any[] = [];
    
    @Input() panel: boolean = false;
    @Input() label: string = '';
    PsrReportTypes: any;
    loanApplicationId: any;
    loanApplicationDetailId: any;
    loanSystemTypeId: any;
    operationId: any;
   
    displayCommentReport: boolean = false;
    displayObservationReport: boolean = false;
    displayDecommendationReport: boolean = false;
    displayPsrPerformanceAnalysis: boolean = false;
    displayTaskReport: boolean = false;
    displayImagesReport: boolean = false;

    psrCommentForm: FormGroup;
    psrObservationForm: FormGroup;
    psrNextInspectionTaskForm: FormGroup;
    psrRecommendationForm: FormGroup;
    psrPerformanceEvaluationForm: FormGroup;
    psrPerformanceAnalysisForm: FormGroup;
    projectSiteReportId: any;
    psrPerformanceEvaluations: any;
    displayPsrPerformanceEvaluation: boolean = false;
    displayCommentImagesReport: boolean = false;

    performanceEvaluationsReport: any[] = [];
    performanceAnalysisReport: any[] = [];
    commentReport: any[] = [];
    observationReport: any[] = [];
    recommendationReport: any[] = [];
    taskReport: any[] = [];
    show: boolean = false; message: any; title: any; cssClass: any;
    performanceEvaluationsReportCount: number = 0;
    performanceAnalysisReportCount: number = 0;
    commentReportCount: number = 0;
    observationReportCount: number = 0;
    recommendationReportCount: number = 0;
    taskReportCount: number = 0;

    performanceDetail: any;
    showDetail: boolean = false;
    showAnalysisDetail: boolean = false;
    showInput: boolean = true;
    psrReportTypeId: any;
    whoProjectSiteReport: any = false;
    showProjectComment: any = false;
    currencies: any[];
    selectedPsrApplication: any;
    ckEditorContent: any
    documentContent: any;
    reportSrc: any;
    displayTestReport: boolean;
    displayReport: boolean;
    approvalStatusId: any;
    selectedFacilitiesRows: any[] = [];
    displayProjectForm: boolean;
    projectForm: FormGroup;
    psrImageForm: FormGroup;
    psrCommentImageForm: FormGroup;
    projectList: any;
    disableTab: boolean = true;
    rowToEdit: any;
    customerId: any;
    reportType: any;
    analysisDetail: any;
    loanId: any;
    imageCommentLenght: number = 0;
    imageReport: any[] = [];
    imageCommentReport: any[] = [];
    files: FileList;
    file: File;

    //@Input() set reload(value: number) { if (value > 0) this.getProjectSiteReports(this.loanApplicationId); }

    formState: string = 'New';
    selectedId: number = null;
    projectSiteReportForm: FormGroup;
    displayProjectSiteReportForm: boolean = false;
    displayOriginalDocumentApprovalForm: boolean = false;
    facilities: any;
    showFacilieis: boolean;

    displayProjectSiteLoansReport: boolean = false;
    ProjectSiteLoans: any[] = [];

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }


    constructor(private fb: FormBuilder,
        private psrService: ProjectSiteReportService,
        private loadingService: LoadingService,
        private currencyService: CurrencyService,
        private sanitizer: DomSanitizer,
        private loanService: LoanService) {

    }


    ngOnInit() {
        this.clearControls();
        this.getPsrReportTypes();
        this.getAllCurrencies();
        this.getProjectSiteReports();
    }

    getApprovalWorkFlow(targetId) {
        this.loadingService.show();
        this.loanService.getApprovalTrailByProjectSiteId(targetId).subscribe((res) => {
          this.approvalWorkflowData = res.result;
          this.loadingService.hide();
        });
      }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    editProjectSiteReports(row) {
        this.formState = 'Edit';
        this.rowToEdit = row;
        this.selectedId = row.projectSiteReportId;
        this.projectSiteReportForm.setValue({
            psrReportTypeId: row.psrReportTypeId,
            clientName: row.clientName,
            contractorName: row.contractorName,
            consultantName: row.consultantName,
            projectAmount: row.projectAmount,
            projectDescription: row.projectDescription,
            commencementDate: new Date(row.commencementDate),
            completionDate: new Date(row.completionDate),
            //nextVisitationDate: new Date(row.nextVisitationDate),
            projectLocation: row.projectLocation,
            currencyId: row.currencyId,
            inspectionDate: new Date(row.inspectionDate)
        });

        this.viewFacilities2(row.projectSiteReportId);
        this.displayProjectSiteReportForm = true;
    }

    addSiteImage() {
        this.displayImagesReport = true;
    }

    editPsrImage(d) {
        this.selectedId = d.psrImageId;
        this.displayImagesReport = true;
    }

    select(row) {
        this.selectedPsrApplication = row;
        this.loanApplicationId = row.loanApplicationId;
        this.loanApplicationDetailId = row.loanApplicationDetailId;
        this.loanId = row.loanId;
        this.displayProjectSiteLoansReport = true;
    }

    viewLoans(d) {
        this.projectSiteLoans(d.loanApplicationId);
        this.displayProjectSiteLoansReport = true;
    }

    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    search() {
        this.loadingService.show();
        this.psrService.facilitySearch(this.parameter).subscribe((response) => {
            this.applications = response.result;
            this.showApplicationSearchForm = false;
        });
        this.loadingService.hide();
    }

    projectSiteLoans(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.projectSiteLoans(projectSiteReportId).subscribe((response) => {
            this.ProjectSiteLoans = response.result;
        });
        this.loadingService.hide();
    }

    customerSearch() {
        this.showApplicationSearchForm = true;
    }

    saveProjectSiteReport(form) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This creates a new project site report. Are you sure you want to proceed?",
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

            let body = {
                psrReportTypeId: form.value.psrReportTypeId,
                clientName: form.value.clientName,
                contractorName: form.value.contractorName,
                consultantName: form.value.consultantName,
                projectAmount: form.value.projectAmount,
                projectDescription: form.value.projectDescription,
                commencementDate: form.value.commencementDate,
                completionDate: form.value.completionDate,
                //nextVisitationDate: form.value.nextVisitationDate,
                projectLocation: form.value.projectLocation,
                loanApplicationId: __this.loanApplicationId,
                loanApplicationDetailId: __this.loanApplicationDetailId,
                loanSystemTypeId: __this.loanSystemTypeId,
                loanId: __this.loanId,
                currencyId: form.value.currencyId,
                loanApplicationViewModel: __this.selectedFacilitiesRows,
                inspectionDate: form.value.inspectionDate,
            };
            __this.loadingService.show();
                
            if (__this.selectedId == null) {
                __this.psrService.saveProjectSiteReport(body).subscribe((response) => {
                    __this.whoProjectSiteReport = true;
                    __this.displayProjectSiteReportForm = false;
                    if (response.success == true) {
                        __this.finishGood(response.message);
                         __this.getProjectSiteReport(response.result); 
                         __this.loadingService.hide();
                        }
                    else { 
                        __this.finishBad(response.message); 
                        __this.loadingService.hide();
                    }
                }, (err: any) => {
                    __this.loadingService.hide();
                    __this.finishBad(JSON.stringify(err));
                });
            } else {
                __this.psrService.editProjectSiteReport(body, __this.selectedId).subscribe((response) => {
                    __this.loadingService.hide();
                    if (response.success == true) {
                        if (__this.rowToEdit.approvalStatusId == 5) {
                            __this.savePsrForApproval(__this.rowToEdit);
                        }
                        __this.finishGood(response.message);
                        __this.reloadGrid();
                    }
                    else __this.finishBad(response.message);
                }, (err: any) => {
                    __this.loadingService.hide();
                    __this.finishBad(JSON.stringify(err));
                });
            }
            __this.selectedId = null;

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });


    }


    savePsrForApproval(row) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This will go for Approval, Are you sure you want to proceed?",
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


            let body = {
                approvalStatusId: row.approvalStatusId,
                projectSiteReportId: row.projectSiteReportId,
                psrReportTypeId: row.psrReportTypeId,
                clientName: row.clientName,
                contractorName: row.contractorName,
                consultantName: row.consultantName,
                projectAmount: row.projectAmount,
                projectDescription: row.projectDescription,
                commencementDate: row.commencementDate,
                completionDate: row.completionDate,
                //nextVisitationDate: row.nextVisitationDate,
                projectLocation: row.projectLocation,
                loanApplicationId: __this.loanApplicationId,
                loanApplicationDetailId: __this.loanApplicationDetailId,
                currencyId: row.currencyId,
                loanApplicationViewModel: __this.selectedFacilitiesRows,
                inspectionDate: row.inspectionDate

            };

            __this.loadingService.show();
            __this.psrService.savePsrForApproval(body).subscribe((response) => {
                if (response.success == true) {
                    __this.loadingService.hide();
                    __this.reloadGrid();
                    __this.activeTabindex = 0; __this.clearControls();
                    __this.displayProjectSiteReportForm = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Transaction has been Successfully sent for Approval', 'success');
                }
                else { this.finishBad(response.message); 
                    __this.loadingService.hide();
                }
            }, (err: any) => {
                __this.loadingService.hide();
                __this.finishBad(JSON.stringify(err));
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }


    getProjectSiteReports() {
        this.loadingService.show();
        this.psrService.getProjectSiteReports().subscribe((response) => {
            this.ProjectSiteReports = response.result;
            this.activeTabindex = 1;
            this.loadingService.hide();
        });
    }

    getProjectSiteReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getProjectSiteReport(projectSiteReportId).subscribe((response) => {
            this.ProjectSiteReports = response.result;
            this.activeTabindex = 1;
            this.loadingService.hide();
        });
    }
    deleteProjectSiteReport(row) {
        this.loadingService.show();
        this.psrService.deleteProjectSiteReport(row.projectSiteReportId).subscribe((response) => {
            if (response.result == true) this.reloadGrid();
            this.loadingService.hide();
        });
    }

    reloadGrid() {
        this.displayImagesReport = false;
        this.displayProjectSiteReportForm = false;
        this.getProjectSiteReports();

    }

    clearControls() {
        this.formState = 'New';
        this.projectSiteReportForm = this.fb.group({
            clientName: ['', Validators.required],
            contractorName: ['', Validators.required],
            consultantName: ['', Validators.required],
            projectAmount: ['', Validators.required],
            projectDescription: ['', Validators.required],
            commencementDate: ['', Validators.required],
            completionDate: ['', Validators.required],
           // nextVisitationDate: ['', Validators.required],
            projectLocation: ['', Validators.required],
            psrReportTypeId: ['', Validators.required],
            currencyId: ['', Validators.required],
            inspectionDate: ['', Validators.required]
        });

        this.psrCommentForm = this.fb.group({
        });

        this.psrObservationForm = this.fb.group({
        });

        this.psrNextInspectionTaskForm = this.fb.group({
            nextInspectionDate: ['', Validators.required],
            isDone: [false]

        });

        this.psrRecommendationForm = this.fb.group({
           // projectRiskRating: ['', Validators.required],
           // customerRating: ['', Validators.required]

        });

        this.projectForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required]

        });

        this.psrImageForm = this.fb.group({
            imageCaption: ['', Validators.required],
            fileName: [''],
            fileExtension: [''],
            fileSize: [''],
            fileSizeUnit: [''],
            fileData: ['', Validators.required]
        });

        this.psrCommentImageForm = this.fb.group({
            imageCaption: ['', Validators.required],
            fileName: [''],
            fileExtension: [''],
            fileSize: [''],
            fileSizeUnit: [''],
            fileData: ['', Validators.required]
        });


        this.psrPerformanceEvaluationForm = this.fb.group({
            psrPerformanceEvaluationId: [''],
            apgIssued: [''],
            disbursedTodate: [''],
            //initialProjectSum: [''],
            paymentToDate: [''],
            pmuAssessed: [''],
            projectSum: [''],
            progressPayment: [''],
            vowdToDate: [''],
            amortisedApg: [''],
            costVariation: [''],
            certifiedVowd: [''],
            timeVariation: [''],
            consoltantVowd: [''],
            amountReceived: [''],
            projectSiteReportId: [''],
            psrReportTypeId: [''],
            psrReportType: [''],
        });

        this.psrPerformanceAnalysisForm = this.fb.group({
            valueOfCollateral: [''],
            ipc: [''],
            pmu: [''],
            less: [''],
            amountDisbursed: [''],
            amountRequested: [''],
        });
    }


    showProjectSiteReportForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayProjectSiteReportForm = true;
    }

    getPsrReportTypes() {
        this.loadingService.show();
        this.psrService.getPsrReportTypes().subscribe((response) => {
            this.PsrReportTypes = response.result;
            this.loadingService.hide();
        });
    }

    getPsrReportTypesById(id) {
        this.loadingService.show();
        this.psrService.getPsrReportTypesById(id).subscribe((response) => {
            this.PsrReportTypes = response.result;
            this.loadingService.hide();
        });
    }
    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.currencies = res.result;
        }, (err) => {

        });
    }

   
    finishGood(message) { 
        this.loadingService.hide(); 
        this.showMessage(message, 'success', "FintrakBanking");
    }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }


    deleteCommentReport(d) {
        this.loadingService.show();
        this.psrService.deletePsrComment(d.psrCommentId).subscribe((response) => {
            this.finishGood(response.message);
            this.getCommentReport(this.projectSiteReportId);
            this.loadingService.hide();
        });
    }

    deleteCommentImage(d) {
        this.loadingService.show();
        this.psrService.deletePsrCommentImage(d.psrCommentImageId).subscribe((response) => {
            this.finishGood(response.message);
            this.getCommentReport(this.projectSiteReportId);
            this.getImageReport(this.projectSiteReportId);
            this.loadingService.hide();
        });
    }

    deletePsrImage(d) {
        this.loadingService.show();
        this.psrService.deletePsrImage(d.psrImageId).subscribe((response) => {
            this.finishGood(response.message);
            this.getCommentReport(this.projectSiteReportId);
            this.getImageReport(this.projectSiteReportId);
            this.loadingService.hide();
        });
    }

    deleteObservationReport(d) {
        this.loadingService.show();
        this.psrService.deletePsrObservation(d.psrObservationId).subscribe((response) => {
            this.finishGood(response.message);
            this.getObservationReport(this.projectSiteReportId);
            this.loadingService.hide();
        });
    }

    deleteRecommendationReport(d) {
        this.loadingService.show();
        this.psrService.deletePsrRecommendation(d.psrRecommendationId).subscribe((response) => {
            this.getRecommendationReport(this.projectSiteReportId);
            this.loadingService.hide();
        });
    }

    deleteTaskReport(d) {
        this.loadingService.show();
        this.psrService.deletePsrNextInspectionTask(d.psrNextInspectionTaskId).subscribe((response) => {
            this.getTaskReport(this.projectSiteReportId);
            this.loadingService.hide();
        });
    }

    getCommentReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrComments(projectSiteReportId).subscribe((response) => {
            this.commentReport = response.result;
            this.commentReportCount = this.commentReport.length;
            this.loadingService.hide();
        });
    }
    getObservationReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrObservations(projectSiteReportId).subscribe((response) => {
            this.observationReport = response.result;
            this.observationReportCount = this.observationReport.length;
            this.loadingService.hide();
        });
    }
    getRecommendationReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrRecommendations(projectSiteReportId).subscribe((response) => {
            this.recommendationReport = response.result;
            this.recommendationReportCount = this.recommendationReport.length;
            this.loadingService.hide();
        });
    }
    getTaskReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrNextInspectionTasks(projectSiteReportId).subscribe((response) => {
            this.taskReport = response.result;
            this.taskReportCount = this.taskReport.length;
            this.loadingService.hide();
        });
    }
    getPsrPerformanceEvaluation(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrPerformanceEvaluations(projectSiteReportId).subscribe((response) => {
            this.performanceEvaluationsReport = response.result;
            this.performanceEvaluationsReportCount = this.performanceEvaluationsReport.length;
            this.loadingService.hide();
        });
    }

    getPsrPerformanceAnalysis(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrPerformanceAnalysis(projectSiteReportId).subscribe((response) => {
            this.performanceAnalysisReport = response.result;
            this.performanceAnalysisReportCount = this.performanceAnalysisReport.length;
            this.loadingService.hide();

        });
    }

    getImageReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrImages(projectSiteReportId).subscribe((response) => {
            this.imageReport = response.result;
            this.loadingService.hide();
        });
    }

    getImageCommentReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrCommentImages(projectSiteReportId).subscribe((response) => {
            this.imageCommentReport = response.result;
            this.loadingService.hide();
        });
    }

    saveComment(form) {
        let body = {
            comment: this.ckEditorContent,
            projectSiteReportId: this.projectSiteReportId,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.psrService.savePsrComment(body).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.ckEditorContent = null;
                    this.loadingService.hide();
                }
                else { this.finishBad(response.message); this.loadingService.hide(); }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.UpdatePsrComment(body, this.selectedId).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.ckEditorContent = null;
                    this.loadingService.hide();
                }
                else { this.finishBad(response.message);  this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
            this.selectedId = null;
            this.ckEditorContent = null;
        }

    }

    saveObservation(form) {
        let body = {
            projectSiteReportId: this.projectSiteReportId,
            comment: this.ckEditorContent,
        };

        this.loadingService.show();
        if (this.selectedId === null) {
            this.psrService.savePsrObservation(body).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.ckEditorContent = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.loadingService.hide();
                }
                else { this.finishBad(response.message); this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.UpdatePsrObservation(body, this.selectedId).subscribe((response) => {
                if (response.success == true) {
                    this.selectedId = null;
                    this.finishGood(response.message);
                    this.ckEditorContent = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.loadingService.hide();

                }
                else { this.finishBad(response.message); this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }

        this.selectedId = null;
        this.ckEditorContent = null;
    }

    saveNextInspectionTask(form) {
        let body = {
            projectSiteReportId: this.projectSiteReportId,
            comment: this.ckEditorContent,
            nextInspectionDate: form.value.nextInspectionDate,
            isDone: form.value.isDone
        };

        this.loadingService.show();
        if (this.selectedId === null) {
            this.psrService.savePsrNextInspectionTask(body).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.ckEditorContent = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.loadingService.hide();

                }
                else { this.finishBad(response.message); this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.UpdatePsrNextInspectionTask(body, this.selectedId).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.ckEditorContent = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.loadingService.hide();

                }
                else { this.finishBad(response.message);  this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });

        }

        this.selectedId = null;
        this.ckEditorContent = null;
    }

    saveRecommendation(form) {
        let body = {
            projectSiteReportId: this.projectSiteReportId,
            comment: this.ckEditorContent,
            //projectRiskRating: form.value.projectRiskRating,
            //customerRating: form.value.customerRating
        };

        this.loadingService.show();
        if (this.selectedId === null) {
            this.psrService.savePsrRecommendation(body).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.ckEditorContent = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.loadingService.hide();

                }
                else {
                    this.finishBad(response.message);  this.loadingService.hide();
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.UpdatePsrRecommendation(body, this.selectedId).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.ckEditorContent = null;
                    this.refreshGrid();
                    this.disaplePopup();
                    this.loadingService.hide();

                }
                else { this.finishBad(response.message); this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
            this.selectedId = null;
            this.ckEditorContent = null;
        }

    }

    scheduleForApproval(d) {

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This will go through approval workflow. Are you sure you want to proceed?",
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

            let body = {
                projectSiteReportId: d.projectSiteReportId,
            };
            __this.loadingService.show();
            __this.psrService.scheduleForApproval(body).subscribe((response) => {
                if (response.success == true) {
                    __this.getProjectSiteReports();
                    __this.activeTabindex = 1;
                    __this.disaplePopup();
                    __this.finishGood(response.message);
                    __this.loadingService.hide();
                }
                else {
                    __this.finishBad(response.message);
                    __this.loadingService.hide();
                }
            }, (err: any) => {
                __this.loadingService.hide();
                __this.finishBad(JSON.stringify(err));
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    addComment(d) {
        this.disableTab = false;
        this.getApprovalWorkFlow(d.projectSiteReportId);
        this.psrReportTypeId = d.psrReportTypeId;
        this.projectSiteReportId = d.projectSiteReportId;
        this.approvalStatusId = d.approvalStatusId;
        this.operationId = d.operationId;
        this.activeTabindex = 2;
        this.refreshGrid();
        this.showProjectComment = true;
        
    }

    showTab() {

    }

    refreshGrid() {
        this.getCommentReport(this.projectSiteReportId);
        this.getObservationReport(this.projectSiteReportId);
        this.getRecommendationReport(this.projectSiteReportId);
        this.getTaskReport(this.projectSiteReportId);
        this.getPsrPerformanceEvaluation(this.projectSiteReportId);
        this.getPsrPerformanceAnalysis(this.projectSiteReportId);
        this.getImageReport(this.projectSiteReportId);
        this.getImageCommentReport(this.projectSiteReportId);
    }

    detail(d) {
        this.performanceDetail = d;
        this.showDetail = true;
        this.showInput = false;
    }

    myAnalysisDetail(d) {
        this.analysisDetail = d;
        this.showAnalysisDetail = true;
        this.showInput = false;
    }

    deletePsrPerformanceEvaluation(d) {
        this.loadingService.show();
        this.psrService.deletePsrPerformanceEvaluation(d.psrPerformanceEvaluationId).subscribe((response) => {
            this.refreshGrid();
            this.loadingService.hide();
        });
    }

    deletePsrPerformanceAnalysis(d) {
        this.loadingService.show();
        this.psrService.deletePsrPerformanceAnalysis(d.psrAnalysisId).subscribe((response) => {
            this.refreshGrid();
            this.loadingService.hide();
        });
    }

    editPsrPerformanceEvaluation(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.psrPerformanceEvaluationId;
        this.psrPerformanceEvaluationForm = this.fb.group({
            psrPerformanceEvaluationId: [row.psrPerformanceEvaluationId],
            apgIssued: [row.apgIssued],
            disbursedTodate: [row.disbursedTodate],
            //initialProjectSum: [row.initialProjectSum],
            paymentToDate: [row.paymentToDate],
            pmuAssessed: [row.pmuAssessed],
            projectSum: [row.projectSum],
            progressPayment: [row.progressPayment],
            vowdToDate: [row.vowdToDate],
            amortisedApg: [row.amortisedApg],
            costVariation: [row.costVariation],
            certifiedVowd: [row.certifiedVowd],
            timeVariation: [row.timeVariation],
            consoltantVowd: [row.consoltantVowd],
            amountReceived: [row.amountReceived],
            projectSiteReportId: [row.projectSiteReportId],
            psrReportTypeId: [row.psrReportTypeId],
            psrReportType: [row.psrReportType],

        });
        this.displayPsrPerformanceEvaluation = true;
    }

    editPsrPerformanceAnalysis(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.psrAnalysisId;
        this.psrPerformanceAnalysisForm = this.fb.group({
            psrAnalysisId: [row.psrAnalysisId],
            valueOfCollateral: [row.valueOfCollateral],
            ipc: [row.ipc],
            pmu: [row.pmu],
            less: [row.less],
            amountDisbursed: [row.amountDisbursed],
            amountRequested: [row.amountRequested]

        });
        this.displayPsrPerformanceAnalysis = true;
    }

    savePsrPerformanceEvaluation(form) {
        let body = {
            psrPerformanceEvaluationId: form.value.psrPerformanceEvaluationId,
            apgIssued: form.value.apgIssued,
            disbursedTodate: form.value.disbursedTodate,
            initialProjectSum: form.value.initialProjectSum,
            paymentToDate: form.value.paymentToDate,
            pmuAssessed: form.value.pmuAssessed,
            projectSum: form.value.projectSum,
            progressPayment: form.value.progressPayment,
            vowdToDate: form.value.vowdToDate,
            amortisedApg: form.value.amortisedApg,
            costVariation: form.value.costVariation,
            certifiedVowd: form.value.certifiedVowd,
            timeVariation: form.value.timeVariation,
            consoltantVowd: form.value.consoltantVowd,
            amountReceived: form.value.amountReceived,
            projectSiteReportId: this.projectSiteReportId,
            psrReportTypeId: this.psrReportTypeId,
            psrReportType: form.value.psrReportType,
        };


        this.loadingService.show();
        if (this.selectedId === null) {
            this.psrService.savePsrPerformanceEvaluation(body).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.getPsrPerformanceEvaluation(this.projectSiteReportId);
                    this.displayPsrPerformanceEvaluation = false;
                    this.loadingService.hide();
                }
                else { this.finishBad(response.message); this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.updatePsrPerformanceEvaluation(body, this.selectedId).subscribe((response) => {
                if (response.success == true) {
                    this.selectedId = null;
                    this.getPsrPerformanceEvaluation(this.projectSiteReportId);
                    this.displayPsrPerformanceEvaluation = false;
                    this.loadingService.hide();
                }
                else{ this.finishBad(response.message);  this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }

        this.disaplePopup();
    }


    savePsrPerformanceAnalysis(form) {
        let body = {
            valueOfCollateral: ConvertString.TO_NUMBER(form.value.valueOfCollateral),
            ipc: ConvertString.TO_NUMBER(form.value.ipc),
            pmu: ConvertString.TO_NUMBER(form.value.pmu),
            amountDisbursed: ConvertString.TO_NUMBER(form.value.amountDisbursed),
            amountRequested: ConvertString.TO_NUMBER(form.value.amountRequested),
            projectSiteReportId: this.projectSiteReportId
        };

        this.loadingService.show();
        if (this.selectedId === null) {
            this.psrService.savePsrPerformanceAnalysis(body).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.getPsrPerformanceAnalysis(this.projectSiteReportId);
                    this.displayPsrPerformanceAnalysis = false;
                    this.loadingService.hide();
                }
                else { this.finishBad(response.message); this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.updatePsrPerformanceAnalysis(body, this.selectedId).subscribe((response) => {
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.selectedId = null;
                    this.getPsrPerformanceAnalysis(this.projectSiteReportId);
                    this.displayPsrPerformanceAnalysis = false;
                    this.loadingService.hide();
                }
                else{ this.finishBad(response.message);this.loadingService.hide();}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }

        this.disaplePopup();
    }

    disaplePopup() {
        this.displayCommentReport = false;
        this.displayObservationReport = false;
        this.displayDecommendationReport = false;
        this.displayProjectSiteReportForm = false;
        this.displayOriginalDocumentApprovalForm = false;
        this.displayTaskReport = false;
        this.displayImagesReport = false;
    }

    contentChange(updates) {
        this.ckEditorContent = updates;

    }

    editCommentReport(d) {
        this.selectedId = d.psrCommentId;
        this.ckEditorContent = d.comment;
        this.displayCommentReport = true;

    }

    editCommentImage(d) {
        this.selectedId = d.psrCommentImageId;
        this.displayCommentImagesReport = true;
        
    }

    editObservationReport(d) {
        this.selectedId = d.psrObservationId;
        this.ckEditorContent = d.comment;
        this.displayObservationReport = true;
    }

    displayObservationReportM() {
        this.displayObservationReport = true;
    }
    editRecommendationReport(d) {
        this.selectedId = d.psrRecommendationId;
        this.ckEditorContent = d.comment;
        this.displayDecommendationReport = true;
        this.psrRecommendationForm = this.fb.group({
           // customerRating: [d.customerRating],
           // projectRiskRating: [d.projectRiskRating]
        });
    }

    editTaskReport(d) {
        this.selectedId = d.psrNextInspectionTaskId;
        this.ckEditorContent = d.comment;
        this.psrNextInspectionTaskForm = this.fb.group({
            nextInspectionDate: [new Date(d.nextInspectionDate)],
            isDone: [d.isDone]

        });
        this.displayTaskReport = true;
    }

    psrReport() {
        this.loadingService.show();
        let data = {
            projectSiteReportId: this.projectSiteReportId,
            psrReportTypeId: this.psrReportTypeId
        }
        this.psrService.psrReport(data).subscribe((response) => {
            let path = response.result;
            this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            this.displayTestReport = true;

        });
        this.loadingService.hide(10000);
        this.displayReport = true;
    }

    onRowSelectUnselect(row) {
        this.remove(row);
    }

    onRowSelect(data) {
        let index = this.selectedFacilitiesRows.findIndex(obj => obj.loanApplicationId == data.loanApplicationId);
        this.customerId = data.customerId;
       // if ((index < 0 || index == null)) {
            this.projectSiteReportForm.controls["clientName"].setValue(data.customerName);
            this.projectSiteReportForm.controls["psrReportTypeId"].setValue(data.psrReportTypeId);
            this.selectedFacilitiesRows.push({
                loanApplicationId: data.loanApplicationId,
                loanApplicationDetailId: data.loanApplicationDetailId,
                loanId: data.loanId,
                loanSystemTypeId: data.loanSystemTypeId,
                loanPurpose: data.loanPurpose,
                customerName: data.customerName,
                applicationReferenceNumber: data.applicationReferenceNumber,
                loanReferenceNumber: data.loanReferenceNumber,
                legalContingentCode: data.legalContingentCode,
                customerId: data.customerId,
                branchName: data.branchName,
                applicationAmount: data.applicationAmount,
                principalAmount: data.principalAmount,
                approvedAmount: data.approvedAmount,
                totalUtilized : data.totalUtilized,
                interestRate: data.interestRate,
                productName: data.productName,
                isProjectRelated: data.isProjectRelated
            });

            this.projectList = this.selectedFacilitiesRows;

        // }
        // else {
        //     this.message = 'ERROR!\nInvalid Input For Unit To Release';
        //     this.finishBad(this.message);
        // }

    }

    remove(row) {
        let index = this.selectedFacilitiesRows.findIndex(obj => obj.loanApplicationId == row.loanApplicationId);
        if (index > -1) {
            this.selectedFacilitiesRows.splice(index, 1);
        }
    }

    createReport() {
        this.displayProjectSiteReportForm = true;
    }

    viewFacilities(d) {
        this.psrService.getFacilities(d.projectSiteReportId).subscribe((response) => {
            this.facilities = response.result;
        });
        this.showFacilieis = true;

    }

    viewFacilities2(projectSiteReportId) {
        this.psrService.getFacilities(projectSiteReportId).subscribe((response) => {
            this.selectedFacilitiesRows = response.result;
        });
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }


    confirmOverwrite(): void {
        const __this = this;
        swal({
            title: 'File already exist!',
            text: 'Are you sure you want to OVERWRITE it?',
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
            __this.savePsrImage(true);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    savePsrImage(form, overwrite = false) {
        let body = {
            fileName: this.file.name,
            fileExtension: this.fileExtention(this.file.name),
            fileSize: this.file.size,
            projectSiteReportId: this.projectSiteReportId,
            imageCaption: form.value.imageCaption,
            fileSizeUnit: 'kilobyte',
            overwrite: overwrite
        };

        this.loadingService.show();
        if (this.selectedId == null) {
            this.psrService.savePsrImage(this.file, body).then((response: any) => {
                if (response.result == 3) {
                    this.selectedId = null;
                    this.confirmOverwrite();
                } else {
                    if (response.success == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                        this.getCommentReport(this.projectSiteReportId);
                        this.getImageReport(this.projectSiteReportId);
                        this.selectedId = null;
                        this.loadingService.hide();
                    }
                    else this.finishBad(response.message);
                    this.loadingService.hide();
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.UpdatePsrImage(this.file, body, this.selectedId).then((response: any) => {
                this.loadingService.hide();
                if (response.success == true) {
                    this.selectedId = null;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.getCommentReport(this.projectSiteReportId);
                    this.getImageReport(this.projectSiteReportId);
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    saveCommentImage(form, overwrite = false) {
        let body = {
            fileName: this.file.name,
            fileExtension: this.fileExtention(this.file.name),
            fileSize: this.file.size,
            projectSiteReportId: this.projectSiteReportId,
            imageCaption: form.value.imageCaption,
            fileSizeUnit: 'kilobyte',
            overwrite: overwrite
        };
       // console.log("my selected id2 = "+ this.selectedId);
        this.loadingService.show();
        if (this.selectedId == null) {
            this.psrService.saveCommentImage(this.file, body).then((response: any) => {
                if (response.result == 3) {
                    this.confirmOverwrite();
                    this.selectedId = null;
                } else {
                    if (response.success == true) {
                        this.displayCommentImagesReport = false
                        this.selectedId = null;
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                        this.reloadGrid();
                        this.loadingService.hide();
                    }
                    else this.finishBad(response.message);
                    this.loadingService.hide();
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.psrService.UpdateCommentImage(this.file, body, this.selectedId).then((response: any) => {
                this.loadingService.hide();
                if (response.success == true) {
                    this.displayCommentImagesReport = false
                    this.selectedId = null;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.reloadGrid();
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    closeModal() {
        this.displayObservationReport = false;
    }


}