import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../../setup/services/collateral.service';
import { CollateralType, GlobalConfig } from 'app/shared/constant/app.constant';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalService } from 'app/setup/services';
import swal from 'sweetalert2';
import { DocumentUploadComponent } from 'app/shared/components/document-upload/document-upload.component';
import { LoanService } from 'app/credit/services';


@Component({
  selector: 'app-collateral-valuation',
  templateUrl: './collateral-valuation.component.html',
  // styleUrls: ['./collateral-valuation.component.scss']
})
export class CollateralValuationComponent implements OnInit {
  loanApplicationCollaterals: any;
  customerCollaterals: any[];
  selectedCustomerId: number;
  selectedCustomerName: string = '';

  @Input() showCustomerCollaterals: boolean = false;
  proposedCollaterals: any;
  @Input() loanApplicationId: number = null;
  @Input() applicationId: number = null;
  @Input() applicationCustomerId: number = null;
  @Input() applicationCustomerName: string;
  @Output() sum: EventEmitter<number> = new EventEmitter<number>();
  @Output() figures: EventEmitter<any> = new EventEmitter<any>();
  searchCustomerId: any;
  showCusotmerSearch: boolean;
  subTypes: any;
  mainCollateralDetail: any;
  isInsurancePolicy: any;
  isVisitation: any;
  customerCode: any;
  customerId: 0;
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
  collateralList: any[];
  activeTabindex: any;
  valuationReports: any;
  valuationReportTypes: any;
  showNewCollateralValuation: boolean = false;
  showNewValuationPrerequisite: boolean = false;
  collateralValuationForm: FormGroup;
  valuationPrerequisiteForm: FormGroup;
  collateralValuations: any[];
  collateralValuationsRequestList: any[] = [];
  selectedCollateralId: any;
  showDocumentUpload: boolean = false;
  collateralValuationId: any;
  operationId: any;
  deleteLink: boolean = true;
  showUploadForm: boolean = true;
  originalDocumentApprovals: any;
  approvalStatus: any;
  selectedRow: any;
  valuerInfor: any;
  showReport: boolean;
  showPrerequiteListDocumentUpload: boolean = false;
  valuationPrerequisites: any;
  selectedCollateralValuationId: number;
  targetId: any;
  showPrerequiteDocumentUpload: boolean = false;
  prerequisiteOperationId: any;
  valuationPrerequisiteId: any;
  cvForwardForm: FormGroup;
  cvForwardTitle = 'Collateral Valuation';
  showCvForward: boolean = false;
  selectedValuation: any;

  @Input() set reload(value: number) { if (value > 0) this.getOriginalDocumentApprovals(); }
  @ViewChild(DocumentUploadComponent, {static: false}) docUpload: DocumentUploadComponent;

  constructor(private collateralService: CollateralService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private loanBookingService: LoanService,
    private approvalService: ApprovalService, ) {
  }

