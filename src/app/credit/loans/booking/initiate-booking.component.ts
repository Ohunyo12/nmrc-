import { LoadingService } from '../../../shared/services/loading.service';
import { LoanService } from '../../services/loan.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { ConvertString, ProductTypeEnum, ProductClassEnum, JobSource, GlobalConfig, ApprovalStatusEnum, ProductLinesClassEnum, CollateralType } from '../../../shared/constant/app.constant';
import { CustomerService } from '../../../customer/services/customer.service';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { CustomerInformationDetailComponent } from '../../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { JobRequestViewComponent } from '../../job-request';
import { CasaService } from 'app/customer/services/casa.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import {  DrawdownSubmitionModel } from 'app/credit/models';
import { LoanApplicationService } from 'app/credit/services';
import { ProductService, CollateralService, StaffRoleService, StaffRealTimeSearchService } from 'app/setup/services';
import { Subject ,  fromEvent } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
//import { JobRequestViewComponent } from 'app/credit/components';
// import * as jspdf from 'jspdf';   
// import html2canvas from 'html2canvas'; 

@Component({
    selector: 'initiate-booking',
    templateUrl: 'initiate-booking.component.html',
    styles: [`
    .remove-btn{
        color:#bbb;
        font-size:27px;
        position:absolute;
        top:0;
        right:0;
    }
    `]
})

export class InitiateLoanBookingComponent implements OnInit {
    showCollateralInformation: boolean = false;
    showCasgBackForm: boolean = false;
    displayProjectRiskRatingModal: boolean = false;
    loanTypeId: any;
    collateralCustomerId: any;
    collateralTypeId: any;
    displayCollateralDetails: boolean;
    disbursableAmount: any;
    loanApplId: any;
    loanApplDetailId: any;
    file: any;
    files: any;
    loanApplicationDetailId: any;
    operationId: any; 
    displayTestReport: boolean=false;
    allowToAddInsurancePolicy: boolean=false;
    displayInitiationForm: boolean;
    jobSourceId: number;
    secondaryInfocaption: string;
    loanInfoUpdate: any;
    isGroup: boolean;
    pdfFile: any;
    applicationSelection:any;
    projectRiskRatingss: any[] = [];
    projectRiskRatingComputation: any[] = [];
    customerTier: any;
    
    pdfFileName: string;
    myDocExtention: string;
    displayDocument: boolean;
    selectedDocument: any;
    binaryFile: any;
    display: boolean = false; show: boolean = false; width: string; message: any; title: any; cssClass: any;
    loanApplication: any[];
    initiationForm: FormGroup;
    cashBackForm:  FormGroup;
    projectRiskRatingForm: FormGroup;
    inputTitleText = 'Customer Request Document';
    loans: any[] = [];
    employerRelatedLoans: any[] = [];
    loanSelection: any;
    customerSelection: any;
    formState: string = null;
    customerName: string;
    customerCode: string;
    feeTypeText: string;
    uploadFileTitle: string = "Customer Request Document";
    displayReport: boolean=false;
    supportingDocuments: any[] = [];
    disableApprovalsAndCommentsTab: boolean = false;
    applicantName: string;
    showCustomerCollaterals: boolean = false;
    customerCollaterals: any[];
    scheduleTitle: string = 'Generate Schedule';
    noDataDiv: string = 'no-data-div';
    casaAccountId: number;
    reload: number = 1;
    casaAccountText: string ='Customer Account';
    casaAccountTextProjectRelated: string ='Receiving/APG Account';
    casaAccount2Text: string;
    productLimit:number;
    documentations: any[] = [];
    projectRiskRatings: any = null;
    chargeFeeOnce: boolean;
    isProjectRelated: boolean;
    nextLevelId = 0;
    toStaffId: number;
    selectedApprover: string;

    readonly commentTitle: string = "CREDIT APPRAISAL COMMENTS";
    readonly commentTitle2: string = "DRAWDOWN COMMENTS";
    readonly CREDITAPPRIASALDOC: string ="CREDIT APPRAISAL DOCUMENTS";
    readonly DRAWDOWNDOC: string ="DRAWDOWN DOCUMENTS";

    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
    // @ViewChild(CollateralInformationViewComponent) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(JobRequestViewComponent, {static: false}) jobRequestViewObj: JobRequestViewComponent;
    casaAccountSelected: boolean;
    customerAccounts: any;
    isForeignExchangeLoan: boolean;
    isCommercialLoan: boolean;
    isScheduledLoan: boolean;
    isRevolvingLoan: boolean;
    isContingentLoan: boolean;
    isIDF: boolean;
    displayDocumentation: boolean;
    customerId: any;
    loanBookingRequestId: any;
    searchString: string;
    EmployerSearchString: string;
    // @ViewChild(forwardRef(() => ConditionChecklistComponent)) conditionChecklist: ConditionChecklistComponent;
    @ViewChild('approvalInPut', {static: false}) approvalInPut: ElementRef;
    @ViewChild('staffInPut', {static: false}) staffInPut: ElementRef;
    @ViewChild('customerInPut', {static: false}) customerInPut: ElementRef;
    numberOfUploadedFiles: number = 0;
    drawdownHtml: any;
    cashBackHtml: any;
    displayDrawdownDocument: boolean;
    ckEditorContent: any;
    // proposedCollateral:any[] = [];

    racSearchBaseId:any;
    racCategoryTypeId:any;

    isLienPlacementForLoan: boolean = false;
    allLiensArePlaced = false;

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    staffRoleRecord: any;
    apiRequestId: any;
    loanSource: string;
    displayMemberSearchForm: boolean = false;
    displayCustomerSearchForm: boolean = false;
    availableApprovers: any[] = [];
    displayApproverSearchForm = false;
    searchTerm$ = new Subject<any>();
    groupMembers: any[] = [];
    customers: any[] = [];
    isProspective: boolean = false;
    isUserLegal: boolean = false;
    proposedCollateral: any[] = [];
    isRegistrationDoneViaLoanApplication = 1;
       

