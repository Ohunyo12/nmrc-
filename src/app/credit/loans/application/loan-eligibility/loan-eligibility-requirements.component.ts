import { saveAs } from 'file-saver';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { ChecklistService } from '../../../../setup/services/checklist.service';
import { GlobalConfig, JobSource } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyService } from '../../../../setup/services';
import { CustomerFinancialStatementComponent } from '../../../../shared/components/customer-financial-statement/customer-financial-statement.component';
import { CustomerService } from 'app/customer/services/customer.service';
import { CreditBureauSearchComponent } from '../../credit-bureau-search/credit-bureau-search.component';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { ChangeDetectorRef } from '@angular/core';

export enum Options {
  NotMet = 2,
  Met = 1,
  Waiver = 3,
  Deferred = 4
}

// export enum ChecklistType {
//   NotMet = 0,
//   Met = 1,
//   Waiver = 2,
//   Deferred = 3
// }

@Component({
    selector: 'app-eligibility-requirements',
    templateUrl: './loan-eligibility-requirements.component.html',
    providers: [
        CreditAppraisalService,
        LoadingService,
        LoanApplicationService,
        ChecklistService,
        CountryStateService,
        CurrencyService,
        CustomerService,
        UnifiedUnderwritingStandardService,
        //ChangeDetectorRef
    ]
})
export class LoanEligibilityRequirementsComponent implements OnInit {
    isCustomerTypeIndividual: boolean;
    show: boolean;
    cssClass: string;
    customerApplicationBureauList: any[];
    btnNullProperty: string;
    cancel: string;
    ok: string;
    width: string;
    message: string;
    applicationReferenceNumber: string;
    autoMapNew = true;
    loanApplicationLists: any[];
    loanApplicationReferance = 0;
    requestStatusId: number = 1;
    loanApplicationDetails: any[];
    displayRequestForm: boolean = false;
    requestPageHeaderTitle: string;
    isRequestReassigned: boolean;
    isRequestAcknowledged: boolean;
    requestComment: string;
    checklistModel: any[] = [];
    loanApplicationId: number;
    checklistDetailData: any[];
    displayCheckList: boolean = false;
    checklistStatusData: any[];
    cities: any[];
    filterState: any[];
    state: any[];
    country: any[];
    customerId: number;
    creditBureauForm: FormGroup;
    selectedCustomer: any = {};
    requestOperationsId: number = 2;
    bureauSearchTitle: string;
    applicationCustomerId: number;
    jobSourceId: number;
    productId: number = 0;
    productClassProcessId: number = 0;
    loanApplicationDetailId: number = 0;
    applicationId: number;
    requirementItems: boolean = false;
    selectedCustomerId: number;
    displayCollateral: boolean = false;
    selectedChecklist: any;
    displayCheckListDetails: boolean = false;
    checkListStatusId: number;
    operationId: number = 2;
    deferedDate: string;
    checklistDeffered: boolean = false;
    checklistNotProvided: boolean = false;
    checklistItem: string;
    checkListDetailList: any[];
    filteredChecklistDefinition: any[];
    fileDocument: any;
    collateralValue: number;
    allowForEdit: boolean = false;
    title: string;
    loanApplicationAmount: number;
    requairedCollateralValue: number;
    securityValue: number;
    loanCurrency: string;
    checkListIndex: number = 0;
    selectedCustomerName: string;
    selectedCustomerCode: string;
    @Output() selectedCustomerDetail: any = {};
    displayRMSuggestions: boolean = false;
    loanInitiatorSuggestionForm: FormGroup;
    @ViewChild(CustomerFinancialStatementComponent, { static: false }) customerFinancials: CustomerFinancialStatementComponent;
    @ViewChild(CreditBureauSearchComponent, { static: false }) creditBureauObj: CreditBureauSearchComponent;
    selectedApplicationDetail: any = {};
    loanApplicationList: Array<any> = [];
    isExternal: boolean = false;
    displayCreditBureauModal = false;
    startLoanTypeId: number = 0;
    customerGroupId: number = 0;
    colCurrencyId: number;
    colCurrencyCode: string;
    totalSecurity: number;
    currencies: any[];
    displayDocumentUpload: boolean = false;
    displayUpload: boolean = false;
    displayUploadOtherDocument: boolean = false;
    loanDocumentUploadList: any[] = [];
    binaryFile: string;
    selectedDocument: string;
    uploadFileTitle: string = null;
    physicalFileNumber: string = null;
    physicalLocation: string = null;
    documentTypeId: number = null;
    files: FileList;
    file: File;
    @ViewChild('fileInput', { static: false }) fileInput: any;
    allowFeeConcessionForEdit: boolean;
    loanDetailId: number;
    displayFinancialStatement: boolean = false;
    loanApplications = {};

