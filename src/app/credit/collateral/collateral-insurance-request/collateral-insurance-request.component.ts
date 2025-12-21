import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../../setup/services/collateral.service';
import { CollateralType, GlobalConfig } from 'app/shared/constant/app.constant';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { ApprovalService } from 'app/setup/services';
import swal from 'sweetalert2';


@Component({
  selector: 'app-collateral-insurance-request',
  templateUrl: './collateral-insurance-request.component.html'
})
export class CollateralInsuranceRequestComponent implements OnInit {
  loanApplicationCollaterals: any;
  customerName: any;
  collateralId: any;
  customerCollateral: any;
  useSearch: boolean;
  hideGrid: boolean;
  collateralProperty: boolean;
  mainCollateralView: boolean;
  collateralMarketableSecurity: boolean;
  collateralGaurantee: boolean;
  collateralEquipment: boolean;
  collateralVehicle: boolean;
  collateralStock: boolean;
  collateralPreciousMetal: boolean;
  collateralCasa: boolean;
  collateralDeposit: boolean;
  collateralItemPolicy: boolean;
  collateralPromissory: boolean;
  indemnity: boolean;
  collateralIspo: boolean;
  domiciliationContract: boolean;
  domiciliationSalary: boolean;
  supportingDocuments: any;
  collateralVisitation: any;
  insurancePolicies: any;
  testCollaterals: any;
  mainCollateral: any;
  collateralList: any;
  activeTabindex: any;
  valuationReports: any;
  valuationReportTypes: any;
  showNewCollateralValuation: boolean = false;
  showNewValuationPrerequisite: boolean = false;
  insuranceRequestForm: FormGroup;
  valuationPrerequisiteForm: FormGroup;
  collateralValuations: any;
  selectedCollateralId: any;
  showDocumentUpload: boolean = false;
  collateralValuationId: any;
  operationId: any;
  deleteLink: boolean = true;
  showUploadForm: boolean = true;
  originalDocumentApprovals: any;
  approvalStatus: any;
  selectedRow: any;
  customerId: any;
  valuerInfor: any;
  showReport: boolean;
  valuationPrerequisites: any;
  selectedCollateralValuationId: number;
  insuranceRequest: boolean = false;
  insuranceForm: FormGroup;
  insuranceType: any;
  insuranceCompany: any;
  currentDate: Date;
  selectedId: number = null;
  fillInsuranceForm: boolean = false;
  searchCustomerId: any;
  showCusotmerSearch: boolean;
  applicationCustomerId: any;
  applicationCustomerName: any;
  referenceNumber: any;
  insuranceRequests: any;
  show: boolean = false; message: any; title: any; cssClass: any;
  formState: string;
  approvalStatusId: any;
  insuranceRequestId: any;
  editRow: any;
  showInsuranceSearch:boolean;


  constructor(private collateralService: CollateralService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private approvalService: ApprovalService, ) {
  }

  ngOnInit() {
    this.intializeForms();
    this.loadDropdowns();
    this.currentDate = new Date();
    this.getInsuranceRequests();
  }

  loadDropdowns() {

    this.collateralService.getInsuranceType().subscribe((response: any) => {
      this.insuranceType = response.result;
    });

    this.collateralService.getInsuranceCompany().subscribe((response: any) => {
      this.insuranceCompany = response.result;
    });
  }