    constructor(private customerService: CustomerService,
        private fb: FormBuilder,
        private loanBookingService: LoanService,
        private loadingSrv: LoadingService,
        private camService: CreditAppraisalService,
        private casaSrv: CasaService,
        private reportServ: ReportService, 
        private productService: ProductService,
        private sanitizer: DomSanitizer,
        private collateralService: CollateralService,
        private _loanApplServ: LoanApplicationService,
        private staffRole: StaffRoleService,
        private realSearchSrv: StaffRealTimeSearchService,
    ) { }

    ngOnInit() {
        this.loadingSrv.reset();
        this.jobSourceId = JobSource.LoanApplicationDetail;
        this.initializeControls();
        this.getAvailedLoanApplications();
        this.getReferedDrawdownRequests();
        this.getAllproducts();
        this.getUserRole();
        
    }

    refreshCollateral() {
        this.getProposedCollateral(this.loanSelection.loanApplicationId);
    }

    getProposedCollateral(loanApplicationId): void {

        this.collateralService.getProposedCustomerCollateral(loanApplicationId, this.loanSelection.currencyId).subscribe((response: any) => {
            this.proposedCollateral = response.result;

        });
    }

    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') { 
                    this.userIsAccountOfficer = true; 
                    this.allowToAddInsurancePolicy = true;
                }
                if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                    this.userIsRelationshipManager = true; 
                }

                if(this.staffRoleRecord.staffRoleShortCode == 'LEGAL') {
                    this.isUserLegal = true;
                }
                else {
                    this.isUserLegal = false;
                }
            });
    }

    getAvailedLoanApplications() {
        this.loadingSrv.show();
        this.loanBookingService.getAvailedLoanApplications()
            .subscribe((res) => {
                this.loanApplication = this.loans = res.result;
                if(this.loanApplication != null && this.loanApplication != undefined) this.loanApplication.slice;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide(1000);
            });
    }

    getGlobalApprovedEmployerApplications() {
        this.loadingSrv.show();
        this.employerRelatedLoans = [];
        this.loanBookingService.getGlobalApprovedEmployerApplications(this.EmployerSearchString)
            .subscribe((res) => {
                this.employerRelatedLoans = res.result;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide(1000);
            });
    }

    referedDrawdownItems:any[] = [];
    getReferedDrawdownRequests() {
        this.loadingSrv.show();
        this.loanBookingService.getInitiatedLoansAwaitingApproval()
            .subscribe((res) => {
                this.referedDrawdownItems = res.result;
                this.referedDrawdownItems.slice;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            });
    }
    
    products: any;
    getAllproducts() {
        this.loadingSrv.show();
        this.productService.getAllProducts()
            .subscribe((res) => {
                this.products =  res.result;
                this.products.slice;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            });
    }
 
    getCustomerByCustomerId(id: number) {
        this.customerService.getCustomerByCustomerId(id)
    }

    // getProposedCollateral(loanApplId, currencyId): void {
    //     this.loadingSrv.show();
    //     this.collateralService.getProposedCustomerCollateral(loanApplId, currencyId).subscribe((response: any) => {
    //         this.loadingSrv.hide();
    //         this.proposedCollateral = response.result;
    //     });
    // }

    closeCollateralDetaits(event) {
        if (event)
            this.showCollateralInformation = false;
    }

    ViewCollateralDetails(index_data) {
        this.showCollateralInformation = true;
        this.collateralCustomerId = index_data.collateralCustomerId;
        this.reload++;
    }

    reAssignResultToLoan(data) {
        this.loanSelection = data;
        
    }

    
    isMultipleDrawdown: boolean;
    multiplefacilities: any;
    getApplicationFacilities(){
        this.multiplefacilities = this.loans.filter(x=>x.applicationReferenceNumber == this.searchString);
    }

    setMultipleDrawdown(value){
        if(value) { 
            this.isMultipleDrawdown = true; 
        }
        else { 
            this.isMultipleDrawdown = false; 
            this.multiplefacilities == null; 
        }
    }

    showProceedButtton: boolean;
    drawdownFacilitiesInformation: any[] = [];
    approvalStatusId: number = 0;
    pushSelectedLoans(row){ 
        this.approvalStatusId = row.data.approvalStatusId;
        if (row.data.customerAvailableAmount == 0 && row.data.approvalStatusId != ApprovalStatusEnum.Referred) {
            swal('', 'Available amount is zero. Loan may have been booked and currently undergoing approval', 'info');
            return;
        }
        if (row.data.expiryDate != null && (row.data.expiryDate <= row.data.systemCurrentDate) 
            && row.data.productTypeId == ProductTypeEnum.CommercialLoans ){
                swal('', 'The selected Commercial Loan tenor has expired', 'info');
                return;
        }
        
        this.drawdownFacilitiesInformation.push(row.data);
        this.loanSelection = this.drawdownFacilitiesInformation;
        this.showProceedButtton = true;
        this.loadingSrv.hide();
    }

    GetLoanDataFromMultiple(){
        
    }

    popSelectedLoans(row) {
        var record = row.data;
        var index = this.drawdownFacilitiesInformation.findIndex(x=>x.loanApplicationDetailId == record.loanApplicationDetailId)
        this.drawdownFacilitiesInformation.splice(index,1);
        if(this.drawdownFacilitiesInformation.length <= 0){
            this.showProceedButtton =false;
        }
    }

    proceedFirstOfSelectedMultiples() { 
        var firstRow = this.loanSelection.filter(x=>x.loanApplicationDetailId == this.drawdownFacilitiesInformation[0].loanApplicationDetailId);
        this.onSelectedLoanChange(firstRow[0]);
    }

    onRowPrepared(e) {
        if (e.rowType == 'data' && e.data.approvalStatusId == ApprovalStatusEnum.Referred) {
            e.rowElement.style.backgroundColor == 'yellow';
            e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
        }
    }

    racProductClassId: number = null;
    racCurrencyId: any = null;
    searchBasePlaceholder:any; // ="PRODUCTCLASS";
    productId:any = null;
    filteredProducts: any;

    onSelectedLoanChange(data) {
        this.loanApplicationDetailId = data.loanApplicationDetailId;
        this.operationId = data.operationId; 
        this.loanBookingRequestId = data.loanBookingRequestId; 
        this.apiRequestId = data.apiRequestId;
        
        this.getAllProjectRiskRating(data.loanApplicationId, data.loanApplicationDetailId,data.loanBookingRequestId);
        this.getAllProjectRiskRatingComputation(data.loanApplicationId, data.loanApplicationDetailId,data.loanBookingRequestId);
                
        //this.customerCode = data.customerCode;
        this.loanSelection = data;
        this.setLienPlacementForLoan(data.loanCollateral);
        this.approvalStatusId = data.approvalStatusId;
        if (this.loanSelection.customerAvailableAmount == 0 && data.approvalStatusId != ApprovalStatusEnum.Referred) {
            swal('', 'Available amount is zero. Loan may have been booked and currently undergoing approval', 'info');
            this.loadingSrv.hide();
            return;
        }
       
        if (this.loanSelection.expiryDate != null && (this.loanSelection.expiryDate <= this.loanSelection.systemCurrentDate) 
            && this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans ){
                swal('', 'The selected Commercial Loan tenor has expired', 'info');
                this.loadingSrv.hide();
                return;
        }


        if(this.loanSelection.productClassId == ProductClassEnum.CREDITCARD) {
            this.searchBasePlaceholder = 'CREDITCARD';
        }
        else {
            this.searchBasePlaceholder = 'PRODUCTCLASS';

        }
        this.racProductClassId = this.loanSelection.productClassId;
        this.racCurrencyId = this.loanSelection.currencyId;
        this.productId = this.loanSelection.productId;

        if (this.loanSelection.customerType != null && this.loanSelection.customerType.toLowerCase() === 'corporate') {
            this.secondaryInfocaption = 'Company Executives';
        } 
        else {
            this.secondaryInfocaption = 'Other Information';
        }

        if(this.products != null && this.products != undefined) {
            if(this.loanSelection.productClassId == ProductLinesClassEnum.IMPORTFINANCEFACILITY || this.loanSelection.productClassId == ProductLinesClassEnum.INVOICEDISCOUNTINGFACILITY){
                this.filteredProducts = this.products; 
            }else{ 
                this.filteredProducts = this.products.filter(x=>x.productClassId == this.loanSelection.productClassId);
            }
        }

        this.initiationForm.controls['productId'].setValue(this.loanSelection.productId);

        if(!this.loanSelection.customerId === null || this.loanSelection.customerId != 0) {  this.customerId = this.loanSelection.customerId }

        if (!this.loanSelection.customerGroupId === null || this.loanSelection.customerGroupId != 0) {
            this.isGroup = true;
            this.customerId = this.loanSelection.customerGroupId;
        }
        this.previewDocumentation(false);
        this.setLoanByProductTypes();
        this.popoverSeeMore();
        this.customerService.fetchAndAddCustomerAccounts(this.loanSelection.customerId).subscribe((response: any) => {});
        this.getLoanCustomerAccounts(this.loanSelection.customerId);
        // this.getDrawdownMemoHtml(data.loanApplicationDetailId);
        this.getCashBackMemoHtml(data.appraisalOperationId, data.loanApplicationDetailId);
        this.displayInitiationForm = true;
        this.displayCollateralDetails = false;
        this.workingLoanApplication = data.applicationReferenceNumber;// + ' ' + appl.applicantName;

        this.applicantName = this.loanSelection.applicantName;
        this.customerName = this.loanSelection.customerName;
        this.customerCode = this.loanSelection.customerCode;
        this.loanTypeId = this.loanSelection.loanTypeId;
        this.loanApplId = this.loanSelection.loanApplicationId;
        this.loanApplDetailId = this.loanSelection.loanApplicationDetailId;

        

        this.initiationForm.controls['approvedAmount'].setValue(ConvertString.ToNumberFormate(this.loanSelection.approvedAmount));

        this.disbursableAmount = this.loanSelection.approvedAmount - this.loanSelection.allRequestAmount;
        if(this.disbursableAmount < 0)this.disbursableAmount = 0;

        this.initiationForm.controls['availableAmount'].setValue(ConvertString.ToNumberFormate(this.disbursableAmount));

        this.initiationForm.controls['amountToBook'].setValue(ConvertString.ToNumberFormate(data.requestedAmount));
        //this.initiationForm.controls['tenor'].setValue(ConvertString.ToNumberFormate(data.approvedTenor));

        this.setEditableStatus();
        this.getLoanApplicationCollateral(this.loanSelection.loanApplicationId);
        //this.getSupportingDocuments(this.loanSelection.applicationReferenceNumber);

        if (this.apiRequestId == null) {
            this.loanSource = "Credit360 Portal";
        }
        else {
            this.loanSource = "Cashflow Portal";
        }

        // console.log("this.customerCode: ", this.customerCode);
        // alert(this.customerCode);

        if (this.customerCode.search("PROS") == -1) {
            this.isProspective = false;
        }
        else {
            this.isProspective = true;
        }
    }

    // validateTenor(tenor) { 
    //             let amt = ConvertString.TO_NUMBER(tenor);
    //             if (this.loanSelection.approvedTenor < amt) {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Inputed tenor must not be greater than the approved tenor ' + this.loanSelection.approvedTenor, 'error');
    //             return;
    //         }
  
    // }

    setLienPlacementForLoan(loanCollaterals: any[]) {
        if (loanCollaterals != null && loanCollaterals != undefined) {
            if (loanCollaterals.length > 0) {
                loanCollaterals.forEach(item => {  
                    if (item.collateralTypeId == CollateralType.FIXED_DEPOSIT || item.collateralTypeId == CollateralType.CASA)
                        {
                            this.isLienPlacementForLoan = true;
                        }  
                }); 
            } 
        }
    }

    editCashBack(){
    this.showCasgBackForm = true;
    }

    submitCashbackForm(form) {
        this.loadingSrv.show();
        let body = {
            background: form.value.background,
            issues: form.value.issues,
            request: form.value.request,
            loanApplicationDetailId: this.loanApplicationDetailId,
            operationId: this.operationId, 
        };
    
            this.loanBookingService.saveCashbackTemplate(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCashBackMemoHtml(this.operationId, this.loanApplicationDetailId);
                    this.showCasgBackForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
    }

     finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingSrv.hide();
    }

    finishGood(message) {
        this.loadingSrv.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    setEditableStatus(){
        this.initiationForm.controls['approvalStatusId'].setValue(this.loanSelection.approvalStatusId);
        this.initiationForm.controls['loanBookingRequestId'].setValue(this.loanSelection.loanBookingRequestId);
        this.initiationForm.controls['operationId'].setValue(this.loanSelection.operationId);
        if(this.loanSelection.approvalStatusId == ApprovalStatusEnum.Referred){
            //TODO: Initilize the form fields with values
            
            this.filteredProducts = this.products.filter(x=>x.productClassId == this.loanSelection.productClassId);

            this.initiationForm.controls['productId'].setValue(this.loanSelection.productId);
            this.data.bookingAmount= ConvertString.ToNumberFormate(this.loanSelection.requestedAmount);

            this.initiationForm.controls['casaAccountId'].setValue(this.loanSelection.casaAccountId);
            
            ( this.loanSelection.casaAccountId != null && this.loanSelection.casaAccountId > 0 )  
                                ? this.casaAccountSelected = true 
                                : this.casaAccountSelected = false;
        }
    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanBookingService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanSelection.loanCollateral = data.result;
        }, err => { });
    }

    getSupportingDocuments(applicationNumber: any) {
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
           // this.supportingDocuments = response.result;
            this.loadingSrv.hide();
        });
    }

    SaveActiveRecordAmount(form) {
        this.loanSelection.bookingAmountRequested = form.value.amountToBook;
        //this.drawdownFacilitiesInformation.find(x=>x.l)
        this.drawdownFacilitiesInformation.slice; 
    }

    previewDocumentation(print = false) {
        this.loadingSrv.show(); 
        // this.camService.getDocumentation(6, this.loanSelection.loanApplicationId).subscribe((response: any) => { 
        this.camService.getDocumentation(this.operationId, this.loanSelection.loanApplicationId).subscribe((response: any) => { 
            if(response.success){
            this.documentations = response.result; 
            this.documentations.slice;
            this.loadingSrv.hide();
            if (print == false) this.displayDocumentation = true;
            else setTimeout(() => this.print(), 5000);
            }
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    reportSrc: SafeResourceUrl;
    popoverSeeMore() {
        if (this.loanSelection.applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: this.loanSelection.applicationReferenceNumber,

            }
           

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
               console.log(path)
            });
          
            return;
        }
    }

    resetofferLetterChecklist(event){
        this.offerLetterChecklistIndex = 0;
        this.offerLetterChecklistIndex = 0;
        this.offerLetterChecklistIndex = 0;
        this.offerLetterChecklistIndex = 0;
    }

    offerLetterChecklistIndex = 0;
    offerLetterChecklist() { 
        this.offerLetterChecklistIndex = this.loanSelection.loanApplicationId;
        // this.conditionChecklist.viewOfferLetterChecklist(this.loanSelection.loanApplicationId);
    }

    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    workingLoanApplication: string = null;
    print(): void {
        let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.workingLoanApplication;
        let printContents, popupWin;

        let content = '<div class="row">';
        this.documentations.forEach(x => {
            content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
        });
        //content = content + '</div>';

        printContents = content;// document.getElementById('print-section').innerHTML;
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

    printDrawdownMemo(): void {
        let printTitle = 'DRAWDOWN APPROVAL MEMO';
        let printContents, popupWin;

        printContents = document.getElementById('print-drawdon-section').innerHTML;
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



    setLoanByProductTypes(){
        if (this.loanSelection.productTypeId === ProductTypeEnum.Revolving) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = true;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.TermLoan 
            || this.loanSelection.productTypeId === ProductTypeEnum.SelfLiquidating
            || this.loanSelection.productTypeId === ProductTypeEnum.SyndicatedLoan) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = true;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
            if(this.loanSelection.isLocalCurrency && this.loanSelection.productClassId == !ProductClassEnum.INVOICEDISCOUNTINGFACILITY){
                this.casaAccountText = 'Fee Account';
            }
            if(this.loanSelection.productClassId == ProductClassEnum.INVOICEDISCOUNTINGFACILITY)
            {
                this.isIDF=true;
                this.casaAccountText = 'Collection Account';
            }
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.CommercialLoans) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = true;
            this.isForeignExchangeLoan = false;
            this.casaAccountText = 'Receiving Account';
            this.casaAccount2Text = 'Paying Account';
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.ForeignExchangeRevolvingFacility) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = true;
            this.casaAccountText = 'Fee Account';
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.ContingentLiability) {
            this.isContingentLoan = true;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
        }
    }


    // onFileChange(event) {
    //     this.files = event.target.files;
    //     this.file = this.files[0];
    // }
    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
          this.initiationForm.patchValue({ fileInput: file });
          const fileInputControl = this.initiationForm.get('fileInput');
          if (fileInputControl) {
            fileInputControl.markAsTouched();
          }
        }
      }
      

    sendToInitiationPoolForNextLevel(){
        this.initiateDrawdownModelsForNextLevel = [];
        let entries = this.initiationForm.value; 
        if(this.isMultipleDrawdown){
            this.drawdownFacilitiesInformation.forEach(item => {
                if(item.bookingAmountRequested <= 0.00 ) {
                    swal('Fintrak Credit360', 'One or more records has zero request amount.','info');
                    return;
                }
                let body = {
                    loanApplicationId: item.loanApplicationId,
                    amount_Requested: item.bookingAmountRequested,
                    loanApplicationDetailId: item.loanApplicationDetailId,
                    casaAccountId: entries.casaAccountId,
                    casaAccountId2: entries.casaAccountId2,
                    productId: entries.productId,
                    approvalStatusId : entries.approvalStatusId,
                    loanBookingRequestId: entries.loanBookingRequestId,
                    operationId: entries.operationId,
                    isLienPlacementForLoan: this.isLienPlacementForLoan,
                    chargeFeeOnce : this.chargeFeeOnce,
                    comment: entries.comment,
                    //tenor: entries.tenor,
                    rac : this.rac
                }
                this.initiateDrawdownModelsForNextLevel.push(body);
            });
        }
        else {
            let entries = this.initiationForm.value;

            let body = {
                loanApplicationId: this.loanSelection.loanApplicationId,
                amount_Requested: this.initiationForm.value.amountToBook,
                loanApplicationDetailId: this.loanSelection.loanApplicationDetailId,
                casaAccountId: entries.casaAccountId,
                casaAccountId2: entries.casaAccountId2,
                productId: entries.productId,
                approvalStatusId : entries.approvalStatusId,
                loanBookingRequestId: entries.loanBookingRequestId,
                operationId: entries.operationId,
                isLienPlacementForLoan: this.isLienPlacementForLoan,
                chargeFeeOnce : this.chargeFeeOnce,
                customerId : this.requestCustomerId,
                comment: entries.comment,
                //tenor: entries.tenor,
                rac : this.rac,
            }
            this.initiateDrawdownModelsForNextLevel.push(body);
        }
    }

    sendToInitiationPool(){

        this.initiateDrawdownModels = [];
        let entries = this.initiationForm.value; 
        if(this.isMultipleDrawdown){
            this.drawdownFacilitiesInformation.forEach(item => {
                if(item.bookingAmountRequested <= 0.00 ) {
                    swal('Fintrak Credit360', 'One or more records has zero request amount.','info');
                    return;
                }
                let body = {
                    loanApplicationId: item.loanApplicationId,
                    amount_Requested: item.bookingAmountRequested,
                    loanApplicationDetailId: item.loanApplicationDetailId,
                    casaAccountId: entries.casaAccountId,
                    casaAccountId2: entries.casaAccountId2,
                    productId: entries.productId,
                    approvalStatusId : entries.approvalStatusId,
                    loanBookingRequestId: entries.loanBookingRequestId,
                    operationId: entries.operationId,
                    isLienPlacementForLoan: this.isLienPlacementForLoan,
                    chargeFeeOnce : this.chargeFeeOnce,
                    comment: entries.comment,
                    //tenor: entries.tenor,
                    rac : this.rac,
                    toStaffId: this.toStaffId,
                    isFromPc: true
                }
                this.initiateDrawdownModels.push(body);
            });
        }
        else {
            let entries = this.initiationForm.value;
            if(this.initiationForm.value.amountToBook <= 0){
                swal('Fintrak Credit 360','The approved amount has been fully requested.','info');
                return;
            }
            if (this.initiationForm.value.amountToBook > this.disbursableAmount) {
                swal('Fintrak Credit360','The requested amount is higher than disbursable amount','info');
                return;
            }
            if (entries.amountToBook < 0) {
                swal('Fintrak Credit360','Zero amount not allowed','info');
                return;
            }

            let body = {
                loanApplicationId: this.loanSelection.loanApplicationId,
                amount_Requested: this.initiationForm.value.amountToBook,
                loanApplicationDetailId: this.loanSelection.loanApplicationDetailId,
                casaAccountId: entries.casaAccountId,
                casaAccountId2: entries.casaAccountId2,
                productId: entries.productId,
                approvalStatusId : entries.approvalStatusId,
                loanBookingRequestId: entries.loanBookingRequestId,
                operationId: entries.operationId,
                isLienPlacementForLoan: this.isLienPlacementForLoan,
                chargeFeeOnce : this.chargeFeeOnce,
                customerId : this.requestCustomerId,
                comment: entries.comment,
                //tenor: entries.tenor,
                rac : this.rac,
                toStaffId: this.toStaffId,
            }
            this.initiateDrawdownModels.push(body);
        }
        // let body = {
        //     loanApplicationId: this.loanSelection.loanApplicationId,
        //     amount_Requested: this.initiationForm.value.amountToBook,
        //     loanApplicationDetailId: this.loanSelection.loanApplicationDetailId,
        //     casaAccountId: entries.casaAccountId,
        //     casaAccountId2: entries.casaAccountId2
        // }

        // this.initiateDrawdownModels.push(body);
    }

    submitEvent: number = 0;
    rac: any;
    setRacValues(rac) {
        this.rac = rac;
        this.fireRequest();
    }

    initiateDrawdownModels: DrawdownSubmitionModel[] = [];
    initiateDrawdownModelsForNextLevel: DrawdownSubmitionModel[] = [];
    // initiateDrawdown() {
    //     const __this = this;
    //     __this.sendToInitiationPool();
        
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
    //         __this.loadingSrv.show();
    //         __this._loanApplServ.validatePrecedenceChecklistCompleted(__this.loanSelection.loanApplicationId).subscribe((res) => {
    //             if (res.success == true) {
    //                 __this.submitEvent++;
    //             } else {
    //                // __this.displayLetterAcceptanceModal = false;
    //                __this.loadingSrv.hide();
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

    fireRequest() {
        this.submitEvent = 0;
        this.loanBookingService.initiateBooking(this.initiateDrawdownModels, this.loanSelection.loanApplicationId)
        .subscribe((res) => {
            if (res.success === true) {
                this.displayInitiationForm = false;
                //this.getSupportingDocuments(this.loanSelection.applicationReferenceNumber);
                this.getAvailedLoanApplications();
                this.initializeControls();
                swal('Fintrak Credit 360', res.message, 'success');
                this.loadingSrv.hide();
                this.closeDialog();

            } else { swal('Fintrak Credit360',res.message,'error');  this.loadingSrv.hide();}

        }, (err) => { this.loadingSrv.hide(); swal('Fintrak Credit360',err.message,'error');
    })
    
    }

    selectApprover() {
        this.sendToInitiationPoolForNextLevel();
        this.loadingSrv.show();
        this.loanBookingService.getNextLevelForInitiateBooking(this.initiateDrawdownModelsForNextLevel, this.loanSelection.loanApplicationId)
            .subscribe((res) => {
                if (res.success == true) {
                    this.nextLevelId = res.data;
                    this.displayApproverSearchForm = true;
                    this.loadingSrv.hide();

                } else { swal('Fintrak Credit360', res.message, 'error'); this.loadingSrv.hide(); }

            }, (err) => {
                this.loadingSrv.hide(); swal('Fintrak Credit360', err.message, 'error');
            });
    }
    
    isChecked: boolean = false;
      changed = (evt) => {    
        this.isChecked = evt.target.checked;
        if(this.isChecked && (this.projectRiskRatingss.length == 0 || this.projectRiskRatingss == null || this.projectRiskRatingss == undefined)){
            this.getAllProjectRiskRatingCriteria();
            this.displayProjectRiskRatingModal = true;
        }
    }

    initiateDrawdown() {
        if ((this.projectRiskRatingss == null || this.projectRiskRatingss.length == 0) && this.isChecked == true){
            this.getAllProjectRiskRatingCriteria();
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please kindly fill Project Risk Rating form!', 'error');
            this.displayProjectRiskRatingModal=true;
            return;
        }

        const __this = this;
        __this.sendToInitiationPool();
        
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
            __this.loadingSrv.showKeyApiCall();
            __this._loanApplServ.validatePrecedenceChecklistCompleted(__this.loanSelection.loanApplicationId)
            .subscribe((res) => {
                if (res.success == true) {
                    __this.loadingSrv.showKeyApiCall();
                    __this.loanBookingService.initiateBooking(__this.initiateDrawdownModels, __this.loanSelection.loanApplicationId)
                        .subscribe((res) => {
                            if (res.success == true) {
                                __this.displayInitiationForm = false;
                                //__this.getSupportingDocuments(__this.loanSelection.applicationReferenceNumber);
                                __this.getAvailedLoanApplications();
                                __this.initializeControls();
                                swal('Fintrak Credit 360', res.message, 'success');
                                __this.closeDialog();

                            } else { 
                                swal('Fintrak Credit360',res.message,'error');  
                            }
                            __this.loadingSrv.hideKeyApiCall();
                        }, (err) => { 
                            __this.loadingSrv.hideKeyApiCall(1000); 
                            swal('Fintrak Credit360',err.message,'error');
                    });
                } else {
                   // __this.displayLetterAcceptanceModal = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please complete offer letter checklist to continue', 'error');
                }
                __this.loadingSrv.hideKeyApiCall();
            }, (err) => { 
                swal('Fintrak Credit360',err.message,'error');
                __this.loadingSrv.hideKeyApiCall(1000); 
        });
          
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
        
    }

    //..........DOCUMENT UPLOAD AND MANAGEMENT SECTION...................
    @ViewChild('fileInput', {static: false}) fileInput: any;
    @Input() moduleId: number;
    @Input() moduleReferenceNumber: number;

    uploadFile(sourceId): boolean {
        if (this.file != undefined || this.uploadFileTitle != null) {
            
            let body = {

                loanApplicationId: this.loanSelection.loanApplicationId,
                loanApplicationNumber: this.loanSelection.applicationReferenceNumber,
                loanReferenceNumber: '',
                documentTitle: this.uploadFileTitle,
                sourceId: sourceId,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: '5',
            };

            this.camService.uploadFile(this.file, body).then((val: any) => {
                if (val['success']) {
                    return true;

                } else {
                    
                    return false;
                }

            }, (error) => {
                this.loadingSrv.hide(1000);
                swal('Customer Request', JSON.stringify(error), 'error')
                this.initializeControls();
                return false;
            });
            return true;
        }
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    getLoanCustomerAccounts( customerId:number) {
        this.loadingSrv.show();        
        this.casaSrv.getAllCustomerAccountByCustomerId(customerId).subscribe((data) => {
            this.loadingSrv.hide();
            this.customerAccounts = data.result;
        }, err => { 
            this.loadingSrv.hide(1000);
        });
    }

    onCustomerAccountChange(id): void {
        let account = this.customerAccounts.filter(x => x.casaAccountId == id);

        if (this.loanSelection.currencyId != account[0].currencyId){
            swal('Fintrak Credit 360','You need a ' + this.loanSelection.currencyCode + ' account for this transaction.');
            this.initiationForm.controls['casaAccountId'].setValue("");
        }
        else if ((Number(id) > 0 && id != null)){
            this.casaAccountSelected = true;
        }
        // else{
        //     this.casaAccountSelected = false;
        //     this.finishBad('Select the customer account');
        // }
    }

    showDialog() {
        this.initializeControls();
        this.display = true;
    }

    closeDialog() {
        this.initializeControls();
        this.displayInitiationForm = false
        this.isContingentLoan = false;
        this.isRevolvingLoan = false;
        this.isScheduledLoan = false;
        this.isCommercialLoan = false;
        this.isForeignExchangeLoan = false;
        this.showBeneficiary = false;
        this.isIDF=false;
        this.submitEvent =0;
        this.casaAccount2Text = '';
        if(this.multiplefacilities != null) {
            this.multiplefacilities.splice(0);
        }
         
        this.drawdownFacilitiesInformation.splice(0); 
        this.isMultipleDrawdown = false;
        this.showProceedButtton = false;
        this.casaAccountText = 'Customer Account';

        
    }

    initializeControls() {
        this.initiationForm = this.fb.group({
            // docDescription: ['Customer Request Form', Validators.required],
            approvedAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            availableAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            amountToBook: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            casaAccountId: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            casaAccountId2: [''],
            productId:['', Validators.compose([ValidationService.isNumber, Validators.required])],
            approvalStatusId : [''],
            loanBookingRequestId: [''],
            operationId: [''],
            racCategoryTypeId: [''],
            comment:['', Validators.required],
            isProjectRelated: [''],
            // fileInput: [null, Validators.required]
            //tenor: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
   
        });

         this.cashBackForm = this.fb.group({
            background: ['', Validators.required],
            issues: ['', Validators.required],
            request: ['', Validators.required],  
        });

        this.nextLevelId = null;
        this.toStaffId = null;
        this.selectedApprover = null;
    }

    displayShowCustInfo: boolean;
    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanSelection.loanApplicationId);
        this.displayShowCustInfo = true;
    }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
      
    }

    DownloadDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
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
    }

    viewExcelDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);
            var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
            saveAs(file)
        }
    }

   
    hideMessage(event) {
        this.show = false;
    }
    
    data: any = {};
    setNumberOfUploads(event) {
        this.numberOfUploadedFiles = event;
    }

    contentChange(updates) { 
         this.ckEditorContent = updates; 
    }
  
    getDrawdownMemoHtml(targetId) {
        this.camService.getDrawdownMemoHtml(targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.drawdownHtml = response.result;
        }, (err) => {
           
        });
    }

    getCashBackMemoHtml(operationId, targetId) {
        this.camService.getCashBackMemoHtml(operationId, targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.cashBackHtml = response.result;
        }, (err) => {
           
        });
    }


    captureScreen() {
        this.displayTestReport = true;
        this.displayReport = true;
        let path = '';
          this.camService.getDrawdownMemoPdf(this.loanSelection.applicationReferenceNumber).subscribe((response: any) => {
                  path = response.result;
                  this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
              });
          return;
      }


    categoryTeirs:any;
    getRacCategoryTeirs(productId) {
        this.productService.GetRacCategoryTeirs(productId).subscribe((res) => {
            this.categoryTeirs = res.result;

            if (this.categoryTeirs.length == 0) {
                this.initiationForm .controls['racCategoryTypeId'].clearValidators()
                this.initiationForm .controls['racCategoryTypeId'].updateValueAndValidity()
            } else {
                //this.showCategoryTypeInput = true;
                
                this.initiationForm .controls['racCategoryTypeId'].setValidators([Validators.required])
                this.initiationForm .controls['racCategoryTypeId'].updateValueAndValidity()
            }
                        
        }, (err) => {
        });
    }

    getRacForRacCategoryType(id) {
        this.productService.RacCategoryTypeExist(this.productId,id).subscribe((res) => {
            let exit = res.result;

            if (exit == true) {
                this.racCategoryTypeId = id;

                this.initiationForm.controls['racCategoryTypeId'].clearValidators();
                this.initiationForm.controls['racCategoryTypeId'].updateValueAndValidity();

            } else {
               // this.proposedProductId = 1223100;
            }


        }, (err) => {
            });
        
        
            
    }
    
