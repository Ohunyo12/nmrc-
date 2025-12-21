import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/primeng'; // lazyloading

import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { ReportService } from '../../../reports/service/report.service';

import swal from 'sweetalert2';
import { GlobalConfig, LoanApplicationStatus, ApprovalStatus, AppConstant, ProductProcessEnum, LMSOperationEnum, JobSource } from '../../../shared/constant/app.constant';
import { ApprovalService } from '../../../setup/services';
import { PrintService } from '../../../shared/services/print.service';
import { PrintModel } from '../../../shared/models/print-model';

@Component({
    templateUrl: 'offer-letter-gen.component.html',
    styles: [` 
        .btn-move {
            margin-right: 5px;
        }
        #offerLetter .removeConditions_OL {
            display: none;
        }
        .conditionsTable_OL {
            width: 100%; overflow-x:auto;
        }
        @media screen 
        {
            #print-section {display: none;}
        }
        
        @media print 
        {
            #print-section {display: block; margin-top: 0px;}
        }
    `]
   
})

export class OfferLetterGenerationComponent implements OnInit {
    isFinalOfferLetter: boolean;
    applicationRefNo: string;
    applications: any[] = [];
    signatories: string;
    // existingLoans: any[];
    displayGeneratedLetter = false;
    // selectedCustomer: any = {};
    displayOfferLetter = false;
    reportSrc: any = {};
    activeIndex = 0;
    displayLoanDetails = false;
    editMode = false;
    offerLetterData: any[] = [];
    docTemplateObj: any = {};
    form3800bSrc: any = {};
    originalForm3800bSrc: any = {};
    camDocuments: any[] = [];
    creditAnalystDocument: any = {}; disableCommitteeTabs: boolean = true;
    bccDocument: any = {};
    mccDocument: any = {};
    generatedLetter: string;

    approvalWorkflowData: any[] = [];
    disableApprovalBtn = true;
    displayWorkflowModal = false;
    printDocument: any; isCAMBased: boolean;
    displayLetterAcceptanceModal: boolean = false;
    rmComment: string;
    offerLetterAccepted: boolean = false;
    sectionName: any;
    // selectedRecord: any = {};

    // REFER BACK

    trail: any[] = [];
    forwardAction: number = 0;
    trailId: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    readonly CAM_OPERATION_ID: number = 6;
    backtrail: any[] = [];
    displayTestReport: boolean; displayReport: boolean; reportSrcv: SafeResourceUrl;
    disableForwardToRM: boolean = false;
    readonly OPERATION_ID: number = 37;
    loanApplicationId: number = 0;
    undergoingConcession: boolean = false;
    currentTrail: any;
    approvalTrail: any;
    displayForm3800b: boolean;
    disableUploadTab: boolean = false;
    reload: number = 0;

    editOption: any;
    documentContent: any;
    serverResponse: any;
    enableOfferLetterContent: boolean;
    enableDocument: boolean = false;
    displayModalSectionForm: boolean = false;
    ckeditorChanges: any;
    jobSourceId: number;
    ReportType: string;
    reportSource: SafeResourceUrl;
    displayDocument: boolean;
    userInfo: any;
    showEditOfferLetterButton: boolean = false;
    facilityList: any;
    displayJobRequest: boolean;
    offerletterTemplateId: any;
    displayOfferletterTemplate: boolean;
    offerletterTemplates: any;
    offerLetterGenerated: boolean;
    viewedOfferLetter: boolean = false;
    apiRequestId: any;

    constructor(
        private fb: FormBuilder,
        private loanApplService: LoanApplicationService,
        private _creditApprServ: CreditAppraisalService,
        private loadingService: LoadingService,
        private _approvalService: ApprovalService,
        private printService: PrintService,
        private reportServ: ReportService,
        private sanitizer: DomSanitizer,
        private camService: CreditAppraisalService,

    ) {

    }

    ngOnInit() {
        this.jobSourceId = JobSource.LoanApplicationDetail;
        // this.getApprovedLoanApplications(); 
        this.getAllSavedOfferLetters();
        this.generateOfferLetter();
        this.getLoanApplications();
        this.getAllDocuments();
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.hideEditOfferButton();

    }

