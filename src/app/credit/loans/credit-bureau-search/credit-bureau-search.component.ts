import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from '../../../customer/services/customer.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { CasaService } from '../../../customer/services/casa.service';
import { GlobalConfig, CustomerTypeEnum, CreditBureauTypeEnum, ChargeTypeEnum } from '../../../shared/constant/app.constant';
import { CreditBureauAppModel } from '../../models/credit-bureau';
import { CreditAppraisalService } from '../../services';
import { CreditBureauService } from '../../services/credit-bureau.service';
import { DatePipe } from '@angular/common';
import { AuthorizationService } from 'app/admin/services/authorization.service';
import {CompanyService} from 'app/setup/services'


@Component({
    templateUrl: 'credit-bureau-search.component.html',
    selector: 'credit-bureau-search-component',
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
export class CreditBureauSearchComponent implements OnInit {
    noCharge: boolean;
    showBusinessChargeControl: boolean;
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    showProceedToApplication: boolean = false;
    selectedFacilityId: any;
    selectedAccountId: any;
    crcLoanFacilities: any;
    crcSearchForm: FormGroup;
    crcSearchButtonDisabled: boolean;
    creditCRCBureauSearchResult: any[] = [];
    crcSearchTypeCode: number;
    accountSelected: boolean = false;
    pdfFileName: any;
    myDocExtention: string;
    pdfFile: any;
    selectedConsumerOrCommercialId: any[] = [];
    selectedbureauSearch: any[] = [];
    selectedCrcbureauSearch: any[] = [];
    searchForm: FormGroup;
    customerAccounts: any[];
    isCorporate: boolean = false;
    creditBureauSearchResult: any[] =[];
    searchCustomerName: string;
    phoneNumber: string;
    identity: string;
    dateOfbirth: any;
    gender: string;
    rcNumber: string;
    accountOrRegistrationNumber: string;
    selectedCreditBureauActionTitle: string;
    searchTitle: string;
    activeDirectorId: any;
    displayBureauGrid: boolean = true;
    displayBureauGrid2: any;
    activeCustomerRequest: any;
    completedCustomersCount: any;
    customersCount: any;
    displayDocument: boolean;
    selectedDocument: any;
    binaryFile: any;
    supportingDocuments: any;
    files: any;
    uploadForm: FormGroup;
    displayUploadPanel: boolean = false;
    uploadFileTitle: any;
    file: any;
    selectedCreditBureauName: any;
    displayCreditBureauUpload: boolean = false;
    selectedCustomerId: any;
    customerCreditBureauCollection: CreditBureauAppModel[];
    displayCustomerBureauInfo: boolean = false;
    showcust2: boolean = false;
    showcust1: boolean = true;
    cols: { field: string; header: string; }[];
    customerData: CreditBureauAppModel[] =[];
    iSearch: { label: string; value: { id: number; name: string; }; }[];
    displayCreditBureau: boolean;
    maxBureauSearchReached: boolean = false;
    creditBureauInfo: any;
    customerBureauInfo: any[];
    customerCreditBureauLogList: any;
    selectBureaInfo: any;
    selectBureaData: any;
    selectedCustomerCreditBureauInfo: any;
    selectedCustomerBureauData: any;

    displayGroupSearchModal: boolean;
    selectedCustomer: any;
    customers: any;
    groupCustomerCode: number;
    groupCustomerId: number;
    displayXdsSearchModal = false;
    displayCrcSearchModal = false;
    displayCustSearchBtn: boolean;
    displayGrpSearchBtn: boolean;
    selectedCustomerIndex: number[] = [2];

    searchResults: any[];
    searchTerm$ = new Subject<any>();
    searchStagingTerm$ = new Subject<any>();
    custGrpSearchTerm$ = new Subject<any>();
    storageItem$ = new Subject<any>();
    searchButtonDisabled: boolean= false;
    displayStartNewGroupLoan: boolean = false;
    chargeBusiness: boolean;
    businessAccounts: any[];
    displayCustomerSearch: boolean;
    customerSelected: boolean = false;
    selectedValues: string[] = ['Customer Name','Date of birth','Phone', 'BVN'];
    //progressInitialValue: number = 12;

    @Input('isGlobal') isGlobal: boolean = true;
    @Input('display') display: boolean = true;
    @Input('startLoanTypeId') startLoanTypeId: number;
    @Input('customerId') customerId: number;
    

    @Output() proceedEvent = new EventEmitter();
    @Output() reverseEvent = new EventEmitter();
    crediBureauDocument: any[]=[];
    displayTwoFactorAuth: boolean;
    displayTwoFactorAuthForXDS: boolean;
    crcData: any;
    choiceName: string ='';
    twoFactorAuthEnabled: any;
    thirdPartyChargeStatus: any;
    userSpecific: boolean;
    statusForm: FormGroup;
    displayCrmsSearchModal: boolean = false;
    crmsCredits: any;
    crmsSummary: any;
    isProspectConversion: boolean = false;
    customerGroupId: any;
    LoanTypeId: any;


    constructor(private loadingService: LoadingService,
        private fb: FormBuilder,
        private customerService: CustomerService,
        private casaService: CasaService,
        private bureauService: CreditBureauService,
        private camService: CreditAppraisalService,
        private authorizationService: AuthorizationService,
        private companyService:CompanyService,
        private router: Router) {

            this.customerService.searchForCustomer(this.searchTerm$).subscribe(results => {
                this.customers = results.result;
               
            });
            this.customerService.searchForCustomerStaging(this.searchStagingTerm$, this.isProspectConversion).subscribe(results => {
                this.searchResults = results.result;
            });
        }

    ngOnInit() {
        this.initializeControls()
         this.getCreditBureauInformation();
        this.selectedCustomerIndex = [2];
        this.getCustomerAcccounts(this.activeCustomerRequest);
        this.getBusinessAcccounts();
        this.displayCustomerBureauInfo = false;
        this.getThirdPartyServiceChargeDetailsStatus();
    }

    searchDB(searchString) {
        this.searchTerm$.next(searchString);
    }

    searchStagingDB(searchString) {
        this.searchStagingTerm$.next(searchString);
    }

    selectedSearchCustomer(selected) {
        let kk = this.searchResults.filter(x => x.customerCode == selected.customerCode);
        this.displayXdsSearchModal = false;
    }

    searchForCustomerGroup(searchString) {
        this.custGrpSearchTerm$.next(searchString);
    }

    pickSearchedData(item) {
        this.selectedCustomer = item;
        this.displayXdsSearchModal = false;
    }
    pickCustomerSearchedData(item) { 
        //this.selectedCustomer = item;
        this.getCreditBureauCustomer(item.customerId,null,true);
        this.displayCustomerSearch = false;
    }


    closeSearchBox(evt) {
        evt.preventDefault();
        this.displayXdsSearchModal = false;
        this.displayCrcSearchModal =  false;
        this.displayGroupSearchModal = false;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    CloseSearchDialog(){
        this.displayXdsSearchModal = false;
        this.displayCrcSearchModal = false;
        this.displayCrmsSearchModal = false;
        this.searchButtonDisabled = false;
        this.creditBureauSearchResult = [];
        this.creditCRCBureauSearchResult=[];
    }

    onLoanFacilityChange(id){
        this.selectedFacilityId = id;
    }

    onCustomerAccountChange(id):void {
        let account = this.customerAccounts.filter(x=>x.casaAccountId == id);
        if(account != null && account != undefined)
        {
            this.accountSelected = true;
            this.selectedAccountId = id;
        }
        else this.accountSelected = false;
    }

    startUpload(record){
        this.initializeControls();
        this.displayUploadPanel = true;
        this.displayXdsSearchModal = false;
        this.displayCrcSearchModal = false;
        this.selectBureaData = record;
        this.selectedCreditBureauName = record.creditBureauName;
        this.selectedCreditBureauActionTitle = this.selectedCustomerBureauData.customerName.toUpperCase() +"'S " + this.selectedCreditBureauName;
        this.uploadFileTitle = this.selectedCreditBureauName +" Report Document Upload ";
        this.uploadForm.controls['docDescription'].setValue(this.selectedCreditBureauName +' Report Document')
    }

    startDownload(record){ 
        this.DownloadCreditBureauAutoFile(record.fileData);
        //this.DownloadDocument(record.fileData);
    }

    initiateSearch(record){
       if( record.creditBureauId == CreditBureauTypeEnum.XDSCreditBureau){
            this.displayXdsSearchModal = true;
            this.displayCrcSearchModal = false;
        } else if(record.creditBureauId == CreditBureauTypeEnum.CRCCreditBureau){
            this.displayXdsSearchModal = false;
            this.displayCrcSearchModal = true;
            this.getCRCLoanFacility();
        } else {
            this.displayCrmsSearchModal = true;
            this.displayXdsSearchModal = false;
            this.displayCrcSearchModal = false;
            this.getCRMSCreditCheck();
        }

        this.displayUploadPanel = false;
        this.selectBureaData = record;
        this.selectedCreditBureauName = record.creditBureauName;
        this.selectedCreditBureauActionTitle = this.selectedCustomerBureauData.customerName.toUpperCase() +"'S " + this.selectedCreditBureauName;
        this.searchTitle = this.selectedCreditBureauName +" Report Search";
        if(this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE) this.isCorporate =true;
        else this.isCorporate =false;

        this.searchCustomerName = this.selectedCustomerBureauData.customerName ;
    }

    
    setDob: string;
    onCrcSearchParameterChange(id){
        this.crcSearchTypeCode = id;
        var datePipe = new DatePipe('en-US');
        this.setDob = datePipe.transform(this.selectedCustomerBureauData.dateOfBirth, 'dd/MMM/yyyy');
        (id == 0 || id == 6) ? this.dateOfbirth = this.setDob : this.dateOfbirth = '';
        (id == 0 || id == 6) ? this.gender = this.selectedCustomerBureauData.gender : this.gender = '';
        (id == 0 || id == 6) ? this.searchCustomerName = this.selectedCustomerBureauData.customerName : this.searchCustomerName = '';

        (id == 5 || id == 6) ? this.phoneNumber = this.selectedCustomerBureauData.phoneNumber : this.phoneNumber = undefined;
        (id == 4 || id == 6) ? this.identity = this.selectedCustomerBureauData.customerBVN : this.identity = undefined;
    }

    firstNameValue: string = '';
    lastNameValue: string = '';
    middleNameValue: string = '';
    setXDSSearchParameterValues(val, isChecked){
        if(val == 'DOB'){   
            isChecked ? this.dateOfbirth = this.selectedCustomerBureauData.dateOfBirth : this.dateOfbirth = '';
        }

        if(val == 'PHONE'){   
            isChecked ? this.phoneNumber = this.selectedCustomerBureauData.phoneNumber : this.phoneNumber = '';
        } 

        if(val == 'GENDER'){   
            isChecked ? this.gender = this.selectedCustomerBureauData.gender : this.gender = '';
        }

        if(val == 'BVN'){   
            isChecked ? this.identity = this.selectedCustomerBureauData.customerBVN : this.identity = '';
        }

        if(val == 'REGISTRATION') {   
            isChecked ? this.accountOrRegistrationNumber = this.selectedCustomerBureauData.rcNumber : this.accountOrRegistrationNumber ='';
        } 

        if(val == 'NAME' || val == 'FNAME' || val == 'LNAME' || val == 'MNAME') 
        {   
            if(this.isCorporate)
            {
                isChecked ? this.searchCustomerName = this.selectedCustomerBureauData.firstName  : this.searchCustomerName = '';
            }
            else
            {
                if(val == 'FNAME' && isChecked) {this.firstNameValue = this.selectedCustomerBureauData.firstName ? this.selectedCustomerBureauData.firstName +' ': '' +' ';}
                   if(val == 'FNAME' && !isChecked) {this.firstNameValue = '';}

                if(val == 'LNAME' && isChecked)
                    {this.lastNameValue = this.selectedCustomerBureauData.lastName ? this.selectedCustomerBureauData.lastName +' ': ''+' ';}
                if(val == 'LNAME' && !isChecked) {this.lastNameValue = '';}

                if(val == 'MNAME' && isChecked)
                    {this.middleNameValue = this.selectedCustomerBureauData.middleName ?  this.selectedCustomerBureauData.middleName +' ': ''+' ';}
                if(val == 'MNAME' && !isChecked) {this.middleNameValue = '';}

                this.choiceName = this.firstNameValue + this.lastNameValue + this.middleNameValue;
                this.searchCustomerName = this.choiceName;
            }
        }

        val = null;
    }

     promptForCRCReportFetch() {
        this.companyService.getLoginCompanySetup().subscribe((companyres) => {
            if(companyres.success){
                var company = companyres.result;
                if(company.creditBureauChargeTypeId != ChargeTypeEnum.NoCharge){
                    this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
                        this.twoFactorAuthEnabled = res.result;
                        if (this.twoFactorAuthEnabled == true) {
                          if(res.userSpecific) { 
                              this.userSpecific = true;
                          }
                          else {
                              this.userSpecific = false;
                          }
                          this.displayTwoFactorAuth = true;
                        } else {
                          this.beginCrcSearchProcess();
                        }
                      });
                }
                
                else this.beginCrcSearchProcess();
            }
          });
        
      }

      promptForFirstCentralReportDownload() {
        this.companyService.getLoginCompanySetup().subscribe((companyres) => {
            if(companyres.success){
                var company = companyres.result;
                if(company.creditBureauChargeTypeId != ChargeTypeEnum.NoCharge){
                    this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
                        this.twoFactorAuthEnabled = res.result;
                        if (this.twoFactorAuthEnabled == true) {
                              if(res.userSpecific) { 
                                  this.userSpecific = true;
                              }
                              else {
                                  this.userSpecific = false;
                              }
                          this.displayTwoFactorAuthForXDS = true;
                        } else {
                          this.downloadReport();
                        }
                      });
                }
                
                else this.downloadReport();
            }
          });
      }

    downloadReport(){
        var loanCreditBureau = {
            creditBureauId : this.selectBureaData.creditBureauId,
            customerId: this.selectedCustomerBureauData.customerId,
            chargeAmount: this.selectedCustomerBureauData.customerTypeName.toLowerCase() =='corporate' ? this.selectBureaData.corporateChargeAmount : this.selectBureaData.retailChargeAmount,
            isComplete: true,
            companyDirectorId: this.selectedCustomerBureauData.companyDirectorId,
            isReportOkay: false,
            usedIntegration: true,
            username: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        }; 
      var  searchInput = { 
            productId: this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? XDSConnectProductEnum.DetailedBusinessEnquiryReport : XDSConnectProductEnum.DetailedCreditProfileReport, 
            creditBureauId : this.selectBureaData.creditBureauId, //dxs / crc
            searchType : this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? CreditBureauSearchTypeEnum.CommercialSearch : CreditBureauSearchTypeEnum.ConsumerSearch,       // consumer/ commercial
            consumerID : this.creditBureauSearchResult[0].ConsumerID ? this.creditBureauSearchResult[0].ConsumerID : this.creditBureauSearchResult[0].CommercialID, // (this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE && this.creditBureauSearchResult[0] != undefined) ? this.creditBureauSearchResult[0].CommercialID : (this.creditBureauSearchResult[0] != undefined) ? this.creditBureauSearchResult[0].ConsumerlID : null, //int
            mergeList : this.selectedConsumerOrCommercialId,
            subscriberEnquiryEngineID : this.creditBureauSearchResult[0] != undefined ? this.creditBureauSearchResult[0].MatchingEngineID : this.creditBureauSearchResult[0].MatchingEngineID ,
            enquiryID : this.creditBureauSearchResult[0].EnquiryID, // (this.creditBureauSearchResult[0] != undefined) ? this.creditBureauSearchResult[0].EnquiryID  : this.creditBureauSearchResult[0].SubscriberEnquiryID, //int
            customerCreditBureauUploadDetails : loanCreditBureau,
            casaAccountId : this.searchForm.value.casaAccountId,
            debitBusiness: this.chargeBusiness,
            username: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        }; 
        this.loadingService.show();
         this.bureauService.GetFullSearchResultInPDF(searchInput).subscribe((res) => { 
            if (res.success === true) {
                if(res.data.file != null || res.data.file != undefined){

                    swal('Fintrak Credit 360', 'The response file has been saved successfully', 'info');
                    this.loadingService.hide();
                    this.DownloadCreditBureauAutoFile(res.data.file);
                    this.customerBureauInfo.find(x=>x.creditBureauId == this.selectBureaData.creditBureauId).appliedSearchForLoan =true;
                    this.selectedCustomerBureauData.creditBureauCount + 1;
                    this.displayBureauGrid = false;
                    this.creditBureauSearchResult = [];
                }else swal('', 'Successful but returned nothing..','info');

                this.loadingService.hide();
            }else {
                swal('', res.message);
                this.loadingService.hide();
             }
         });
    }

    downloadCRCReport(){
        var loanCreditBureau = {
            creditBureauId : this.selectBureaData.creditBureauId,
            customerId: this.selectedCustomerBureauData.customerId,
            chargeAmount: this.selectedCustomerBureauData.customerTypeName.toLowerCase() =='corporate' ? this.selectBureaData.corporateChargeAmount : this.selectBureaData.retailChargeAmount,
            isComplete: true,
            companyDirectorId: this.selectedCustomerBureauData.companyDirectorId,
            isReportOkay: true,
            usedIntegration: true,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        };

      var  searchInput = {
            productId: this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? XDSConnectProductEnum.DetailedBusinessEnquiryReport : XDSConnectProductEnum.DetailedCreditProfileReport,
            creditBureauId : this.selectBureaData.creditBureauId,
            searchType : this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? CreditBureauSearchTypeEnum.CommercialSearch : CreditBureauSearchTypeEnum.ConsumerSearch,
            bureauID : this.selectedConsumerOrCommercialId,
            responseType : "2",
            enquiryReason : '1',
            productCode : "017",
            number : "0",
            reportID : this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? CRCReportTypeEnum.Corporate : CRCReportTypeEnum.Individual,  
            searchTypeCode : this.crcSearchTypeCode,
            referenceNo : this.crcData['@REFERENCE-NO'], 
            currencyCode : "NGN",
            //reportID : this.crcData['@REQUEST-ID'], 
            customerCreditBureauUploadDetails : loanCreditBureau,
            customerId : this.selectedCustomerBureauData.customerId,
            casaAccountId : this.selectedAccountId, 
            debitBusiness: this.chargeBusiness,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        };

        this.loadingService.show();
         this.bureauService.GetCRCFullSearchResultInPDF(searchInput).subscribe((res) => {

            if (res.success === true) {
                if(res.data != null || res.data != undefined){
                    if(this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE)
                    { this.isCorporate = true; }
                    else 
                    { this.isCorporate =false; }
                    swal('Fintrak Credit 360', 'The response file has been saved successfully', 'info');
                    this.DownloadCreditBureauAutoFile(res.data)
                    this.getCreditBureauCustomer(this.activeCustomerRequest,0,false);
                    this.customerBureauInfo.find(x=>x.creditBureauId == this.selectedCustomerBureauData.creditBureauId)//.appliedSearchForLoan=true;
                    this.selectedCustomerBureauData.creditBureauCount + 1;
                    this.displayBureauGrid = false;
                    this.creditBureauSearchResult = [];
                    this.loadingService.hide();
                }else swal('', 'Successful but returned nothing..','info');

                this.loadingService.hide();
            }else { 
                swal('', res.message);
                this.loadingService.hide();
             }
         });
    }
    
    DownloadDocument(pdfFile) {
        if (pdfFile != null) {
                this.pdfFile = pdfFile;
                this.pdfFileName = this.selectedCustomerBureauData.customerName+this.selectedCreditBureauName;
                this.myDocExtention = 'pdf';
                var byteString = atob(this.pdfFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                    var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                }
                // if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                //     var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                // }
                // if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                //     var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                // }
                saveAs(file)
        };
    }

    DownloadCreditBureauAutoFile(pdfFile) {
        if (pdfFile != null) {
                this.pdfFile = pdfFile;
                this.pdfFileName = this.selectedCustomerBureauData.customerName+this.selectedCreditBureauName;
                this.myDocExtention = 'pdf';
                var byteString = atob(this.pdfFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
                    }
                }
        };
    }

    promptForXDSReportFetch() {
        this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
          this.twoFactorAuthEnabled = res.result;
          if (this.twoFactorAuthEnabled == true) {
            this.displayTwoFactorAuthForXDS = true;
          } else {
            this.beginXdsSearchProcess();
          }
        });
      }

    beginXdsSearchProcess(){ 
        this.loadingService.show();
        this.searchButtonDisabled = true;
        this.creditBureauSearchResult = [];
        var data = {
            productId: this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? XDSConnectProductEnum.DetailedBusinessEnquiryReport : XDSConnectProductEnum.DetailedCreditProfileReport, // DetailedBusinessEnquiryReport,
            creditBureauId : this.selectBureaData.creditBureauId, 
            searchType : this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? CreditBureauSearchTypeEnum.CommercialSearch : CreditBureauSearchTypeEnum.ConsumerSearch,       // consumer/ commercial
            enquiryReason : 'Application for credit by a borrower',
            customerName : this.searchCustomerName, 
            gender : this.gender,
            dateOfBirth : this.dateOfbirth, 
            identification : this.identity,  
            accountOrRegistrationNumber : this.accountOrRegistrationNumber ? this.accountOrRegistrationNumber : '', // this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? this.selectedCustomerBureauData.rcNumber : this.selectedCustomerBureauData.customerAccountNo,
            debitBusiness: this.chargeBusiness,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        };
        this.bureauService.SearchCustomerXdsCreditBureauReport(data).subscribe((res) => {
        if (res.success === true) 
        { 
            this.searchButtonDisabled = false;
            if(res.data != null || res.data != undefined){ 
                if(res.data.status == 0)
                {
                    let searchResult = JSON.parse(res.data.searchResult);
                    if(this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE) 
                    {
                        this.isCorporate = true;
                        searchResult.CommercialMatching != null ? this.creditBureauSearchResult = searchResult.CommercialMatching.MatchedCommercial : null;
                    }
                    else 
                    {
                        this.isCorporate = false;
                        searchResult.ConsumerMtaching != null ? this.creditBureauSearchResult = searchResult.ConsumerMtaching.MatchedConsumer : null;
                    }
                    this.loadingService.hide();
                }
                else if(res.data.status == 1)
                {
                    swal('Fintrak Credit 360',  'XDS found no matching record', 'info' );
                    this.loadingService.hide();
                }
                else if(res.data.status == 2)
                {
                    swal('Fintrak Credit 360',  res.data.errorMessage, 'info' );
                    this.loadingService.hide();
                }
                else if(res.data.status == 3)
                {
                    swal('Fintrak Credit 360',  'Credit Bureau API Error - '+ res.data.searchResult, 'error' );
                    this.loadingService.hide();
                }
            }
            else
            {
                this.searchButtonDisabled = false;
                swal('Fintrak Credit 360', res.message, 'error' );
                this.loadingService.hide();
            }
        }
        else{
            this.loadingService.hide()
            swal('Fintrak Credit 360', res.message +":"+ res.data, 'error');
            this.loadingService.hide();
        }
        this.loadingService.hide()
        this.searchButtonDisabled = false;
        this.displayTwoFactorAuthForXDS=false;
        });
    }

    beginCrcSearchProcess(){ 
        this.crcSearchButtonDisabled = true;
        var data = {
            creditBureauId : this.selectBureaData.creditBureauId, 
            customerName : this.searchCustomerName, 
            amount : 0,
            productCode : "0",
            number : "0",
            productId : this.selectedFacilityId,
            dateOfBirth : new Date(this.dateOfbirth), 
            accountOrRegistrationNumber :this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? this.selectedCustomerBureauData.rcNumber : this.selectedCustomerBureauData.customerAccountNo,
            identification : this.identity,
            phoneNumber : this.phoneNumber, 
            gender : this.gender,
            responseType : 2,
            enquiryReason : '6',
            reportID : this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ? CRCReportTypeEnum.Corporate : CRCReportTypeEnum.Individual,  
            searchTypeCode : this.crcSearchTypeCode,
            casaAccountId :  this.selectedAccountId, 
            currencyCode : "NGN",
            customerId : this.selectedCustomerBureauData.customerId,
            companyDirectorId : this.selectedCustomerBureauData.companyDirectorId,
            debitBusiness: this.chargeBusiness,
            username: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        };
        this.loadingService.show();
        this.creditCRCBureauSearchResult = [];
        this.bureauService.SearchCustomerCrcCreditBureauReport(data).subscribe((res) => {
            if (res.success === true) 
            { 
                if(res.data.file != null )
                {
                    swal('Fintrak Credit 360', 'The response file has been saved successfully', 'info');
                    this.loadingService.hide();
                    this.DownloadCreditBureauAutoFile(res.data.searchResult);
                    this.customerBureauInfo.find(x=>x.creditBureauId == this.selectBureaData.creditBureauId).appliedSearchForLoan =true;
                    this.selectedCustomerBureauData.creditBureauCount + 1;
                    this.displayBureauGrid = false;
                }
                else 
                {
                    if(res.data.searchCompleted == SearchCompletedStatusEnum.SearchError)
                    {
                        swal('Fintrak Credit 360',res.data.searchResult, 'error');
                        this.crcSearchButtonDisabled = false;
                        this.loadingService.hide();
                        return;
                    }
                    if(res.data.searchCompleted == SearchCompletedStatusEnum.SearchCompleted)
                    {   
                        this.displayCrcSearchModal = false;
                        swal(this.selectBureaData.creditBureauName+' search.' + 'Your Search was successful.'+'\n' + 'The search found an exact match and the resulting document has been downloaded.', 'info')
                        this.crcSearchButtonDisabled = false;
                        this.loadingService.hide();
                    } 

                    var responseData = JSON.parse(res.data.searchResult) ;
                    this.crcSearchButtonDisabled = false;
                    this.crcData = responseData['DATAPACKET'];
                    
                    if (responseData['DATAPACKET']['BODY']['SEARCH-RESULT-LIST'] != undefined) {
                        this.creditCRCBureauSearchResult = responseData['DATAPACKET']['BODY']['SEARCH-RESULT-LIST']['SEARCH-RESULT-ITEM'];
                    }

                    if(res.data.searchCompleted === SearchCompletedStatusEnum.SearchIncomplete)
                    {   
                        if(this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE)
                        {   
                            this.isCorporate = true;
                            this.creditCRCBureauSearchResult =
                            responseData['DATAPACKET']['BODY']['SEARCH-RESULT-LIST']['SEARCH-RESULT-ITEM'];
                            if(this.creditCRCBureauSearchResult == null || this.creditCRCBureauSearchResult == undefined)
                            {
                                swal('Fintrak Credit 360', 'Search Completed with Clean Report','info')
                            }
                        }
                        else
                        {   
                            this.isCorporate = false;

                            if (responseData['DATAPACKET']['BODY']['SEARCH-RESULT-LIST'] != undefined) {
                                this.creditCRCBureauSearchResult = responseData['DATAPACKET']['BODY']['SEARCH-RESULT-LIST']['SEARCH-RESULT-ITEM'];
                            }

                            if(this.creditCRCBureauSearchResult == null || this.creditCRCBureauSearchResult == undefined)
                            {
                                swal('Fintrak Credit 360', 'Search Completed with Clean Report','info')
                            }
                        }
                    } 
                    this.loadingService.hide();
                }
                //this.loadingService.hide();
            }
            else 
            {   // SEARCH WAS NOT SUCCESSFUL
                swal('Fintrak Credit 360', res.message);
                this.loadingService.hide();
            }
        });
        this.crcSearchButtonDisabled = false;
        this.displayTwoFactorAuth =false;
    }

    clearScreenSettings(){
        this.displayCrcSearchModal = false;
        this.creditCRCBureauSearchResult = [];
    }

    processChoiceCreditBureauSearchRecords(event){
    }

    toggleCustomerBureauGrid(){
        if(this.displayBureauGrid2 ){
            this.displayBureauGrid2 = false;
            this.displayBureauGrid = true;
        } else {
            this.displayBureauGrid2 = false;
            this.displayBureauGrid = true;
        }
    }

    GetCustomerCreditBureauLog(customerId,companyDirectorId) {
        this.initializeControls();
        this.customerCreditBureauLogList = [];
        this.bureauService.customerCreditBureauReportLog(customerId,companyDirectorId).subscribe((data) => {
            this.customerCreditBureauLogList = data.result;
            this.customerCreditBureauLogList.slice;
        } );
        this.getCustomerAcccounts(customerId);
    }

    getCreditBureauCustomer(customerId,companyDirectorId,isValidation){ 
        this.activeCustomerRequest = customerId;
        this.activeDirectorId = companyDirectorId

        this.loadingService.show();
        this.bureauService.getSimpleCustomerDetailsByCustomerId(customerId)
        .subscribe((data) => {
            this.customerData = data.result;
            this.fetchAndAddCustomerAccounts(this.customerData);
            this.getCustomerAcccounts(customerId);
            this.loadingService.hide();
            if(data.result == null || data.result == undefined){
                swal('Fintrak Credit 360', data.message,'error');
            }
        },
         (err) => {this.loadingService.hide();});

        this.displayCreditBureau = true;

        if(isValidation && !this.maxBureauSearchReached) { swal('','Credit Bureau Check has not been completed', 'info'); } 
    }

    fetchAndAddCustomerAccounts(data){
        this.bureauService.fetchAndAddCustomerAccounts(data)
        .subscribe((data) => {},
         (err) => {});
    }

    setCreditBureauItem(){
        if(this.customerBureauInfo != null)this.customerBureauInfo.forEach(obj =>
            {
                if(this.customerCreditBureauLogList == null) obj.appliedSearchForLoan = false;
                else if(this.customerCreditBureauLogList.find(x=>x.creditBureauId === obj.creditBureauId) != null)
                {
                    //alert("test: 1");
                    obj.appliedSearchForLoan = true;
                    var currentCustBureauLog = this.customerCreditBureauLogList.find(x=>x.creditBureauId === obj.creditBureauId);
                    obj.isReportOkay = currentCustBureauLog.isReportOkay;
                    obj.hasFile = true;
                    this.GetCustomerCreditBureauDocument(currentCustBureauLog.customerCreditBureauId);
                    if(this.crediBureauDocument.length > 0 ) obj.fileData = this.crediBureauDocument[0].fileData;
                } else {
                    obj.appliedSearchForLoan = false;
                }

               this.toggleCustomerBureauGrid();
                this.customerBureauInfo = this.customerBureauInfo.slice();
            });

    }

    validateCreditBureauChecks(isValidate: boolean){
        if(this.creditBureauInfo == null) this.getCreditBureauInformation();
        if(this.creditBureauInfo != null){
            this.customerData.forEach(obj => {
                if(obj.creditBureauCount >= 3){
                    obj.isCreditBureauUploadCompleted = true;
                    this.maxBureauSearchReached = true;
                } else this.maxBureauSearchReached = false;
                this.customerData = this.customerData.slice();
             });
        }
        if(!this.maxBureauSearchReached && isValidate) swal('Fintrak Credit360', 'Credit Bureau Upload has not been completed');
        else this.proceedToApplication();
    }

    GetCustomerCreditBureauDocument(customerCreditBureauId) {
        this.bureauService.GetCustomerCreditBureauDocument(customerCreditBureauId).subscribe((data) => {
            this.crediBureauDocument = data.result;
            this.loadingService.hide();
        }, (err) => {});
    }

    getCreditBureauInformation(){
        this.loadingService.show();
        this.bureauService.GetCreditBureauInformation().subscribe((data) => {
            this.creditBureauInfo = data.result;
            //alert("Here: 2");
            this.loadingService.hide();
        }, (err) => {});
        this.displayCreditBureau = true;
    }

    showCustomerCreditBureauInfo(data, isValidation){
        this.customerBureauInfo = this.creditBureauInfo;
        this.displayCustomerBureauInfo = true;
        this.selectedCustomerId = data.customerId;
        this.selectedCustomerBureauData = data;
        this.customerCreditBureauLogList = [];
        this.bureauService.customerCreditBureauReportLog(data.customerId,data.companyDirectorId).subscribe((data) => {
            this.customerCreditBureauLogList = data.result;
            //alert(JSON.stringify(this.customerCreditBureauLogList));
            this.setCreditBureauItem();
        } );

        this.file = undefined;
        this.displayUploadPanel =false;
    }

    acceptedExtention: Array<any> = ['docx','pdf','jpg','jpeg','png', 'PNG', 'txt','xlsx','xls','doc','xml','PDF','JPG','JPEG','XML'];
    uploadBureauReport(selectedCustomerBureauData, selectBureaData){
        if (this.file != undefined || this.uploadFileTitle != null) { 

            let fileExtension = this.fileExtention(this.file.name);
            if(this.acceptedExtention.find(ob => ob === fileExtension)== null) {
             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please Upload Files with Accepted Extentions ' + this.acceptedExtention , 'warning');
             return;
            }

            var loanCreditBureau = {
                creditBureauId : selectBureaData.creditBureauId,
                customerId:selectedCustomerBureauData.customerId,
                chargeAmount: this.selectedCustomerBureauData.customerTypeName.toLowerCase() =='corporate' ? selectBureaData.corporateChargeAmount : selectBureaData.retailChargeAmount,
                isComplete: true,
                companyDirectorId: this.selectedCustomerBureauData.companyDirectorId,
                isReportOkay: false,
                usedIntegration: false,
                customerCreditBureauId: null,
                documentTitle: this.uploadFileTitle,
                fileExtension: this.fileExtention(this.file.name),
                fileName: this.file.name,
                debitBusiness: this.chargeBusiness,
                userName: this.twoFactorAuthStaffCode,
                passCode: this.twoFactorAuthPassCode,
                customerGroupId : this.customerGroupId,
                startLoanTypeId : this.startLoanTypeId,
            }

            this.saveCustomerCreditBureauSearch(loanCreditBureau, false);
            //alert(JSON.stringify(this.customerBureauInfo));
            this.customerBureauInfo.find(x=>x.creditBureauId == selectBureaData.creditBureauId).appliedSearchForLoan =false;
        }
        else { swal('', 'Please select a file to upload'); }   
    }

    saveCustomerCreditBureauSearch(data,isSearch){
        var msgSuccess = null;
        this.loadingService.show();
       // this.bureauService.saveCreditBureauSearch(data).subscribe((res) => {
        this.bureauService.uploadCreditBureauReportFile(this.file,data).then((res: any) => { 
            if(res['success']){
                this.getCreditBureauCustomer(this.activeCustomerRequest,0,false);
                this.selectedCustomerBureauData.creditBureauCount + 1;
                
                this.customerBureauInfo.find(x=>x.creditBureauId ==data.creditBureauId).appliedSearchForLoan=true;
                this.displayUploadPanel = false;
                this.displayBureauGrid = false;
                this.initializeControls();
                this.file = undefined;
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'info');
                this.loadingService.hide();
                return true;
            } else {
               swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
               this.loadingService.hide();
                    this.displayUploadPanel = false;
                return false;
            }
                
        }, (error) => {
           this.loadingService.hide(1000);
           swal('Customer Request', JSON.stringify(error), 'error')
            return false;
        });
    }

    updateReportStatus(item,status){
        var body ={
        creditBureauId: item.creditBureauId,
        customerCreditBureauId: this.selectedCustomerBureauData.customerCreditBureauId,
        customerId: this.selectedCustomerBureauData.customerId,
        creditBureauName: item.creditBureauName
        }
        this.bureauService.updateCustomerCreditBureauReportStatus(status,body).subscribe((res) => {
            if (res.success === true) {
               this.GetCustomerCreditBureauLog(this.selectedCustomerBureauData.customerId,null);
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'info');
                this.loadingService.hide();
            } else {
                swal('',res.message,'warning');
                this.loadingService.hide();
            }
        }, );
    }

    SetChargeableAccount(status){ 
        if(status == true) this.chargeBusiness = true;
        else this.chargeBusiness = false;
    }

    initializeControls() {
        this.uploadForm = this.fb.group({
            docDescription: ['', Validators.required],
        });

        this.searchForm = this.fb.group({
            casaAccountId: ['', Validators.required],
        }); 

        this.statusForm = this.fb.group({
            reportStatus: ['', Validators.required],
        });

        this.statusForm = this.fb.group({
            reportSatus: ['', Validators.required],
        });
        
        this.crcSearchForm = this.fb.group({
            //casaAccountId: ['', Validators.required],
            productId: ['', Validators.required],
            searchParameterId: ['',Validators.required]
        });
    }

    getCRCLoanFacility(){
        this.bureauService.GetCRCBureauFacilities().subscribe((res) => {
            this.crcLoanFacilities = res.result;
        });
    }

    getCRMSCreditCheck() {
        this.loadingService.show();
        var customerBVN = this.selectedCustomerBureauData.customerBVN;

        var body = {
            //bvn: "22185899776",
            bvn: customerBVN,
            channel_code: "PDL",
            token: "1234"
        }

        this.bureauService.GetCRMSCreditCheck(body).subscribe((res) => {

            if (res.success) {
                this.crmsCredits = res.credits;
                this.crmsSummary = res.summary;
            }
            else {
                swal('', res.message, 'error')
            }

        });

        this.loadingService.hide();
    }

    getCustomerAcccounts(customerId){
        if (customerId == undefined || customerId == null) {
            return;
        }
        this.casaService.getAllCustomerAccountByCustomerId(customerId).subscribe((res) => {
            this.customerAccounts = res.result;
        });
    }

    getBusinessAcccounts(){
        this.casaService.getBusinessAccounts().subscribe((res) => {
            this.customerAccounts = res.result;
        });
    }

    getThirdPartyServiceChargeDetailsStatus(){
        const crCcasaAccount = this.crcSearchForm.controls['casaAccountId']; //searchForm
        const casaAccount = this.searchForm.controls['casaAccountId'];
        this.bureauService.getThirdPartyServiceChargeDetailsStatus().subscribe((res) => {
            this.thirdPartyChargeStatus = res.result;
            if(this.thirdPartyChargeStatus != null && this.thirdPartyChargeStatus != undefined) {
                if(this.thirdPartyChargeStatus.creditBureauSearchTypeId == ChargeTypeEnum.ChargeCustomerORBank
                || this.thirdPartyChargeStatus.creditBureauSearchTypeId == ChargeTypeEnum.ChargeBank) {
                    this.showBusinessChargeControl = true;
                } else  this.showBusinessChargeControl = false;

                if(this.thirdPartyChargeStatus.creditBureauSearchTypeId == ChargeTypeEnum.NoCharge) {
                        this.noCharge = true;
                        if (casaAccount != null && casaAccount != undefined) {
                            casaAccount.clearValidators();
                            casaAccount.updateValueAndValidity();
                        }
                        
                        if (crCcasaAccount != null && crCcasaAccount != undefined) {
                            crCcasaAccount.clearValidators();
                            crCcasaAccount.updateValueAndValidity();
                        }
                        this.showBusinessChargeControl = false;
                    } else {
                        this.noCharge = false;
                    }
            }
        });
    }
    
    addSelectedXDSSearchItem(evt) { 
        this.selectedbureauSearch.push(evt);
        // this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE 
        // ? this.selectedConsumerOrCommercialId.push(evt['CommercialID'])
        // : this.selectedConsumerOrCommercialId.push(evt.MatchingEngineID) ;
        
        if(this.selectedCustomerBureauData.customerTypeId == CustomerTypeEnum.CORPORATE ){
            this.selectedConsumerOrCommercialId.push(evt.CommercialID);
        } else this.selectedConsumerOrCommercialId.push(evt.ConsumerID);

       
    }

    showCustomerSearch(){
        this.displayCustomerSearch = true;
    }

    addSelectedCRCSearchItem(evt) {
        this.selectedbureauSearch.push(evt);
        this.selectedConsumerOrCommercialId.push(evt['@BUREAU-ID']); 

     }

     

    removeSelectedSearchItem(evt){
        var index = this.selectedbureauSearch.find(x=>x.MatchingEngineID == evt.MatchingEngineID).index;
        this.selectedbureauSearch.splice(index, 1);
        this.selectedConsumerOrCommercialId.splice(index, 1);
    }

    proceedToApplication(){
        this.displayCreditBureau=false
        this.proceedEvent.emit({ continue: 'true'});
        
    }

    goBack(){
        this.displayCreditBureau = false;
        this.displayCustomerBureauInfo = false;
        this.display = false;
        this.reverseEvent.emit({ continue: 'true' });
    }

    getCreditBureauSearchState(): boolean{
        return true;
    }

    bureauDialogTitle: string;
    startCreditBureauSearch(index_data, status){
        if(status){
            this.selectBureaInfo = index_data;
           // this.showConfirmDialog();
        }
    }

    onCreditBureauCustomerRowSelect(data,event) {
        this.selectedCustomerCreditBureauInfo  = event.data.creditBureauInfo;
    }

    //..........DOCUMENT UPLOAD AND MANAGEMENT SECTION...................
    @ViewChild('fileInput', {static: false}) fileInput: any;

    uploadFile(sourceId): boolean {
        if (this.file != undefined || this.uploadFileTitle != null) {
            
            let fileExtension = this.fileExtention(this.file.name);      
            if(this.acceptedExtention.find(ob => ob === fileExtension)== null) {
             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please Upload Files with Accepted Extentions ' + this.acceptedExtention , 'warning');
             return;
            }
            
            let body = {
                loanReferenceNumber: '',
                customerCreditBureauId: sourceId,
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
            };
                this.camService.uploadFile(this.file, body).then((val: any) => {
                if(val['success']){
                    return true;
                } else {
                    return false;
                }
            }, (error) => {
               this.loadingService.hide(1000);
               swal('Customer Request', JSON.stringify(error), 'error')
                return false;
            });
            return true;
        }
    }

    getSupportingDocuments(customerCreditBureauId: any) {
        this.loadingService.show();
        this.camService.getCreditBureauSupportingDocumentByCreditBureauId(customerCreditBureauId).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId === id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }
}

export enum CreditBureauSearchTypeEnum {
    ConsumerSearch = 1,
    CommercialSearch = 2
}

enum CRCReportTypeEnum {
    Corporate = 6112,
    Individual = 6110
}

 enum XDSConnectProductEnum {
        ConsumerSnapCheckReport = 42,
        ConsumerBasicTraceReport = 43,
        ConsumerBasicCreditReport = 44,
        DetailedCreditProfileReport = 45,
        XScoreConsumerFullCreditReport = 50,
        BusinessEnquiryBasicCredit = 46,
        DetailedBusinessEnquiryReport = 47
    }

    enum SearchCompletedStatusEnum{
        SearchIncomplete = 1,
        SearchCompleted = 2,
        SearchError = 3
    }

    