formatFeeValue() {
    this.data.bookingAmount = this.initiationForm.value.amountToBook;

    if (this.data.bookingAmount == '' || this.data.bookingAmount == null || this.data.bookingAmount == undefined) return;
    var realChar: string = this.data.bookingAmount;
    var currVal: string = this.data.bookingAmount.substr(-1);
    if(currVal === 'M' || currVal === 'm' || currVal === 't' || currVal === 'T' || currVal === 'k' || currVal === 'K' || currVal === 'b' || currVal === 'B'){
        realChar = realChar.substr(0, realChar.length - 1 );
    }
    else{
        realChar = realChar.substr(0, realChar.length );
    }
    
    currVal = currVal.substr(-1);

    if (currVal === 'M' || currVal == 'm') {
        let result: Number = Number(realChar) * 1000000;
        this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
        let result: Number = Number(realChar) * 1000;
        this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else if (currVal === 'b' || currVal === 'B') {
        let result: Number = Number(realChar) * 1000000000;
        this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else {
        let result: Number = Number(realChar);
        this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
}


    timeAgo(time) {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;
        if (seconds == 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        var i = 0, format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    }

    lienIsSatisfied(event) {
       
        this.allLiensArePlaced = event;
    }

    fetchAndAddCustomerAccounts() {
        this.loadingSrv.show();
        this.customerService.fetchAndAddCustomerAccounts(this.loanSelection.customerId).subscribe((response: any) => {
            if(response.success) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            }
            else if (response.errorCode == "99"){
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            this.loadingSrv.hide();
        });
    }

    searchApprover(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    selectedBeneficiary: string = '';
    selectMember() {
        this.selectedBeneficiary = '';
        this.displayMemberSearchForm = true;
        //if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    selectCustomerForEmployerRelated() {
        this.selectedBeneficiary = '';
        this.displayCustomerSearchForm = true;
    }


    showBeneficiary: Boolean;
    requestCustomerId: any;
    pickSearchedApprover(data) {
        if(this.displayApproverSearchForm == true){
            if (data.secondName == undefined){
                this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.lastName;
            }else{
            this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.secondName + ' ' + data.lastName;
            }
        this.toStaffId = data.staffId;
        this.displayApproverSearchForm = false;

        }else if(this.displayMemberSearchForm == true){
                if(data.lastName == null)data.lastName='';
                if(data.secondName ==null)data.secondName='';
                if (data.secondName == undefined)
                    this.selectedBeneficiary = data.customerCode + ' -- ' + data.firstName + ' ' + data.lastName;
                else
                    this.selectedBeneficiary = data.customerCode + ' -- ' + data.firstName + ' ' + data.secondName + ' ' + data.lastName;
                this.requestCustomerId = data.customerId;
                this.displayMemberSearchForm = false;
                this.showBeneficiary = true;
                this.customerService.fetchAndAddCustomerAccounts(data.customerId).subscribe((response: any) => {});
        }else if(this.displayCustomerSearchForm == true){
            this.selectedBeneficiary = data.customerCode + ' -- ' + data.customerName;
            this.requestCustomerId = data.customerId;
            this.initiationForm.controls['casaAccountId'].reset();
            this.getLoanCustomerAccounts(this.requestCustomerId);
            this.displayCustomerSearchForm = false;
            this.showBeneficiary = true;
        }
        
    }

    refreshDoc(event){
        if(event){
            this.reloadDocs += 1;
        }
    }

    reloadDocs = 0;//multiple for multiple doc component refresh
    test2 = 0;
    ngAfterViewInit(): void {
        fromEvent(this.staffInPut.nativeElement, 'keyup').pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
                this.realSearchSrv.searchApproversEntries(this.staffInPut.nativeElement.value, this.nextLevelId)
                    .subscribe(results => {
                        if (results != null) {
                            this.availableApprovers = results.result;
                        }
                    });
            });

        fromEvent(this.approvalInPut.nativeElement, 'keyup').pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
                this.customerService.searchCustomerGroupMembers(this.approvalInPut.nativeElement.value, this.loanSelection.customerGroupId)
                    .subscribe(results => {
                        if (results != null) {
                            this.groupMembers = results.result;
                        }
                    });
            });

            fromEvent(this.customerInPut.nativeElement, 'keyup').pipe(
                debounceTime(150),
                distinctUntilChanged(),)
                .subscribe(() => {
            this.customerService.searchAllCustomerRealtime(this.customerInPut.nativeElement.value).subscribe(results => {
                    if (results != null) {
                        this.customers = results.result;
                    }
                });
            });
    }

    // ========================== project risk rating ========================
      
    getAllProjectRiskRatingCriteria(): void {
        this.camService.getAllProjectriskRatingCriteria().subscribe((response: any) => {
          this.projectRiskRatings = response.result;
          this.initializeProjectRiskRatingForm();
        });
     }

      initializeProjectRiskRatingForm() {
        if (this.projectRiskRatings == null || this.projectRiskRatings == {} || this.projectRiskRatings == undefined) return;
        let formControls = {}; 
            for (let f of this.projectRiskRatings) {
                formControls[f.categoryId] = new FormControl("", Validators.required);
                formControls["projectLocation"] = new FormControl("", Validators.required);
                formControls["projectDetails"] = new FormControl("", Validators.required);
            }
            this.projectRiskRatingForm = this.fb.group(formControls);
    }

    submitProjectRiskRatingForm(formValues){
        this.loadingSrv.show();
        let entries = this.initiationForm.value;
        let form = formValues.value;
        let body = {
            form: Object.keys(form).map(key => { return { categoryId: key, value: form[key] } }),
            loanApplicationId: this.loanSelection.loanApplicationId,
            loanApplicationDetailId: this.loanSelection.loanApplicationDetailId,
            loanBookingRequestId: entries.loanBookingRequestId,
            projectLocation: formValues.value.projectLocation,
            projectDetails: formValues.value.projectDetails,
        };
        this.camService.forwardProjectRiskRating(body).subscribe((response: any) => {
            if (response.success == true) {
                this.success(response.message);
                this.displayProjectRiskRatingModal=false; 
                this.getAllProjectRiskRating(this.loanSelection.loanApplicationId, this.loanSelection.loanApplicationDetailId,entries.loanBookingRequestId);
                this.getAllProjectRiskRatingComputation(this.applicationSelection.applicationReferenceNumber, this.applicationSelection.customerId,entries.loanBookingRequestId);
                
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });  
    }

    
    getAllProjectRiskRating(loanApplicationId, loanApplicationDetailId,loanBookingRequestId): void {
        this.camService.getAllProjectRiskRating(loanApplicationId, loanApplicationDetailId,loanBookingRequestId).subscribe((response: any) => {
          this.projectRiskRatingss = response.result;
        });
      }

      rating: number = 0;
      computation: number = 0;
      riskCategorisation: number = 0;
      projectLocation: string = "";
      projectDetails: string = ""; 

      getAllProjectRiskRatingComputation(loanApplicationId, loanApplicationDetailId,loanBookingRequestId): void {
        this.loadingSrv.show();
        this.camService.getAllProjectRiskRatingComputation(loanApplicationId, loanApplicationDetailId).subscribe((response: any) => {
            this.loadingSrv.hide();
            this.projectRiskRatingComputation = response.result;
            if (!isNullOrUndefined(this.projectRiskRatingComputation) && this.projectRiskRatingComputation.length > 0){
                this.computation = this.projectRiskRatingComputation[0].computation;
                this.customerTier = this.projectRiskRatingComputation[0].customerTier;
                this.riskCategorisation = this.projectRiskRatingComputation[0].riskCategorisation;
                this.projectLocation = this.projectRiskRatingComputation[0].projectLocation;
                this.projectDetails = this.projectRiskRatingComputation[0].projectDetails;
                if(this.customerTier >= 80){
                    this.rating = 25;
                }else if(this.customerTier >= 60 && this.customerTier <=79){
                this.rating = 20;
                }else{
                this.rating = 10;
                }
            }
            
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        }); 
      }
      
    success(message) {
        this.loadingSrv.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    resetEmployerRelatedLoans() {
        this.employerRelatedLoans = [];
    }

}