    // UWS Modal Properties
    isUWSModalVisible: boolean = false;
    uwsList: any[] = [];
    selectedFiles: { [loanId: number]: File[] } = {};
    today: string;
    nhfNumber: any;

    constructor(
        private route: ActivatedRoute,
        private loadingService: LoadingService,
        private checklistService: ChecklistService,
        private countryService: CountryStateService,
        private fb: FormBuilder,
        private router: Router,
        private locationService: CountryStateService,
        private loanAppService: LoanApplicationService,
        private camService: CreditAppraisalService,
        private loanApplicationService: LoanApplicationService,
        private currencyService: CurrencyService,
        private custService: CustomerService,
        private underwritingService: UnifiedUnderwritingStandardService,
        private cdr: ChangeDetectorRef
    ) {
        this.jobSourceId = JobSource.LoanApplicationDetail;
        this.applicationId = +this.route.snapshot.params['applicationId'];
        this.initCreditBureau();
        this.InitApplicationDetail();
        this.initialiseSuggestionForm();
    }

    ngOnInit(): void {
        this.getApplication();
        this.loanApplicationdetailsList(this.applicationId);
        this.getAllCountry();
        this.getState();
        this.getLoanApplicationDetails();
        this.getAllCurrencies();
        this.fetchDisbursedObligors(this.nhfNumber);
    const now = new Date();
  this.today = now.toISOString().split('T')[0];
    }

    getApplication() {
        this.loanAppService.getApplication(this.applicationId)
            .subscribe((res) => {
                this.applicationCustomerId = res.result.customerId;
            });
    }

    gotoLoanApplication() {
        this.router.navigate(['/credit/newloan/application', this.applicationId]);
    }

    loanCollateralDetails() {
        this.getCollateralRequirement(this.applicationId);
    }

    getLoanApplicationDetails() {
        this.loadingService.show();
        this.loanApplicationService.getLoanApplicationinfo(this.applicationId)
            .subscribe((response: any) => {
                this.loanApplications = response.result;
                this.loanApplicationList = response.result;
                this.customerId = this.loanApplicationList[0].customerId;
                this.isExternal = this.loanApplicationList != null ? this.loanApplicationList.some(x => x.isExternal == true) : false;
                this.loadingService.hide();
            }, (err) => {
                console.error("error", err);
            });
    }

