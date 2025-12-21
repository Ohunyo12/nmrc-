import { CustomerInformationDetailComponent } from '../../../customer/components';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CustomerService } from '../../../customer/services/customer.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { GlobalConfig, CustomerTypeEnum } from '../../../shared/constant/app.constant';
import { LoanReviewApplicationService } from 'app/credit/services';

@Component({
    // styles: [
    //     `legend {
    //             margin-left: 15px;
    //             margin-right: 15px;
    //         }
    //     }`
    // ],
    templateUrl: 'preliminary-evaluation.component.html',
})
export class PreliminaryEvaluationComponent implements OnInit, OnDestroy {
    regions: any;
    corporateEnumNumber: number;
    businessManager: any;
    relationshipManager: any;

    selectedCustomer: any = {};
    displayPenApplForm = false;
    penApplForm: FormGroup;
    customerName = 'Sample Customer';
    customers: any[];
    officers: any[];
    activeIndex = 0;

    // file upload
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    displayGrpCustomers = false;
    panelHeader: string;

    @ViewChild(CustomerInformationDetailComponent , {static: false}) customerInfoDetails: CustomerInformationDetailComponent;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private loanApplService: LoanApplicationService, private customerService: CustomerService,
        private router: Router,
        private reviewService: LoanReviewApplicationService,
        private camService: CreditAppraisalService) {

    }

    ngOnInit() {
        this.selectedCustomer = JSON.parse(sessionStorage.getItem('customer-loan-details'));
        let temp = this.selectedCustomer
        if (temp.customerGroupId != null) { 
            this.panelHeader = `Customer Group - ${temp.customerGroupName} - ${temp.customerGroupCode}`;
            this.displayGrpCustomers = true;
        } else {
            this.panelHeader = `Customer - ${temp.customerName} - ${temp.customerCode}`;
        }
        this.corporateEnumNumber = CustomerTypeEnum.CORPORATE;
        this.customerInfoDetails.viewSingleCustomerDetails(this.selectedCustomer.customerId);

        this.loadingService.show();
       // this.getAllOfficers();
        this.getRelationshipManager();
        this.getBusinessManager();
        this.loadPenApplForm();

        this.getRegions();
    }

    ngOnDestroy() {
        // sessionStorage.removeItem('customer-loan-details');
    }

    loadPenApplForm() {
        const cust = this.selectedCustomer;

        ////console.log('selectedCustomer', this.selectedCustomer);
        // cust.taxIdentificationNumber = cust.taxIdentificationNumber == null ?
        //     'NGN-TXN-9029090' : cust.taxIdentificationNumber;
        // cust.registrationNumber = cust.registrationNumber == null ?
        //     '9289830930' : cust.registrationNumber;
        cust.taxIdentificationNumber = cust.taxIdentificationNumber;
        cust.registrationNumber = cust.registrationNumber;

        let currentStaffInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        ////console.log('user info', currentStaffInfo);
        cust.relationshipOfficerId = cust.relationshipOfficerId == null ? currentStaffInfo.staffId : cust.relationshipOfficerId;
        cust.relationshipManagerId = cust.relationshipManagerId == null ? currentStaffInfo.staffId : cust.relationshipManagerId; // relationshipOfficerId;

        this.penApplForm = this.fb.group({
            projectDescription: ['', Validators.required],
            customerId: [cust.customerId],
            customerName: [cust.customerName],
            customerGroupId: [cust.customerGroupId],
            branchId: [cust.branchId],
            branchName: [cust.branchName],
            ownershipStructure: ['', Validators.required],
            clientDescription: ['', Validators.required],
            registrationNumber: [cust.registrationNumber, Validators.required],
            taxIdentificationNumber: [cust.taxIdentificationNumber, Validators.required],
            existingExposure: [cust.existingExposure, Validators.required],
            projectFinancingPlan: ['', Validators.required],
            bankRole: ['Lender', Validators.required],
            marketDemand: ['', Validators.required],
            loanApplicationtypeId: [this.selectedCustomer.customerTypeId, Validators.required],
            businessProfile: ['', Validators.required], 
            relatedCompanies: [''],
            collateralArrangement: ['', Validators.required],
            commercialViabilityAssessment: ['', Validators.required],
            environmentalImpact: ['', Validators.required],
            implementationArrangements: ['', Validators.required],
            portfolioStrategicAlignment: ['', Validators.required],
            proposedTermsAndConditions: ['', Validators.required],
            risksAndConcerns: ['', Validators.required],
            prudentialExposureLimitImplications: ['', Validators.required],
            relationshipManagerId: [cust.relationshipManagerId],
            relationshipOfficerId: [cust.relationshipOfficerId],
            sendForEvaluation: [''],
            productClassId: [cust.productClassId],
            subSectorId: [cust.subSectorId],
            loanAmount: [cust.loanAmount],
            loanTypeId: [cust.loanTypeId],
            capRegionId:['',Validators.required]
        }); // loanTypeId: [cust.loanTypeId]
        // this.getSupportingDocumentsByRefNum(cust.preliminaryEvaluationCode);
    }

    getAllOfficers() {
        this.loanApplService.getOfficers().subscribe((res) => {
            this.officers = res.result;
            this.loadingService.hide();
        });
    }

    getRelationshipManager() {
        const relateId = this.selectedCustomer.relationshipOfficerId;
        if(relateId != 0 && relateId != null){
            this.loanApplService.getRelationshipManager(relateId).subscribe((res) => {
                this.businessManager = res.result;
                this.loadingService.hide();
            });
        }
    }

    getBusinessManager() {
        const relateId = this.selectedCustomer.relationshipManagerId;
        this.loanApplService.getBusinessManager(relateId).subscribe((res) => {
            this.relationshipManager = res.result;
            this.loadingService.hide();
        });
    }

    showPenApplForm() {
        this.loadPenApplForm();
        // if (this.selectedCustomer.taxIdentificationNumber == null) {
        //     this.penApplForm.controls['taxIdenitificationNumber'].setValue();
        // }
        this.displayPenApplForm = true;
    }

    submitPreliminaryEvaluation(formObj) {
        const bodyObj = formObj.value;
        ////console.log('bodyObj', bodyObj);
        this.loadingService.show();
        this.loanApplService.addPreliminaryEvaluation(bodyObj).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.router.navigate(['/credit/loan/preliminary-evaluation/view']);
                this.activeIndex = 0;
               // this.router.navigate(['customer/customer-information']);
               // this.resetPENForm();
               // this.router.navigate(['/credit/loan/application/start']);
               // this.activeIndex = 0;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    resetPENForm(){
        this.penApplForm = this.fb.group({
            projectDescription: ['', Validators.required],
            customerId: [''],
            customerName: [''],
            customerGroupId: [''],
            branchId: [''],
            branchName: [''],
            ownershipStructure: ['', Validators.required],
            clientDescription: ['', Validators.required],
            registrationNumber: ['', Validators.required],
            taxIdentificationNumber: ['', Validators.required],
            existingExposure: ['', Validators.required],
            projectFinancingPlan: ['', Validators.required],
            bankRole: ['', Validators.required],
            marketDemand: ['', Validators.required],
            loanApplicationtypeId: ['', Validators.required],
            businessProfile: ['', Validators.required], 
            relatedCompanies: [''],
            collateralArrangement: ['', Validators.required],
            commercialViabilityAssessment: ['', Validators.required],
            environmentalImpact: ['', Validators.required],
            implementationArrangements: ['', Validators.required],
            portfolioStrategicAlignment: ['', Validators.required],
            proposedTermsAndConditions: ['', Validators.required],
            risksAndConcerns: ['', Validators.required],
            prudentialExposureLimitImplications: ['', Validators.required],
            relationshipManagerId: ['', Validators.required],
            relationshipOfficerId: ['', Validators.required],
            sendForEvaluation: [''],
            productClassId: [],
            subSectorId: [],
            loanAmount: [],
            loanTypeId: [],
            capRegionId:['']
        }); // loanTypeId: [cust.loanTypeId]
       
    }
    backToStart() {
        

    }

    startLoanAppHome() {
        // let data ={
        //     customerId : this.selectedCustomer.customerId,
        //     customerCode : this.selectedCustomer.customerCode,
        //     startLoanTypeId : this.selectedCustomer.startLoanTypeId,
        //     productClassProcessId: this.selectedCustomer.productClassProcessId,
        //     relationshipManagerId: this.selectedCustomer.relationshipManagerId,
        //     relationshipOfficerId: this.selectedCustomer.relationshipOfficerId,
        //     companyDirectors : this.selectedCustomer.companyDirectors,
        //     companyShareholders : this.selectedCustomer.companyShareholders,
        //     companyBvnInformation : this.selectedCustomer.companyBvnInformation,
        //     customerGroupId : this.selectedCustomer.customerGroupId,
        //     customerGroupName : this.selectedCustomer.customerGroupName,
        //     customerGroupCode : this.selectedCustomer.customerGroupCode,
        //     customerTopClients : this.selectedCustomer.customerTopClients,
        //     customerTopSuppliers : this.selectedCustomer.customerTopSuppliers,
        //     customerGroupMappings : this.selectedCustomer.customerGroupMappings,
        //     customerTypeId :this.selectedCustomer.customerTypeId,
        //     accountNumber : this.selectedCustomer.accountNumber,
        //     taxIdentificationNumber : this.selectedCustomer.taxIdentificationNumber,
        //     registrationNumber : this.selectedCustomer.registrationNumber,
        //     existingExposure : this.selectedCustomer.existingExposure,
        //     source : 'PEN'
        // }
       // sessionStorage.setItem('customer-loan-details', JSON.stringify(data));
        this.router.navigate(['/credit/loan/application/start']);
        this.activeIndex = 0;
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 3) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex =  this.activeIndex - 1;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
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
                // loanApplicationId: this.selectedCustomer.loanPreliminaryEvaluationId,
                loanApplicationNumber: 'PEN',
                loanReferenceNumber: this.selectedCustomer.preliminaryEvaluationCode,
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
                this.getSupportingDocumentsByRefNum(this.selectedCustomer.preliminaryEvaluationCode);
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log('error', error);
            });
        }
    }

    getSupportingDocumentsByRefNum(referenceNumber: any) {
        ////console.log('appl number', referenceNumber);
        this.camService.getSupportingDocumentByApplication(referenceNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
        }, (error) => {
            ////console.log('error', error);
        });
    }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId === id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
        ////console.log('this.binaryFile', this.binaryFile);
    }

    getRegions() {
        let regionTypeId = 1;
        this.reviewService.getRegions(regionTypeId).subscribe((response: any) => {
            this.regions = response.result;

        });
    }
}