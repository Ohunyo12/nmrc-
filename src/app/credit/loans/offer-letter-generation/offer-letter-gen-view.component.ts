import { saveAs } from 'file-saver';
import { ConditionChecklistComponent } from '../loan-checklist/condition-checklist.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { DocumentService } from '../../../setup/services/document.service';

import swal from 'sweetalert2';
import { GlobalConfig, LoanApplicationStatus, ApprovalStatus, ProductProcessEnum, JobSource, OperationsEnum } from '../../../shared/constant/app.constant';
import { ReportService } from '../../../reports/service/report.service';
import { GeneralSetupService } from '../../../setup/services/general-setup.service';
import { ApprovalService } from '../../../setup/services';
import { PrintService } from '../../../shared/services/print.service';
import { LazyLoadEvent } from 'primeng/primeng'; // lazyloading
import { forwardRef } from '@angular/core';
import { IAppraisal } from 'app/shared/models/appraisal.model';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';

@Component({
    templateUrl: 'offer-letter-gen-view.component.html',
    styles: [`
        #offerLetter {
            background-image: url(./assets/layout/images/draft.png);
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-size: contain;
            background-position: 70%;
        }
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

export class OfferLetterGenererationReviewComponent implements OnInit {

    showAsDraft: boolean = false;
    applications: any[] = [];
    // applicationSelection: any = {};
    displayOfferLetter = false;
    displayLoanDetails = false;
    generatedOfferLetter: any = {};
    form3800bSrc: any = {};
    reportSource: any;
    jobRequestForm: FormGroup;
    displayJobRequest = false;
    officers: any[]; jobRequests: any[];
    allDepartments: any[]; allJobTypes: any[];
    operationId: any;
    targetId: any;
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', { static: false }) fileInput: any;
    @ViewChild(forwardRef(() => ConditionChecklistComponent), { static: false }) conditionChecklist: ConditionChecklistComponent;
    activeIndex = 0;

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;

    displayValidationModal: boolean = false;
    displayLetterAcceptanceModal: boolean = false;

    decisionStatusId: number = 0;
    rmComment: string;
    commentsData: any[] = [];

    goForAvailment: boolean = false;
    approvalStatusData: any[] = [];
    offerLetterAccepted: string;
    camDocuments: any[] = [];
    creditAnalystDocument: any = {};
    rmCamDocument: any = {};
    loanApplicationId: number;
    printDocument: any; goForRMReview: boolean = false; goForCAPReview: boolean = false;
    jobSourceId: number;
    validationResponseObj: any; isCAMBased: boolean;
    displayTestReport: boolean; displayReport: boolean; reportSrc: SafeResourceUrl;
    displayForm3800b: boolean;
    ReportType: string;
    facilityList: any;

    // Obligor Checklist
    uwsList: any[] = [];
    isPreviewModalVisible: boolean = false;
    selectedDocumentUrl: SafeResourceUrl | null = null;
    fileType: string = '';
    zoomLevel: number = 1;
    dragging: boolean = false;
    startX: number = 0;
    startY: number = 0;
    imageList: string[] = [];
    currentImageIndex: number = 0;
    maxZoom: number = 3;
    minZoom: number = 1;
    selectedLoan: IAppraisal | null = null;
    ;
    constructor(
        private loadingService: LoadingService,
        private _loadingService: LoadingService,
        private _fb: FormBuilder,
        private _docServ: DocumentService,
        private reportService: ReportService,
        private _loanApplServ: LoanApplicationService,
        private _creditApprServ: CreditAppraisalService,
        private _genSetupService: GeneralSetupService,
        private _approvalService: ApprovalService,
        private _printService: PrintService,
        private camService: CreditAppraisalService,
        private reportServ: ReportService,
        private sanitizer: DomSanitizer,
        private underwritingService: UnifiedUnderwritingStandardService
    ) {

    }

    ngOnInit() {
        this.jobSourceId = JobSource.LoanApplicationDetail;
        // this._loadingService.show();
        this.getLoanApplication();
        this.getAllApprovalStatus();

    }

    // lazyloading table

    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    applicationSelection: any; // selection
    currentLazyLoadEvent: LazyLoadEvent;

    loadData(event: LazyLoadEvent) {
        this.getLoanApplications(event.first, event.rows);
        this.currentLazyLoadEvent = event;
    }

    getLoanApplication() {
        this._loadingService.show();
        this._creditApprServ.getApplicationsForReviewFromCreditUnit().subscribe((response: any) => {
            this.applications = response.result;
            this._loadingService.hide();
        }, (err) => {
            this._loadingService.hide(1000);
        });
    }

    getLoanApplications(
        page: number,
        itemsPerPage: number,
        classId: number = null,
        search: boolean = false
    ) {
        this._loadingService.show();
        this._creditApprServ.getApplicationsForReviewFromCreditUnit().subscribe((response: any) => {
            this.applications = response.result;
            this._loadingService.hide();
        }, (err) => {
            this._loadingService.hide(1000);
        });
    }

    // getLoanApplications(0, this.currentLazyLoadEvent.rows) {
    //     this._creditApprServ.getApplicationsForReviewFromCreditUnit().subscribe((response: any) => {
    //         this.applications = response.result;
    //         this._loadingService.hide();
    //     }, (err) => {
    //         ////console.log('error', err);
    //         this._loadingService.hide();
    //     });
    // }

    getAllApprovalStatus(): void {
        this._genSetupService.getApprovalStatus().subscribe((response: any) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.filter(x => x.approvalStatusId >= 4);
        });
    }

    viewOfferLetter(row) {
        //this.loadingService.show()
        this.goForAvailment = false;
        this.showAsDraft = false;
        this.goForCAPReview = false;
        this.goForRMReview = false;

        this.applicationSelection = row;
        //this.operationId = row.operationId;
        this.operationId = OperationsEnum.OfferLetterApproval;
        this.targetId = row.loanApplicationId;
        this.loanApplicationId = row.loanApplicationId;
        //this.getTrail();

        this._loadingService.show();
        this.getSupportingDocuments(this.applicationSelection.applicationReferenceNumber);

        this._loanApplServ.getLoanApplicationDetailsByApplicationId(this.applicationSelection.loanApplicationId)
            .subscribe((response: any) => {
                this.facilityList = response.result;
                ////console.log('facilityList', this.facilityList);
            }, (err) => {
                this._loadingService.hide();
            });

        // this._loanApplServ.getFinalOfferLetterByApplRefNumber(this.applicationSelection.applicationReferenceNumber)
        this._loanApplServ.getForm3800Template(this.applicationSelection.applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                this.form3800bSrc = tempSrc;

                if (tempSrc.isFinal == true) {
                    this.showAsDraft = true;
                }

                if (row.isFinal == true) {
                    this.showAsDraft = true;
                }

                if (tempSrc.isAccepted) {
                    this.goForAvailment = true;
                }

                this._loadingService.hide();
            }, (err) => {
                this._loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });

        // this._loanApplServ.generateOfferLetterTemplate(this.applicationSelection.applicationReferenceNumber)
        //     .subscribe((response: any) => {
        //         let tempSrc = response.result;
        //         this.generatedOfferLetter = tempSrc;
        //     }, (err) => {
        //         this._loadingService.hide();
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        //         ////console.log('error', err);
        //     });

        if (this.applicationSelection.camDocuments != null) {
            this.applicationSelection.camDocuments.map(element => {
                this.camDocuments.push(element);
            });
        }

        ////console.log('cam documents', this.camDocuments);

        if (this.camDocuments.length > 0) {
            const docLength = this.camDocuments.length;
            ////console.log('cap doc', this.camDocuments[docLength - 1]);
            if (docLength > 1) {
                this.rmCamDocument = this.camDocuments[docLength - 2];
                this.creditAnalystDocument = this.camDocuments[docLength - 1];
            }

        }

        ////console.log('analyst document', this.creditAnalystDocument);

        // this._creditApprServ.updateApplicationStatus(this.applicationSelection.applicationReferenceNumber,
        //     LoanApplicationStatus.OfferLetterReviewInProgress, this.applicationSelection).subscribe((res) => {
        //         if (res.success === true) {
        //             this.displayLoanDetails = true;
        //         }
        //         this._loadingService.hide();
        //     }, (err) => {
        //         this._loadingService.hide();
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        //     });
        this.displayLoanDetails = true;

        if (this.applicationSelection.productClassProcessId == ProductProcessEnum.CAMBased) {
            this.isCAMBased = true;
        } else {
            this.isCAMBased = false;
        }
        //this.print();
        //this.loadingService.hide(5000)

          
        // Fetch UUS checklist for the selected loan's reference number
        if (this.applicationSelection.applicationReferenceNumber) {
          this.fetchCustomerUusItems(this.applicationSelection.applicationReferenceNumber);
        }
    }

    // =========================== Fetch Obligor's Items ===============================

    getRowStyle(rowData: any): any {
        if (rowData.option === 'Yes') {
            return { 'background-color': '#28a745', 'color': '#fff' }; // Deep green
        } else if (rowData.option === 'No') {
            return { 'background-color': '#dc3545', 'color': '#fff' }; // Deep red
        } else {
            return {};
        }
    }

    fetchCustomerUusItems(nhfNumber: string): void {
        console.error('nhf number:', nhfNumber);
        this.loadingService.show();
        this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
            response => {
                this.uwsList = (response.result || []).map(uws => ({
                    ...uws,
                    option: this.mapOptionToEnum(uws.option),
                    deferredDate: uws.deferDate ? new Date(uws.deferDate).toISOString().split('T')[0] : null
                }));
                console.log('Processed UUS List:', this.uwsList);
                //this.cdr.detectChanges();
            },
            error => {
                console.error('Error fetching UWS list:', error);
                this.uwsList = [];
                this.loadingService.hide();
            },
            () => this.loadingService.hide()
        );
    }

    mapOptionToEnum(option: number): string {
        const mapping: { [key: number]: string } = {
            1: 'Yes',
            2: 'No',
            3: 'Waiver',
            4: 'Deferred'
        };
        return mapping[option] || 'No';
    }

    viewDocuments(uws: any): void {
        console.log('Selected UWS:', uws);
        if (!uws.employeeNhfNumber) {
            swal('Error', 'No Employee NHF Number found!', 'error');
            return;
        }
        if (!uws.itemId) {
            swal('Error', 'No Item Found!', 'error');
            return;
        }
        console.log('Fetching document for:', uws.employeeNhfNumber, uws.itemId);
        this.fetchAndPreviewDocument(uws.employeeNhfNumber, uws.itemId);
    }

    private fetchAndPreviewDocument(employeeNumber: string, itemId: number): void {
        console.log('Calling API with:', employeeNumber, itemId);
        this.loadingService.show();
        this.underwritingService.getCustomerUusItemDoc(employeeNumber, itemId).subscribe({
            next: (response) => {
                console.log('API Response:', response);
                if (!response.success || !response.result) {
                    console.error('Invalid document data received');
                    swal('Error', 'Invalid document data received.', 'error');
                    this.loadingService.hide();
                    return;
                }
                const base64Data = response.result.split(',')[1];
                const fileTypeMatch = response.result.match(/data:(.*?);base64/);
                if (!base64Data || !fileTypeMatch) {
                    console.error('Invalid Base64 format');
                    swal('Error', 'Invalid document format.', 'error');
                    this.loadingService.hide();
                    return;
                }
                const fileType = fileTypeMatch[1];
                console.log('Detected file type:', fileType);
                const blob = this.base64ToBlob(base64Data, fileType);
                const url = URL.createObjectURL(blob);
                console.log('Generated Blob URL:', url);
                if (fileType.includes('image') || fileType === 'application/pdf' ||
                    fileType === 'application/vnd.openxmlformats-officedocument.w ordprocessingml.document' ||
                    fileType === 'application/msword') {
                    this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                    this.fileType = fileType;
                    this.isPreviewModalVisible = true;
                } else {
                    swal('Error', 'Unsupported file type.', 'error');
                }
                this.loadingService.hide();
            },
            error: (error) => {
                console.error('Error fetching document:', error);
                swal('Error', 'Error fetching document.', 'error');
                this.loadingService.hide();
            }
        });
    }

    private base64ToBlob(base64: string, contentType: string): Blob {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        return new Blob(byteArrays, { type: contentType });
    }

    getModalStyle() {
        if (this.fileType === 'application/pdf' || this.fileType === 'application/msword' ||
            this.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return { width: '70%', height: '75vh' };
        } else {
            return { width: '55%', height: '70vh' };
        }
    }

    zoomIn() {
        this.zoomLevel += 0.2;
    }

    zoomOut() {
        if (this.zoomLevel > 0.5) this.zoomLevel -= 0.2;
    }

    onScrollZoom(event: WheelEvent) {
        event.preventDefault();
        const zoomFactor = event.deltaY < 0 ? 0.1 : -0.1;
        this.zoomLevel = Math.max(0.5, this.zoomLevel + zoomFactor);
    }

    startDrag(event: MouseEvent) {
        event.preventDefault();
        this.dragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    onDrag = (event: MouseEvent) => {
        if (!this.dragging) return;
        const dragSpeed = 2;
        const deltaX = (event.clientX - this.startX) * dragSpeed;
        const deltaY = (event.clientY - this.startY) * dragSpeed;
        const imageElement = document.querySelector('img') as HTMLElement;
        if (imageElement) {
            imageElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${this.zoomLevel})`;
        }
    };

    toggleZoom() {
        if (this.zoomLevel >= this.maxZoom) {
            this.zoomLevel = this.minZoom;
        } else {
            this.zoomLevel += 0.5;
        }
    }

    stopDrag = () => {
        this.dragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    };

    closePreviewModal() {
        this.isPreviewModalVisible = false;
        this.selectedDocumentUrl = null;
        this.zoomLevel = 1;
    }

     // =========================== END ==============================================

    closeDetailsPanel(evt) {
        evt.preventDefault();
        this.reset();
    }

    reset() {
        this.applicationSelection = '';
        this.activeIndex = 0;
        this.displayLoanDetails = false;
        this.rmComment = null;
        this.getLoanApplication();
        // this._loadingService.hide();
    }

    onRowSelect(event) {
        this.displayLoanDetails = true;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        let regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        ////console.log('file type..', this.file.type);
        ////console.log('file name..', this.file.name);

        if (this.file !== undefined || this.uploadFileTitle != null) {
            let body = {
                loanApplicationId: this.applicationSelection.loanApplicationId,
                loanApplicationNumber: this.applicationSelection.applicationReferenceNumber,
                loanReferenceNumber: '',
                documentTitle: this.uploadFileTitle,
                documentTypeId: '1', // TODO
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
            };
            this._loadingService.show();
            this._creditApprServ.uploadFile(this.file, body).then((val: any) => {
                ////console.log('val', val);
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = '';
                this.getSupportingDocuments(this.applicationSelection.applicationReferenceNumber);
                this._loadingService.hide();
            }, (error) => {
                this._loadingService.hide(1000);
                ////console.log('error', error);
            });
        }
    }

    getSupportingDocuments(applicationNumber: any) {
        ////console.log('appl number', applicationNumber);
        this._creditApprServ.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
        });
    }

    // getAllMonitoringSetup(): void {
    //     this.loadingService.show();
    //     this.monitoringSetupService.getAllMonitoringSetups().subscribe((response: any) => {
    //       this.monitoringSetups = response.result;
    //       this.loadingService.hide();
    //     }, (err) => {
    //       this.loadingService.hide(1000);
    //     });
    //   }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId === id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
        ////console.log('this.binaryFile', this.binaryFile);
    }

    DownloadDocument(id: number) {
        let fileDocument = this.supportingDocuments.find(x => x.documentId === id);
        if (fileDocument != null) {
            this.binaryFile = fileDocument.fileData;
            this.selectedDocument = fileDocument.documentTitle;
            let myDocExtention = fileDocument.fileExtension;
            var byteString = atob(this.binaryFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                }
            }
            if (myDocExtention == 'png' || myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                }
            }
            if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                }
            }
            if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                }
            }
            if (myDocExtention == 'doc' || myDocExtention == 'docx') {

                try {
                    var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                }
            }
        }
    }

    sendForAvailment(evt) {
        this.decisionStatusId = ApprovalStatus.APPROVED;
        this.offerLetterAccepted == 'true';
        this.goForAvailment = true;
        const __this = this;
        const obj = {
            documentId: this.form3800bSrc.documentId,
            comment: this.rmComment,
            documentTemplate: this.form3800bSrc.documentTemplate,
            applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
            productClassId: this.applicationSelection.productClassId,
            productId: '',
            // isAccepted: this.offerLetterAccepted,
            applicationStatusId: LoanApplicationStatus.OfferLetterReviewCompleted,
            approvalStatusId: this.decisionStatusId
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
            __this._loadingService.show();
            __this._loanApplServ.logOfferLetterDecisionForApproval(obj).subscribe((res) => {
                __this._loadingService.hide();
                __this.getLoanApplication();
                __this.reset();
                __this.applicationSelection = '';
                __this.rmComment = null;
                __this.activeIndex = 0;
                __this.displayLoanDetails = false;
                __this.displayLetterAcceptanceModal = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            }, (err) => {
                __this._loadingService.hide(1000);
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    // sendForAvailment(evt) {
    //     this.decisionStatusId = ApprovalStatus.APPROVED;
    //     this.offerLetterAccepted == 'true';
    //     this.goForAvailment = true;
    //     const __this = this;
    //     const obj = {
    //         documentId: this.form3800bSrc.documentId,
    //         comment: this.rmComment,
    //         documentTemplate: this.form3800bSrc.documentTemplate,
    //         applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
    //         productClassId: this.applicationSelection.productClassId,
    //         productId: '',
    //         // isAccepted: this.offerLetterAccepted,
    //         applicationStatusId: LoanApplicationStatus.OfferLetterReviewCompleted,
    //         approvalStatusId: this.decisionStatusId
    //     };
    //     swal({
    //         title: 'Are you sure?',
    //         text: 'You won\'t be able to revert this!',
    //         type: 'question',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes',
    //         cancelButtonText: 'No, cancel!',
    //         confirmButtonClass: 'btn btn-success btn-move',
    //         cancelButtonClass: 'btn btn-danger',
    //         buttonsStyling: true,
    //     }).then(function () {
    //         __this._loadingService.show();
    //         __this._loanApplServ.validatePrecedenceChecklistCompleted(__this.loanApplicationId).subscribe((res) => {
    //             __this._loadingService.hide();
    //             if (res.success == true) {
    //                 __this._loanApplServ.logOfferLetterDecisionForApproval(obj).subscribe((res) => {
    //                         __this.getLoanApplication();
    //                         __this.reset();
    //                         __this.applicationSelection = '';
    //                         __this.rmComment = null;
    //                         __this.activeIndex = 0;
    //                         __this.displayLoanDetails = false;
    //                         __this.displayLetterAcceptanceModal = false;
    //                     swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 }, (err) => {
    //                     __this._loadingService.hide();
    //                     swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //                 });
    //             } else {
    //                 __this.displayLetterAcceptanceModal = false;
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please complete offer letter checklist to continue', 'error');
    //                 return;
    //             }

    //         });

    //     }, function (dismiss) {
    //         if (dismiss === 'cancel') {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    //         }
    //     });
    // }

    handleChange(evt) {
        this.activeIndex = evt.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 4) ? 0 : this.activeIndex + 1;

    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    validateOfferLetter() {
        this.goForAvailment = false;
        this.goForCAPReview = false;
        this.goForRMReview = false;
        //this.operationId = this.applicationSelection.operationId;
        //this.operationId = OperationsEnum.OfferLetterApproval;
        //this.targetId = this.applicationSelection.loanApplicationId;
        this.displayValidationModal = true;
    }

    submitValidationResponse() {
        const obj = {
            documentId: this.form3800bSrc.documentId,
            comment: this.rmComment,
            documentTemplate: this.form3800bSrc.documentTemplate,
            applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
            productId: '',
            applicationStatusId: LoanApplicationStatus.OfferLetterGenerationInProgress,
            approvalStatusId: ApprovalStatus.REFERRED,
        };
        this.validationResponseObj = obj;
        this.goForRMReview = true;
        this.displayValidationModal = false
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Decision recorded', 'success');
    }

    indicateLetterAcceptance() {
        this.offerLetterAccepted === 'true';
        this.goForAvailment = false;
        this.goForCAPReview = false;
        this.goForRMReview = false;
        this.displayLetterAcceptanceModal = true;
    }

    // submitAcceptanceResponse() {
    //     this.decisionStatusId = ApprovalStatus.APPROVED;
    //     this.offerLetterAccepted == 'true';
    //     this.goForAvailment = true;
    //     const offerLetterObj = {
    //         documentId: this.form3800bSrc.documentId,
    //         comment: this.rmComment,
    //         documentTemplate: this.form3800bSrc.documentTemplate,
    //         applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
    //         productId: '',
    //         isAccepted: true
    //     };
    //     const __this = this;
    //     __this._loanApplServ.saveFinalOfferLetter(offerLetterObj).subscribe((res) => {
    //         __this._loadingService.hide();
    //         if (res.success === true) {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //             __this.displayLetterAcceptanceModal = false;
    //         } else {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
    //         }

    //     }, (err) => {
    //         ////console.log('error updating document', err);
    //     });
    // }


    sendApplicationBackToRM() {
        let target = this.applicationSelection;

        const obj = this.validationResponseObj;

        this._loadingService.show();

        this._loanApplServ.logOfferLetterDecisionForApproval(obj).subscribe((res) => {
            this._loadingService.hide();
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application sent back to CR Legal with updates.', 'success');
                // swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application sent back to CR Legal with updates.', 'success');
                this.getLoanApplications(0, this.currentLazyLoadEvent.rows);
                this.displayLoanDetails = false;
                this.displayValidationModal = false;
                this.rmComment = '';
                this.decisionStatusId = 0;
                this.goForRMReview = false;

                this.reset();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application sent back to CR Legal with updates.', 'error');
            }
        }, (err) => {
            this._loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });

        this._loanApplServ.saveFinalOfferLetter(obj).subscribe((res) => {
            if (res.success == true) {
            }
            else {

            }
            this.reset();
        }, (err) => {

        });

    }

    submitAcceptanceResponse() {
        this.decisionStatusId = (this.offerLetterAccepted === 'true') ? ApprovalStatus.APPROVED : ApprovalStatus.REFERRED;
        const offerLetterObj = {
            documentId: this.form3800bSrc.documentId,
            comment: this.rmComment,
            documentTemplate: this.form3800bSrc.documentTemplate,
            applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
            productId: '',
            isAccepted: this.offerLetterAccepted
        };

        this._loanApplServ.validatePrecedenceChecklistCompleted(this.loanApplicationId).subscribe((res) => {
            this._loanApplServ.saveFinalOfferLetter(offerLetterObj).subscribe((res) => {
                this._loadingService.hide();

                if (this.offerLetterAccepted === 'true') {
                    this.goForCAPReview = false;
                    this.goForAvailment = true;
                }
                else {
                    this.goForAvailment = false;
                    this.goForCAPReview = true;
                }
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                this.displayLetterAcceptanceModal = false;
                // if (res.success == true) {
                //     swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                //     __this.displayLetterAcceptanceModal = false;
                // }
                // else {
                //     swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                //     ////console.log('ERROR: ', res.message);
                // }
            }, (err) => {
                ////console.log('error updating document', err);
            });
        });
    }

    // submitAcceptanceResponse() {
    //     this.decisionStatusId = (this.offerLetterAccepted === 'true') ? ApprovalStatus.APPROVED : ApprovalStatus.REFERRED;
    //     const offerLetterObj = {
    //         documentId: this.form3800bSrc.documentId,
    //         comment: this.rmComment,
    //         documentTemplate: this.form3800bSrc.documentTemplate,
    //         applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
    //         productId: '',
    //         isAccepted: this.offerLetterAccepted
    //     };


    //     this._loanApplServ.validatePrecedenceChecklistCompleted(this.loanApplicationId).subscribe((res) => {
    //         this._loadingService.hide();
    //         if (res.success == true) {
    //             this._loanApplServ.saveFinalOfferLetter(offerLetterObj).subscribe((res) => {
    //                 this._loadingService.hide();

    //                 if (this.offerLetterAccepted === 'true') {
    //                     this.goForCAPReview = false;
    //                     this.goForAvailment = true;
    //                 }
    //                 else {
    //                     this.goForAvailment = false;
    //                     this.goForCAPReview = true;
    //                 }
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 this.displayLetterAcceptanceModal = false;
    //                 // if (res.success == true) {
    //                 //     swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 //     __this.displayLetterAcceptanceModal = false;
    //                 // }
    //                 // else {
    //                 //     swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
    //                 //     ////console.log('ERROR: ', res.message);
    //                 // }
    //             }, (err) => {
    //                 ////console.log('error updating document', err);
    //             });
    //         } else {
    //             this.displayLetterAcceptanceModal = false;
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please complete offer letter checklist to continue', 'error');
    //             return;
    //         }
    //     });
    // }

    sendApplicationForReview() {
        this._loadingService.show();

        const obj = {
            comment: this.rmComment,
            applicationReferenceNumber: this.applicationSelection.applicationReferenceNumber,
            productId: '',
            isAccepted: this.offerLetterAccepted,
            applicationStatusId: LoanApplicationStatus.ApplicationUnderReview,
        };

        const target = this.applicationSelection;

        this._loanApplServ.logOfferLetterDecisionForApproval(obj).subscribe((res) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            // this.getLoanApplications(0, this.currentLazyLoadEvent.rows);
            this.reset();
            this.displayLoanDetails = false;
            this.displayLetterAcceptanceModal = false;
            this.rmComment = '';
            this.goForCAPReview = false;
            this._loadingService.hide();
        }, (err) => {
            this._loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
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
    //     this._printService.printDocument(printObj);

    // }

    print(): void {
        if (this.applicationSelection.applicationReferenceNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            this.ReportType = 'FORM3800B Print Preview'
            let path = '';
            const data = {
                applicationRefNumber: this.applicationSelection.applicationReferenceNumber,

            }

            this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            return;
        }

    }
    // REFER BACK

    trail: any[] = [];
    forwardAction: number = 0;
    trailId: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    readonly CAM_OPERATION_ID: number = 6;
    backtrail: any[] = [];

    getTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.applicationSelection.loanApplicationId, this.CAM_OPERATION_ID).subscribe((response: any) => {
            this.trail = response.result;
            ////console.log('trail..', response.result);
            this.referBackTrail();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    onTargetStaffLevelChange(trailId) {
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    referBackTrail(): any {
        this.trail.forEach(x => {
            if (this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId && t.requestStaffId == x.requestStaffId) == null) {
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

    CallRequestClose() { this.displayJobRequest = false; }
    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }


    //Microsoft Report for Offer Letter
    popoverSeeMore() {
        if (this.applicationSelection.applicationReferenceNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            this.ReportType = ' Generated Offer Letter';
            let path = '';
            let pathCFL = '';
            const data = {
                applicationRefNumber: this.applicationSelection.applicationReferenceNumber,

            }
            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            this.displayReport = true;
            return;
        }
    }


    offerLetterChecklist() {
        this.conditionChecklist.viewOfferLetterChecklist(this.applicationSelection.loanApplicationId);

    }

    referBackResultControl(event) {
        if (event == true) {
            this.displayValidationModal = false;
            this.reset();
        }
    }

}