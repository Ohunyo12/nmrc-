import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { LoanApplicationService } from '../../../../credit/services/loan-application.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { DocumentService } from '../../../../setup/services/document.service';
import { CreditAppraisalService } from '../../../../credit/services/credit-appraisal.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';
import { LoanService } from 'app/credit/services/loan.service';
import { WorkflowTarget } from 'app/shared/models/workflow-target';

export enum LoanTypeEnum {
    SingleCustomer = 1,
    Batch = 2,
    GroupCustomer = 3
}

@Component({
    templateUrl: 'pen-approval.component.html'
})

export class PreliminaryEvaluationApprovalComponent implements OnInit {

    penApprovalData: any[];
    displayPenModal = false;
    penSelectedData: any = {};
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;
    loanPreliminaryEvaluationId: number;
    // file upload
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    panelHeader: string;
    displayGrpCustomers = false;

    loanTypeId: number;

    selectedRecord: any; displayApprovalModal = false;

    workflowTarget: WorkflowTarget = new WorkflowTarget();

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private loanApplService: LoanApplicationService, private genSetupService: GeneralSetupService,
        private approvalService: ApprovalService, private documentService: DocumentService,
        private camService: CreditAppraisalService, private router: Router,
        private loanService: LoanService) {
    }

    ngOnInit() {
        this.loadingService.show();
        this.getAllPenApplicationsForApproval(LoanTypeEnum.SingleCustomer);
        this.getAllApprovalStatus();
    }

    viewSingleCustomerPEN(evt) {
        evt.preventDefault();
        this.loanTypeId = LoanTypeEnum.SingleCustomer;
        this.getAllPenApplicationsForApproval(this.loanTypeId);
    }

    viewGroupCustomerPEN(evt) {
        evt.preventDefault();
        this.loanTypeId = LoanTypeEnum.GroupCustomer
        this.getAllPenApplicationsForApproval(this.loanTypeId);
    }

    getAllPenApplicationsForApproval(loanTypeId) {
        this.penApprovalData = [];
        this.loanApplService.getAllPreliminaryEvaluationsAwaitingApprovalByLoanType(loanTypeId).subscribe((response: any) => {
            this.penApprovalData = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        }, (err) => {
            this.loadingService.hide();
        });
    }

    viewApplicationDetails(event) {
        this.loadingService.show();
        ////console.log('pen record', event);
        this.viewPenDetails(event.data);
        this.updateWorkflowTarget();
    }

    viewPenDetails(index) {
        // evt.preventDefault();
        this.penSelectedData = {};
        this.penSelectedData = index;
        ////console.log('this.penSelectedData', this.penSelectedData);

        let temp = this.penSelectedData;
        if (temp.customerGroupId != null) {
            this.panelHeader = `Customer Group - ${temp.customerGroupName} - ${temp.customerGroupCode}`;
            this.displayGrpCustomers = true;
            this.loanTypeId = LoanTypeEnum.GroupCustomer;
        } else {
            this.panelHeader = `Customer - ${temp.customerName} - ${temp.customerCode}`;
            this.loanTypeId = LoanTypeEnum.SingleCustomer;
        }

        let dataObj = this.penSelectedData;
        this.loanService.getApprovalTrailByOperation(dataObj.operationId, dataObj.loanPreliminaryEvaluationId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        this.getSupportingDocumentsByRefNum(dataObj.preliminaryEvaluationCode);
        this.displayPenModal = true;
        this.loadingService.hide();
    }

    showApprovalModal() {
        this.displayApprovalModal = true;
    }

    showConfirmDialog() {
        ////console.log('button clicked');
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval(formObj) {
        let loading = this.loadingService;
        let srv = this.loanApplService;
        let getProducts = this.getAllPenApplicationsForApproval;

        let bodyObj = {
            targetId: formObj.loanPreliminaryEvaluationId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment
        };

        const __this = this;

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
            __this.loanApplService.sendPreliminaryEvaluationForApproval(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    __this.displayPenModal = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllPenApplicationsForApproval(__this.loanTypeId);
                    __this.hideModal();
                    __this.displayApprovalModal = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            __this.loadingService.hide();
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayPenModal = false;
    }

    hideModal() {
        this.activeIndex = 0;
        this.selectedRecord = '';
        this.displayPenModal = false;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
        ////console.log('files..', this.files);
        ////console.log('file..', this.file);
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        ////console.log('file type..', this.file.type);
        ////console.log('file name..', this.file.name);

        if (this.file !== undefined || this.uploadFileTitle != null) {
            let body = {
                // documentId: '1',
                // loanApplicationId: this.penSelectedData.loanPreliminaryEvaluationId,
                loanApplicationNumber: 'PEN',
                loanReferenceNumber: this.penSelectedData.preliminaryEvaluationCode,
                documentTitle: this.uploadFileTitle,
                documentTypeId: '1', // TODO: 
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
            };
            this.loadingService.show();
            this.camService.uploadFile(this.file, body).then((val: any) => {
                ////console.log('val', val)
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = '';
                this.getSupportingDocumentsByRefNum(this.penSelectedData.preliminaryEvaluationCode);
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log('error', error);
            });
        }
    }

    // getSupportingDocumentsByRefNum(referenceNumber: any) {
    //     //console.log('appl number', referenceNumber);
    //     this.camService.getSupportingDocumentByApplication(referenceNumber).subscribe((response: any) => {
    //         this.supportingDocuments = response.result;
    //         ////console.log('documents..', response.result);
    //     }, (error) => {
    //         ////console.log('error', error);
    //     });
    // }

    getSupportingDocumentsByRefNum(referenceNumber: any) {
        this.loadingService.show();
        ////console.log('appl number', referenceNumber);
        this.camService.getSupportingDocumentByApplicationRef(referenceNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide();
            ////console.log('error', error);
        });
    }

    viewDocument(id: number) {
        var doc = this.supportingDocuments.find(x => x.documentId == id);
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
            doc = response.result;
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
        },);
    }

    myDocExtention: string;
    pdfFile: any;
    pdfFileName: string;
    DownloadDocument(id: number) {
        var doc = this.supportingDocuments.find(x => x.documentId == id);
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
            doc = response.result;
        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {

                try {
                    var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                }
            }
        }
        },);
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 6) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.penSelectedData.loanPreliminaryEvaluationId;
        this.workflowTarget.operationId = this.penSelectedData.operationId;
        //this.workflowTarget.toStaffId = this.applicationSelection.toStaffId; // optional
        //this.workflowTarget.responsiblePerson = this.applicationSelection.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.productClassId = null;
        this.workflowTarget.productId = null;
        // this.workflowTarget.currentApprovalLevel = this.applicationSelection.currentApprovalLevel; // required if toStaffId is given
        // this.workflowTarget.finalApprovalLevelId = this.applicationSelection.finalApprovalLevelId;
        this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }
}
