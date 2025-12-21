import { saveAs } from 'file-saver';
import { ICustomerInfo, ICustomerCompanyInfomation,  } from '../../../models/CustomerInfo';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { BranchService } from '../../../../setup/services/branch.service';
import { CompanyService } from '../../../../setup/services/company.service';
import { LoanApplicationService } from '../../../../credit/services/loan-application.service';
import { CustomerService } from '../../../services/customer.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-customer-information-detail',
  templateUrl: './customer-information-detail.component.html',
})
export class CustomerInformationDetailComponent implements OnInit {
  showBackButton: boolean = true;
  customerCASAInformation: any[];
  loanApplicationCustomerList: any[];
  filteredSubsector: any[];
  customersInfo: ICustomerInfo;
  subSectors: any[];
  sectors: any[];
  uploadDocumentType: any[];
  customerCompanyInfomation: any;
  customerCompanyUltimateBeneficial: any[];
  showCreditBureauButton: boolean = true;
  @Input('singleCustomerId') customerId: number = null;
  // @Input('loanApplicationId') loanApplicationId: number = null;
  @Input('showCustomerInfo') displayCustomerInfoDetails: boolean = false;
  @Input('showRefreshAccount') canRefreshAccount: boolean = false;
  @Input() isLMS: boolean = false;
  @Input() doNotCallLoadingService: boolean = false;
  @Output() customer: EventEmitter<any> = new EventEmitter<any>();
  customerAddedChildren: any[];
  clientSuplierTypes: any[];
  directorsTypes: any[];
  customerAddressType: any[];
  riskRatings: any[];
  displayUpload: boolean;
  selectedDocument: any;
  binaryFile: any;
  companies: any[];
  officers: any[];
  countries: any[];
  states: any[];
  cities: any[];
  branches: any[];
  genderList: any[];
  titleList: any[];
  maritalStatusList: any[];
  customerSensitivityLevelList: any[];
  customerFullName: string;
  isCorperateCustomer: boolean = false;
  isOtherCustomer: boolean = false;
  displayLoanCustomerList: boolean = false;
  activeIndex = 0;
  customerSelection: ICustomerInfo;
  customerTypes: any[] = [];

  customerAddresses: any[];
  customerPhoneContact: any[];
  customerCompanyDirectors: any[];
  customerCompanyAccountSignatory: any[];
  customerCompanyShareholderIndividual: any[];
  customerSupplier: any[];
  customerClient: any[];
  customerCompanyShareholderCorporate: any[];
  customerEmploymentHistory: any[];
  kycDocumentUploadList: any[];
  customerRelatedParties: any[];
  displayViewUltimateBeneficial: boolean = false;
  corporateShareholderName: string;

  // tslint:disable-next-line:no-output-rename
  @Output('hideCustomerInfo') hideCustomerInfo = new EventEmitter();
  @Output() proceedEvent = new EventEmitter();
  displayLoadButton: boolean = true;
  showSpinnerChangeLog: boolean = false;
  displayChangeLog: boolean = false;
  showProceedBackButton: boolean = false;

  @Input() set loanApplicationId(value: number) {
    //console.log("the expected value is "+value);
    if (value > 0) this.loadLoanCustomerList(value);
  }

  @Input() set loadWithCustomerId(value: number) {
    if (value > 0){
      this.viewSingleCustomerDetails(value);
    }
  }
  
  constructor(private loadingService: LoadingService,
    private customerService: CustomerService,
    private loanAppService: LoanApplicationService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private router: Router,
    private countryStateSrv: CountryStateService) { }

  ngOnInit() {
  }

  loadData() {
    this.loadCustomerDropdowns();
    this.getSectors()
    this.getListOfMaritalStatus();
  }

