import { Component, OnInit, ViewChild } from '@angular/core';
import { CollateralService, StaffRoleService } from 'app/setup/services';
import { CollateralType, GlobalConfig } from 'app/shared/constant/app.constant';
import { FormBuilder, Validators, FormGroupDirective, FormGroup } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { LoanApplicationService } from 'app/credit/services';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { LoanService } from 'app/credit/services';
import { DocumentUploadComponent } from 'app/shared/components/document-upload/document-upload.component';


@Component({
  selector: 'app-collateral-valuation-approval',
  templateUrl: './collateral-valuation-approval.component.html',
  //styleUrls: ['./collateral-valuation-approval.component.scss']
})
export class CollateralValuationApprovalComponent implements OnInit {

  mainCollateralDetail: any;
  isInsurancePolicy: any;
  isVisitation: any;
  referenceNumber: any;
  collateralId: any;
  customerName: any;
  customerCode: any;
  customerCollateral: any;
  collateralProperty: boolean;
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
  mainCollateralView: boolean;
  useSearch: boolean;
  activeTabindex: number;
  showNewCollateralValuation = false;
  hideGrid: boolean;
  collateralValuations: any;
  commentForm: any;
  showApprovalButton: boolean = true;
  displayCommentForm: boolean;
  comment: any;
  approvalStatusId: any;
  valuationPrerequisites: any[];
  approvalValuations: any;
  targetId: number;
  currentLevelId: number;
  displayApprovalForm: boolean;
  valuerInfoForm: FormGroup;
  valuers: any[];
  showValurerInfo: boolean = false;
  collateralValuationId: any;
  hideValuer: any = true;
  collateralValuation: any;
  operationId: number;
  trailApprovalLevels: any;
  valuationPrerequisite: any;
  hideApproval: boolean = false;
  valuationPrerequisiteId: any;
  showValuereDocumentUpload: boolean = false;
  valuerId: any;
  valuerOperationId: any;
  customerId: any;
  isSelected: any;
  deleteLink: boolean = true;
  deleteLink2: boolean = false;
  reload: any;

  valuerInfor: any[];
  hideButton: boolean = false;
  whoValualtionDetail: boolean;
  showValuationPrerequisite: boolean = false;
  valuationPrerequisiteForm: FormGroup;
  documentUploadForm: FormGroup;
  narrationForm: FormGroup;
  valuerInfors: any[];

  @ViewChild(DocumentUploadComponent, {static: false}) docUpload: DocumentUploadComponent;
  valuationReportTypes: any;
  collateralCode: any;
  approvalStatus: string;
  valuationRequestType: any;
  isReferred: boolean = false;
  isLms: boolean = false;
  status: any;
  staffRoleId: any;
  documentUploads: any[] = [];
  makeAddValuerButtonVisible: boolean = false;
  show: boolean = false; message: any; title: any; cssClass: any;
  userisAnalyst: boolean = false;
  userIsRelationshipManager = false;
  userIsAccountOfficer = false;
  staffRoleRecord: any;

  fileDocument: any;
  binaryFile: string;
  selectedDocument: any;
  displayDocument: boolean = false;
  myPdfFile: any;
  approvalWorkflowData: any;
  valuationOfficer: any;
  showAddValuerButton: boolean = false;
  singleValuerInfor: any;
  documentDeleted: any[] = [];

  documentTypes: any[] = [];
  documentCategories: any[] = [];
  files: FileList;
  file: File;
  documentDates: boolean = false;
  displayNarration: boolean = false;
  isAllowed: boolean = false;

  constructor(private collateralService: CollateralService,
    private creditAppraisalService: CreditAppraisalService,
    private fb: FormBuilder, private loadingService: LoadingService,
    private loanApplService: LoanApplicationService,
    private loanBookingService: LoanService,
    private camService: CreditAppraisalService,
    private staffRole: StaffRoleService,

  ) { }