  ngOnInit() {
    this.intializeCollateralValuationForm();
    this.intializeValuationPrerequisiteForm();
    this.getValuationRequestTypes();
    this.getCollateralValuationsRequestList();
    //this.getCollateralValuations(this.selectedCollateralId);
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

  loadCustomerCollaterals(customerId) {
    if (customerId != null) this.getCustomerCollateral(this.applicationCustomerId, this.applicationCustomerName);
  }

  getCollateralSubTypeName(id) {
    if (this.subTypes == null) return;
    let item = this.subTypes.find(x => x.collateralSubTypeId == id);
    return item == null ? 'n/a' : item.collateralSubTypeName;
  }

  getMappedCollateral() {
    this.loanApplicationCollaterals = [];
    if (this.loanApplicationId != null) {
      this.collateralService.getLoanApplicationCollateral(this.loanApplicationId).subscribe((response: any) => {
        this.loanApplicationCollaterals = response.result;
        this.getMappedSum();
        this.getMappedFigures();
      });
    }
  }

  getMappedSum() {
    var x = this.loanApplicationCollaterals != null && this.loanApplicationCollaterals != undefined ? true : false;
    const total: number = x ? this.loanApplicationCollaterals.map(x => x.securityValue).reduce((a, b) => +a + +b, 0) : 0;
    this.sum.emit(total);
  }

  getMappedFigures() { // still developing
    if (this.loanApplicationCollaterals != null && this.loanApplicationCollaterals != undefined) {
      const obj: any = this.loanApplicationCollaterals.map(x => { return { amount: x.securityValue, currency: x.currencyCode } });
      this.figures.emit(obj);
    }
  }

  getCustomerDetail(event, name = null): void {
    this.searchCustomerId = event.customerId;
    this.getCustomerCollateral(this.searchCustomerId);
    this.showCusotmerSearch = false;
  }


  getCollateralInformation(collateralCustomerId: number): any {
    this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
      .subscribe((res) => {
        this.mainCollateralDetail = res.result[0];
       // console.log(' this.mainCollateral', this.mainCollateralDetail);
       if (this.mainCollateralDetail.collateralId != null || this.mainCollateralDetail.collateralId != undefined){
        this.collateralService.GetCollateralDetailsByCollateral(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
          .subscribe((res) => {
           // console.log('res', res);
            this.customerCollateral = res.result;
            
            this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
            this.isVisitation = this.mainCollateralDetail.requireVisitation;
            this.collateralId = this.mainCollateralDetail.collateralId;
            this.customerName = this.mainCollateralDetail.customerName;
            this.customerId = this.mainCollateralDetail.customerId;
            this.customerCode = this.mainCollateralDetail.customerCode;
            this.customerCode = this.customerCode;

            if (this.mainCollateralDetail.collateralTypeId == CollateralType.IMMOVABLE_PROPERTY) { this.collateralProperty = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.MARKETABLE_SECURITIES) { this.collateralMarketableSecurity = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.GUARANTEE) { this.collateralGaurantee = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.PLANT_AND_EQUIPMENT) { this.collateralEquipment = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.VEHICLE) { this.collateralVehicle = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.STOCK) { this.collateralStock = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.PRECIOUS_METAL) { this.collateralPreciousMetal = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.CASA) { this.collateralCasa = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.FIXED_DEPOSIT) { this.collateralDeposit = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.POLICY) { this.collateralItemPolicy = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.PROMISSORY) { this.collateralPromissory = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.INDEMNITY) { this.indemnity = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.ISPO) { this.collateralIspo = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONCONTACT) { this.domiciliationContract = true; this.mainCollateralView = true; }
            if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONSALARY) { this.domiciliationSalary = true; this.mainCollateralView = true; }

            this.customerCollateral != null ? this.useSearch = false : this.useSearch = true;

            this.getSupportingDocuments(collateralCustomerId);
            this.getCollateralValuations(collateralCustomerId);
            // if (this.isInsurancePolicy) {
            //   this.getCollaterTempItemPolicies(collateralCustomerId);
            // }

          });

       }
        
        this.activeTabindex = 1;
      });
    this.hideGrid = true;
    return this.customerCollateral;
  }

  getSupportingDocuments(id) {
    this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
      this.supportingDocuments = response.result;
      ////console.log('documents..', response.result);
    });
  }

  getcollateralVisitation(id) {
    this.collateralService.getTempCollateralVisitationDetail(id).subscribe((response: any) => {
      this.collateralVisitation = response.result;
      // console.log('collateralVisitation..', response.result);
      // console.log('id..', id);
    });
  }

  getCollaterTempItemPolicies(id) {
    this.collateralService.getTempItemPolicyList(id).subscribe((response: any) => {
      this.insurancePolicies = response.result;
      ////console.log('insurancePolicies..', response.result);
    });
  }

  viewValuationDetail(row) {
   //console.log('row', row);
    this.selectedCollateralId = row.collateralId;
    this.customerCode = row.customerCode;
    this.getCollateralInformation(row.collateralId);
    this.selectedRow = row;
  //  console.log("collateralDetail:", collateralDetail);
  }

  addValuation(row) {
  //  console.log("row:", row);
  }

  onTabChange($event) {
    this.activeTabindex = $event.index;
  }

  getValuationReports() {
    this.collateralService.getValuationReports().subscribe((response: any) => {
      this.valuationReports = response.result;
    });
  }

  getValuationRequestTypes() {
    this.collateralService.getValuationRequestTypes().subscribe((response: any) => {
      this.valuationReportTypes = response.result;
    });
  }

  getCollateralValuations(collateralId: number) {
    this.collateralService.getCollateralValuations(collateralId).subscribe((response: any) => {
      this.collateralValuations = response.result;
    });
  }

  getCollateralValuationsRequestList() {
    this.collateralService.getCollateralValuationsRequestList().subscribe((response: any) => {
      this.collateralValuationsRequestList = response.result;
    });
  }

  getValuationPrerequisites(collateralValuationId: number) {
      this.selectedCollateralValuationId = collateralValuationId;
      this.activeTabindex = 3;
      this.collateralService.getValuationPrerequisites(collateralValuationId).subscribe((response: any) => {
        this.valuationPrerequisites = response.result;
    });
  }

  showPrerequiteList: boolean = false;
  valuationPrerequisitesList: any[]=[];
  getValuationPrerequisitesList(collateralValuationId: number) {
    this.selectedCollateralValuationId = collateralValuationId;
    this.collateralService.getValuationPrerequisitesList(collateralValuationId).subscribe((response: any) => {
      this.valuationPrerequisitesList = response.result;
      this.showPrerequiteList = true;
  });
}