  getCustomerCollateral(id, name = null): void {
    this.loadingService.show();
    this.collateralService.getCustomerCollateral(id, null).subscribe((response: any) => {
      this.collateralList = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  // getCustomerInsuranceSearch(id, name = null): void {
  //   this.loadingService.show();
  //   this.collateralService.insuranceSearch(id).subscribe((response: any) => {
  //     this.collateralList = response.result;
  //     this.loadingService.hide();
  //   }, (err) => {
  //     this.loadingService.hide(1000);
  //   });
  // }

  loadCustomerCollaterals(customerId) {
    if (customerId != null) this.getCustomerCollateral(this.applicationCustomerId, this.applicationCustomerName);
  }



  getCustomerDetail(id, name = null): void {
    this.searchCustomerId = id;
    this.getCustomerCollateral(this.searchCustomerId);
    this.showCusotmerSearch = false;
  }

  // getCustomerInsuranceDetail(id, name = null): void {
  //   this.searchCustomerId = id;
  //   this.getCustomerInsuranceSearch(this.searchCustomerId);
  //   this.showInsuranceSearch = false;
  // }

  getCollaterTempItemPolicies(id) {
    this.collateralService.getTempItemPolicyList(id).subscribe((response: any) => {
      this.insurancePolicies = response.result;
    });
  }

  onTabChange($event) {
    this.activeTabindex = $event.index;
  }
  
  hideMessage(event) { this.show = false; }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  saveInsuranceRequest(form) {

    
    let body = {
      collateralCustomerId: this.selectedCollateralId,
      requestNumber: form.value.requestNumber,
      requestReason: form.value.requestReason,
      requestComment: form.value.requestComment,
      approvalStatusId: form.value.approvalStatusId,
    };

    if (form.value.approvalStatusId == 5)  //approval Status for a referred document
    {
      this.loadingService.show();
      this.collateralService.updateInsuranceRequest(body, this.insuranceRequestId).subscribe((response: any) => {
        if (response.success == true) {
          this.loadingService.hide();
          this.goForApproval(this.editRow);
          this.insuranceRequest = false;
          this.activeTabindex = 1;
          this.intializeForms();
        }
        else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
    }
    else {
      this.loadingService.show();
      this.collateralService.addCollateralInsuranceRequest(body, this.insuranceRequestId).subscribe((response: any) => {
        if (response.success == true) {

          this.getInsuranceRequests();
          this.insuranceRequest = false;
          this.activeTabindex = 1;
          this.intializeForms();
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        }
        else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
    }

  }

  intializeForms() {
    this.insuranceRequestForm = this.fb.group({
      requestNumber: ['', Validators.required],
      requestReason: ['', [Validators.required, Validators.maxLength(50)]],
      requestComment: ['', [Validators.required, Validators.maxLength(200)]],
      approvalStatusId: ['']
    });

  }


  getOriginalDocumentApprovals() {
    this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
      this.originalDocumentApprovals = response.result;
    });
  }

  GetInsuranceDetail(id) {
    if (id == 2) {

    } else {
      this.insuranceForm.controls['referenceNumber'].setValue("");
      this.insuranceForm.controls['sumInsured'].setValue("");
      this.insuranceForm.controls['startDate'].setValue("");
      this.insuranceForm.controls['expiryDate'].setValue("");
      this.insuranceForm.controls['inSurPremiumAmount'].setValue("");
      this.insuranceForm.controls['description'].setValue("");
      this.insuranceForm.controls['premiumPercent'].setValue("");
      //  this.insuranceForm.controls['policyState'].setValue("");
      this.insuranceForm.controls['companyAddress'].setValue("");
    }
  }

  getInsurerAddress(d) {

    let record = this.insuranceCompany.filter(x => x.insuranceCompanyId == d);

    this.insuranceForm.controls["companyAddress"].setValue(record[0].address + ", " + record[0].phoneNumber + ", " + record[0].email)
  }

  SaveInsurance(form) {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "This will cannot be reversed. Are you sure you want to proceed?",
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

      let data = {
        collateraalId: __this.selectedCollateralId,
        referenceNumber: form.value.referenceNumber,
        sumInsured: form.value.sumInsured,
        insuranceCompany: form.value.insuranceCompany,
        startDate: form.value.startDate,
        expiryDate: form.value.expiryDate,
        insuranceType: form.value.insuranceType,
        inSurPremiumAmount: form.value.inSurPremiumAmount,
        description: form.value.description,
        premiumPercent: form.value.premiumPercent,
        policyState: form.value.policyState,
        previousInsurance: form.value.previousInsurance,
        companyAddress: form.value.companyAddress,
        insuranceTypeId: form.value.insuranceTypeId,
        insuranceCompanyId: form.value.insuranceCompanyId,
        prevoiusInsuranceId: form.value.prevoiusInsuranceId,
      }
      __this.collateralService.addInsurancePolicy(data).subscribe((response: any) => {
        // console.log('response.success', response.success);

        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
          __this.insuranceRequest = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }

      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  goForApproval(d) {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "This will cannot be reversed. Are you sure you want to proceed?",
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
      __this.collateralService.insuranceRequestGoForApproval(d).subscribe((response: any) => {

        if (response.success == true) {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Transaction has been Successfully sent for Approval', 'success');
          __this.getInsuranceRequests();
        } else {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }

      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  addInsurance(id) {

    this.insuranceRequestId = null;
    this.formState = 'New'
    this.insuranceRequestForm.controls['requestNumber'].setValue(Math.floor(Math.random() * 1000001));  //set random number
    this.insuranceRequest = true;
    this.selectedCollateralId = id.collateralId;
    // console.log('rowId', id);
  }

  getInsuranceRequests() {
    this.collateralService.getInsuranceRequests().subscribe((response: any) => {
      this.insuranceRequests = response.result;
     // console.log('INSURANCE REQUESTS', this.insuranceRequests);
    });
  }


  remove(data) {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to Remove request?",
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
      __this.collateralService.removeInsuranceRequest(data.insuranceRequestId).subscribe((response: any) => {
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.getInsuranceRequests();
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }



  edit(data) {
    this.editRow = data;

    this.insuranceRequestId = data.insuranceRequestId;
    this.intializeForms();
    this.insuranceRequestForm.controls['requestNumber'].setValue(data.requestNumber);
    this.insuranceRequestForm.controls['requestReason'].setValue(data.requestReason);
    this.insuranceRequestForm.controls['requestComment'].setValue(data.requestComment);
    this.insuranceRequestForm.controls['approvalStatusId'].setValue(data.approvalStatusId);
    this.formState = 'Edit';
    this.insuranceRequest = true;

  }

  reinitiateRequest(row) {
   // console.log(row);
    this.selectedCollateralId = row.collateralId;
    this.insuranceRequestId = row.insuranceRequestId;
     this.intializeForms();
    this.insuranceRequestForm.controls['requestNumber'].setValue(Math.floor(Math.random() * 1000001));  //set random number
    this.insuranceRequestForm.controls['requestReason'].setValue(row.requestReason);
    this.insuranceRequestForm.controls['requestComment'].setValue(row.requestComment);
    this.insuranceRequestForm.controls['approvalStatusId'].setValue(row.approvalStatusId);
    this.formState = 'Reinitiate';
    this.insuranceRequest = true;
  }

}