  loadLoanCustomerList(loanId) {
    this.displayChangeLog = false;
    this.getCustomerGeneralInfoByLoanApplicationId(loanId);
    this.loadData();
    this.displayLoanCustomerList = true;
  }


  
  viewCustomerDetails(index) {

    this.customerSelection = this.loanApplicationCustomerList[index];
    // Update the data on the form
     this.customerId= this.customerSelection.customerId;
    this.customerFullName = this.customerSelection.customerName;
    this.customerCompanyInfomation = this.customerSelection.customerCompanyInfomation[0] || new ICustomerCompanyInfomation;
    this.loadSingleCustomerInformation(this.customerId);
    if (this.customerSelection.customerTypeId == 2) {
      this.isCorperateCustomer = true;
      this.isOtherCustomer = false;
    } else {
      this.isOtherCustomer = true;
      this.isCorperateCustomer = false;
    }
    this.displayCustomerInfoDetails = true;
    this.displayLoanCustomerList = false;
  }


 viewSingleCustomerDetails(customerId) {
      this.getSingleCustomerGeneralInfoByCustomerId(customerId);
      this.displayCustomerInfoDetails = true;
      this.displayLoanCustomerList = false;
      this.showBackButton = false;
  }

  loadCustomerDropdowns() {
    this.customerService.getAllCustomerTypes().subscribe((response: any) => {
      this.customerTypes = response.result;
    });
    this.branchService.get().subscribe((response: any) => {
      this.branches = response.result;
    });
    this.companyService.getAllCompanies().subscribe((response: any) => {
      this.companies = response.result;
    })
    this.customerService.getAllSupplierTypes().subscribe((response: any) => {
      this.clientSuplierTypes = response.result;
    });
    this.customerService.getAlldirectorsTypes().subscribe((response: any) => {
      this.directorsTypes = response.result;
    });
    this.customerService.getCustomerAddressTypes().subscribe((response: any) => {
      this.customerAddressType = response.result;
    });
    this.customerService.getCustomerRiskRating().subscribe((response: any) => {
      this.riskRatings = response.result;
    });
  }


  getSingleCustomerGeneralInfo(customerCode) {
    this.loadingService.show();
    this.customerService.getSingleCustomerGeneralInfo(customerCode).subscribe((response: any) => {
      this.customerSelection = response.result;
      this.customerId = this.customerSelection.customerId;
      this.customerFullName = this.customerSelection.customerName;
      // this.customerCompanyInfomation = this.customerSelection.customerCompanyInfomation[0] || new ICustomerCompanyInfomation;
      this.loadSingleCustomerInformation(this.customerId);
      if (this.customerSelection.customerTypeId == 2) {
        this.isCorperateCustomer = true;
        this.isOtherCustomer = false;
      } else {
        this.isOtherCustomer = true;
        this.isCorperateCustomer = false;
      }
      ////console.log("General Info", this.customerSelection);
    });

    this.loadingService.hide();
    //  this.displayCustomerInfoDetails = true;
  }