  ngOnInit() {
    this.getValuationRequestWaitingForApproval();
    this.showCommentForm(false);
    this.intializeCollateralValuationForm();
    this.getValuer();
    this.getValuationRequestTypes();
    this.disableAddInsuranceButton();
    this.getUserRole();
    this.getDocumentCategories();
    this.clearControls();
  }

  clearControls() {
    this.documentUploadForm = this.fb.group({
      fileName: [''],
      fileExtension: [''],
      fileSize: [''],
      fileSizeUnit: [''],
      fileData: ['', Validators.required],
      issueDate: [''],
      expiryDate: [''],
      physicalFilenumber: [''],
      physicalLocation: [''],
      documentTypeId: ['', Validators.required],
      documentCategoryId: ['', Validators.required]
    });
  }


  getDeletedDocumentsByTarget() {

    if (this.operationId == undefined || this.targetId == undefined) {
      return;
    }
    this.loadingService.show();
    this.creditAppraisalService.getDeletedDocumentsByTarget(this.operationId, this.targetId).subscribe((response: any) => {
      this.loadingService.hide();
      this.documentDeleted = response.result;
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
  }


  getDocumentTypesByCategory(id) {
    this.creditAppraisalService.getDocumentTypesByCategory(id).subscribe((response: any) => {
      this.documentTypes = response.result;
    });
  }

  getDocumentCategories() {
    this.creditAppraisalService.getDocumentCategories().subscribe((response: any) => {
      this.documentCategories = response.result;
    });
  }

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }

  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  customerGroupId: any;
  saveDocumentUpload(form, overwrite = false) {

    let body = {
      fileName: this.file.name,
      fileExtension: this.fileExtention(this.file.name),
      fileSize: this.file.size,
      issueDate: form.value.issueDate,
      expiryDate: form.value.expiryDate,
      documentTypeId: form.value.documentTypeId,
      fileSizeUnit: 'kilobyte',
      operationId: this.operationId,
      customerGroupId: this.customerGroupId == null ? 0 : this.customerGroupId,
      customerId: this.customerId == null ? 0 : this.customerId,
      targetId: this.targetId,
      targetReferenceNumber: this.targetId,
      overwrite: overwrite
    };


    this.loadingService.show();
    // if (this.selectedId === null) {
    this.creditAppraisalService.uploadDocument(this.file, body).then((response: any) => {
      this.loadingService.hide();
      if (response.result == 3) {
        this.confirmOverwrite();
      } else {
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          this.reloadGrid();
        }
        else { this.finishBad(response.message); }
      }
    }, (err: any) => {
      this.loadingService.hide();
      this.finishBad(JSON.stringify(err));
    });
    //}
    //  else {
    //   this.creditAppraisalService.updateDocument(body, this.selectedId).subscribe((response: any) => {
    //     this.loadingService.hide();
    //     if (response.success == true) {


    //       swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
    //       this.reloadGrid();
    //     }
    //     else this.finishBad(response.message);
    //   }, (err: any) => {
    //     this.loadingService.hide();
    //     this.finishBad(JSON.stringify(err));
    //   });
    // }
  }

  finishGood() { this.loadingService.hide(); }
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  reloadGrid() {
    this.clearControls();
    this.getDocumentsByTargets();
  }

  hideMessage(event) { this.show = false; }