    onSubmitForCAM() {
        if (this.applicationId > 0) {
            this.loadingService.show();
            this.checklistService.validateChecklist(this.applicationId).subscribe((res) => {
                if (res.success == true) {
                    this.loanAppService.UpdateloanApplication(this.applicationId)
                        .subscribe((res) => {
                            this.loadingService.hide();
                            if (res.success == true) {
                                if (res.result != null) {
                                    this.checkListIndex = res.result.checkListIndex;
                                    if (res.result.jumpToDrawdown) {
                                        swal('Fintrak Credit360', 'Application was successful. Moved to drawdown.', 'success')
                                        this.router.navigate(['/credit/loan/booking/initiate-booking']);
                                    } else if (this.checkListIndex == 1) {
                                        this.router.navigate(['/credit/appraisal/credit-appraisal']);
                                    } else if (this.checkListIndex == 2) {
                                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.result.messageStr, 'error');
                                        return;
                                    } else if (this.checkListIndex == 3) {
                                        const __this = this;
                                        swal({
                                            title: 'Loan Checklist Requirement',
                                            text: res.result.messageStr + '\n' + 'This application will require that you raise CAM. Do you want to continue ',
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
                                            const body = {
                                                applicationId: __this.applicationId,
                                                checkListIndex: res.result.checkListIndex
                                            };
                                            __this.loanAppService.UpdateloanApplicationForCAM(body).subscribe((res) => {
                                                if (res.success === true) {
                                                    if (res.jumpToDrawdown) {
                                                        __this.router.navigate(['/credit/loan/booking/initiate-booking']);
                                                    } else {
                                                        __this.router.navigate(['/credit/appraisal/credit-appraisal']);
                                                    }
                                                } else {
                                                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                                                }
                                            });
                                        }, function (dismiss) {
                                            if (dismiss === 'cancel') {
                                                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
                                            }
                                        });
                                    }
                                }
                            } else {
                                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                                this.loadingService.hide();
                            }
                        });
                } else {
                    this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err: any) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
            });
        }
    }

    returnToStart() {
        this.router.navigate(['/credit/loan/loan-application-list']);
    }

    validateChecklist() {}

    CallRequestClose() {
        this.displayRequestForm = false;
    }

    getCollateralRequirement(applicationId, colCurrencyId?) {
        this.loanAppService.getCollateralRequirement(this.applicationId, colCurrencyId).subscribe((response: any) => {
            this.title = "Loan Collateral Values";
            this.loanCurrency = response.result.loanCurrency;
            this.loanApplicationAmount = response.result.loanAmount;
            this.requairedCollateralValue = response.result.requiredCollateral;
        });
    }

    saveUpdate() {
        let data = this.applicationDetail.value;
        this.loanAppService.updateLoanApplicationAmount(data)
            .subscribe((x) => {
                if (x.success === true) {
                    this.loanCollateralDetails();
                    this.closeUpdate();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, x.message, 'success');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
    }

    closeUpdate() {
        this.allowForEdit = false;
        this.loanApplicationdetailsList(this.applicationId);
    }

    applicationDetail: FormGroup;
    InitApplicationDetail() {
        this.applicationDetail = this.fb.group({
            loanApplicationId: ['', Validators.required],
            applicationDetailedId: ['', Validators.required],
            proposedRate: ['', Validators.required],
            proposedTenor: ['', Validators.required],
            proposedProductId: ['', Validators.required],
            proposedProductName: ['', Validators.required],
            proposedAmount: ['', Validators.required],
            customerName: ['', Validators.required]
        });
    }

    InitApplicationDetaildata(data) {
        this.applicationDetail = this.fb.group({
            loanApplicationId: [data.loanApplicationId],
            applicationDetailedId: [data.loanApplicationDetailId],
            proposedRate: [data.proposedInterestRate],
            proposedTenor: [data.proposedTenor],
            proposedProductId: [data.proposedProductId],
            proposedProductName: [data.proposedProductName],
            proposedAmount: [data.proposedAmount],
            customerName: [data.customerName]
        });
    }

    editRequest(i, data) {
        this.allowForEdit = true;
        this.loanCollateralDetails();
    }

    getSecurityValue(event: any) {
        this.getCollateralRequirement(this.applicationId, 2);
        this.colCurrencyCode = "NGN";
        this.totalSecurity = event;
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies()
            .subscribe((res) => {
                this.currencies = res.result;
            }, (err) => {
                console.error(err);
            });
    }

    getExchangeRateInvoice2(id) {
        // Placeholder for exchange rate logic
    }

    getRequestData(event: any) {
        if (event) {
            this.displayRequestForm = false;
        }
    }

    getStateByCountryId(id) {
        this.filterState = this.state.filter(x => x.countryId == +id);
    }

    getState() {
        this.locationService.getStates().subscribe((response: any) => {
            this.state = response.result;
            this.loadingService.hide();
        }, (err) => {
            console.error(err);
        });
    }

    getAllCountry() {
        this.countryService.getAllCountries()
            .subscribe((res) => {
                this.country = res.result;
            }, (err) => {
                console.error(err);
            });
    }

    gotoCollateralInformation() {
        this.displayCollateral = true;
        this.autoMapNew = true;
    }

    setCustomerTypeIndicator(id: number) {
        this.custService.getSingleCustomerGeneralInfoByCustomerId(id).subscribe((data) => {
            if (data.result.customerTypeId == 1) {
                this.isCustomerTypeIndividual = true;
            } else if (data.result.customerTypeId == 2) {
                this.isCustomerTypeIndividual = false;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    requireCollateral: boolean;
    productClassId: number;
    onRowSelect(event) {
        this.isCustomerTypeIndividual = null;
        this.setCustomerTypeIndicator(event.data.customerId);
        this.selectedCustomerDetail = event.data;
        this.loanCollateralDetails();
        this.selectedApplicationDetail = event.data;
        this.requirementItems = true;
        this.requireCollateral = event.data.requireCollateral;
        this.selectedCustomerId = event.data.customerId;
        this.loanApplicationId = event.data.loanApplicationId;
        this.loanApplicationDetailId = event.data.loanApplicationDetailId;
        this.applicationReferenceNumber = event.data.applicationReferenceNumber;
        this.productId = event.data.proposedProductId;
        this.productClassProcessId = event.data.productClassProcessId;
        this.productClassId = event.data.productClassId;
        this.requireCollateral = event.data.requireCollateral;
        this.selectedCustomerName = event.data.customerName;
        this.selectedCustomerCode = event.data.customerCode;
        this.InitApplicationDetaildata(event.data);
        this.getLoanDocumentsUploads(this.applicationReferenceNumber);
        let data = {
            customerId: event.data.customerId,
            loanApplicationId: event.data.loanApplicationId,
            productClassProcessId: event.data.productClassProcessId
        };
        this.populateLoanApplicationChecklist(data);
    }

    populateLoanApplicationChecklist(data) {
        this.loadingService.show();
        this.loanAppService.populateLoanApplicationChecklist(data).subscribe((response: any) => {
            this.loadingService.hide();
            response.result;
        }, (err) => {
            this.loadingService.hide();
        });
    }

    showRequestForm() {
        this.displayRequestForm = true;
    }

    onSelectedCity(id) {
        this.getAllCities(+id);
    }

    getAllCities(id: number) {
        this.locationService.getAllCitiesByStateId(id).subscribe((response: any) => {
            this.cities = response.result;
        }, (err) => {
            console.error(err);
        });
    }

    loanApplicationdetailsList(id) {
        this.loadingService.show();
        this.loanApplicationLists = [];
        this.loanAppService.loanApplicationdetails(id).subscribe((data) => {
            this.loanApplicationLists = data.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
            console.error('Error', err);
        });
    }

    getSingleLoanApplicationdetail(id) {
        this.selectedApplicationDetail = null;
        this.loanAppService.getSingleLoanApplicationdetail(id).subscribe((data) => {
            this.selectedApplicationDetail = data.result;
            console.log('Processed UUS List:', this.selectedApplicationDetail);
        });
    }

    initCreditBureau() {
        const cust = this.selectedCustomer;
        this.creditBureauForm = this.fb.group({
            companyName: new FormControl(cust.customerName, Validators.required),
            companyAddress: new FormControl('', Validators.required),
            taxRegistrationNumber: new FormControl('', Validators.required),
            rcNumber: new FormControl('', Validators.required),
            companyEmailAddress: new FormControl('', Validators.required),
            accountName: new FormControl(''),
            availableBalance: new FormControl(''),
            companyPhoneNumber: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            directorFullName: new FormControl('', Validators.required),
            directorEmail: new FormControl('', Validators.required),
            uploadScannedID: new FormControl('', Validators.required),
            quoteIDNumber: new FormControl('', Validators.required),
            iDType: new FormControl('', Validators.required),
            bVNNumbe: new FormControl('', Validators.required),
            senderIdUpload: new FormControl('', Validators.required),
            senderCoiUpload: new FormControl('', Validators.required)
        });
    }

    getLoanDocumentsUploads(applicationNumber: any) {
        this.loadingService.show();
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
            this.loanDocumentUploadList = response.result;
            this.loadingService.hide();
        });
    }

    viewDocument(id: number) {
        this.fileDocument = null;
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;
                this.displayUpload = true;
            }
        });
    }

    DownloadDocument(id: number) {
        this.fileDocument = null;
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;
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
                        var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                    }
                }
                if (myDocExtention == 'png') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                    }
                }
                if (myDocExtention == 'pdf') {
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
        });
    }

    showAddNewUpload() {
        this.displayDocumentUpload = true;
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
        if (this.file && this.uploadFileTitle) {
            const body = {
                loanApplicationNumber: this.applicationReferenceNumber,
                loanReferenceNumber: this.loanApplicationDetailId,
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: this.physicalFileNumber,
                physicalLocation: this.physicalLocation,
                documentTypeId: 1
            };
            this.loadingService.show();
            console.log('Upload started:', body);
            Promise.race([
                this.camService.uploadFile(this.file, body)
                    .then((response: any) => {
                        this.loadingService.hide();
                        console.log('Upload response:', response);
                        if (response.success) {
                            swal(
                                GlobalConfig.APPLICATION_NAME,
                                response.message || 'The record has been created successfully',
                                'success'
                            );
                            this.uploadFileTitle = null;
                            this.physicalFileNumber = null;
                            this.physicalLocation = null;
                            this.file = undefined;
                            this.fileInput.nativeElement.value = '';
                            this.displayDocumentUpload = false;
                            this.getLoanDocumentsUploads(this.applicationReferenceNumber);
                        } else {
                            swal(
                                GlobalConfig.APPLICATION_NAME,
                                response.message || 'Failed to upload the document',
                                'error'
                            );
                        }
                    })
                    .catch((error: any) => {
                        this.loadingService.hide();
                        console.error('Upload error:', error);
                        swal(
                            GlobalConfig.APPLICATION_NAME,
                            error.message || 'An unexpected error occurred while uploading the document',
                            'error'
                        );
                    })
            ]);
        }
    }

    viewConcession(item) {
        this.loanDetailId = item.loanApplicationDetailId;
        this.allowFeeConcessionForEdit = true;
    }

    viewFinancialStatement() {
        this.customerFinancials.displayFinancialStatement = true;
        this.customerFinancials.loadCustomerDetails(this.selectedCustomerId);
    }

    closeFeeConcession(event) {
        this.allowFeeConcessionForEdit = false;
    }

    initialiseSuggestionForm() {
        this.loanInitiatorSuggestionForm = this.fb.group({
            loanApplicationDetailId: [this.loanApplicationDetailId],
            conditionPrecedent: ['', Validators.required],
            conditionSubsequent: ['', Validators.required],
            transactionDynamics: ['', Validators.required]
        });
    }

    editSuggestionForm() {
        let row = this.selectedApplicationDetail;
        this.loanInitiatorSuggestionForm = this.fb.group({
            loanApplicationDetailId: [row.loanApplicationDetailId],
            conditionPrecedent: [row.conditionPrecedent, Validators.required],
            conditionSubsequent: [row.conditionSubsequent, Validators.required],
            transactionDynamics: [row.transactionDynamics, Validators.required]
        });
    }

    showSuggestionForm() {
        this.editSuggestionForm();
        this.displayRMSuggestions = true;
    }

    submitSuggestionForm(formObj) {
        let body = formObj.value;
        this.loadingService.show();
        this.loanAppService.loanApplicationDetailSuggestion(body).subscribe((x) => {
            this.loadingService.hide();
            if (x.success === true) {
                this.displayRMSuggestions = false;
                this.getSingleLoanApplicationdetail(body.loanApplicationDetailId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, x.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, x.message, 'error');
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    showCreditBureau() {
        this.creditBureauObj.display = true;
        this.creditBureauObj.showProceedToApplication = true;
        this.creditBureauObj.getCreditBureauCustomer(this.customerId, 0, false);
        this.creditBureauObj.customerGroupId = this.customerGroupId;
        this.creditBureauObj.LoanTypeId = this.startLoanTypeId;
        this.displayCreditBureauModal = true;
    }

    // UWS Modal Methods
    // fetchDisbursedObligors(nhfNumber: any) {
    //     debugger;
    //     console.log('Fetching UUS List for NHF Number:', this.selectedApplicationDetail.applicationReferenceNumber);
 
    //     this.underwritingService.getDisbursedObligorUus(nhfNumber).subscribe(
    //         response => {
    //             this.uwsList = response.result || [];
    //             console.log('Fetched UUS List:', response);
    //         },
    //         error => console.error('Error fetching UUS list:', error)
    //     );
    // }

// fetchDisbursedObligors(nhfNumber: string | number) {
//     this.loadingService.show();
//     if (nhfNumber === null || nhfNumber === undefined) {
//         console.warn('NHF Number is missing. API call aborted.');
//         return;
//     }

//     console.log('Fetching UUS List for NHF Number:', nhfNumber);

//     this.underwritingService.getDisbursedObligorUus(nhfNumber.toString()).subscribe(
//         (response) => {
//             this.loadingService.hide();
//             this.uwsList = response.result || [];
//             console.log('Fetched UUS List:', this.uwsList);
//         },
//         (error) => {
//             console.error('Error fetching UUS list:', error);
//         }
//     );
// }

// fetchDisbursedObligors(nhfNumber: string | number) {
//     this.loadingService.show();

//     if (nhfNumber === null || nhfNumber === undefined) {
//         console.warn('NHF Number is missing. API call aborted.');
//         this.loadingService.hide();
//         return;
//     }

//     console.log('Fetching UUS List for NHF Number:', nhfNumber);

//     this.underwritingService
//         .getDisbursedObligorUus(nhfNumber.toString())
//         .subscribe(
//             (response) => {
//                 this.loadingService.hide();

//                 this.uwsList = (response.result || []).map((uws: any) => ({
//                     ...uws,
//                     // convert backend checkListType to number so it matches radio value
//                     option: uws.
//                         checkTypes !== null && uws.
//                             checkTypes !== undefined
//                         ? Number(uws.
//                             checkTypes)
//                         : null,
//                         id: uws.ChecklistId ??uws.checklistId ?? uws.id,

//                     // keep deferredDate only if option is Deferred
//                     deferredDate:
//                         Number(uws.systemOption) === 3
//                             ? uws.deferredDate
//                             : null
//                 }));

//                 console.log('Fetched UUS List:', this.uwsList);
//             },
//             (error) => {
//                 this.loadingService.hide();
//                 console.error('Error fetching UUS list:', error);
//             }
//         );
// }

fetchDisbursedObligors(nhfNumber: string | number) {
    this.loadingService.show();

    if (nhfNumber === null || nhfNumber === undefined) {
        console.warn('NHF Number is missing. API call aborted.');
        this.loadingService.hide();
        return;
    }

    console.log('Fetching UUS List for NHF Number:', nhfNumber);

    this.underwritingService
        .getDisbursedObligorUus(nhfNumber.toString())
        .subscribe(
            (response) => {
                this.loadingService.hide();
            console.log('Fetching UUS List for NHF Number:', response.result);
                // this.uwsList = (response.result || []).map((uws: any) => {
                //     // Determine ID without using ?? (for older Angular versions)
                //     let resolvedId = null;
                //     if (uws.ChecklistId !== undefined && uws.ChecklistId !== null) {
                //         resolvedId = uws.ChecklistId;
                //     } else if (uws.checklistId !== undefined && uws.checklistId !== null) {
                //         resolvedId = uws.checklistId;
                //     } else if (uws.id !== undefined && uws.id !== null) {
                //         resolvedId = uws.id;
                //     }

                //     return {
                //         ...uws,
                //         id: resolvedId, // normalized ID
                //         // Convert backend systemOption to number to match radio values
                //         option: uws.systemOption !== null && uws.systemOption !== undefined
                //             ? Number(uws.systemOption)
                //             : null,
                //         // Keep deferredDate only if option is Deferred (3)
                //         deferredDate: Number(uws.systemOption) === 3
                //             ? uws.deferredDate
                //             : null,
                //         files: [] // initialize empty files array
                //     };
                // });
                this.uwsList = (response.result || []).map((uws: any) => {

                    let resolvedId = null;
                    if (uws.ChecklistId !== undefined && uws.ChecklistId !== null) {
                        resolvedId = uws.ChecklistId;
                    } else if (uws.checklistId !== undefined && uws.checklistId !== null) {
                        resolvedId = uws.checklistId;
                    } else if (uws.id !== undefined && uws.id !== null) {
                        resolvedId = uws.id;
                    }

                    const hasSystemOption =
                        uws.systemOption !== null && uws.systemOption !== undefined;

                    return {
                        ...uws,
                        id: resolvedId,

                        // radio value
                        option: hasSystemOption ? Number(uws.systemOption) : null,

                        // lock row if systemOption exists
                        isLocked: hasSystemOption,

                        deferredDate: Number(uws.systemOption) === 4
                            ? uws.deferredDate
                            : null,

                        files: []
                    };
                });

                console.log('Fetched UUS List:', this.uwsList);
            },
            (error) => {
                this.loadingService.hide();
                console.error('Error fetching UUS list:', error);
            }
        );
}







    // openUWSModal(): void {
    //     console.log('Fetched Loan List:', this.selectedApplicationDetail.applicationReferenceNumber);
    //     if (!this.selectedApplicationDetail) {
    //         swal('FinTrak Credit 360', 'Please select a loan application to view the UUS checklist.', 'warning');
    //         return;
    //     }
    //     this.loadingService.show();
    //     setTimeout(() => {
    //         this.isUWSModalVisible = true;
    //         this.loadingService.hide();
    //     }, 50);
        
    // }

    openUWSModal(applicationDetail: any): void {
    if (!applicationDetail.applicationReferenceNumber) {
        swal('FinTrak Credit 360', 'Please select a valid loan application.', 'warning');
        return;
    }

    this.selectedApplicationDetail = applicationDetail;
    console.log('Opening UWS Modal for Application Reference Number:', applicationDetail);

    // Pass the NHF number explicitly
    this.fetchDisbursedObligors(applicationDetail.applicationReferenceNumber);

    this.isUWSModalVisible = true;
}


    closeUWSModal(): void {
        this.clearForm();
        this.isUWSModalVisible = false;
    }

    clearForm(): void {
        if (!this.uwsList || this.uwsList.length === 0) {
            console.warn('uwsList is empty or undefined. Skipping clearForm.');
            return;
        }
        this.uwsList.forEach(uws => {
            uws.option = '';
            uws.deferredDate = '';
            uws.files = [];
            const fileInput = document.getElementById(`fileInput-${uws.id}`) as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
            const fileNameDisplay = document.getElementById(`fileNameDisplay-${uws.id}`);
            if (fileNameDisplay) {
                fileNameDisplay.textContent = 'No file selected';
            }
        });
    }

    async saveUWSDetails(): Promise<void> {
        if (!this.selectedApplicationDetail) {
            swal('FinTrak Credit 360', 'Please select a loan to submit the UUS checklist.', 'warning');
            return;
        }

        const filteredUwsList = this.uwsList.filter(uws => uws.option);
        if (filteredUwsList.length === 0) {
            swal('FinTrak Credit 360', 'At least one UUS checklist item is required for submission.', 'warning');
            return;
        }

        for (let uws of filteredUwsList) {
            if (uws.files && uws.files.length > 0) {
                for (let fileObj of uws.files) {
                    fileObj.fileContentBase64 = await this.convertFileToBase64(fileObj.file);
                }
            }
        }

        const body = filteredUwsList.map(uws => {
            const firstFile = uws.files && uws.files.length > 0 ? uws.files[0] : null;
            return {
                loanId: this.selectedApplicationDetail.loanApplicationDetailId,
                nhfNumber: this.selectedApplicationDetail.applicationReferenceNumber || null,
                item: uws.item,
                itemId: uws.id,
                description: uws.description,
                pmbId: 1,
                officerComment: uws.comment || '',
                deferDate: uws.option === 4 ? uws.deferredDate : '',
                option: uws.option || '',
                fileName: firstFile ? firstFile.fileName : '',
                fileType: firstFile ? firstFile.fileType : '',
                fileContentBase64: firstFile ? firstFile.fileContentBase64 : ''
            };
        });
         console.log('Prepared UUS Submission Body:', body);
     

        swal({
            title: 'Confirm UUS Checklist Submission',
            text: 'Are you sure you want to submit the Unified Underwriting checklist for this loan?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Submit',
            cancelButtonText: 'No, Cancel',
            allowOutsideClick: false
        }).then((confirmed) => {
            if (confirmed) {
                this.loadingService.show();
                this.underwritingService.postCustomerUus(body).subscribe(
                    response => {
                        this.loadingService.hide();
                        if (response && response.success) {
                            swal('FinTrak Credit 360', 'UUS checklist successfully submitted for the loan!', 'success')
                                .then(() => {
                                    this.closeUWSModal();
                                    this.loanApplicationdetailsList(this.applicationId);
                                });
                        } else {
                            console.error('Backend error:', response);
                            swal('FinTrak Credit 360', response.message || 'An error occurred while submitting the UUS checklist. Please try again.', 'error');
                        }
                    },
                    error => {
                        this.loadingService.hide();
                        console.error('API Error:', error);
                        swal('FinTrak Credit 360', error.message || 'An error occurred while submitting the UUS checklist. Please try again.', 'error');
                    }
                );
            }
        }).catch((reason) => {
            if (reason === 'cancel') {
                console.log('User cancelled the UUS checklist submission');
                swal('FinTrak Credit 360', 'UUS checklist submission cancelled.', 'info');
            }
        });
    }

    // onOptionChange(uws: any): void {
 
    //     if (uws.option !== '3') {
    //         uws.deferredDate = null;
    //     }
    //         if (uws.option !== 1) {
    //     uws.comment = null;
    // }
    // }

    onOptionChange(uws: any): void {

    // Clear deferred date unless Deferred (3)
    if (uws.option !== 4) {
        uws.deferredDate = '';
    }

    // Clear comment ONLY when Not Met (0)
    if (uws.option === 2) {
        uws.comment = '';
    }
}




    onDeferredDateChange(uws: any): void {
        // Optional: Add logic if needed for deferred date changes
    }

    onFileSelect(event: any, uwsId: number): void {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const uwsIndex = this.uwsList.findIndex(uws => uws.id === uwsId);
        if (uwsIndex !== -1) {
            if (!this.uwsList[uwsIndex].files) {
                this.uwsList[uwsIndex].files = [];
            }
            this.uwsList[uwsIndex].files = [];
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    this.uwsList[uwsIndex].files.push({
                        file: file,
                        fileName: file.name,
                        fileType: file.type,
                        fileContentBase64: base64String
                    });
                    const fileNameDisplay = document.getElementById(`fileNameDisplay-${uwsId}`);
                    if (fileNameDisplay) {
                        fileNameDisplay.innerText = this.uwsList[uwsIndex].files.map(f => f.fileName).join(', ') || 'No file selected';
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                reject(new Error('Invalid file: Not a Blob'));
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = () => reject(new Error('Error reading file'));
        });
    }

    mapOptionToEnum(option: string): Options {
        const mapping: { [key: string]: Options } = {
            '1': Options.Met,
            '0': Options.NotMet,
            '2': Options.Waiver,
            '3': Options.Deferred
        };
        return mapping[option] !== undefined ? mapping[option] : Options.Deferred;
    }
}