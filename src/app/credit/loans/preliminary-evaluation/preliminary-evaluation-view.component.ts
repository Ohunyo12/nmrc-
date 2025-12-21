import { Component, OnInit, OnDestroy, ViewChild ,Input} from '@angular/core';

import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { LoanApplicationService } from '../../services/loan-application.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { ApprovalService } from 'app/setup/services/approval.service';
import { LoanService } from 'app/credit/services/loan.service';
import { LoanReviewApplicationService } from 'app/credit/services';
import { WorkflowTarget } from 'app/shared/models/workflow-target';

export enum LoanTypeEnum {
    SingleCustomer = 1,
    Batch = 3,
    GroupCustomer = 2
}

@Component({
    // styles: [
    //     `.panel-body {
    //         overflow-y:scroll;
    //         width:100%;
    //     }`
    // ],
    selector: 'prelimanary-evaluation-view-template',
    templateUrl: 'preliminary-evaluation-view.component.html',
})

export class PreliminaryEvaluationViewComponent implements OnInit {
    displayPenApplForm = false;
    disableCtrl = false;
    penApplForm: FormGroup;
    penApplications: any[];
    officers: any[];
    penApplicant: any = {};
    activeIndex = 0;
    custData: any;

    operationType: number = 1;
    workflowTarget: WorkflowTarget = new WorkflowTarget();

    showBackButton: boolean = true;
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

    customerGroupMappings: any[];
    companyDirectors: any[];
    companyShareholders: any[];
    companyBvnInformation: any[];
    customerTopClients: any[];
    customerTopSuppliers: any[];

    displayPenDetails = false;

    selectedRecord: any;
    disableSave: boolean;
    approvalWorkflowData: any;