    indicateLetterAcceptance() {
        this.getTrail();
        this.displayLetterAcceptanceModal = true;
    }

    // REFER BACK
    /* hideEditOfferButton(){
        if(this.userInfo.staffRole=='CREDIT CONTROL'){
            this.showEditOfferLetterButton = true;
        }else{
            this.showEditOfferLetterButton = false;
        }
    } */


    hideEditOfferButton() {
        if (this.userInfo.staffRole == 'CREDIT CONTROL') {
            this.showEditOfferLetterButton = true;
        } else {
            this.showEditOfferLetterButton = false;
        }
    }

    getTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.applicationSelection.loanApplicationId, this.applicationSelection.appraiselOperationId).subscribe((response: any) => {
            this.trail = response.result;

            /* this.referBackTrail(); */
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    selectectTrailId: number;
    onTargetStaffLevelChange(trailId) {
        this.selectectTrailId = trailId;
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    referBackTrail(): any {
        this.trail.forEach(x => {
            if (
                this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId && t.requestStaffId == x.requestStaffId
                ) == null && x.fromApprovalLevelId != null) {
                this.backtrail.push({
                    approvalTrailId: x.approvalTrailId,
                    fromApprovalLevelId: x.fromApprovalLevelId,
                    fromApprovalLevelName: x.fromApprovalLevelName,
                    requestStaffId: x.requestStaffId,
                    staffName: x.staffName,
                });
            }
        });
    }



    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    applicationSelection: any; // selection
    currentLazyLoadEvent: LazyLoadEvent;

    // loadData(event: LazyLoadEvent) {
    //     this.getLoanApplications(event.first, event.rows);
    //     this.currentLazyLoadEvent = event;
    // }

    getLoanApplications() {
        this.loadingService.show();
        this._creditApprServ.getApprovedCamProcessedLoanApplications().subscribe((res) => {
            this.applications = res.result;
            this.loadingService.hide();
        }, (err) => {

        });

    }

    getAllSavedOfferLetters() {
        this.loanApplService.getAllFinalOfferLetters().subscribe((res) => {
            this.offerLetterData = res.result;
        }, (err) => {

        });
    }

    sendApplicationForReview() {
        this.loadingService.show();

        const obj = {
            comment: this.rmComment,
            applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
            productId: '',
            isAccepted: false,
            applicationStatusId: LoanApplicationStatus.ApplicationUnderReview,
            trailId: this.trailId,
            applicationId: this.applicationSelection.loanApplicationId,
            operationId: this.applicationSelection.appraiselOperationId
        };

        this.loanApplService.referBackForReview(obj).subscribe((res) => {
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application has been referred back to the responsible Officer', 'success');
                this.displayLoanDetails = false;
                this.displayLetterAcceptanceModal = false;
                this.displayBackToCAPModal = false;
                this.rmComment = '';
                this.getLoanApplications(); // refresh list
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        });
    }



    viewApplicationDetails(row) {
        this.reload++;
        this.disableUploadTab = false;
        this.viewedOfferLetter = false;
        this.apiRequestId = row.apiRequestId;

        if (row.undergoingConcession == true) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application is undergoing Fee Concession', 'info');
            return;
        }

        this.displayLoanDetails = true;
        this.applicationSelection = row;
        this.applicationRefNo = row.applicationReferenceNumber;
        this.loanApplicationId = row.loanApplicationId;
        this.getTrail();
        this.generateOfferLetter()

        this.loanGenerateFinalOfferLetter(this.loanApplicationId);


        this.loadingService.show();
        this.loanApplService.getLoanApplicationDetailsByApplicationId(this.loanApplicationId)
            .subscribe((response: any) => {
                this.loadingService.hide();
                this.facilityList = response.result;
            }, (err) => {
                this.loadingService.hide(1000);
            });


        if (row.productClassProcessId == ProductProcessEnum.CAMBased) {

            this.isCAMBased = true;
        } else {
            this.isCAMBased = false;
        }


        if (this.camDocuments.length > 0) {
            const docLength = this.camDocuments.length;
            if (docLength > 4) {
                this.creditAnalystDocument = this.camDocuments[docLength - 2];
                this.mccDocument = this.camDocuments[docLength - 1];
                this.bccDocument = this.camDocuments[docLength - 1];
                this.disableCommitteeTabs = false;
            } else {
                this.creditAnalystDocument = this.camDocuments[docLength - 1];
            }
        }




        this.displayLoanDetails = true;


        /* this.loadingService.show();
        commented bcoz it is redundant and implementation is bad
        let dataObj = this.applicationSelection;
        this._approvalService.getApprovalTrailByOperation(this.OPERATION_ID, dataObj.loanApplicationId).subscribe((res) => {
            this.loadingService.hide();
            this.approvalWorkflowData = res.result;
            if (this.approvalWorkflowData.length > 0) this.disableApprovalBtn = false;
        }, (err) => {
            this.loadingService.hide();
        }); */
    }

    CallRequestClose() { this.displayJobRequest = false; }

    generateOfferLetter() {
        this.loadingService.show();
        this.displayGeneratedLetter = true;
        this.loadingService.hide(3000);
    }

    loanGenerateFinalOfferLetter(loanApplicationId) {
        this.loanApplService.getFinalOfferLetterByLoanAppId(loanApplicationId)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                this.isFinalOfferLetter = tempSrc.isFinal
            });
    }

    generateFinalOfferLetter(evt) {
        let ref = this.applicationRefNo;
        let body = {
            isFinal: evt,
            documentId: this.reportSrc.documentId,
            comments: '',
            documentTemplate: this.form3800bSrc.documentTemplate,
            applicationReferenceNumber: ref,
            productClassId: this.reportSrc.productClassId,
            productId: '',
            isAccepted: false,
            applicationStatusId: LoanApplicationStatus.OfferLetterGenerationCompleted,
            approvalStatusId: ApprovalStatus.PROCESSING
        }
        this._creditApprServ.update(body, this.loanApplicationId).subscribe((res) => {
        });


    }

    loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
        this.loadingService.show();
        this.loanApplService.getForm3800Template(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                if (tempSrc != null) {
                    this.originalForm3800bSrc = tempSrc;
                }
                else this.originalForm3800bSrc = {};
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');

            });
    }

    loadPreparedForm38BTemplate(applicationReferenceNumber: string) {
        this.loadingService.show();
        this.loanApplService.getForm3800Template(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;

                if (tempSrc != null) {
                    this.form3800bSrc = tempSrc;
                }
                else this.form3800bSrc = {};
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');

            });
    }


    loadPreparedOfferLetter(applicationReferenceNumber: string) {
        this.loanApplService.generateOfferLetterTemplate(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                this.generatedLetter = tempSrc.documentTemplate;

                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');

            });
    }

    sendToReview(dataObj, evt) {
        evt.preventDefault();
        const __this = this;
        let target = dataObj;
        //console.log("application: ", this.applicationSelection);

        if (this.applicationSelection.productId == 20 && this.apiRequestId != null && this.viewedOfferLetter == false) {
            swal(GlobalConfig.APPLICATION_NAME, 'Click on "View Offer Letter" button to Proceed', 'info');
            return;
        }

        const obj = {
            documentId: this.reportSrc.documentId,
            comments: '',
            documentTemplate: this.reportSrc.documentTemplate,
            applicationReferenceNumber: target.applicationReferenceNumber,
            productClassId: target.productClassId,
            productId: target.productId,
            isAccepted: false,
            applicationStatusId: LoanApplicationStatus.OfferLetterGenerationCompleted,
            approvalStatusId: ApprovalStatus.PROCESSING
        };

        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
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
            __this.loadingService.show();
            __this.loanApplService.logOfferLetterDecisionForApproval(obj).subscribe((res) => {
                __this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    __this.disableForwardToRM = true;
                    __this.displayLoanDetails = false;
                    __this.getLoanApplications();

                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });

            if (__this.editMode == false && __this.form3800bSrc != null) {
                let bodyObj = {
                    documentTemplate: __this.form3800bSrc.documentTemplate,
                    applicationReferenceNumber: __this.applicationSelection.applicationReferenceNumber,
                    productId: '',
                    comments: '',
                    isAccepted: false
                };

                __this.loanApplService.saveFinalOfferLetter(bodyObj).subscribe((response: any) => {
                    if (response.success === true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');

                    } else {
                    }
                }, (err) => {
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                });
            }
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    closeDetailsPanel() {
        this.applicationSelection = '';
        this.activeIndex = 0;
        this.displayGeneratedLetter = false;
        this.displayLoanDetails = false;
    }

    handleChange(evt) {
        this.activeIndex = evt.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 4) ? 0 : this.activeIndex + 1;

    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    editDocument() {
        this.loadingService.show();
        this.loadingService.hide(5000);
        this.editMode = true;
    }

    saveChanges() {
        const __this = this;

        let bodyObj = {
            documentTemplate: this.form3800bSrc.documentTemplate,
            applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
            productId: '',
            comments: '',
            isAccepted: true,
            saveOnly: true
        };

        swal({
            title: 'Save changes to document',
            text: 'Are you sure about this?',
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
            __this.loadingService.show();
            __this.loanApplService.saveFinalOfferLetter(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.editMode = false;
                    this.getLoanApplications(0, this.currentLazyLoadEvent.rows); // refresh list
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    // print(content): void {

    //     const printObj: PrintModel = {
    //         htmlDocument: content,
    //         htmlStyles: `
    //         .removeConditions_OL {
    //             display: none;
    //         }
    //         `
    //     }
    //     this.printService.printDocument(printObj);
    // }

    print(applicationReferenceNumber): void {
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: applicationReferenceNumber,

            }

            this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            return;
        }

    }

    popoverSeeMore() {
       // console.log("application: ", this.applicationSelection);
        if (this.applicationSelection.applicationReferenceNumber != null) {

            this.viewedOfferLetter = true;
            this.displayTestReport = false;
            this.displayReport = false;
            this.ReportType = ' Generated Offer Letter';
            let path = '';
            const data = {
                applicationRefNumber: this.applicationSelection.applicationReferenceNumber,
            }

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;

            });

            if (this.applicationSelection.productId == 20) { // Checking for Cashflow Lending
                this.reportServ.getGeneratedOfferLetterCFL(data.applicationRefNumber).subscribe((response: any) => {
                    path = response.result;
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                });
            }

            this.displayReport = true;
            return;
        }
    }

    viewAllComments() {
        this.displayWorkflowModal = true;
    }

    appraisalTrail: any[] = [];
    displayBackToCAPModal: boolean = false;

    referBack() {
        this.loadingService.show();
        this.camService.getTrailForReferBack(this.applicationSelection.loanApplicationId, this.applicationSelection.appraiselOperationId, this.applicationSelection.currentApprovalLevelId).subscribe((response: any) => {
            this.appraisalTrail = response.result;

            this.displayBackToCAPModal = true;
            //this.displayReferBackForm = true;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }



    // refer back ends


    setUploadCount(count) {

        this.disableUploadTab = +count > 0 ? false : true;
    }


    getOfferLeterTitle(data) {
        this.reportServ.GetOfferLetterTitle(data).subscribe((response: any) => {
            this.documentContent = response.result.offerLetterTitle;
            this.enableDocument = true;

        }, (err) => {
        });
    }

    getOfferLeterSalutation(data) {
        this.reportServ.GetOfferLetterSalutation(data).subscribe((response: any) => {
            this.documentContent = response.result.offerLetterSalutation;
            this.enableDocument = true;
        }, (err) => {
        });
    }
    getOfferLeterClause(data) {
        this.reportServ.GetOfferLetterClause(data).subscribe((response: any) => {
            if (response.result != null) { this.documentContent = response.result.offerLetterClauses; }

            this.enableDocument = true;

        }, (err) => {
        });
    }

    getOfferLeterAcceptance(data) {
        this.reportServ.GetOfferLetterAcceptance(data).subscribe((response: any) => {
            if (response.result != null) { this.documentContent = response.result.offerLetteracceptance; }
            this.enableDocument = true;
        }, (err) => {
        });
    }

    updateOfferLeterAcceptance(data) {
        this.reportServ.UpdateOfferLetterAcceptance(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }

        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');

        });
    }


    updateOfferLeterTitle(data) {
        this.reportServ.UpdateOfferLetterTitle(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }

        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');

        });
    }

    updateOfferLeterSalutation(data) {
        this.reportServ.UpdateOfferLetterSalutation(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');

        });
    }
    updateOfferLeterClause(data) {
        this.reportServ.UpdateOfferLetterClause(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }

        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');
        });
    }




    contentChange(updates) { this.ckeditorChanges = updates; }

    saveDocument() {

        if (this.ckeditorChanges != null) {
            if (this.editOption == 1) { //title
                let model = {
                    offerLetterTitle: this.ckeditorChanges,
                    customerId: this.applicationSelection.customerId,
                    isLMS: false
                }
                this.updateOfferLeterTitle(model);

            } else if (this.editOption == 2) {
                let model = {
                    offerLetterSalutation: this.ckeditorChanges,
                    customerId: this.applicationSelection.customerId,
                    isLMS: false
                }
                this.updateOfferLeterSalutation(model);

            } else if (this.editOption == 3) {
                let model = {
                    offerLetterClauses: this.ckeditorChanges,
                    loanApplicationId: this.applicationSelection.loanApplicationId,
                    isLMS: false
                }

                this.updateOfferLeterClause(model);

            } else if (this.editOption == 4) {
                let model = {
                    offerLetteracceptance: this.ckeditorChanges,
                    loanApplicationId: this.applicationSelection.loanApplicationId,
                    isLMS: false
                }
                this.updateOfferLeterAcceptance(model);
            } else if (this.editOption == -1) {

            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "please select an option", 'warning');
            }
        } else {

            swal(`${GlobalConfig.APPLICATION_NAME}`, "No change has been made to the content", 'warning');
            this.displayDocument = false;
        }
    }

    loadDocument() {

        if (this.editOption == 1) { //title
            this.getOfferLeterTitle(this.applicationSelection.customerId);
        } else if (this.editOption == 2) {
            this.getOfferLeterSalutation(this.applicationSelection.customerId);
        } else if (this.editOption == 3) {
            this.getOfferLeterClause(this.applicationSelection.loanApplicationId);
        } else if (this.editOption == 4) {
            this.getOfferLeterAcceptance(this.applicationSelection.loanApplicationId);
        } else if (this.editOption == -1) {
        } else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "please select an option", 'warning');
        }
    }

    selectOfferLetter() {
        this.offerletterTemplateId = null;
        this.displayOfferletterTemplate = true;
    }

    getAllDocuments(): void {

        this.camService.getAllDocumentTemplate().subscribe((response: any) => {
            this.offerletterTemplates = response.result;
            this.offerletterTemplates = this.offerletterTemplates
                .filter
                (x =>
                    x.operationId == 37)    //offer letter operationId

        });
    }

    isOfferLetterGenerated(): void {
        this.offerLetterGenerated = false;
        let bodyObj = {
            documentTemplate: this.offerletterTemplateId,
            loanApplicationId: this.applicationSelection.loanApplicationId,
        };
        this.reportServ.isOfferLetterGenerated(bodyObj).subscribe((response: any) => {
            this.offerLetterGenerated = response.result;
        });
    }

    applyTemplate() {
        const __this = this;

        let bodyObj = {
            documentTemplate: this.offerletterTemplateId,
            loanApplicationId: this.applicationSelection.loanApplicationId,
        };

        swal({
            title: 'Apply Template to Offer Letter',
            text: 'Are you sure about this? Yes will override offer letter, if it has been generated before',
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
            __this.loadingService.show();
            __this.reportServ.ApplyTemplateToOfferLetter(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.offerletterTemplateId = null;
                    __this.displayOfferletterTemplate = false;
                    __this.isOfferLetterGenerated();

                    __this.popoverSeeMore(); // refresh list
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    displayReferBackForm: boolean;
    displayStatus(e) {
        if (e == true) {
            this.displayReferBackForm = false;
        }
    }

    displayLoanToApproveModal: boolean;
    referBackResultControl(event) {
        if (event == true) {
            this.getLoanApplications();
            this.displayReferBackForm = false;
            this.displayLoanToApproveModal = false;
        }
    }

}