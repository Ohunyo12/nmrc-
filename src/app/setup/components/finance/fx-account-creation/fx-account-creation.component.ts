import { LoadingService } from '../../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FxAccountService } from '../../../services/fx-account.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';
import { CustomerService } from '../../../../customer/services/customer.service';
import { AuthorizationService } from '../../../../admin/services';

@Component({
  selector: 'app-fx-account-creation',
  templateUrl: './fx-account-creation.component.html',
})
export class FXAccountCreationComponent implements OnInit {
  twoFactorAuthStaffCode: string;
  twoFactorAuthPassCode: string;
  displayTwoFactorAuth: boolean = false;
  twoFactorAuthEnabled: boolean = false;
  fxAccountCreationForm: FormGroup;
  displayAccountCreation: boolean = false;
  data: any = {};
  freeCode1: any[] = [];
  freeCode4: any[] = [];
  freeCode5: any[] = [];
  freeCode6: any[] = [];
  freeCode7: any[] = [];
  freeCode8: any[] = [];
  freeCode9: any[] = [];
  freeCode10: any[] = [];
  modeOfAdvances: any[] = [];
  natureOfAdvances: any[] = [];
  sectorCodes: any[] = [];
  sub_sectors: any[] = [];
  advanceTypes: any[] = [];
  borrowerCategoryCodes: any[] = [];
  occupationCodes: any[] = [];
  purposeOfAdvances: any[] = [];
  currencyCodes: any[] = [];
  schemeCodes: any[] = [];
  sol_Ids: any[] = [];
  glSubHeadCodes: any[] = [];
  displayCustomerInfo: boolean = false;
  customersInfo: any[];
  selectedCustomer: any = {};
  searchString: string;
  constructor(private loadingService: LoadingService,
    private fb: FormBuilder,
    private fxAccountService: FxAccountService,
    private customerService: CustomerService,
    private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.initializeControl();
    this.displayCustomerInfo = true;
    this.loadAllDropdownData();
  }
  loadAllDropdownData() {
    this.loadingService.show();
    this.fxAccountService.getAllFXAccountDropdownData().subscribe((response: any) => {
      this.data = response.result;
      if (this.data != undefined) {
        this.freeCode1 = this.data.freeCode1;
        this.freeCode4 = this.data.freeCode4;
        this.freeCode5 = this.data.freeCode5;
        this.freeCode6 = this.data.freeCode6;
        this.freeCode7 = this.data.freeCode7;
        this.freeCode8 = this.data.freeCode8;
        this.freeCode9 = this.data.freeCode9;
        this.freeCode10 = this.data.freeCode10;
        this.modeOfAdvances = this.data.modeOfAdvance;
        this.natureOfAdvances = this.data.natureOfAdvance;
        this.sectorCodes = this.data.sectorCode;
        this.sub_sectors = this.data.sub_sector;
        this.advanceTypes = this.data.advanceType;
        this.borrowerCategoryCodes = this.data.borrowerCategoryCode;
        this.occupationCodes = this.data.occupationCode;
        this.purposeOfAdvances = this.data.purposeOfAdvance;
        this.currencyCodes = this.data.currencyCode;
        this.schemeCodes = this.data.schemeCode;
        this.sol_Ids = this.data.sol_Ids;
        // this.glSubHeadCodes = this.data.glSubHeadCode;
      }
      this.loadingService.hide();
    });
  }
  getAllGLSubHeadCode(schemeCode) {
    this.fxAccountService.getAllGLSubHeadCode(schemeCode).subscribe((response: any) => {
      this.glSubHeadCodes = response.result;
    });
  }
  onSelectedSchemeCodeChanged(value) {
    this.getAllGLSubHeadCode(value);
  }
  showDialog() {
    this.initializeControl();
    this.displayAccountCreation = true;
  }
  initializeControl() {
    this.fxAccountCreationForm = this.fb.group({
      functionCode: ['A'],
      solId: [''],
      channel: ['FINTRAK'],
      currencyCode: [''],
      customerCode: [''],
      schemeCode: [''],
      generalLedgerSubHeadCode: [''],
      sectorCode: [''],
      subSectorCode: [''],
      accountOccupationCode: [''],
      borrowerCategoryCode: [''],
      purposeOfAdavance: [''],
      natureOfAdavance: [''],
      modeOfAdavance: [''],
      typeOfAdavance: [''],
      freeCodeOne: [''],
      freeCodeFour: [''],
      freeCodeFive: [''],
      freeCodeSix: [''],
      freeCodeSeven: [''],
      freeCodeEight: [''],
      freeCodeNine: [''],
      freeCodeTen: [''],
      username: [''],
      passCode: ['']
    });
  }
  onSelectedCustomerChanged() {
    this.displayAccountCreation = true
    this.displayCustomerInfo = false;
    if (this.selectedCustomer != null) {
      this.fxAccountCreationForm.get('customerCode').setValue(this.selectedCustomer.customerCode);
    }

  }
  backToSearch() {
    this.displayAccountCreation = false
    this.displayCustomerInfo = true;
    this.selectedCustomer = null;
  }
  searchForCustomerInfo(searchTerm) {
    this.loadingService.show();
    this.customerService.searchCustomerRealtime(searchTerm).subscribe(response => {
      this.loadingService.hide();
      if (response.success == true) {
        this.customersInfo = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
      }
    });
  }
  submitFSaccountCreation(formObj) {
    this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
      this.twoFactorAuthEnabled = res.result;
      if (this.twoFactorAuthEnabled == true) {
        this.displayTwoFactorAuth = true;
      } else {
        this.createFXAccount(formObj);
      }
    });
  }
  createFXAccount(formObj) {
    this.fxAccountCreationForm.get('username').setValue(this.twoFactorAuthStaffCode);
    this.fxAccountCreationForm.get('passCode').setValue(this.twoFactorAuthPassCode);
    const __this = this;
    let body = formObj.value;

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
      __this.fxAccountService.foreignAccountCreation(body).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.displayTwoFactorAuth = false;
          __this.backToSearch();
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      }, (err) => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss == 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }
}