  getSingleCustomerGeneralInfoByCustomerId(customerId) {
    if(this.doNotCallLoadingService == false){ this.loadingService.show();}
    this.customerService.getSingleCustomerGeneralInfoByCustomerId(customerId).subscribe((response: any) => {
      if(response.success == true){
        this.customerSelection = response.result;
        this.customerId = this.customerSelection.customerId;
        this.customerFullName = this.customerSelection.customerName;
        this.showSpinnerChangeLog = false;
        this.loadSingleCustomerInformation(customerId);
        this.customer.emit(this.customerSelection);
        if (this.customerSelection.customerTypeId == 2) {
          this.isCorperateCustomer = true;
          this.isOtherCustomer = false;
        } else {
          this.isOtherCustomer = true;
          this.isCorperateCustomer = false;
        }
    }
    if(this.doNotCallLoadingService == false){ this.loadingService.hide();}
      ////console.log("General Info", this.customerSelection);
    }, (err) => {
      if(this.doNotCallLoadingService == false){ this.loadingService.hide(1000);}
    });


  }
  getListOfCustomerSensitivityLevel() {
    this.customerSensitivityLevelList = this.customerService.getCustomerSensitivityLevelList()
  }
  getListOfMaritalStatus() {
    this.maritalStatusList = this.customerService.getMaritalStatusList()
  }
  getListOfTitle() {
    this.titleList = this.customerService.getTitleList()
  }
  getListOfGender() {
    this.genderList = this.customerService.getGenderList()
  }
  getBranch(id) {
    let item = this.branches != null ? this.branches.find(x => x.branchId == id) : [];
    if (item != undefined) { return item.branchName; }
    return 'n/a';
  }
  getSectorBySectoeId(id) {
    let item = this.sectors != null ? this.sectors.find(x => x.lookupId == id) : [];
    if (item != undefined) { return item.lookupName; }
    return 'n/a';
  }
  getStateCities(id): void {
    this.countryStateSrv.getCityByState(id).subscribe((response: any) => {
      this.cities = response.result;
      ////console.log('CITIES', response.result);
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getStates() {
    this.countryStateSrv.getStates()
      .subscribe((response: any) => {
        this.states = response.result;
      });
  }
  getCountries() {
    this.countryStateSrv.getAllCountries()
      .subscribe((response: any) => {
        this.countries = response.result;
      });
  }
  getAllOfficers() {
    this.loanAppService.getOfficers()
      .subscribe((res) => {
        this.officers = res.result;
      }, (err) => {
      })
  }
  getCompany(id) {
    let item = this.companies != null ? this.companies.find(x => x.CompanyId == id) : [];
    if (item != undefined) { return item.Name; }
    return 'n/a';
  }
  getMaritalStatus(id) {
    if (this.maritalStatusList === undefined) { return }
    let item = this.maritalStatusList != null ? this.maritalStatusList.find(x => x.MaritalStatusId == id) : [];
    if (item != undefined) { return item.MaritalStatus; }
    return 'n/a';
  }
  getCustomerSensitivityLevel(id) {
    return this.customerService.getCustomerSensitivityLevel(id);
  }
  getCustomerType(id) {

    let item = this.customerTypes != null ? this.customerTypes.find(x => x.customerTypeId == id) : [];
    if (item != undefined) { return item.name; }
    return 'n/a';
  }

  getCustomerGeneralInfoByLoanApplicationId(loanApplicationId) {
    this.loadingService.show();
    this.showSpinnerChangeLog = true;

    this.showSpinnerChangeLog = false;
    this.displayChangeLog = true;

    if (this.isLMS == true) {
      this.customerService.getCustomerGeneralInfoByLMSLoanApplicationId(loanApplicationId).subscribe((response: any) => {
        this.loanApplicationCustomerList = response.result;
      });
    } else {
      this.customerService.getCustomerGeneralInfoByLoanApplicationId(loanApplicationId).subscribe((response: any) => {
        this.loanApplicationCustomerList = response.result;
      });
    }
   
    this.loadingService.hide();
  }
  getSingleCustomerCompanyInfo(customerId) {
    this.customerService.getSingleCustomerCompanyInfo(customerId).subscribe((response: any) => {
      this.customerCompanyInfomation = response.result;
    });
  }
  getSingleCustomerAddressInfo(customerId) {
    this.customerService.getSingleCustomerAddressInfo(customerId).subscribe((response: any) => {
      this.customerAddresses = response.result;
    });
  }
  getSingleCustomerPhoneContactInfo(customerId) {
    this.customerService.getSingleCustomerPhoneContactInfo(customerId).subscribe((response: any) => {
      this.customerPhoneContact = response.result;
    });
  }
  getSingleCustomerEmploymentHistoryInfo(customerId) {
    this.customerService.getSingleCustomerEmploymentHistoryInfo(customerId).subscribe((response: any) => {
      this.customerEmploymentHistory = response.result;
    });
  }
  getSingleCustomerBoardInfo(customerId) {
    this.customerService.getSingleCustomerBoardInfo(customerId).subscribe((response: any) => {
      this.customerCompanyDirectors = response.result;
    });
  }
  getSingleCustomerShareholderIndividual(customerId) {
    this.customerService.getSingleCustomerShareholderIndividual(customerId).subscribe((response: any) => {
      this.customerCompanyShareholderIndividual = response.result;
    });
  }
  getSingleCustomerShareholderCorporate(customerId) {
    this.customerService.getSingleCustomerShareholderCorporate(customerId).subscribe((response: any) => {
      this.customerCompanyShareholderCorporate = response.result;
    });
  }
  getCustomerShareholderUltimateBenefical(companyDirectorId) {
    this.customerService.getCustomerShareholderUltimateBenefical(companyDirectorId).subscribe((response: any) => {
      this.customerCompanyUltimateBeneficial = response.result;
    });
  }
  getSingleCustomerAccountSignatoryInfo(customerId) {
    this.customerService.getSingleCustomerAccountSignatoryInfo(customerId).subscribe((response: any) => {
      this.customerCompanyAccountSignatory = response.result;
    });
  }
  getSingleCustomerClientInfo(customerId) {
    this.customerService.getSingleCustomerClientInfo(customerId).subscribe((response: any) => {
      this.customerClient = response.result;
    });
  }
  getSingleCustomerSupplierInfo(customerId) {
    this.customerService.getSingleCustomerSupplierInfo(customerId).subscribe((response: any) => {
      this.customerSupplier = response.result;
      ////console.log("supplier", this.customerSupplier)
    });
  }
  getSingleCustomerChildrenInfo(customerId) {
    this.customerService.getSingleCustomerChildrenInfo(customerId).subscribe((response: any) => {
      this.customerAddedChildren = response.result;
    });
  }
  getCustomerCASAInformation(customerId) {
    this.customerService.getCustomerCASAInformation(customerId).subscribe((response: any) => {
      this.customerCASAInformation = response.result;
    });
  }
  getCustomerRelatedParty(customerId) {
    this.customerService.getAllCustomerRelatedParty(customerId).subscribe((response: any) => {
      this.customerRelatedParties = response.result;
    });
  }
  getKYCDocumentUploads(customerId) {
    this.loadingService.show();
    this.customerService.getKYCDocumentUploads(customerId).subscribe((response: any) => {
      this.kycDocumentUploadList = response.result;
      this.loadingService.hide();
    });
  }
  loadSingleCustomerInformation(customerId: Number) {
    this.loadingService.show();
    this.getSingleCustomerCompanyInfo(customerId);
    this.getSingleCustomerAddressInfo(customerId);
    this.getSingleCustomerPhoneContactInfo(customerId);
    this.getSingleCustomerEmploymentHistoryInfo(customerId);
    this.getSingleCustomerBoardInfo(customerId);
    this.getSingleCustomerShareholderIndividual(customerId);
    this.getSingleCustomerShareholderCorporate(customerId);
    this.getSingleCustomerAccountSignatoryInfo(customerId);
    this.getSingleCustomerClientInfo(customerId);
    this.getSingleCustomerSupplierInfo(customerId);
    this.getSingleCustomerChildrenInfo(customerId);
    this.getCustomerCASAInformation(customerId);
    this.getKYCDocumentUploads(customerId);
    this.getCustomerRelatedParty(customerId);
    this.loadingService.hide();
  }
  getKYCDocumentType() {
    this.customerService.getKYCDocumentType().subscribe((response: any) => {
      this.uploadDocumentType = response.result;
    });
  }
  getSectors() {
    this.loanAppService.getSector().subscribe((response: any) => {
      this.sectors = response.result;
      ////console.log("My Sector", this.sectors);
    });
  }
  getSubSectorBySector(sectId) {
    this.filteredSubsector = this.subSectors.filter(x => x.sectorId == sectId);

  }
  getFilteredSubsector() {
    this.loanAppService.getSubSector().subscribe((response: any) => {
      this.subSectors = response.result;
    });
  }
  viewDocument(id: number) {
    let doc = this.kycDocumentUploadList.find(x => x.documentId == id);
    if (doc != null) {
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayUpload = true;
    }
  }
  DownloadDocument(id: number) {
    let doc = this.kycDocumentUploadList.find(x => x.documentId == id);
    if (doc != null) {
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      let myDocExtention = doc.fileExtension;
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

  viewShareholderUltimateBeneficial(index) {
    const row = this.customerCompanyShareholderCorporate[index];
    let corporateId = row.companyDirectorId;
    this.corporateShareholderName = row.firstname;
    this.getCustomerShareholderUltimateBenefical(corporateId);
    this.displayViewUltimateBeneficial = true;
  }
  closeModal() {
    this.displayCustomerInfoDetails = false;
    this.hideCustomerInfo.emit("closed");
  }

  closed() {
    this.displayCustomerInfoDetails = false;
    this.displayLoanCustomerList = true;
    //this.displayLoadButton = true;
    //this.hideCustomerInfo.emit("closed");
  }
  proceedToApplication() {
    this.displayCustomerInfoDetails = false;
    //console.log('this.customerId', this.customerId);
    this.proceedEvent.emit({ continue: 'true', customerId: this.customerId });
  }

  // proceedToApplication() {
  //   const data = {
  //     customerId : 61, //this.customerId,
  //     loanTypeId : 1,
  //   }

  //   sessionStorage.setItem('customer-loan-details', JSON.stringify(data));
  //   this.router.navigate(['/credit/loan/customer/credit-bureau-report']);
  // }

  closeDetailsModal() {
    this.displayCustomerInfoDetails = false;
    this.hideCustomerInfo.emit("closed");
  }

  goForPenApplication(evt) {
   
    evt.preventDefault();
    const formObj = {
      customerId: this.customerSelection.customerId, //form.value.customerId,
      customerName: null, //form.value.customerName,
      customerCode: this.customerSelection.customerCode,
      productClassProcessId: null, //form.value.productClassProcessId,
      productClassId: null, //form.value.productClassId,
      loanAmount: null, //form.value.loanAmount,
      loanTypeId: null, //form.value.loanTypeId,
      relationshipManagerId: this.customerSelection.relationshipOfficerId, //this.customerSelection.relationshipManagerId,
      relationshipOfficerId: this.customerSelection.relationshipOfficerId,
      companyDirectors: null, //this.companyDirectors,
      companyShareholders: null, //this.companyShareholders,
      companyBvnInformation: null, //this.companyBvnInformation,
      customerTopClients: null, //this.customerTopClients,
      customerTopSuppliers: null, //this.customerTopSuppliers,
      penCode: '',
      penId: '',
      customerGroupId: null, //this.selectedGroup.customerGroupId,
      customerGroupName: null, // this.selectedGroup.customerGroupName,
      customerGroupCode: null, //this.selectedGroup.customerGroupCode,
      customerTypeId: this.customerSelection.customerTypeId,
      accountNumber: null, //form.value.accountNumber,
      taxIdentificationNumber: null, //form.value.taxIdentificationNumber,
      registrationNumber: null, //form.value.registrationNumber,
      existingExposure: null, //form.value.existingExposure,
      customerGroupMappings: null, //this.customerGroupMappings
    };

    sessionStorage.setItem('customer-loan-details', JSON.stringify(formObj));
    this.router.navigate(['/credit/loan/preliminary-evaluation']);
  }

  fetchAndAddCustomerAccounts() {
        
    this.loadingService.show();
    this.customerService.fetchAndAddCustomerAccounts(this.customerId).subscribe((response: any) => {
        if(response.success) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        }
        else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
        this.loadingService.hide();
    });
}


}

