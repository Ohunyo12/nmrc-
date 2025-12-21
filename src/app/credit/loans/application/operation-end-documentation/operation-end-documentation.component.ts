import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoanService } from 'app/credit/services';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { LetterGenerationRequestService } from 'app/credit/services/letter-generation-request.service';
import { ProjectSiteReportService } from 'app/credit/services/project-site-report.service';
import { ApprovalService, ChecklistService, CollateralService } from 'app/setup/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-operation-end-documentation',
  templateUrl: './operation-end-documentation.component.html',
  styleUrls: ['./operation-end-documentation.component.scss']
})
export class OperationEndDocumentationComponent implements OnInit {

	constructor(private loadingService: LoadingService,
				private loanService: LoanService, private camService: CreditAppraisalService,
				private LetterGenServ: LetterGenerationRequestService, private collateralService: CollateralService,
                private checklistService: ChecklistService, private psrService: ProjectSiteReportService,
				private approvalService: ApprovalService, private sanitizer: DomSanitizer,
                private fb: FormBuilder
                ) { }

	ngOnInit() {
		
    }

    loadAll(){
        this.getChecklistAwaitingApproval();
        this.getOriginalDocumentApprovals();
        this.getApprovalSecurityRelease();
        this.getLetterGenerationRequests();
        this.getValuationRequestWaitingForApproval();
        this.getCollateralSwapRequestsForApproval();
        this.getInsurancePoliciesWaitingForApproval();
		this.getProjectSiteReportApproval();
        this.getDeferralDocumentsWaitingForApproval();
        this.getDeferralExtensionsWaitingForApproval();
    }
    


	hideModal(int: number = 0) {
        if(int == 1){
            this.activeTabindex1 = 0;
            this.targetId1 = 0;
            this.operationId1 = 0;
        }else if(int == 2){
            this.activeTabindex2 = 0;
            this.targetId2 = 0;
            this.operationId2 = 0;
        }else if(int == 3){
            this.activeTabindex3 = 0;
            this.targetId3 = 0;
            this.operationId3 = 0;
        }else if(int == 4){
            this.activeTabindex4 = 0;
            this.targetId4 = 0;
            this.operationId4 = 0;
        }else if(int == 5){
            this.activeTabindex5 = 0;
            this.targetId5 = 0;
            this.operationId5 = 0;
        }
        
    }

    
    //#region properties
    fileDocument: any;
    selectedChecklist: any;
    checklistAwaitingApproval = [];
    operationId1 = 0; // deferral/waiver
    operationId2 = 0; //security release
    operationId3 = 0; //original doc sub
    operationId4 = 0; //lettergen
    operationId5 = 0; //projectSite
    operationId6 = 0; //collateralvaluation
    operationId7 = 0; //swap
    operationId8 = 0; //insurance
    operationId9 = 0; //deferred doc provision
    operationId10 = 0; //deferred doc extension
    targetId1 = 0; // deferral/waiver
    targetId2 = 0; //security release
    targetId3 = 0; //original doc sub
    targetId4 = 0; //letter gen
    targetId5 = 0; //projectSite
    targetId6 = 0; //collateralvaluation
    targetId7 = 0; //swap
    targetId8 = 0; //insurance
    targetId9 = 0; //deferred doc provision
    targetId10 = 0; //deferred doc extension
    selectedChecklistData: any;
    itemSelected = false;
    ckEditorContent: any;
    loanSystemTypeId1 = 0;
    loanApplicationDetailId = 0;
    reloadLoanDetails = 0;
    approvalReleases = [];
    activeTabindex1: number; //deferral/waiver
    activeTabindex2: number; //security release
    activeTabindex3: number; //original doc sub
    activeTabindex4: number; //letter gen
    activeTabindex5: number; //projectSite
    activeTabindex6: number; //collateralvaluation
    activeTabindex7: number; //swap
    activeTabindex8: number; //insurance
    activeTabindex9: number; //deferred doc provision
    activeTabindex10: number; //deferred doc extension
    TARGET_ID = 0;
    CUSTOMER_ID = 0;
    REFERENCE_NUMBER: string;
    rowSelected = false;
    documentUploadsForSecurityRelease = [];
    documentUploadsOriginalDocSub = [];
    letterGenerationRequests = [];
    showUploadeddocumentForSecurityRelease = false;
    originalDocumentApprovals = [];
    originalDocumentApprovalId = 0;
    facilityDetailForOriginalDocSub = false;
    requestTypes = [
        {name: 'Letter Of Indebtedness', id: 1},
        {name: 'Letter Of Non-indebtness', id: 2},
        {name: 'Auditor\'s enquiry', id: 3}
    ];
    displayLetterGenerationRequestForm = false;
    displayCollateralValuationRequestForm = false;
    camsolLoanDocHtml: any;
    valuationPrerequisites = [];
    valuationCustomerId = 0;
    valuationReferenceNumber = '';
    displayCollateralSwapForm = false;
    collateralSwapRequests = [];
    itemPolicy = [];
    displayCollateralInsuranceForm = false;
    ProjectSiteReports = [];
    displayProjectSiteReport = false;
    showProjectSiteDetail = false;
    projectReportSrc: SafeResourceUrl;
    psrReportTypeId = 0;
    showInput = false;
    performanceAnalysisReport = [];
    showAnalysisDetail = false;
    analysisDetail:any = {};
    commentReport = [];
    observationReport = [];
    recommendationReport = [];
    taskReport = [];
    performanceEvaluationsReport = [];
    evaluationDetail:any = {};
    performanceAnalysisReportCount = 0;
    OrignalDocLoanSelection: any = {};
    displayDocument = false;
    binaryFile: string;
	selectedDocument: string;
	reload = 0;
	message = '';
    title = '';
    cssClass = '';
	show = true;
	deferralDocuments = [];
	deferralDocumentsExtension = [];
	displayDeferralModal = false;
	deferralDocumentUpload = [];
	displayUploadShow = false;
	selectedDocumentName = '';
    viewUpload: any;
    letterGenerationsignatories: any[] = [];
    letterGenerationCamsolList: any[] = [];
    applicationReferenceNumber = '';
			// this.getChecklistAwaitingApproval();
			// this.getApprovalSecurityRelease();
			// this.getOriginalDocumentApprovals();
			// this.getLetterGenerationRequests();
			// this.getProjectSiteReportApproval();
			// this.getValuationRequestWaitingForApproval();
			// this.getCollateralSwapRequestsForApproval();
			// this.getInsurancePoliciesWaitingForApproval();
            // this.getDeferralDocumentsWaitingForApproval();
            // this.getDeferralExtensionsWaitingForApproval();
    //#endregion

