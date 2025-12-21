import { LoanApplicationService } from '../../../../credit/services/loan-application.service';
import { CustomerInformationDetailComponent } from '../../../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { LoanOperationService } from '../../../../credit/services/loan-operations.service';
import { CustomerService } from '../../../../customer/services/customer.service';
import { GlobalConfig, CustomerModificationTypeEnum } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryStateService } from '../../../../setup/services';

@Component({
  selector: 'app-customer-approval',
  templateUrl: './customer-approval.component.html',
})
export class CustomerApprovalComponent implements OnInit {
  showSpinnerChangeLog: boolean = false;
  isOtherCustomer: boolean = false;
  customerAddedChildren: any[] = [];
  customerCompanyUltimateBeneficial: any[] = [];
  sectors: any[] = [];
  customerTypes: any[] = [];
  maritalStatusList: any[] = [];
  usersFormGroup: FormGroup;
  displayCustomerModal = false;
  customerApprovalData: any[] = [];
  selectedCustomerData: any = {};
  approvalStatusData: any[];
  approvalWorkflowData: any[];

  customerSelection: any = {};
  customerCompanyInfomation: any = {};
  customerAddresses: any[];
  customerPhoneContact: any[];
  customerCompanyDirectors: any[];
  customerCompanyAccountSignatory: any[];
  customerSupplier: any[];
  customerClient: any[];
  customerCompanyShareholderIndividual: any[];
  customerCompanyShareholderCorporate: any[];
  customerEmploymentHistory: any[];
  isCorperateCustomer: boolean = false;
  activeIndex = 0;
  @ViewChild(CustomerInformationDetailComponent , {static: false}) customerInfo: CustomerInformationDetailComponent;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private approvalService: ApprovalService, private customerService: CustomerService,
    private genSetupService: GeneralSetupService, private loanOperationService: LoanOperationService,
    private countryStateSrv: CountryStateService,
    private loanAppService: LoanApplicationService, ) { }

  ngOnInit() {
    this.loadingService.show();
    this.loadCustomerDropdowns();
    this.getAllCustomerInformationsAwaitingApproval();
    this.getAllApprovalStatus();
  }
  getAllCustomerInformationsAwaitingApproval(): void {
    this.showSpinnerChangeLog = true;
    this.customerService.GetAllCustomerInformationAwaitingApproval().subscribe((response: any) => {
      this.customerApprovalData = response.result;
      this.showSpinnerChangeLog = false;
      this.loadingService.hide();
    });
  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
      const tempData = response.result;
      this.approvalStatusData = tempData.slice(2, 4);
    });
  }

  viewCustomerDetails(index, evt) {
    evt.preventDefault();
    this.selectedCustomerData = {};
    this.reset();
    this.selectedCustomerData = index; //this.customerApprovalData[index];
    this.customerInfo.viewSingleCustomerDetails(this.selectedCustomerData.customerId);
    //this.loadSingleCustomerInformation(this.selectedCustomerData.customerId, this.selectedCustomerData.modificationTyepId, this.selectedCustomerData.targetId);

    const dataObj = this.selectedCustomerData;
    this.loanOperationService.getLoanApprovalDetails(dataObj.customerModificationId, dataObj.operationId).subscribe((res) => {
      this.approvalWorkflowData = res.result;
    });

    this.displayCustomerModal = true;

  }



  goForApproval(formObj, event) {
    let loading = this.loadingService;
    let srv = this.customerService;

    let bodyObj = {
      targetId: formObj.customerModificationId,
      approvalStatusId: formObj.approvalStatusId,
      comment: formObj.comment
    };

    this.displayCustomerModal = false;

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
      __this.customerService.sendForApproval(bodyObj).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.getAllCustomerInformationsAwaitingApproval();
        } else {
          __this.displayCustomerModal = true;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      }, (err) => {
        __this.loadingService.hide();
        __this.displayCustomerModal = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  cancelApproval(event) {
    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
    this.displayCustomerModal = false;
  }

  hideModal() {
    this.handleChange(0);
    this.activeIndex = 0;
    this.displayCustomerModal = false;
  }

  handleChange(e) {
    this.activeIndex = e.index;
  }

  getMaritalStatus(id) {
    if (this.maritalStatusList === undefined) { return }
    let item = this.maritalStatusList.find(x => x.MaritalStatusId == id);
    if (item != undefined) { return item.MaritalStatus; }
    return 'n/a';
  }
  getCustomerType(id) {
    let item = this.customerTypes.find(x => x.customerTypeId == id);
    if (item != undefined) { return item.name; }
    return 'n/a';
  }
  loadCustomerDropdowns() {
    this.customerService.getAllCustomerTypes().subscribe((response: any) => {
      this.customerTypes = response.result;
    });
    this.loanAppService.getSector().subscribe((response: any) => {
      this.sectors = response.result;
    });
    this.maritalStatusList = this.customerService.getMaritalStatusList()
  }
  getCustomerSensitivityLevel(id) {
    return this.customerService.getCustomerSensitivityLevel(id);
  }
  getSectorBySectoeId(id) {
    let item = this.sectors.find(x => x.lookupId == id);
    if (item != undefined) { return item.lookupName; }
    return 'n/a';
  }

  getSingleCustomerGeneralInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerGeneralInfo(customerId, targetId).subscribe((response: any) => {
      this.customerSelection = response.result;
      if (this.customerSelection.customerTypeId == 2) {
        this.isCorperateCustomer = true;
        this.isOtherCustomer = false;
      } else {
        this.isOtherCustomer = true;
        this.isCorperateCustomer = false;
      }
    });
  }
  getSingleCustomerCompanyInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerCompanyInfo(customerId, targetId).subscribe((response: any) => {
      this.customerCompanyInfomation = response.result;
    });
  }
  getSingleCustomerAddressInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerAddressInfo(customerId, targetId).subscribe((response: any) => {
      this.customerAddresses = response.result;
    });
  }
  getSingleCustomerPhoneContactInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerPhoneContactInfo(customerId, targetId).subscribe((response: any) => {
      this.customerPhoneContact = response.result;
    });
  }
  getSingleCustomerEmploymentHistoryInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerEmploymentHistoryInfo(customerId, targetId).subscribe((response: any) => {
      this.customerEmploymentHistory = response.result;
    });
  }
  getSingleCustomerBoardInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerBoardInfo(customerId, targetId).subscribe((response: any) => {
      this.customerCompanyDirectors = response.result;
    });
  }
  getSingleCustomerShareholderIndividual(customerId, targetId) {
    this.customerService.getSingleTempCustomerShareholderIndividual(customerId, targetId).subscribe((response: any) => {
      this.customerCompanyShareholderIndividual = response.result;
    });
  }
  getSingleCustomerShareholderCorporate(customerId, targetId) {
    this.customerService.getSingleTempCustomerShareholderCorporate(customerId, targetId).subscribe((response: any) => {
      this.customerCompanyShareholderCorporate = response.result;
    });
  }
  getCustomerShareholderUltimateBenefical(companyDirectorId) {
    this.customerService.getCustomerShareholderUltimateBenefical(companyDirectorId).subscribe((response: any) => {
      this.customerCompanyUltimateBeneficial = response.result;
    });
  }
  getSingleCustomerAccountSignatoryInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerAccountSignatoryInfo(customerId, targetId).subscribe((response: any) => {
      this.customerCompanyAccountSignatory = response.result;
    });
  }
  getSingleCustomerClientInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerClientInfo(customerId, targetId).subscribe((response: any) => {
      this.customerClient = response.result;

    });
  }
  getSingleCustomerSupplierInfo(customerId, targetId) {
    this.customerService.getSingleTempCustomerSupplierInfo(customerId, targetId).subscribe((response: any) => {
      this.customerSupplier = response.result;
    });
  }
  getSingleCustomerChildrenInfo(customerId, targetId) {
    this.customerService.getSingleCustomerChildrenInfo(customerId).subscribe((response: any) => {
      this.customerAddedChildren = response.result;
    });
  }
  loadSingleCustomerInformation(customerId, modificationId, targetId) {
    this.loadingService.show();
    if (modificationId == CustomerModificationTypeEnum.General_Information) {
      this.getSingleCustomerGeneralInfo(customerId, targetId);
    }
    else if (modificationId == CustomerModificationTypeEnum.Corporate_Information) {
      this.getSingleCustomerCompanyInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Address_Addition || modificationId == CustomerModificationTypeEnum.Address_Modification) {
      this.getSingleCustomerAddressInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Phone_Number_Addition || modificationId == CustomerModificationTypeEnum.Phone_Number_Modification) {
      this.getSingleCustomerPhoneContactInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Employement_History_Addition || modificationId == CustomerModificationTypeEnum.Employment_History_Modification) {
      this.getSingleCustomerEmploymentHistoryInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Director_Addition || modificationId == CustomerModificationTypeEnum.Director_Modification) {
      this.getSingleCustomerBoardInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Shareholder_Addition || modificationId == CustomerModificationTypeEnum.Shareholder_Modification) {
      this.getSingleCustomerShareholderIndividual(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Shareholder_Addition || modificationId == CustomerModificationTypeEnum.Shareholder_Modification) {
      this.getSingleCustomerShareholderCorporate(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Signatory_Adition || modificationId == CustomerModificationTypeEnum.Signatory_Modification) {
      this.getSingleCustomerAccountSignatoryInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Client_Addition || modificationId == CustomerModificationTypeEnum.Client_Modification) {
      this.getSingleCustomerClientInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Supplier_Addition || modificationId == CustomerModificationTypeEnum.Suplier_Modification) {
      this.getSingleCustomerSupplierInfo(customerId, targetId);
    } else if (modificationId == CustomerModificationTypeEnum.Customer_Children_Addition || modificationId == CustomerModificationTypeEnum.Customer_Children_Modification) {
      this.getSingleCustomerChildrenInfo(customerId, targetId);
    }
    this.loadingService.hide();
  }
  reset() {
    this.customerSelection = null;
    this.customerCompanyInfomation = null;
    this.customerAddresses = null;
    this.customerPhoneContact = null;
    this.customerCompanyDirectors = null;
    this.customerCompanyAccountSignatory = null;
    this.customerSupplier = null;
    this.customerClient = null;
    this.customerCompanyShareholderIndividual = null;
    this.customerCompanyShareholderCorporate = null;
    this.customerEmploymentHistory = null;
  }
}