  confirmOverwrite(): void {
    const __this = this;
    swal({
      title: 'File already exist!',
      text: 'Are you sure you want to OVERWRITE it?',
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
      __this.saveDocumentUpload(__this.documentUploadForm, true);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }


  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
      this.staffRoleRecord = res.result;

      if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
        this.userIsAccountOfficer = true;
      }
      if (this.staffRoleRecord.staffRoleCode == 'DOM OPS OFFICER' || this.staffRoleRecord.staffRoleCode == 'DOM OPS CHECKER' || this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RM') {
        this.userIsRelationshipManager = true;
      } if (this.staffRoleRecord.staffRoleCode == 'VAL CR DOC OFF' || this.staffRoleRecord.staffRoleCode == 'CRDT DOC GH' || this.staffRoleRecord.staffRoleCode == 'CR DOC MGR') {
        this.valuationOfficer = true;
      } if (this.staffRoleRecord.staffRoleCode == 'DOM OPS OFFICER' || this.staffRoleRecord.staffRoleCode == 'DOM OPS CHECKER') {
        this.isAllowed = true;
      }
      if (this.staffRoleRecord.staffRoleCode == 'DOM OPS OFFICER') {
        this.displayNarration = true;
      }
    });
  }

  downloadDocument(row, view = false) {
    this.fileDocument = null;
    this.loadingService.show();
    this.creditAppraisalService.downloadDocument(row.documentUploadId).subscribe((response: any) => {
      this.fileDocument = response.result;

      if (this.fileDocument != null) {
        this.loadingService.hide();
        const downloadedFileName = this.fileDocument.fileName;
        this.binaryFile = this.fileDocument.fileData;
        this.selectedDocument = this.fileDocument.fileName;

        if (view) {
          this.displayDocument = true;
          return;
        }

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
            var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'png' || myDocExtention == 'png') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'image/png' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'doc' || myDocExtention == 'docx') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'application/msword' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
      }

    }, (error) => {
      this.loadingService.hide(1000);
    });
  }

  getDocumentsByTargets() {
    if (this.operationId == undefined || this.targetId == undefined) {
      return;
    }
    if (this.isLms) {
      this.loadingService.show();
      this.creditAppraisalService.getDocumentsByTargetLms(this.operationId, this.targetId, false, this.isLms).subscribe((response: any) => {
        this.loadingService.hide();
        this.documentUploads = response.result;
      }, (err: any) => {
        this.loadingService.hide(1000);
      });
    } else {
      this.loadingService.show();
      this.creditAppraisalService.getDocumentsByTarget(this.operationId, this.targetId, false).subscribe((response: any) => {
        this.loadingService.hide();
        this.documentUploads = response.result;
      }, (err: any) => {
        this.loadingService.hide(1000);
      });
    }
  }


  getCollateralValuation(collteralValuationId) {
    this.collateralService.getCollateralValuation(collteralValuationId).subscribe((response: any) => {
      if (response.success == true) {
        this.collateralValuation = response.result;
      }
    });
  }

  public getCollateralInformation(collateralCustomerId: number): any {
    this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
      .subscribe((res) => {
        
        this.mainCollateralDetail = res.result[0];
       
if (this.mainCollateralDetail.collateralId != null || this.mainCollateralDetail.collateralId != undefined){
  this.collateralService.GetCollateralDetailsByCollateral(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
  .subscribe((res) => {
    
    this.customerCollateral = res.result;
    
    this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
    this.isVisitation = this.mainCollateralDetail.requireVisitation;
    this.collateralId = this.mainCollateralDetail.collateralId;
    this.customerName = this.mainCollateralDetail.customerName;
    this.referenceNumber = this.mainCollateralDetail.referenceNumber;
    this.customerCode = this.mainCollateralDetail.customerCode;

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

    // this.getSupportingDocuments(collateralCustomerId);
    // this.getCollateralValuations(collateralCustomerId);
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

  showCommentForm(init = true) {
    this.showApprovalButton = false;
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      approvalLevelId: ['', Validators.required]
    });
    if (init == true) this.displayCommentForm = true;
  }

  onTabChange($event) {
    this.activeTabindex = $event.index;
  }

  valuerInformation: any;
  selectedId: number = 0;

  editValuer(d) {
    this.valuerInformation = d;
    this.selectedId = d.valuationReportId;
    this.collateralValuationId = d.collateralValuationId;
    this.getAllCollateralValuerIformationDetailById(d.valuationReportId);
    this.valuerInfoForm.controls["valuerId"].setValue(this.singleValuerInfor.valuerId);
    this.valuerInfoForm.controls["valuationFee"].setValue(this.singleValuerInfor.valuationFee);
    this.valuerInfoForm.controls["accountNumber"].setValue(this.singleValuerInfor.accountNumber);
    this.valuerInfoForm.controls["wht"].setValue(this.singleValuerInfor.wht);
    this.valuerInfoForm.controls["valuerComment"].setValue(this.singleValuerInfor.valuationComment);
    this.valuerInfoForm.controls["whtAmount"].setValue(this.singleValuerInfor.whtAmount);
    this.valuerInfoForm.controls["omv"].setValue(this.singleValuerInfor.omv);
    this.valuerInfoForm.controls["fsv"].setValue(this.singleValuerInfor.fsv);
    this.showValurerInfo = true;
  }

  removeValuer(d) {
    this.loadingService.show();
    this.DeleteAddedValuer(d.valuationReportId);
    this.getAllCollateralValuerIformationById(d.valuationReportId);
    this.selectedId = 0;
    this.loadingService.hide();
  }

  getAllCollateralValuerIformationById(id) {
    this.loadingService.show();
    this.collateralService.getAllCollateralValuerIformationById(id).subscribe((response: any) => {
      this.valuerInfors = response.result;
      if (this.valuerInfors.length == 0 && this.valuationOfficer) {
        this.showAddValuerButton = true;
        this.hideButton = true; this.hideApproval = false;
        this.loadingService.hide();
      }
      else { this.hideButton = false; this.hideApproval = true; this.loadingService.hide(); }
    });
    this.loadingService.hide();
  }


  getAllCollateralValuerIformationDetailById(id) {
    this.collateralService.getAllCollateralValuerIformationDetailById(id).subscribe((response: any) => {
      this.singleValuerInfor = response.result;
    });
  }

  valuerDetails: any;
  valuerAccount: any;
  valuationFee: any;
  viewDetail(d) {
    this.loadingService.show();
    this.valuerDetails = {};
    this.getCollateralValuation(d.collateralValuationId);
    this.getCollateralInformation(d.collateralCustomerId);
    this.GetAllValuationRequest(d.collateralCustomerId);
    this.getAllCollateralValuerIformationById(d.collateralValuationId);

    this.collateralValuationId = d.collateralValuationId;
    this.targetId = d.valuationPrerequisiteId;
    this.currentLevelId = d.currentApprovalLevelId;
    this.valuationPrerequisiteId = d.valuationPrerequisiteId;
    this.customerId = d.customerId;
    this.referenceNumber = d.referenceNumber;
    this.operationId = d.operationId;
    this.customerGroupId = null;
    this.getDocumentsByTargets();
    this.getDeletedDocumentsByTarget();
    //this.targetId = d.collateralValuationId;
    this.displayApprovalForm = true;
    this.getApprovalWorkFlowComments(this.operationId, this.targetId);
    //this.getApprovalTrail();

    this.collateralService.getCollateralValuerIformationById(d.collateralValuationId).subscribe((response: any) => {
      this.valuerDetails = response.result;
      if (this.valuerDetails != null) {
        this.valuerAccount = this.valuerDetails.accountNumber;
        this.valuationFee = this.valuerDetails.valuationFee;
      } else {
        this.valuerAccount = "N/A";
        this.valuationFee = "N/A";
      }
      this.loadValuationPrerequisite(d, this.valuerAccount, this.valuationFee);
    });

    this.collateralCode = d.collateralCode;
    this.status = d.approvalStatus;
    this.valuationRequestType = d.valuationRequestType;

    // this.approvalStatusId = d.approvalStatusId;

    this.loadingService.hide();
  }

  loadValuationPrerequisite(data, valuerAccount = null, valuationFee = null) {
    this.approvalStatus = data.approvalStatus;
    this.targetId = data.valuationPrerequisiteId;
    this.valuationPrerequisiteId = data.valuationPrerequisiteId;
    this.customerId = data.customerId;
    this.operationId = data.operationId;

    this.valuationPrerequisite = [
      {
        "valuationFee": valuationFee,
        "customerAccount": data.customerAccount,
        "valuerAccount": valuerAccount,
        "narration": data.narration,
        "collateralCode": data.collateralCode,
        "valuationRequestType": data.valuationRequestType,
        "valuationRequestTypeId": data.valuationRequestTypeId,
        "valuationComment": data.valuationComment,
        "approvalStatus": data.approvalStatus,
        "approvalComment": data.approvalComment,
        // "customerAccount": data.customerAccount,
      }
    ];


    if (this.status == 'REFERRED') { this.isReferred = true; }
  }

  getValuationRequestWaitingForApproval() {
    this.collateralService.getAllValuationRequestWaitingForApproval().subscribe((response: any) => {
      this.valuationPrerequisites = response.result;
      this.operationId = response.result[0].operationId;
    });
  }

  GetAllValuationRequest(id) {
    this.collateralService.GetAllValuationRequest(id).subscribe((response: any) => {
      this.collateralValuations = response.result;
    });
  }

  getValuationPrerequisite(id) {
    this.collateralService.getValuationPrerequisite(id).subscribe((response: any) => {
      this.valuationPrerequisite = response.result;
    });
  }

  getApprovalWorkFlowComments(operationId, targetId) {
    this.loanBookingService.getApprovalTrailByOperation(operationId, targetId).subscribe((res) => {
      this.approvalWorkflowData = res.result;
    });
  }

  submitForApproval() {
    let __this = this;

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

      let data = {
        //collateralCustomerId: __this.targetId,
        approvalStatusId: __this.approvalStatusId,
        valuationComment: __this.comment,
        collateralValuationId: __this.collateralValuationId,
        valuationPrerequisiteId: __this.valuationPrerequisiteId
      }

      __this.submitApproval(data);
      __this.valuationPrerequisite = [];
      __this.mainCollateralDetail = null;
      __this.documentUploads = [];
      __this.approvalWorkflowData = [];
      __this.hideApproval = false;

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }


  submitApproval(data) {
    this.loadingService.show();
    this.collateralService.submitApproval(data).subscribe((response: any) => {
      if (response.success == true) {
        this.loadingService.hide();
        if (data.approvalStatusId == 2) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        }
        else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Collateral Valuation has been successfully rejected!!', 'success');
        }
        this.showCommentForm(false);
        this.valuerInfor = [];
        this.collateralValuations = [];
        this.activeTabindex = 0;
        this.getValuationRequestWaitingForApproval();
        this.loadingService.hide();
      }

      else { this.loadingService.hide(); swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error'); }
      //this.approveCollateralValuation();
    });
  }

  ViewValuation(d) {
    this.GetAllValuationRequest(d.collateralCustomerId);
  }

  showApprovalPopup() {
    this.displayApprovalForm = true;
  }

  intializeCollateralValuationForm() {
    this.valuerInfoForm = this.fb.group({
      valuerId: ['', Validators.required],
      valuerComment: ['', Validators.required],
      wht: [''],
      valuationFee: [''],
      accountNumber: ['', Validators.required],
      whtAmount: [''],
      omv: [''],
      fsv: ['']
    });

    this.valuationPrerequisiteForm = this.fb.group({
      valuationComment: ['', Validators.required],
      valuationRequestTypeId: ['', Validators.required],
      approvalComment: ['']
    });

    this.narrationForm = this.fb.group({
      narration: ['', Validators.required]
    });

  }

  getValuer() {
    this.collateralService.getValuers().subscribe((response: any) => {
      this.valuers = response.result;
    });
  }

  addCollateralValuerInfomation(form) {

    let data = {
      valuationReportId: this.selectedId,
      valuerId: form.value.valuerId,
      collateralValuationId: this.collateralValuationId,
      valuationFee: form.value.valuationFee,
      accountNumber: form.value.accountNumber.toString(),
      wht: form.value.wht,
      valuationComment: form.value.valuerComment,
      whtAmount: form.value.whtAmount,
      omv: form.value.omv,
      fsv: form.value.fsv
    }
    if (this.selectedId == 0) {
      this.collateralService.addCollateralValuerInfo(data).subscribe((response: any) => {
        if (response.success == true) {
          this.valuerInfoForm.reset();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          this.getAllCollateralValuerIformationById(this.collateralValuationId);
          this.showValurerInfo = false;
          this.getValuer();
        }
        else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }

      });
    } else {
      this.collateralService.updateCollateralValuerInfo(data).subscribe((response: any) => {
        if (response.success == true) {
          this.valuerInfoForm.reset();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          this.getAllCollateralValuerIformationById(this.collateralValuationId);
          this.showValurerInfo = false;
          this.getValuer();
        }
        else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }

      });
    }
  }


  addCollateralNarration(form) {
    this.loadingService.show();
    let data = {
      valuationReportId: this.collateralValuationId,
      narration: form.value.narration,
    }
    this.collateralService.updateCollateralNarration(data).subscribe((response: any) => {
      if (response.success == true) {
        this.loadingService.hide();
        this.narrationForm.reset();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        this.getAllCollateralValuerIformationById(this.collateralValuationId);
        this.getCollateralValuation(this.collateralValuationId);
        this.showValurerInfo = false;
        this.getValuer();
      }
      else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        this.loadingService.hide();
      }

    });
  }


  deleteDocumentUpload(row) {
    const __this = this;
    swal({
      title: 'File DELETE operation!',
      text: 'Are you sure you want to DELETE the file ' + row.fileName + '?',
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
      __this.creditAppraisalService.deleteDocument(row.documentUploadId, row.documentTypeId).subscribe((response: any) => {
        __this.reloadGrid();
        __this.getDeletedDocumentsByTarget();
        __this.loadingService.hide();
      }, (err: any) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
        __this.loadingService.hide();
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  getAllCollateralValuerIformation() {
    this.collateralService.getAllCollateralValuerIformation().subscribe((response: any) => {
      this.valuerInfor = response.result;
      if (this.valuerInfor.length == 0) {
        this.hideButton = true; this.hideApproval = false;
      }
      else { this.hideButton = false; this.hideApproval = true; }
    });
  }



  DeleteAddedValuer(id) {
    this.collateralService.DeleteAddedValuer(id).subscribe((response: any) => {
      this.singleValuerInfor = response.result;
      if (response.success == true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
      }
      else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });
  }

  getApprovalTrail() {
    this.loadingService.show();
    this.camService.getTrail(this.targetId, this.operationId).subscribe((response: any) => {
      if (response.success) {
        this.trailApprovalLevels = response.result;
        this.loadingService.hide();
      }
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  displayStatus(event) {
    if (event == true) {
      this.displayCommentForm = false;
    }
  }

  afterReferBackSuccess() {
    //this.loadData();
    this.getValuationRequestWaitingForApproval();
    this.displayCommentForm = false;
    this.valuerInfor = [];
    this.valuationPrerequisite = [];
    // swal(`${GlobalConfig.APPLICATION_NAME}`, "Valuation prerequisite has been successfully referred back!", 'success');
    this.activeTabindex = 0;
  }

  // returnBack(form) {
  //   const __this = this;

  //   const target = {
  //     targetId: this.targetId,
  //     comment: form.value.comment,
  //     operationId: this.operationId,
  //     approvalLevelId: form.value.approvalLevelId
  //   };

  //   swal({
  //     title: 'Are you sure?',
  //     text: 'You want to refer back?',
  //     type: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No, cancel!',
  //     confirmButtonClass: 'btn btn-success btn-move',
  //     cancelButtonClass: 'btn btn-danger',
  //     buttonsStyling: true,
  //   }).then(function () {
  //     __this.loadingService.show();

  //     __this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
  //       __this.loadingService.hide();
  //       if (res.success === true) {
  //         //__this.updateValuationPrerequisiteStatus(target.targetId);
  //         __this.getValuationRequestWaitingForApproval();
  //         __this.showApprovalButton = false;
  //         __this.displayCommentForm = false;
  //         __this.hideApproval = true;
  //         __this.valuerInfor = [];
  //         __this.valuationPrerequisite = [];
  //         swal(`${GlobalConfig.APPLICATION_NAME}`, "Valuation prerequisite has been successfully referred back!", 'success');
  //         __this.activeTabindex = 0;
  //       } else {
  //         __this.showApprovalButton = true;
  //         __this.displayCommentForm = false;
  //         swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
  //       }
  //     }, (err) => {
  //       __this.loadingService.hide();
  //       swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
  //     });
  //   }, function (dismiss) {
  //     if (dismiss === 'cancel') {
  //       swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
  //     }
  //   });
  // }

  populateValuerDocumentUploadProperties(row) {
    //this.showValuereDocumentUpload = true;
    this.customerId = this.customerId;
    this.targetId = row.valuerId;
    this.operationId = this.operationId;
    this.getDocumentsByTargets();
  }

  onValuerTypeChange(collateralValuerId) {
    var accountNumber = this.valuers.find(O => O.collateralValuerId == collateralValuerId).accountNumber;
    this.valuerInfoForm.controls['accountNumber'].setValue(accountNumber);
  }

  calculateWithHoldingTax(event) {
    var valuationFee = this.valuerInfoForm.controls['valuationFee'].value;
    var wht = this.valuerInfoForm.controls['wht'].value;
    if (valuationFee > 0 && wht > 0) {
      var amount = ((wht * valuationFee) / 100);
      this.valuerInfoForm.controls['whtAmount'].setValue(amount);
    } else {
      this.valuerInfoForm.controls['whtAmount'].setValue(0);
    }
  }

  getValuationRequestTypes() {
    this.collateralService.getValuationRequestTypes().subscribe((response: any) => {
      this.valuationReportTypes = response.result;
    });
  }

  populateValuationPrerequisiteForm(row) {
    // var id = row.valuationPrerequisiteId;
    this.valuationPrerequisiteForm.controls['valuationRequestTypeId'].setValue(row.valuationRequestTypeId);
    this.valuationPrerequisiteForm.controls['valuationComment'].setValue(row.valuationComment);
    this.valuationPrerequisiteForm.controls['approvalComment'].setValue(row.approvalComment);

    this.showValuationPrerequisite = true;
  }

  editValuationPrerequisite(form) {

    let body = {
      collateralValuationId: this.collateralValuationId,
      valuationRequestTypeId: form.value.valuationRequestTypeId,
      valuationComment: form.value.valuationComment,

      collateralCode: this.collateralCode,
      approvalStatus: this.approvalStatus,
      valuationRequestType: this.valuationRequestType
    };

    this.collateralService.editValuationPrerequisite(this.valuationPrerequisiteId, body).subscribe((response: any) => {
      if (response.success == true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, "Valuation prerequisite has been successfully updated!", 'success');
        this.loadValuationPrerequisite(body);
        this.getValuer();
        this.showValuationPrerequisite = false;
      }
      else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });
  }

  updateValuationPrerequisiteStatus(valuationPrerequisiteId) {

    let body = {

    };

    this.collateralService.updateValuationPrerequisiteStatus(this.valuationPrerequisiteId, body).subscribe((response: any) => {
      if (response.success == true) {
        //swal(`${GlobalConfig.APPLICATION_NAME}`, "Valuation prerequisite has been successfully updated!", 'success');
      }
      else {
        //swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });
  }


  disableAddInsuranceButton() {
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.staffRoleId = userInfo.staffRoleId;
    if (this.staffRoleId == 541) {
      this.makeAddValuerButtonVisible = true;
      //this.hideApproval =false;
    }
  }

}