        //#region forward
    forward(targetId: number = 0, operationId: number = 0, int = 0){
        if(targetId <= 0 || operationId <= 0){
            return;
        }
        let body = {
            targetId,
			operationId,
			comment: 'Related Documents are printed'
        }
        const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'You want to submit as documented',
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
			__this.loadingService.showKeyApiCall();
			__this.loanService.logApproval(body).subscribe((response: any) => {
				if(response.success == true){
					__this.refresh(int);
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				}
				__this.loadingService.hideKeyApiCall();
			}, (err) => {
				__this.loadingService.hideKeyApiCall(1000);
			});
			}, function (dismiss) {
				if (dismiss === 'cancel') {
					swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
				}
			});
	}

	refresh(int = 0){
		if(int == 0){
			return;
		}else if(int == 1){
    		this.getChecklistAwaitingApproval();
		}else if(int == 2){
    		this.getApprovalSecurityRelease();
		}else if(int == 3){
			this.getOriginalDocumentApprovals();
		}else if(int == 4){
			this.getLetterGenerationRequests();
		}else if(int == 5){
			this.getProjectSiteReportApproval();
		}else if(int == 6){
			this.getValuationRequestWaitingForApproval();
		}else if(int == 7){
			this.getCollateralSwapRequestsForApproval();
		}else if(int == 8){
			this.getInsurancePoliciesWaitingForApproval();
		}else if(int == 9){
			this.getDeferralDocumentsWaitingForApproval();
		}else if(int == 10){
			this.getDeferralExtensionsWaitingForApproval();
		}

	}
	
	finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
	}
	
	showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }
    //#endregion

    //#region deferral
    getChecklistAwaitingApproval() {
        this.loadingService.show();
        this.checklistService.getChecklistAwaitingApproval().subscribe((data) => {
          this.checklistAwaitingApproval = data.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
        this.activeTabindex1 = 0;
    }

    onTabChange1(e) {
        this.activeTabindex1 = e.index;
        if (e.index == 0) { 
            this.refresh1(); 
        }
    }

    refresh1() {
        this.reload = 0;
        this.selectedChecklistData = {};
        this.itemSelected = false;
    }

    viewChecklistDetails(row) {
        this.getDrawdownDeferralMemo(row.operationId,row.loanApplicationDetailId)
        if(row.isLms == false) {
            this.operationId1 = row.operationId;
            this.targetId1 = row.conditionId;
            this.loanApplicationDetailId = row.loanApplicationDetailId;
        } else {
            this.loanSystemTypeId1 = row.loanSystemTypeId;
            this.reloadLoanDetails = row.loanId;
        }
        this.selectedChecklistData = row;
        this.selectedChecklistData.conditionId = row.conditionId;
        this.itemSelected = true;
        this.activeTabindex1 = 1;
    }

    getDrawdownDeferralMemo(operationId,targetId) {
        this.loadingService.show();
        this.checklistService.getDrawdownDeferralMemo(operationId, targetId).subscribe((response: any) => {
            if (response.result == null) {
                return;
            }
            this.loadingService.hide();
            this.ckEditorContent = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
     
    printDocumentByElemntId(printTitle: string, elementId: string): void {
        let printContents, popupWin;

        printContents = document.getElementById(elementId).innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title style="font face: arial; size:12px">${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

    // getDeferralWaiverPdf() {
    //     let path = '';
    //     this.checklistService.getDeferralWaiverPdf(this.operationId1, this.targetId1, this.loanApplicationDetailId).subscribe((response: any) => {
    //         if (response.result == null) {
    //             return;
    //         }
    //         path = response.result;
    //         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    //         this.displayTestReport = true;
    //         this.displayReport = true;
    //     }, (err) => {
        
    //     });
    // }
    //#endregion
    
    //#region security Release
    memoTargetId = 0;
    viewDocumentsForSecurityRelease(row) {
        this.loadingService.show();
        this.operationId2 = row.operationId;
        this.targetId2 = row.originalDocumentApprovalId;
        this.memoTargetId = row.originalDocumentReleaseId;
        this.REFERENCE_NUMBER = row.documentReferenceNumber;
        this.getDocumentsByTargetForSecurityRelease(row.docSubmissionOperationId, row.originalDocumentApprovalId);
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.rowSelected = true;
        this.loadingService.hide();
    }

    getDocumentsByTargetForSecurityRelease(docSubmissionOperationId, targetId) {
        this.loadingService.show();
        this.camService.getDocumentsReleasedDocuments(docSubmissionOperationId, targetId).subscribe((response: any) => {
            this.documentUploadsForSecurityRelease = response.result;
            this.showUploadeddocumentForSecurityRelease = true;
            this.loadingService.hide();
        });
    }

    downloadDocument(d, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.camService.downloadDocument(d.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;

                if (view) {
                    this.displayDocument = true;
                    return;
                }

                let myDocExtention = this.fileDocument.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
            }

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    getApprovalSecurityRelease() {
        this.loadingService.show();
        this.camService.approveRelease().subscribe((response: any) => {
            this.approvalReleases = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    //#endregion

    //#region OrigDocSub
    getOriginalDocumentApprovals() {
        this.loadingService.show();
        this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
            this.originalDocumentApprovals = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewOriginalDocDetail(row) {
        this.OrignalDocLoanSelection = row;
        // console.log('row', row);
        this.operationId3 = row.operationId;
        this.facilityDetailForOriginalDocSub = true;
        this.CUSTOMER_ID = row.customerId;
        this.applicationReferenceNumber = row.referenceNumber;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        this.targetId3 = row.originalDocumentApprovalId;
        this.getDocumentsByTargetForOriginalDocSub();
        this.activeTabindex3 = 1;
    }

    getDocumentsByTargetForOriginalDocSub() {
        this.loadingService.show();
        this.camService.getDocumentsByTarget(this.operationId3, this.originalDocumentApprovalId, true).subscribe((response: any) => {
            this.documentUploadsOriginalDocSub = response.result;
            this.loadingService.hide();
        });
    }
    //#endregion

    //#region letterGen
    getLetterGenerationRequests() {
        this.loadingService.show();
        this.LetterGenServ.getLetterGenerationRequestsForApproval().subscribe((response: any) => {
            this.letterGenerationRequests = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getAllLetterGenSignatories(requestId: number) {
        this.loadingService.show();
        this.LetterGenServ.getLetterGenSignatories(requestId).subscribe((response: any) => {
            this.letterGenerationsignatories = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        })
    }

    getRequestTypeName(id): string {
        return this.requestTypes.find(t => t.id == id).name;
    }

    editLetterGenerationRequest(row) {
       // console.log("row: ", row);
        this.targetId4 = row.requestId;
        this.operationId4 = row.operationId;
        this.getAllLetterGenSignatories(row.requestId);
        this.displayLetterGenerationRequestForm = true;
        this.getCamsolLoanDocument(row.requestType, row);
        // this.getCamsolLoansByCustomerCode(row.customerName, row.customerCode);
    }

    getCamsolLoanDocument(typeId: Number, data: any) {
     //   console.log("data: ", data);
        var body = {
            customerId: data.customerId,
            customerCode: data.customerCode,
            customerName: data.customerName,
            accountNumber: data.accountNumber,
            asAtDate: data.asAtDate,
            requestRef: data.requestRef,
            loanBalance: data.loanBalance
        }

        this.loadingService.show();
        this.LetterGenServ.getCamsolLoanDocument(typeId, body).subscribe((response: any) => {
            this.camsolLoanDocHtml = response.result;
            this.loadingService.hide();
        });
    }

    printCamsolLoanDocument() {
        var print_div = document.getElementById("camsolLoanDocument");
        var print_area = window.open();
        print_area.document.write(print_div.innerHTML);
        print_area.document.close();
        print_area.focus();
        print_area.print();
        print_area.close();
    }
    //#endregion

    //#region valuation
    getValuationRequestWaitingForApproval() {
        this.loadingService.show();
        this.collateralService.getAllValuationRequestWaitingForApproval().subscribe((response: any) => {
            this.valuationPrerequisites = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewValuationDetail(d) {
        this.targetId6 = d.valuationPrerequisiteId;
        this.valuationCustomerId = d.customerId;
        this.valuationReferenceNumber = d.referenceNumber;
        this.operationId6 = d.operationId;
        this.displayCollateralValuationRequestForm = true;
    }
    //#endregion

    //#region swap
    getCollateralSwapRequestsForApproval() {
		this.loadingService.show();
		this.collateralService.getCollateralSwapRequestsForApproval().subscribe((response: any) => {
			this.collateralSwapRequests = response.result;
			this.loadingService.hide();
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
			this.loadingService.hide(1000);
		});
    }
    
    viewSwapInfo(row) {
		this.loadingService.show();
		this.targetId7 = row.collateralSwapId;
		this.operationId7 = row.operationId;
		this.CUSTOMER_ID = row.customerId;
		this.applicationReferenceNumber = row.swapRef;
        this.displayCollateralSwapForm = true;
        this.loadingService.hide();
    }
    //#endregion

    //#region insurance
    getInsurancePoliciesWaitingForApproval(): void {
        this.loadingService.show();
        this.collateralService.getInsurancePoliciesWaitingForApproval().subscribe((response: any) => {
          this.itemPolicy = response.result;
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
    }

    public getPolicyInformation(policy) {
        this.targetId8 = policy.insuranceRequestId;
        this.operationId8 = policy.operationId;
        this.displayCollateralInsuranceForm = true;
        this.getInsuranceInformation(policy);
        this.getInsurancePolicies(policy.collateraalId);
    }
    //#endregion

    //#region projectSite
    getProjectSiteReportApproval() {
        this.loadingService.show();
        this.psrService.getProjectSiteReportApproval().subscribe((response: any) => {
        this.ProjectSiteReports = response.result;
        this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showPsrReport(d) {
        this.loadingService.show();
        let data = {
            projectSiteReportId: d.projectSiteReportId,
            psrReportTypeId: d.psrReportTypeId
        }
        this.psrService.psrReport(data).subscribe((response: any) => {
            let path = response.result;
            this.projectReportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        });
        this.loadingService.hide(1000);
        this.displayProjectSiteReport = true;
    }

    showPsrDetail(d) {
        this.targetId5 = d.projectSiteReportId;
        this.psrReportTypeId = d.psrReportTypeId;
        this.activeTabindex5 = 1;
        this.operationId5 = d.operationId;
        this.showProjectSiteDetail = true;
        this.refreshGrid(this.targetId5);
    }

    myAnalysisDetail(d) {
        this.analysisDetail = d;
        this.showAnalysisDetail = true;
        this.showInput = false;
    }

    refreshGrid(targetid: number) {
        if(targetid <= 0){
            return;
        }
        this.getCommentReport(targetid);
        this.getObservationReport(targetid);
        this.getRecommendationReport(targetid);
        this.getTaskReport(targetid);
        this.getPsrPerformanceEvaluation(targetid);
        this.getPsrPerformanceAnalysis(targetid);
    }
    
    getCommentReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrComments(projectSiteReportId).subscribe((response: any) => {
            this.commentReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getObservationReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrObservations(projectSiteReportId).subscribe((response: any) => {
            this.observationReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getRecommendationReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrRecommendations(projectSiteReportId).subscribe((response: any) => {
            this.recommendationReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getTaskReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrNextInspectionTasks(projectSiteReportId).subscribe((response: any) => {
            this.taskReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getPsrPerformanceEvaluation(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrPerformanceEvaluations(projectSiteReportId).subscribe((response: any) => {
            this.performanceEvaluationsReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getPsrPerformanceAnalysis(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrPerformanceAnalysis(projectSiteReportId).subscribe((response: any) => {
            this.performanceAnalysisReport = response.result;
            this.performanceAnalysisReportCount = this.performanceAnalysisReport.length;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewPerformanceEvaluationsDetail(d) {
        this.evaluationDetail = d;
    }
    //#endregion

	//#region deferred Doc provision
	getDeferralDocumentsWaitingForApproval() {
        this.loadingService.show();
		this.checklistService.getDeferralDocumentsWaitingForApproval().subscribe((data) => {
		  this.deferralDocuments = data.result;
		  this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
	}

	viewProvision(row){
        this.CUSTOMER_ID = row.customerId;
        this.applicationReferenceNumber = row.applicationReferenceNumber;
		this.targetId9 = row.conditionId;
		this.operationId9 = row.operationId;
		this.getConditionPrecedentDocumentUpload(row.conditionId);
		this.displayDeferralModal = true;
	}

	getConditionPrecedentDocumentUpload(conditionId) {
        this.loadingService.show();
		this.checklistService.getConditionPrecedentDocumentUpload(conditionId).subscribe((data) => {
			if (data.success == true) {
				this.deferralDocumentUpload = data.result;
			} else {
				this.showMessage('No upload found for this checklist', 'info', "FintrakBanking");
			}
		this.loadingService.hide();
		}, (err) => {
			this.loadingService.hide(1000);
		});
	}

	viewDeferralDocument(documentId) {
		this.selectedDocumentName = null;
		this.binaryFile = null;
		this.loadingService.show()
		this.checklistService.ViewConditionPrecedentDocumentUpload(documentId).subscribe((data) => {
			this.viewUpload = data.result;
			if (this.viewUpload != undefined) {
				if (['jpg', 'jpeg', 'png'].indexOf(this.viewUpload.fileExtension.toLowerCase()) > -1) {
				this.selectedDocumentName = this.viewUpload.fileName;
				this.binaryFile = this.viewUpload.fileData;
				this.displayUploadShow = true;
				}
				if (['doc', 'docx', 'pdf', 'xls', 'xlsx'].indexOf(this.viewUpload.fileExtension.toLowerCase()) > -1) {
				this.downloadDeferralDocument(this.viewUpload);
				}
			} else {
				this.showMessage('No upload found for this checklist', 'info', "FintrakBanking");
			}
			this.loadingService.hide()
		});
	}

	downloadDeferralDocument(doc: any) {
		if (doc != null) {
		this.binaryFile = doc.fileData;
		let documentName = doc.documentTitle;
		let myDocExtention = doc.fileExtension;
		var byteString = atob(this.binaryFile);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var bb = new Blob([ab]);
		if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
			var file = new File([bb], documentName + '.jpg', { type: 'image/jpg' });
		}
		if (myDocExtention == 'png' || myDocExtention == 'png') {
			var file = new File([bb], documentName + '.png', { type: 'image/png' });
		}
		if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
			var file = new File([bb], documentName + '.pdf', { type: 'application/pdf' });
		}
		if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
			var file = new File([bb], documentName + '.xlsx', { type: 'application/vnd.ms-excel' });
		}
		if (myDocExtention == 'doc' || myDocExtention == 'docx') {
			var file = new File([bb], documentName + '.doc', { type: 'application/msword' });
		}
		saveAs(file)
		}
	}
	//#endregion

	//#region deferred doc extension
	getDeferralExtensionsWaitingForApproval() {
		this.loadingService.show();
		this.checklistService.getDeferralExtensionsWaitingForApproval().subscribe((data) => {
			this.deferralDocumentsExtension = data.result;
			this.loadingService.hide();
		}, (err) => {
			this.loadingService.hide(1000);
		});
	}

	viewdeferralExtension(row) {
        this.targetId9 = row.conditionId;
        this.CUSTOMER_ID = row.customerId;
        this.applicationReferenceNumber = row.applicationReferenceNumber;
		this.operationId9 = row.operationId;
		this.getConditionPrecedentDocumentUpload(row.conditionId);
		this.displayDeferralModal = true;
	}
	//#endregion
//----------INSURANCE DETAILS AND POLICY HISTORY-----------------
    activeTabindex: any;
    displaySearchForm: boolean = false;
    searchForm:FormGroup;
    displaySearchTable:boolean = false;
    applications: any[];
    searchString: any;
    selection: any;
    targetId: any;
    operationId: any;
    requestNumber: any;
    customerName: any;
    collateralValue: any;
    collateralType: any;
    collateralSubType: any;
    dateTimeCreated: any;
    level: any;
    status: any;
    mainInsuranceDetail: any={};
    collateralId: any;
    mainInsuranceView: boolean;
    hideGrid: boolean = false;
    customerCollateral: any;
    showBottom: boolean = false;
    insurancePolicy: any;
     insurancePolicies: any;
    makeDownLoadInsuranceButtonVisible: boolean = false;
    useSearch: boolean;
    allRequiredDocumentsAreUploaded = true;
    insuranceApplications:any;

    getItemPolicy(){
        this.loadingService.show();
        this.collateralService.getInsurancePoliciesWaitingForApproval().subscribe((response: any) => {
          this.insuranceApplications = response.result;
         // console.log("my insuranceApplications "+ JSON.stringify(this.insuranceApplications));
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
      }
    
      clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
      }
      onTabChange(obj) { }
      
      showSearchForm() {this.displaySearchForm=true;}
    
      CancelDetails() { 
        this.showBottom = false;
        this.mainInsuranceView = null;
      }
      submitForm(form) {
        this.searchString = form.value.searchString;
        this.loadingService.show();
        this.collateralService.GetinsuranceSearch(this.searchString).subscribe((response: any) => {
          this.applications = response.result;
          this.loadingService.hide();
          this.displaySearchForm = false;
          this.displaySearchTable = true;
          this.showBottom = false;
        }, (err: any) => {
          this.loadingService.hide(1000);
        });
    }
    
    public getInsuranceInformation(policy): any {
      this.selection = policy;
    
      this.targetId8 = policy.insuranceRequestId;
      this.operationId8 = policy.operationId;
      this.customerName = policy.customerName;
      this.requestNumber = policy.requestNumber;
      this.collateralValue = policy.collateralValue;
      this.collateralType = policy.collateralType;
      this.collateralSubType = policy.collateralSubType;
      this.dateTimeCreated = policy.dateTimeCreated
      this.level=policy.level;
      this.rowSelected = true;
      this.status=policy.status;

      this.GetInsurancePolicyByCollateralid(policy.collateraalId);
      //console.log('targetId, OperationId and good', this.operationId, this.targetId);
      
      if (this.applications != null) {
         this.mainInsuranceDetail = this.applications.find(x => x.insuranceRequestId == policy.insuranceRequestId)
         
    }
         this.collateralId = this.mainInsuranceDetail.collateraalId;
         //this.customerName = this.mainInsuranceDetail.customerName;
      this.hideGrid = true;
      this.mainInsuranceView = true;
      this.useSearch = false;
    
      this.showBottom = true;
    
      this.getInsurancePolicies(policy.collateraalId)
      return this.customerCollateral;
    }
    
    getInsurancePolicies(collateralId) {
      this.collateralService.getInsurancePolicies(collateralId).subscribe((response: any) => {
        this.insurancePolicies = response.result;
        
    
      });
    }
    
    setrequiredUploadValue(value: boolean) {
      this.allRequiredDocumentsAreUploaded = value;
    
    }
    
    GetInsurancePolicyByCollateralid(collateralId) {
      this.collateralService.GetInsurancePolicyByCollateralid(collateralId).subscribe((response: any) => {
        this.insurancePolicy = response.result;
      });
    }
    //--------------END--------------------
}