    @Input() penId: number = null;
    @Input() applicationId: number = null;
    regions: any;
    operationId: any;
    preliminaryEvaluationCode: any;
    @Input() set reload(value: number) { if (value > 0) this.getPreliminaryEvaluations(false); }

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private loanApplService: LoanApplicationService,
        private validationService: ValidationService, private router: Router,
        private camService: CreditAppraisalService,
        private approvalService: ApprovalService,
        private reviewService: LoanReviewApplicationService,
        private loanService: LoanService) {
    }

    ngOnInit() {
        this.loadingService.show();
        this.loadPenApplForm();
        this.getPreliminaryEvaluations();
        this.getAllOfficers();
        //this.getRegions();
    }

    loadPenApplForm() {
        this.penApplForm = this.fb.group({
            loanPreliminaryEvaluationId: [''],
            preliminaryEvaluationCode: [''],
            projectDescription: ['', Validators.required],
            customerId: [''],
            customerName: [''],
            ownershipStructure: ['', Validators.required],
            clientDescription: ['', Validators.required],
            registrationNumber: ['', Validators.required],
            taxIdentificationNumber: ['', Validators.required],
            existingExposure: ['', Validators.required],
            projectFinancingPlan: ['', Validators.required],
            bankRole: ['', Validators.required],
            marketDemand: ['', Validators.required],
            businessProfile: ['', Validators.required],
            collateralArrangement: ['', Validators.required],
            commercialViabilityAssessment: ['', Validators.required],
            environmentalImpact: ['', Validators.required],
            implementationArrangements: ['', Validators.required],
            portfolioStrategicAlignment: ['', Validators.required],
            proposedTermsAndConditions: ['', Validators.required],
            risksAndConcerns: ['', Validators.required],
            prudentialExposureLimitImplications: ['', Validators.required],
            relationshipManagerId: [''],
            relationshipOfficerId: [''],
            sendForEvaluation: [''],
            sentForLoanApplication: [''],
            productClassId: [''],
            subSectorId: [''],
            loanAmount: [''],
            loanTypeId: [''],
            customerGroupId: [''],
            //regionId:['',Validators.required]
        });
    }

    viewSingleCustomerPEN(evt) {
        evt.preventDefault();
        this.loanTypeId = LoanTypeEnum.SingleCustomer;
        this.getPreliminaryEvaluations();
    }

    

    viewGroupCustomerPEN(evt) {
        evt.preventDefault();
        this.loanTypeId = LoanTypeEnum.GroupCustomer
        ////console.log('LoanTypeEnum.GroupCustomer',LoanTypeEnum.GroupCustomer)
        this.getPreliminaryEvaluations();
    }

    // getAllPenApplications(loanTypeId) {
    //     this.penApplications = [];
    //     this.loanApplService.getAllPreliminaryEvaluationsByLoanType(1).subscribe((response: any) => {
    //         this.penApplications = response.result;
    //     });
    // }

    getPreliminaryEvaluations(all = true) {
        if (all == true && this.applicationId == null) {
            this.loanApplService.getAllPreliminaryEvaluationsByLoanType(1).subscribe((response: any) => {
                this.penApplications = response.result;
            });
        } else {
            this.loanApplService.getPreliminaryEvaluations(this.applicationId).subscribe((response: any) => {
                this.penApplications = response.result;
            });
        }
    }

    getAllOfficers() {
        this.loanApplService.getOfficers().subscribe((res) => {
            this.officers = res.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
            ////console.log('officer error', err);
        });
    }

    viewApplicationDetails(event) {
        this.loadingService.show();
        this.operationId =event.data.operationId;
        this.preliminaryEvaluationCode =event.data.preliminaryEvaluationCode
        this.loanService.getApprovalTrailByOperation(event.data.operationId, event.data.loanPreliminaryEvaluationId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
            this.updateWorkflowTarget();
           // console.log('this.approvalWorkflowData ', this.approvalWorkflowData );
        });
        this.viewPenDetails(event.data);
    }

    viewPenDetails(data) {
        if(data == null || data == undefined){return;}
        
        this.loadPenApplForm();
        let row = data;
        this.disableCtrl = (row.approvalStatusId === 2 ||  row.approvalStatusId === 1 || this.applicationId !== null) ? true : false;
        this.displayGrpCustomers = row.customerGroupId !== null ? true : false;
        this.companyDirectors = []; this.companyShareholders = []; this.companyBvnInformation = [];
        this.customerTopClients = []; this.customerTopSuppliers = [];
        if (this.displayGrpCustomers) {
            this.panelHeader = `Customer Group - ${row.customerGroupName} - ${row.customerGroupCode}`;
            this.loanTypeId = LoanTypeEnum.GroupCustomer;
            if(row.customerGroupMappings != null){
                this.companyDirectors = row.customerGroupMappings.customerCompanyDirectors;
                this.companyShareholders = row.customerGroupMappings.customerCompanyShareholders;
                this.companyBvnInformation = row.customerGroupMappings.customerBvnInformation;
                this.customerTopSuppliers = row.customerGroupMappings.customerSuppliers;
                this.customerTopClients = row.customerGroupMappings.customerClients;
            }
        } else {
            this.panelHeader = `Customer - ${row.customerName} - ${row.customerCode}`;
            this.loanTypeId = LoanTypeEnum.SingleCustomer;
            this.companyDirectors = row.customerCompanyDirectors;
            this.companyShareholders = row.customerCompanyShareholders;
            this.companyBvnInformation = row.customerBvnInformation;
            this.customerTopSuppliers = row.customerSuppliers;
            this.customerTopClients = row.customerClients;
        }

        this.penApplicant = row;
        this.penApplForm = this.fb.group({
            loanPreliminaryEvaluationId: [row.loanPreliminaryEvaluationId],
            preliminaryEvaluationCode: [row.preliminaryEvaluationCode],
            projectDescription: [row.projectDescription],
            customerId: [row.customerId],
            customerGroupId: [row.customerGroupId],
            ownershipStructure: [row.ownershipStructure],
            clientDescription: [row.clientDescription],
            registrationNumber: [row.registrationNumber],
            taxIdentificationNumber: [row.taxIdentificationNumber],
            existingExposure: [row.existingExposure],
            projectFinancingPlan: [row.projectFinancingPlan],
            bankRole: [row.bankRole],
            marketDemand: [row.marketDemand],
            businessProfile: [row.businessProfile],
            collateralArrangement: [row.collateralArrangement],
            commercialViabilityAssessment: [row.commercialViabilityAssessment],
            environmentalImpact: [row.environmentalImpact],
            implementationArrangements: [row.implementationArrangements],
            portfolioStrategicAlignment: [row.portfolioStrategicAlignment],
            proposedTermsAndConditions: [row.proposedTermsAndConditions],
            risksAndConcerns: [row.risksAndConcerns],
            prudentialExposureLimitImplications: [row.prudentialExposureLimitImplications],
            relationshipManagerId: [row.relationshipManagerId],
            relationshipOfficerId: [row.relationshipOfficerId],
            sendForEvaluation: [''],
            sentForLoanApplication: [''],
            productClassId: [row.productClassId],
            loanAmount: [row.loanAmount],
            loanTypeId: [row.loanTypeId],
            accountNumber: [row.customerAccountNumber],
            customerTypeId: [row.customerTypeId],
            regionId: [row.regionId]
        });

        this.getSupportingDocumentsByRefNum(row.preliminaryEvaluationCode);
        this.displayPenApplForm = true;
    }

    submitPreliminaryEvaluation(formObj) {
        const bodyObj = formObj.value;
        const selectedId = bodyObj.loanPreliminaryEvaluationId;

        const dataObj = {
            customerId: bodyObj.customerId,
            customerName: this.penApplicant.customerName,
            customerCode: this.penApplicant.customerCode,
            productClassId: bodyObj.productClassId,
            loanAmount: bodyObj.loanAmount,
            loanTypeId: bodyObj.loanTypeId,
            relationshipManagerId: bodyObj.relationshipManagerId,
            relationshipOfficerId: bodyObj.relationshipOfficerId,
            companyDirectors: this.penApplicant.customerCompanyDirectors,
            companyShareholders: this.penApplicant.customerCompanyShareholders,
            companyBvnInformation: this.penApplicant.customerBvnInformation,
            penCode: bodyObj.preliminaryEvaluationCode,
            penId: bodyObj.loanPreliminaryEvaluationId,
            customerGroupId: this.penApplicant.customerGroupId,
            customerGroupName: this.penApplicant.customerGroupName,
            customerGroupCode: this.penApplicant.customerGroupCode,
            customerTypeId: bodyObj.customerTypeId,
            accountNumber: bodyObj.accountNumber,
            taxIdentificationNumber: bodyObj.taxIdentificationNumber,
            registrationNumber: bodyObj.registrationNumber,
            existingExposure: bodyObj.existingExposure,
            regionId:bodyObj.regionId
        };

        if (bodyObj.sentForLoanApplication) {
            this.loadingService.show();
            this.loanApplService.sendForLoanApplication(selectedId, bodyObj).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success === true) {
                    this.displayPenApplForm = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.getPreliminaryEvaluations();
                    this.hideModal();
                    sessionStorage.setItem('customer-loan-details', JSON.stringify(dataObj));
                    this.router.navigate(['/credit/newloan/application']);
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        } else {
            this.updatePenApplication(selectedId, bodyObj);
        }
    }

    updatePenApplication(selectedId, bodyObj) {
        this.loadingService.show();
        this.loanApplService.updatePreliminaryEvaluation(selectedId, bodyObj).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.displayPenApplForm = false;
                this.hideModal();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.getPreliminaryEvaluations();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 5) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    hideModal() {
        this.selectedRecord = '';
        this.displayPenApplForm = false;
        this.activeIndex = 0;
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
                // loanApplicationId: this.penApplicant.loanPreliminaryEvaluationId,
                loanApplicationNumber: 'PEN',
                loanReferenceNumber: this.penApplicant.preliminaryEvaluationCode,
                documentTitle: this.uploadFileTitle,
                documentTypeId: '1', // TODO: 
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
            };
            this.loadingService.show();
            this.camService.uploadFile(this.file, body).then((val: any) => {
                ////console.log('val', val);
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = '';
                this.getSupportingDocumentsByRefNum(this.penApplicant.preliminaryEvaluationCode);
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log('error', error);
            });
        }
    }

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
    resetGrid(yes) {
        if (yes) this.hideModal();
    }

    
    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.approvalWorkflowData.TargetId;
        this.workflowTarget.operationId = this.operationId;
        //this.workflowTarget.toStaffId = this.applicationSelection.toStaffId; // optional
        //this.workflowTarget.responsiblePerson = this.applicationSelection.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.productClassId = null;
        this.workflowTarget.productId = null;
        // this.workflowTarget.currentApprovalLevel = this.applicationSelection.currentApprovalLevel; // required if toStaffId is given
        // this.workflowTarget.finalApprovalLevelId = this.applicationSelection.finalApprovalLevelId;
        this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }

}