approvalWorkflowData: any[]=[];
showPrerequiteListComments: boolean = false
getApprovalWorkFlowComments(d) {
    this.targetId = d.valuationPrerequisiteId;
    this.operationId = d.operationId;
     this.loanBookingService.getApprovalTrailByOperation(this.operationId, this.targetId).subscribe((res) => {
     this.approvalWorkflowData = res.result;
     this.showPrerequiteListComments = true;
   });
}
  addValuationReport(form) {
    let body = {
      //valuationReportId: this.valuationReportId,
      collateralValuationId: form.value.collateralValuationId,
      valuerId: form.value.valuerId,
      valuerComment: form.value.valuerComment,
      accountNumber: form.value.accountNumber,
      valuationFee: form.value.valuationFee,
      //WHT : 7,
    };

    this.collateralService.addValuationReport(body).subscribe((response: any) => {
      if (response.success == true) {
        //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
        // Todo close the modal
      }
    });
  }

  showCollateralValuationForm(){
    this.showNewCollateralValuation = true;
  }

  addCollateralValuation(form) {
    let body = {
      collateralCustomerId: this.selectedCollateralId,
      valuationName: form.value.valuationName,
      valuationReason: form.value.valuationReason,
    };

    this.collateralService.addCollateralValuation(body).subscribe((response: any) => {
      if (response.success == true) {
        this.collateralValuationForm.reset();
        this.showNewCollateralValuation = false; //showNewValuationPrerequisite
        this.activeTabindex = 2;
        this.getCollateralValuations(this.selectedCollateralId);
      }
    });
  }

  addValuationPrerequisite(form) {
   // console.log("test2: ", this.selectedCollateralValuationId);
    let body = {
      collateralValuationId: this.selectedCollateralValuationId,
      // collateralCustomerId: this.selectedCollateralId,
      valuationRequestTypeId: form.value.valuationReportId,
      valuationComment: form.value.valuationComment,
    };

    this.collateralService.addValuationPrerequisite(body).subscribe((response: any) => {
      if (response.success == true) {
        var data = response.response;
        this.showNewValuationPrerequisite = false;
        this.activeTabindex = 3;
        this.getValuationPrerequisites(this.selectedCollateralValuationId);
        //this.populatePreDocumentUploadProperties(data);
      }
    });
  }

  deleteValuationPrerequisite(valuationPrerequisiteId) {
    //console.log("valuationPrerequisiteId: ", valuationPrerequisiteId);this
    let thisClass = this;

    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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
      thisClass.collateralService.deleteValuationPrerequisite(valuationPrerequisiteId).subscribe((response: any) => {
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Deleted Successfully!', 'success');
         // console.log("test3: ", thisClass.selectedCollateralValuationId);
          thisClass.getValuationPrerequisites(thisClass.selectedCollateralValuationId);
        }
        else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Error occured while deleting this record! try again', 'error');
        }
      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });

  }

  showApprovalForm(row) {
    this.showCvForward = true;
    this.selectedValuation = row;
  }

  goForApproval(row) {
    let __this = this;
    //console.log("row: ", row);
    
    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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

      let body = {
        collateralCustomerId: __this.selectedCollateralId,
        collateralValuationId: __this.selectedCollateralValuationId,
        valuationPrerequisiteId: row.valuationPrerequisiteId,
        //comment: __this.cvForwardForm.controls['comment'].value,
      };

      __this.collateralService.goForApproval(body).subscribe((response: any) => {
        __this.approvalStatus = response.result;
        __this.getCollateralValuations(__this.selectedCollateralId);

        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.getValuationPrerequisites(__this.selectedCollateralValuationId);
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Error occured saving this record! try again', 'error');
        }
      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  intializeCollateralValuationForm() {
    this.collateralValuationForm = this.fb.group({
      valuationName: ['', Validators.required],
      valuationReason: ['', Validators.required],
    })
  }

  intializeValuationPrerequisiteForm() {
    this.valuationPrerequisiteForm = this.fb.group({
      valuationComment: ['', Validators.required],
      valuationReportId: ['', Validators.required],
    });

    this.cvForwardForm = this.fb.group({
      forward: [''],
      comment: ['', Validators.required]
    });
  }

  // uploadDocument(row) {
  //   this.collateralValuationId = row.collateralValuationId;
  //   this.operationId = row.operationId;
  //   this.showDocumentUpload = true;

  //   this.docUpload.customerId = this.customerId;
  //   this.docUpload.targetId = row.collateralValuationId;
  //   this.docUpload.operationId = row.operationId;
  //   this.docUpload.getDocumentsByTarget();
  // }
  reloadDocsOnly: number = 0;
  populatePreDocumentUploadProperties(row) {
    this.reloadDocsOnly = 1;
    this.customerId = this.customerId;
    this.targetId = row.valuationPrerequisiteId;
    this.operationId = row.operationId;
    this.showPrerequiteListDocumentUpload = true;
    this.docUpload.customerId = this.customerId;
    this.docUpload.targetId = row.valuationPrerequisiteId;
    this.docUpload.operationId = row.operationId;
    this.docUpload.getDocumentsByTarget();
  }

  populatePreDocumentUploadPropertiesList(row) {
    this.reloadDocsOnly = 1;
    this.customerId = this.customerId;
    this.targetId = row.valuationPrerequisiteId;
    this.operationId = row.operationId;
    this.docUpload.customerId = this.customerId;
    this.docUpload.targetId = row.valuationPrerequisiteId;
    this.docUpload.operationId = row.operationId;
    this.docUpload.getDocumentsByTarget();
    this.showPrerequiteListDocumentUpload = true;
  }

  deleteValuation(d) {
    //   this.collateralService.getValuationReports().subscribe((response: any) => {
    //   this.valuationReports = response.result;
    // });
  }

  getOriginalDocumentApprovals() {
    this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
      this.originalDocumentApprovals = response.result;
    });
  }

  viewValuerReport(d) {
   // console.log('d.collateralValuationId', d.collateralValuationId);

    this.collateralService.getAllCollateralValuerIformationById(d.collateralValuationId).subscribe((response: any) => {
      this.valuerInfor = response.result;

     // console.log('this.valuerInfor', this.valuerInfor);

      if (this.valuerInfor.length == 0) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'No Record Found!', 'warning');
      } else {
        this.showReport = true;
      }
    });
  }


}
