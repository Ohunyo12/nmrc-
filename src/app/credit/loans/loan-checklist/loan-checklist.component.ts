import { saveAs } from 'file-saver';
import { LoadingService } from '../../../shared/services/loading.service';
import { GlobalConfig, ChecklistResponseTypeEnum, ChecklistTypeEnum } from '../../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ChecklistService } from '../../../setup/services/checklist.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import swal from 'sweetalert2';
import { Message } from 'primeng/components/common/api';
import { log } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/admin/services';

@Component({
  selector: 'app-loan-checklist',
  templateUrl: './loan-checklist.component.html',
  styleUrls: ['./loan-checklist.component.css']
})
export class LoanChecklistComponent implements OnInit {
  checklistFacilityLists: any[];
  replicate: boolean = false;
  replicateEGSOverSummary: string;
  replicateESGOverAllRiskStatusId: number;

  saveButtonEnabled: boolean = true;
  today = new Date();
  displayChecklistEntry: boolean = false;
  msgs: Message[] = [];
  uploadDescription: string;
  loanApplicationList: any[];
  checklistDetailData: any[];
  loanChecklistForm: FormGroup;
  checklistDetailsForm: FormGroup;
  displayCheckList: boolean = false;
  checklistDeferred: boolean = false;
  checklistModel: any[] = [];
  checklistStatusData: any[];
  checklistStatusResponse: any[];
  checkedChecklistItem: any[];

  displayChecklistDetailValidation: boolean = false;
  displayChecklistvalidateDecline: boolean = false;
  displayUpload: boolean = false;
  checklistDetailValidationDocument: any;
  isproductbased: boolean;
  @Input('isCAMchecklist') isCAMchecklist: boolean = false;
  @Input() onPageLoad = false;
  @Input('isAvailmentChecklist') isAvailmentChecklist: boolean = false;
  @Input('operationId') operationId: number;
  @Input('loanApplicationDetailId') loanApplicationDetailId: number;
  @Input('loanApplicationId') loanApplicationId: number;
  @Input('productId') productId: number;
  @Input('customerId') customerId: number;
  @Input('customerName') customerName: string;
  @Input('customerCode') customerCode: string;
  @Input('selectedCustomerDetail') selectedCustomerDetail: any={};
  @Input('applicationSelection') applicationSelection: any={};
  @Input() set productClassProcessId(value: number) {
    
    
    if (value > 0) this.getChecklistTypeByApprovalLevel(this.operationId, value);
  }
  selectedChecklist: any;
  displayCheckListDetails: boolean = false;
  checkListStatusId: number;
  deferedDate: string;
  checklistDeffered: boolean = false;
  checklistNotProvided: boolean = false;
  checklistItem: string;
  checkListDetailList: any[];
  checklistTypeList: any[];
  ChecklistDefinitionList: any[];
  filteredChecklistDefinition: any[];
  ChecklistDetailsValidationList: any[];
  filterChecklistDetailsValidationList: any[];
  binaryFile: string;
  selectedDocumentName: string;
  selectedChecklistTypeId: number = null;
  loanTargetId: number = null;
  canDoChecklist: boolean = false;


  showProvidedWaivedDeffered: boolean = false;
  showYesOrNoStatus: boolean = false;
  showResponseType: number = 0;
  hasPreviousChecklist: boolean = false;
  validationHeader: string;
  checkListTypeHeader: string;
  displayConditionPrecedentValidation: boolean = false;
  displayForm3800BCheckListDetails: boolean = false;
  displayForm3800BChecklistEntry: boolean = false;
  form3800BChecklistDefferedOrWaived: boolean = false;
  form3800BChecklistDetailsList: any[];
  form3800BChecklistDefinition: any[];
  reason: string;
  multiple?: number;
  ESGTypeList: any[];
  ESGClassList: any[];
  ESGChecklistStatusList: any[];
  ESGDueDilligenceList: any[];
  newESGcheckListForAccess: any[];
//   newESGcheckListForAccess: any[]
  ESGChecklistDetailsList: any[];
  ESGChecklistDetailsForm: FormGroup;
  GreenRatingDetailsForm: FormGroup;
  // ESGChecklistScoresForm: FormGroup;
  ESGOverAllRiskStatusId: any;
  EGSOverSummary: string;
  displayESGCheckListDetails: boolean = false;
  displayGreenRatingDetails: boolean = false;
  displayESGChecklistvalidation: boolean = false;
  activeIndex: number = 0;
  activeIndexView: number = 0;
  loanApplicationDetailLists: any[];
  facilityDetailId: number;
  showMultipleFacility: boolean = false;
  initESDForm = false;
  userInfo: any = {};
  constructor(private loanAppService: LoanApplicationService, private checklistService: ChecklistService,
    private fb: FormBuilder, private loadingService: LoadingService, private authServ: AuthenticationService) { }

  ngOnInit() {
	if (this.onPageLoad == true) {
      
      this.getChecklistTypeByApprovalLevel(this.operationId, this.productClassProcessId);
    }
    this.loadChecklistDetailsForm();
    this.initializeESGControl();
    this.userInfo = this.authServ.getUserInfo();
    // console.log('userinfo', this.userInfo);
  }

  ShowLoanEligibilityChecklist(typeId) {
    this.canDoChecklist = false;
    this.showMultipleFacility = false;
    this.selectedChecklistTypeId = typeId;
    this.loadAllChecklistStatus();
    this.checkListTypeHeader = this.checklistTypeList.find(x => x.targetTypeId == typeId).targetTypeName;
    this.isproductbased = this.checklistTypeList.find(x => x.targetTypeId == typeId).isproductbased;
    this.canDoChecklist = this.checklistTypeList.find(x => x.targetTypeId == typeId).canValidateChecklist;
    this.customerId = this.selectedCustomerDetail.customerId;

    if (this.isproductbased == true) {
      this.loanTargetId = this.loanApplicationDetailId;
    }
    else {
      this.loanTargetId = this.loanApplicationId;
    }
    this.checklistNotProvided = false;
    this.ChecklistDetailsValidationList = [];
    this.ChecklistDefinitionList = [];

    
    if ((this.isCAMchecklist || this.isAvailmentChecklist) && Number(typeId) == 1) {

      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, false);
      this.loanApplicationdetailsList(this.loanApplicationId);
      this.showMultipleFacility = true;
      
    }
    else if ((this.isCAMchecklist || this.isAvailmentChecklist) && Number(typeId) == 2) {

      this.regulatoryChecklistAutomapping(this.customerId, this.loanTargetId);
      this.getChecklistDefinitionByChecklistTypeView(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, false);
      
    }
    else if ((this.isCAMchecklist || this.isAvailmentChecklist) && Number(typeId) == 3) {

      this.ESGOverAllRiskStatusId = null;
      this.EGSOverSummary = null;
      this.activeIndexView = 0;
      this.loanApplicationdetailsList(this.loanApplicationId);
      this.displayESGChecklistvalidation = true;
      // this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId);
      // this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, false);
      //  this.displayChecklistDetailValidation = true;
    }
    else if ((this.isCAMchecklist || this.isAvailmentChecklist) && Number(typeId) == 4) {

      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, false);
      //  this.displayChecklistDetailValidation = true;
    }
    else if ((this.isAvailmentChecklist) && Number(typeId) == 5) {

      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, true);
    }
    //  else if(this.isCAMchecklist == true && Number(this.selectedChecklistTypeId) == 5 || this.isAvailmentChecklist == true && Number(this.selectedChecklistTypeId) == 6)
    //   {
    //     this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId);
    //   }
    else if ((this.isCAMchecklist || this.isAvailmentChecklist) && Number(typeId) == 6) {

      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, false);
    }
    else if ((this.isAvailmentChecklist) && Number(typeId) == 7) {

      this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
      this.displayConditionPrecedentValidation = true;
    }
    
	else if (Number(typeId) == 10) {

		  this.initializeESGControl();
		  this.activeIndex = 0;
		  this.ESGDueDilligenceList = [];
		  this.newESGcheckListForAccess = [];
			this.getGreenRatingStatus(this.loanApplicationId);
			// this.getGreenRatingDetail(this.loanApplicationId);
		  	this.displayGreenRatingDetails = true;
		}
    else if (Number(typeId) == 3) {

      this.initializeESGControl();
      this.activeIndex = 0;
      this.ESGDueDilligenceList = [];
      this.newESGcheckListForAccess = [];
      this.getAllProposedTransactionClass();
      this.getAllProposedTransactionType();
      this.getESGChecklistStatus(this.loanApplicationDetailId);
      this.getESGChecklistDetail(this.loanApplicationDetailId);
      this.displayESGCheckListDetails = true;
    }
    else if (Number(typeId) == 2) {

      this.regulatoryChecklistAutomapping(this.customerId, this.loanTargetId);
      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, this.selectedChecklistTypeId, false);
      this.displayCheckListDetails = true;
    }
    else if ((this.isCAMchecklist || this.isAvailmentChecklist) && Number(typeId) > 7) {

      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, typeId, false);
	  }
    else {

      this.getChecklistDefinitionByChecklistType(this.operationId, typeId, this.productId, this.loanTargetId,this.customerId);
      this.getChecklistDetailsValidationList(this.loanApplicationId, this.selectedChecklistTypeId, false);
      this.displayCheckListDetails = true;
    }
    if (this.isCAMchecklist) {
      this.validationHeader = 'CAP Validation';
    } else if (this.isAvailmentChecklist) {
      this.validationHeader = 'Availment Validation';
    }
  }

  viewChecklistUpload(index) {

    const row = index;
    let model={
      checkListDefinitionId:row.checkListDefinitionId, 
      checkListStatusId:row.checkListStatusId, 
      targetId:row.targetId, 
      isproductbased:this.isproductbased,
      customerId:this.applicationSelection.customerId,
      checkListItemId:row.checkListItemId,
      checkListTypeId:row.checkListTypeId,
      checklistDate:row.checklistDate

    }

    this.getChecklistDocumentUpload(model);
  }

  viewConditionPrecedentChecklistUpload(index) {
    const row = index; // this.form3800BChecklistDetailsList[index];
    this.getConditionPrecedentChecklistUpload(row.conditionId,row.loanApplicationId)
  }

  loadAllChecklistStatus() {
    this.checklistService.getAllChecklistStatus().subscribe((data) => {
      this.checklistStatusData = data.result;
      this.checklistStatusResponse = this.checklistStatusData;
    });
  }

  getChecklistTypeByApprovalLevel(operationId, productClassProcessId) {
    if (operationId==undefined || productClassProcessId==undefined) {
      return;
    }
    this.loadingService.show();
    this.checklistService.getChecklistTypeByApprovalLevel(operationId, productClassProcessId).subscribe((data) => {
      this.loadingService.hide();
      this.checklistTypeList = data.result;
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getChecklistDefinitionByChecklistType(operationId, checkListTypeId, productId, loanTargetId,customerId) {
    this.loadingService.show()
    this.checklistService.getChecklistDefinitionByChecklistType(operationId, checkListTypeId, productId, loanTargetId,customerId).subscribe((data) => {
      this.ChecklistDefinitionList = data.result;

      if (this.isCAMchecklist == true && Number(this.selectedChecklistTypeId) == 5 || this.isAvailmentChecklist == true && Number(this.selectedChecklistTypeId) == 6) {
        this.displayChecklistvalidateDecline = false;
        this.displayCheckListDetails = true;
      }
      else if (this.isCAMchecklist == true && Number(this.selectedChecklistTypeId) != 5 || this.isAvailmentChecklist == true && Number(this.selectedChecklistTypeId) != 6) {
        this.displayChecklistvalidateDecline = true;
        this.displayCheckListDetails = false;
      }
      else {
        this.displayCheckListDetails = true;
        this.displayChecklistvalidateDecline = false;
      }
      this.loadingService.hide()
    });
  }
  getChecklistDefinitionByChecklistTypeView(operationId, checkListTypeId, productId, loanTargetId,customerId) {
    this.loadingService.show()
    this.checklistService.getChecklistDefinitionByChecklistTypeView(operationId, checkListTypeId, productId, loanTargetId,customerId).subscribe((data) => {
      this.ChecklistDefinitionList = data.result;


      if (this.isCAMchecklist == true && Number(this.selectedChecklistTypeId) == 5 || this.isAvailmentChecklist == true && Number(this.selectedChecklistTypeId) == 6) {
        this.displayChecklistvalidateDecline = false;
        this.displayCheckListDetails = true;
      }
      else if (this.isCAMchecklist == true && Number(this.selectedChecklistTypeId) != 5 || this.isAvailmentChecklist == true && Number(this.selectedChecklistTypeId) != 6) {
        this.displayChecklistvalidateDecline = true;
        this.displayCheckListDetails = false;
      }
      else {
        this.displayCheckListDetails = true;
        this.displayChecklistvalidateDecline = false;
      }
      this.loadingService.hide()
    });
  }
  getChecklistDetailsValidationList(targetId, checkListTypeId, isCAMchecklist) {
    this.hasPreviousChecklist = false;
    this.loadingService.show()
    this.checklistService.getChecklistDetailsValidationList(targetId, checkListTypeId, isCAMchecklist,this.customerId ).subscribe((data) => {
      this.ChecklistDetailsValidationList = data.result;
      
      this.filterChecklistDetailsValidationList = data.result;
      if (this.ChecklistDetailsValidationList == undefined) {
        this.ChecklistDetailsValidationList = [];
      } else if (this.ChecklistDetailsValidationList.length > 0) {
        if (this.isCAMchecklist == true || this.isAvailmentChecklist == true) {
          this.displayChecklistvalidateDecline = true;
          this.displayCheckListDetails = false;
        }
        let notValidateChecklist = this.ChecklistDetailsValidationList.filter(x => x.checkListValidationStatus1 == null);
        if (notValidateChecklist.length != this.ChecklistDetailsValidationList.length) {
          this.hasPreviousChecklist = true;
        }
      }
      this.loadingService.hide()
    });
  }

  onRemoveClicked(index) {
    const row = this.ChecklistDetailsValidationList[index];
    this.removeChecklist(row.checklistId);
    this.removeChecklistDocument(row.checkListDefinitionId, row.checkListStatusId, row.targetId);
  }

  removeChecklist(index) {
    this.loadingService.show();
    this.checklistService.deleteChecklistDetail(index).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {
        this.getChecklistDetailsValidationList(this.loanApplicationId, this.selectedChecklistTypeId, false);
        this.getChecklistDefinitionByChecklistType(this.operationId, this.selectedChecklistTypeId, this.productId, this.loanTargetId,this.customerId);
        this.showSuccess('success', 'Item removed successfully');
      }
    });
  }

  removeChecklistDocument(definitionId, statusId, detailId) {

    this.checklistService.removeChecklistDocumentUpload(definitionId, statusId, detailId, this.isproductbased).subscribe((response: any) => {
      this.getChecklistDetailsValidationList(this.loanApplicationId, this.selectedChecklistTypeId, this.isCAMchecklist);
      this.getChecklistDefinitionByChecklistType(this.operationId, this.selectedChecklistTypeId, this.productId, this.loanTargetId,this.customerId);
    });
  }

  getChecklistDocumentUpload(model) {
    this.selectedDocumentName = null;
    this.binaryFile = null;
    this.loadingService.show()
    this.checklistService.getChecklistDocumentView(model).subscribe((data) => {
      this.checklistDetailValidationDocument = data.result;

      if (this.checklistDetailValidationDocument != undefined) {
        if (['jpg', 'jpeg', 'png'].indexOf(this.checklistDetailValidationDocument.fileExtension.toLowerCase()) > -1) {
          this.selectedDocumentName = this.checklistDetailValidationDocument.fileName;
          this.binaryFile = this.checklistDetailValidationDocument.fileData;
          this.displayUpload = true;
        }
        if (['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx'].indexOf(this.checklistDetailValidationDocument.fileExtension.toLowerCase()) > -1) {
          this.DownloadDocument(this.checklistDetailValidationDocument);
        }
      } else {
        this.showSuccess('info', 'No upload found for this checklist');
      }
      this.loadingService.hide()
    });
  }

  getConditionPrecedentChecklistUpload(conditionId,loanApplicationId) {

    this.selectedDocumentName = null;
    this.binaryFile = null;
    this.loadingService.show()
    this.checklistService.getConditionPrecedentChecklistUpload(conditionId,loanApplicationId).subscribe((data) => {
      this.checklistDetailValidationDocument = data.result;
      if (this.checklistDetailValidationDocument != undefined) {
        if (['jpg', 'jpeg', 'png'].indexOf(this.checklistDetailValidationDocument.fileExtension.toLowerCase()) > -1) {
          this.selectedDocumentName = this.checklistDetailValidationDocument.fileName;
          this.binaryFile = this.checklistDetailValidationDocument.fileData;
          this.displayUpload = true;
        }
        if (['doc', 'docx', 'pdf', 'xls', 'xlsx'].indexOf(this.checklistDetailValidationDocument.fileExtension.toLowerCase()) > -1) {
          this.DownloadDocument(this.checklistDetailValidationDocument);
        }
      } else {
        this.showSuccess('info', 'No upload found for this checklist');
      }
      this.loadingService.hide()
    });
  }

  DownloadDocument(doc: any) {
    if (doc != null) {
      this.binaryFile = doc.fileData;
      let documentName = doc.documentTitle;
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
          var file = new File([bb], documentName + '.jpg', { type: 'image/jpg' });
          saveAs(file);
        } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.jpg');
        }
      }
      if (myDocExtention == 'png' || myDocExtention == 'png') {
        try {
          var file = new File([bb], documentName + '.png', { type: 'image/png' });
          saveAs(file);
        } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.png');
        }
      }
      if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
        try {
          var file = new File([bb], documentName + '.pdf', { type: 'application/pdf' });
          saveAs(file);
        } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.pdf');
        }
      }
      if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
        try {
          var file = new File([bb], documentName + '.xlsx', { type: 'application/vnd.ms-excel' });
          saveAs(file);
        } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.xlsx');
        }
      }
      if (myDocExtention == 'doc' || myDocExtention == 'docx') {

        try {
          var file = new File([bb], documentName + '.doc', { type: 'application/msword' });
          saveAs(file);
        } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.doc');
        }
      }
    }
  }

  loadAllApplicationChecklist() {
    this.loanAppService.loanApplicationChecklist().subscribe((data) => {
      this.loanApplicationList = data.result;
    }, (err) => {
      this.loadingService.hide(1000);
      ////console.log('Error', err);
    });
  }

  onChecklistStatusChanged(status) {
    this.saveButtonEnabled = false;
    if (Number(status) == 2) {
      this.checklistNotProvided = true;
      this.checklistDeffered = false;
      this.form3800BChecklistDefferedOrWaived = true;
    }
    if (Number(status) == 3) {
      this.checklistNotProvided = true;
      this.form3800BChecklistDefferedOrWaived = false;
      this.checklistDeffered = false;
    }
    if (Number(status) == 4) {
      this.checklistDeffered = true;
      this.checklistNotProvided = true;
      this.form3800BChecklistDefferedOrWaived = true;
    }
    if (Number(status) == 5) {
      this.checklistNotProvided = true;
      this.form3800BChecklistDefferedOrWaived = false;
    }
    if (Number(status) == 6) {
      this.checklistNotProvided = true;
      this.form3800BChecklistDefferedOrWaived = false;
    }
  }

  uncheckedChecklistItem(index, evt) {
    evt.preventDefault();
    this.checkListStatusId = null;
    this.checklistStatusResponse = [];
    this.selectedChecklist = index;
    // this.selectectClist = index;
    this.checklistItem = this.selectedChecklist.checkListItemName;

    this.checklistStatusResponse = this.checklistStatusData.filter(x => x.responseTypeId == this.selectedChecklist.responseTypeId);

    if (this.selectedChecklist.requireUpload == true) {
      this.uploadDescription = this.selectedChecklist.itemDescription;
    } else {
      this.uploadDescription = null;
    }
    this.displayChecklistEntry = true;
    this.checklistNotProvided = false;
  }

  getChecklistDetailByTargetId(targetId) {
    this.checklistService.getChecklistDetailByTargetId(targetId).subscribe((response: any) => {
      this.checkListDetailList = response.result;
      ////console.log(this.checkListDetailList);
    }, (err) => {
      ////console.log(err);
    });
  }

  viewLoanCheckList() {
    //  const row = this.loanApplicationDetails;
    this.loadAllChecklistDetail(this.productId);
    ////console.log('Got it', this.checklistDetailData);
    this.filteredChecklistDetails()
    this.displayCheckList = true;
    // }
    this.productId = null;
  }
  filteredChecklistDetails() {
    //Compare two array and return the difference
    if (this.ChecklistDefinitionList === undefined) {
      this.ChecklistDefinitionList = [];
    }
    if (this.ChecklistDetailsValidationList === undefined) {
      this.ChecklistDetailsValidationList = [];
    }
    let checklistDefinitionsDiff: any[] = []; // new array to be returned
    for (let listByProduct of this.ChecklistDefinitionList) {
      let isDup: boolean = false;
      for (let listByLoan of this.ChecklistDetailsValidationList) {
        if (listByProduct.checkListDefinitionId === listByLoan.checkListDefinitionId) {
          isDup = true;
          break;
        }
      }
      if (!isDup) checklistDefinitionsDiff.push(listByProduct); // append non-duplicated
    }
    this.filteredChecklistDefinition = checklistDefinitionsDiff;
  }
  loadAllChecklistDetail(productId) {
    this.checklistService.getAllChecklistDetailByProductId(productId).subscribe((data) => {
      this.checklistDetailData = data.result;
    });
  }

  checklistValidated() {
    let body = [];
    this.ChecklistDetailsValidationList.forEach((res) => {
      let bodyObj = {
        checklistId: res.checklistId,
        checkListDefinitionId: res.checkListDefinitionId,
        checkListStatusId2: res.checkListValidationStatus1,
        checkListStatusId3: res.checkListValidationStatus2,
        isCAMchecklist: this.isCAMchecklist,
        isAvailmentChecklist: this.isAvailmentChecklist
      };
      body.push(bodyObj);
    });

    this.checklistService.ValidateChecklistDetail(body).subscribe((res) => {
      this.loadingService.hide();
      if (res.success === true) {
        this.showSuccess('success', res.message);
        this.displayChecklistvalidateDecline = false;
      }
    });

    // const row = this.ChecklistDetailsValidationList[index];
    ////console.log('hmmm', row)
    ////console.log('optionValue', optionValue)
    // let bodyObj = {
    //   checklistId: row.checklistId,
    //   checkListDefinitionId: row.checkListDefinitionId,
    //   checkListStatusId2: optionValue,
    //   checkListStatusId3: optionValue,
    //   isCAMchecklist: this.isCAMchecklist,
    //   isAvailmentChecklist: this.isAvailmentChecklist
    // }
    // this.checklistService.ValidateChecklistDetail(bodyObj).subscribe((res) => {
    //   this.loadingService.hide();
    //   if (res.success === true) {
    //     this.showSuccess('success', res.message);
    //     // swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //   }
    // });

  }
  validateConditionPrecedent(index, optionValue) {
    this.loadingService.show();
    const row = index; // this.form3800BChecklistDetailsList[index];
    ////console.log('hmmm', row)
    ////console.log('optionValue', optionValue)
    let bodyObj = {
      conditionId: row.conditionId,
      validationStatus: optionValue,
      isLMSChecklist: false
    }
    this.checklistService.validateConditionPrecedent(bodyObj).subscribe((res) => {
      this.loadingService.hide();
      if (res.success === true) {
        this.showSuccess('success', res.message);
      } else {
        this.showSuccess('error', res.message);
      }
    });
  }
  showSuccess(type, message) {
    this.msgs = [];
    this.msgs.push({ severity: type, summary: 'FinTrak Credit 360', detail: message });
  }


  submitLoanChecklist() {
    this.saveButtonEnabled = true;
    if (this.selectedChecklist.requireUpload == true && this.uploadFileTitle == null) {
      let doc = this.selectedChecklist.itemDescription == null || "" ? '' : this.selectedChecklist.itemDescription;
      //  swal(`${GlobalConfig.APPLICATION_NAME}`, `Please Upload  ${doc} to continue`, 'warning');
      this.showSuccess('info', `Please Upload  ${doc} to continue`);
      return;
    }
    if (this.uploadFileTitle != null) {
      // swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please Click Upload to continue', 'warning');
      // return;
    }
    let bodyObj = {
      checkListStatusId: this.checkListStatusId,
      deferedDate: this.deferedDate,
      checkListDefinitionId: this.selectedChecklist.checkListDefinitionId,
      targetId: this.loanTargetId,
      checklistId: this.loanApplicationId
    };
    ////console.log("submitted", bodyObj);
    this.checklistService.addChecklistDetail(bodyObj).subscribe((res) => {
      if (res.success === true) {
        if (this.uploadFileTitle != null) {
          this.uploadFile();
        }
        this.loadingService.hide();
        // swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.showSuccess('success', res.message);
       // this.getChecklistDetailsValidationList(this.loanApplicationId, this.selectedChecklistTypeId, this.isCAMchecklist);
       // this.getChecklistDefinitionByChecklistType(this.operationId, this.selectedChecklistTypeId, this.productId, this.loanTargetId,this.customerId);
        this.displayChecklistEntry = false
        this.checkListStatusId = null;
        this.deferedDate = null;
      } else {
        this.showSuccess('error', res.message);
        // swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err) => {
      this.showSuccess('error', JSON.stringify(err));
      // swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }

  // file upload
  uploadFileTitle: string = null;
  files: FileList;
  file: File;

  @ViewChild('fileInput', {static: false}) fileInput: any;
  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
    this.uploadFileTitle = this.file.name;
    this.saveButtonEnabled = false;
    //this.uploadFile();
  }
  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }
  uploadFile() {
    if (this.file != undefined || this.uploadFileTitle != null) {
      let body = {
        checkListDefinitionId: this.selectedChecklist.checkListDefinitionId,
        checkListStatusId: this.checkListStatusId,
        loanApplicationId: this.loanApplicationId,
        loanDetailsId: this.loanApplicationDetailId,
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        physicalFileNumber: 'n/a',
        physicalLocation: 'n/a',
        overwrite: false,
        
      };
      ////console.log("upload body", body);
      this.loadingService.show();
      this.loanAppService.uploadFile(this.file, body).then((response: any) => {
        if (response.result == 3) {
          body.overwrite = true;
          this.confirmOverwrite(body);
      } else {
        this.uploadFileTitle = null;
        this.checkListStatusId = null;
        this.fileInput.nativeElement.value = "";

        if (response.success == true) {
          this.showSuccess('success', 'Uploaded Successfully...');
        } else {
          this.showSuccess('error', 'Upload not Successful...');
        }
      }

        this.loadingService.hide();
      }, (error) => {
        this.loadingService.hide(1000);
        this.showSuccess('error', 'Upload not Successful...');
        //swal(`${GlobalConfig.APPLICATION_NAME}`, "Upload not Successful...", 'error');
      });
    }
  }


  confirmOverwrite(body): void {
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
        __this.loadingService.show();
        __this.loanAppService.uploadFile(__this.file, body).then((response: any) => {
          __this.uploadFileTitle = null;
          __this.checkListStatusId = null;
          __this.fileInput.nativeElement.value = "";
          if (response.success == true) {
            __this.showSuccess('success', 'Uploaded Successfully...');
          } else {
            __this.showSuccess('error', 'Upload not Successful...');
          }
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

  viewPreviousChecklist() {
    this.displayChecklistDetailValidation = true;
  }
  loadChecklistDetailsForm() {
    this.checklistDetailsForm = this.fb.group({
      checkListStatusId: [''],
      deferedDate: [''],
      checkListDefinitionId: [''],
      targetId: [''],
      checklistId: [''],
      Provided: [false],
      Deferred: [false],
      Waived: [false],
      yes: [false],
      no: [false],
    });
  }
  submitMultipleChecklistDetails(formObj) {
    ////console.log(">>>>>>>>>>>>>>>>>", formObj.value)
  }
  getConditionPrededenceChecklist(loanId, IsAvailment) {
    this.checklistService.getConditionPrededenceChecklist(loanId, IsAvailment).subscribe((response: any) => {
      this.form3800BChecklistDefinition = response.result;
      this.loadingService.hide();
    });
  }
  getConditionPrededenceChecklistStatus(loanId, IsAvailment) {
    this.checklistService.getConditionPrededenceChecklistStatus(loanId, IsAvailment).subscribe((response: any) => {
      this.form3800BChecklistDetailsList = response.result;
    });
  }
  uncheckedForm3800BChecklistItem(index, evt) {
    evt.preventDefault();
    this.checkListStatusId = null;
    this.checklistStatusResponse = [];
    this.selectedChecklist = index;
    this.checklistItem = this.selectedChecklist.condition;
    this.checklistStatusResponse = this.checklistStatusData.filter(x => x.responseTypeId == this.selectedChecklist.responseTypeId);
    ////console.log('<<<<<<<<<<<<<<<<<<<<', this.selectedChecklist.responseTypeId);
    this.displayForm3800BChecklistEntry = true;
    this.checklistDeffered = false;
    this.checklistNotProvided = false;
    this.form3800BChecklistDefferedOrWaived = false;
  }
  submitForm3800BChecklist() {
    if (this.today > new Date(this.deferedDate)) {
      this.showSuccess('info', `Deferred date cannot be less than today's date`);
      return;
    }

    let bodyObj = {
      conditionId: this.selectedChecklist.conditionId,
      checkListStatusId1: this.checkListStatusId,
      checkListStatusId2: this.checkListStatusId,
      isAvailment: this.isAvailmentChecklist,
      deferedDate: this.deferedDate,
      reason: this.reason
    };
    ////console.log("submitted", bodyObj);
    this.checklistService.UpdateLoanConditionPrecedenceStatus(bodyObj).subscribe((res) => {
      if (res.success === true) {
        if (this.uploadFileTitle != null) {
          this.uploadFile();
        }
        this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
        this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
        this.loadingService.hide();
        this.showSuccess('success', res.message);
        this.displayForm3800BChecklistEntry = false
        this.checkListStatusId = null;
        this.deferedDate = null;
        this.reason = null;
      } else {
        this.showSuccess('error', res.message);
      }
    }, (err) => {
      this.showSuccess('error', JSON.stringify(err));
    });
  }

  createUpdateChecklistDetails(index, optionValue) {
    const row = index;
    
    this.selectedChecklist = row;
    if (row.requireUpload == true && this.uploadFileTitle == null) {
      let doc = row.itemDescription == null || "" ? '' : row.itemDescription;
      this.showSuccess('info', `Please Upload  ${doc} to continue`);
      row.checklistStatusId = null;
      return;
    }
    this.loadingService.show();
    this.checkListStatusId = optionValue;
    let bodyObj = {
      checkListStatusId: optionValue,
      deferedDate: this.deferedDate,
      checkListDefinitionId: row.checkListDefinitionId,
      targetId: this.loanTargetId,
      checklistId: row.checkListDetailId,
      httpVerb : "Add",
      targetId2:this.selectedCustomerDetail.customerId
    };
    this.checklistService.addChecklistDetail(bodyObj).subscribe((res) => {
      this.loadingService.hide();
      if (res.success === true) {
        if (this.uploadFileTitle != null) {
          this.uploadFile();
        }
        this.loadingService.hide();
        this.showSuccess('success', res.message);
        this.getChecklistDetailsValidationList(this.loanApplicationId, this.selectedChecklistTypeId, this.isCAMchecklist);
        this.getChecklistDefinitionByChecklistType(this.operationId, this.selectedChecklistTypeId, this.productId, this.loanTargetId,this.customerId);
        this.displayChecklistEntry = false
      } else {
        this.showSuccess('error', res.message);
        // const __this = this;
        // swal({
        //   title: 'Are you sure?',
        //   text: 'You want to update the checklist item!',
        //   type: 'question',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Yes',
        //   cancelButtonText: 'No, cancel!',
        //   confirmButtonClass: 'btn btn-success btn-move',
        //   cancelButtonClass: 'btn btn-danger',
        //   buttonsStyling: true,
        // }).then(function () {
        //   __this.loadingService.show();
        //   __this.checklistService.addChecklistDetail(bodyObj).subscribe((response: any) => {
        //     __this.loadingService.hide();
        //     if (response.success === true) {
        //       __this.showSuccess('success', response.message);
        //     } else {
        //       __this.showSuccess('error', response.message);
        //     }
        //   }, (err) => {
        //     __this.loadingService.hide();
        //     __this.showSuccess('error', err.message);
        //   });
        // }, function (dismiss) {
        //   if (dismiss === 'cancel') {
        //     __this.showSuccess('info', 'Operation cancelled');
        //   }
        // });
      }
    }, (err) => {
      this.showSuccess('error', JSON.stringify(err));
    });
  }

  prevButton() {
    this.activeIndex = this.activeIndex - 1;
  }

  nextButton() {
    this.activeIndex = this.activeIndex + 1;
  }

  initializeESGControl() {
    this.ESGChecklistDetailsForm = this.fb.group({
    //   customerName: [''],
    //   customerCode: [''],
    //   esgChecklistDetailId: [0],
    //   esgChecklistDefinitionId: [''],
    //   loanApplicationDetailId: [''],
    //   esgClassId: ['', Validators.required],
    //   esgTypeId: ['', Validators.required],
      // checkStatusId: [],
      //   description: ['', Validators.required],
    //   comment: [''],
      overAllRiskStatusId: ['', Validators.required],
      overSummary: ['', Validators.required]
    });
  }

  initializeGreenRatingControl() {
    this.GreenRatingDetailsForm = this.fb.group({
      overAllRiskStatusId: ['', Validators.required],
      overSummary: ['', Validators.required]
    });
  }

  getAllProposedTransactionType() {
    this.checklistService.getESGType().subscribe((data) => {
      this.ESGTypeList = data.result;
      ////console.log("checklist Type", this.checklistTypeList)
    });
  }

	getAllProposedTransactionClass() {
		this.checklistService.getESGClass().subscribe((data) => {
		this.ESGClassList = data.result;
		////console.log("checklist Type", this.checklistTypeList)
		});
	}

	getESGChecklistStatus(loanApplicationDetailId) {
		this.loadingService.show();
		this.checklistService.getESGChecklistStatus(loanApplicationDetailId).subscribe((data) => {
      this.loadingService.hide()
      this.ESGChecklistStatusList = data.result;
		if (this.ESGChecklistStatusList != undefined) {
			// this.ESGDueDilligenceList = this.ESGChecklistStatusList.filter(x => x.responseTypeId == 3);
			this.newESGcheckListForAccess = this.ESGChecklistStatusList.filter(x => x.responseTypeId == 2);
		// console.log(this.newESGcheckListForAccess);
			// let formControls = {};
			// for (let f of this.newESGcheckListForAccess) {
			// 	formControls[f.checkListDefinitionId] = f.hasException ? new FormControl(f.checklistStatusId) : new FormControl(f.checklistStatusId, [Validators.required]);
			// }
		//     this.ESGChecklistScoresForm = this.fb.group(formControls);
		}
		this.initESDForm = true;
		}, (err: HttpErrorResponse) => {
			this.loadingService.hide();
		});
	}

	getESGChecklistDetail(loanApplicationDetailId) {
		this.loadingService.show();
		this.checklistService.getESGChecklistDetail(loanApplicationDetailId).subscribe((data) => {
		this.loadingService.hide();
		this.ESGChecklistDetailsList = data.result;
		if (this.ESGChecklistDetailsList != undefined) {
			let row = this.ESGChecklistDetailsList[0];
			// this.ESGChecklistDetailsForm.get('customerName').setValue(this.customerName);
			// this.ESGChecklistDetailsForm.get('customerCode').setValue(this.customerCode);
			// this.ESGChecklistDetailsForm.get('esgTypeId').setValue(row.esgTypeId);
			// this.ESGChecklistDetailsForm.get('esgClassId').setValue(row.esgClassId);
			// this.ESGChecklistDetailsForm.get('description').setValue(row.description);
			this.ESGChecklistDetailsForm.get('overAllRiskStatusId').setValue(row.description);
			this.ESGChecklistDetailsForm.get('overSummary').setValue(row.description);
			if (this.replicate) {
			  this.replicateEGSOverSummary = row.overSummary;
        this.replicateESGOverAllRiskStatusId = row.overAllRiskStatusId;
        this.ESGOverAllRiskStatusId = row.overAllRiskStatusId;
        this.ESGChecklistDetailsForm.get('overAllRiskStatusId').setValue(row.overAllRiskStatusId);
			  this.ESGChecklistDetailsForm.get('overSummary').setValue(row.overSummary);
			}else{
        this.replicateEGSOverSummary = null;
        this.replicateESGOverAllRiskStatusId = null;
      }
		}
		}, (err: HttpErrorResponse) => {
			this.loadingService.hide(1000);
		});
	}

	getGreenRatingStatus(loanApplicationId) {
		this.ESGChecklistStatusList = [];
		this.loadingService.show();
		this.checklistService.getGreenRatingStatus(loanApplicationId).subscribe((data) => {
		this.loadingService.hide();
		this.ESGChecklistStatusList = data.result;
		if (this.ESGChecklistStatusList != undefined) {
			this.newESGcheckListForAccess = this.ESGChecklistStatusList.filter(x => x.responseTypeId == 2);
		}
		this.initESDForm = true;
		}, (err: HttpErrorResponse) => {
			this.loadingService.hide(1000);
		});
	}

	// getGreenRatingDetail(loanApplicationId) {
	// 	this.loadingService.show();
	// 	this.checklistService.getGreenRatingDetail(loanApplicationId).subscribe((data) => {
	// 	this.loadingService.hide()
	// 	this.ESGChecklistDetailsList = data.result;
	// 	if (this.ESGChecklistDetailsList != undefined) {
	// 		let row = this.ESGChecklistDetailsList[0];
	// 		// this.ESGChecklistDetailsForm.get('description').setValue(row.description);
	// 		this.ESGChecklistDetailsForm.get('overAllRiskStatusId').setValue(row.description);
	// 		this.ESGChecklistDetailsForm.get('overSummary').setValue(row.description);
	// 	}
	// 	}, (err: HttpErrorResponse) => {
	// 		this.loadingService.hide();
	// 	});
  // }
  
  getGreenRatingSummary(form) {
    if (!(this.checklistStatusIdIsValid())) {
      swal(`${GlobalConfig.APPLICATION_NAME}`,'No checklist was Loaded or there are still pending checklist items', 'error');
      return;
    }
		let body = [];
		this.newESGcheckListForAccess.forEach((res) => {
		let row = form.value;
		// console.log(row);
			let bodyObj = {
				esgChecklistDetailId: res.checkListDetailId,
				esgChecklistDefinitionId: res.checkListDefinitionId,
				loanApplicationDetailId: this.loanApplicationId,
				sectorId: row.sectorId,
				checkStatusId: res.checklistStatusId,
				description: row.description,
				comment: res.comment,
				overAllRiskStatusId: row.overAllRiskStatusId,
				overSummary: row.overSummary
			};
			if (res.checklistStatusId > 0) {
				body.push(bodyObj);
			}
		});
			this.loadingService.show();
      this.checklistService.calculateGreenRatingSummary(body).subscribe((res) => {
			this.loadingService.hide();
			if (res.success === true) {
				this.showSuccess('success', res.message);
				// this.ESGOverAllRiskStatusId = res.result.ratingId;
				this.ESGChecklistDetailsForm.get('overAllRiskStatusId').setValue(res.result.ratingId);
				this.ESGChecklistDetailsForm.get('overSummary').setValue(res.result.comment);
        document.getElementById("summary").style.backgroundColor = res.result.colourCode;
				this.activeIndex = 1;
				// console.log(this.ESGChecklistDetailsForm.value);
			} else {
				this.showSuccess('error', res.message);
			}
			}, (err) => {
			this.loadingService.hide();
			this.showSuccess('error', JSON.stringify(err));
			});
	}
 
	getESGSummary(form) {
    if (!(this.checklistStatusIdIsValid())) {
      swal(`${GlobalConfig.APPLICATION_NAME}`,'No checklist was Loaded or there are still pending checklist items', 'error');
      return;
    }
		let body = [];
		this.newESGcheckListForAccess.forEach((res) => {
		let row = form.value;
		// console.log(row);
			let bodyObj = {
				esgChecklistDetailId: res.checkListDetailId,
				esgChecklistDefinitionId: res.checkListDefinitionId,
				loanApplicationDetailId: this.loanApplicationDetailId,
				esgClassId: row.esgClassId,
				esgTypeId: row.esgTypeId,
				checkStatusId: res.checklistStatusId,
				description: row.description,
				comment: res.comment,
				overAllRiskStatusId: row.overAllRiskStatusId,
				overSummary: row.overSummary
			};
			if (res.checklistStatusId > 0) {
				body.push(bodyObj);
			}
		});
			this.loadingService.show();
      this.checklistService.calculateESGChecklistSummary(body).subscribe((res) => {
			this.loadingService.hide();
			if (res.success === true) {
				this.showSuccess('success', res.message);
				this.ESGOverAllRiskStatusId = res.result.ratingId;
				this.ESGChecklistDetailsForm.get('overAllRiskStatusId').setValue(res.result.ratingId);
				this.ESGChecklistDetailsForm.get('overSummary').setValue(res.result.comment);
				this.activeIndex = 1;
				// console.log(this.ESGChecklistDetailsForm.value);
			} else {
				this.showSuccess('error', res.message);
			}
			}, (err) => {
			this.loadingService.hide();
			this.showSuccess('error', JSON.stringify(err));
			});
	}

	checklistStatusIdIsValid(): boolean {
		if (this.newESGcheckListForAccess == null) {
			return false;
		}
		let notChecked = this.newESGcheckListForAccess.findIndex(l => l.checklistStatusId == 0)
    // console.log(notChecked);
    if (notChecked == -1) {
			return true;
		}
		return false;
	}

	submitESGChecklistDetail(formObj) {
		this.loadingService.show();
		let row = formObj.value;
		let body = [];
		// this.ESGDueDilligenceList.forEach((res) => {
		//   let bodyObj = {
		//     esgChecklistDetailId: res.checkListDetailId,
		//     esgChecklistDefinitionId: res.checkListDefinitionId,
		//     loanApplicationDetailId: this.loanApplicationDetailId,
		//     esgClassId: row.esgClassId,
		//     esgTypeId: row.esgTypeId,
		//     checkStatusId: res.checklistStatusId,
		//     description: row.description,
		//     comment: res.comment,
		//     overAllRiskStatusId: row.overAllRiskStatusId,
		//     overSummary: row.overSummary
		//   };
		//   if (res.checklistStatusId > 0) {
		//     body.push(bodyObj);
		//   }
		// });
    let detailId = this.facilityDetailId > 0 ? this.facilityDetailId : this.loanApplicationDetailId;
		this.newESGcheckListForAccess.forEach((res) => {
		let bodyObj = {
			esgChecklistDetailId: res.checkListDetailId,
			esgChecklistDefinitionId: res.checkListDefinitionId,
			loanApplicationDetailId: detailId,
			esgClassId: row.esgClassId,
			esgTypeId: row.esgTypeId,
			checkStatusId: res.checklistStatusId,
			description: row.description,
			comment: res.comment,
			overAllRiskStatusId: row.overAllRiskStatusId,
			overSummary: row.overSummary
		};
		if (res.checklistStatusId > 0) {
			body.push(bodyObj);
		}
		});
		////console.log('Submit Stuff', body);
		this.checklistService.addESGChecklistDetail(body).subscribe((res) => {
		this.loadingService.hide();
		if (res.success === true) {
			this.showSuccess('success', res.message);
			this.getESGChecklistStatus(detailId);
			this.submitESGChecklistSummary();
			this.ESGDueDilligenceList = [];
			this.newESGcheckListForAccess = [];
			// this.activeIndex = 0;
			this.displayESGCheckListDetails = false
		} else {
			this.showSuccess('error', res.message);
		}
		}, (err) => {
		this.showSuccess('error', JSON.stringify(err));
		});

  }
  
  submitGreenRatingDetail(formObj) {
		this.loadingService.show();
		let row = formObj.value;
		let body = [];
		
		this.newESGcheckListForAccess.forEach((res) => {
		let bodyObj = {
			esgChecklistDetailId: res.checkListDetailId,
			esgChecklistDefinitionId: res.checkListDefinitionId,
			loanApplicationDetailId: this.loanApplicationId,
      sectorId: row.sectorId,
			checkStatusId: res.checklistStatusId,
			description: row.description,
			comment: res.comment,
			overAllRiskStatusId: row.overAllRiskStatusId,
			overSummary: row.overSummary
		};
		if (res.checklistStatusId > 0) {
			body.push(bodyObj);
		}
		});
		////console.log('Submit Stuff', body);
		this.checklistService.addGreenRatingDetail(body).subscribe((res) => {
		this.loadingService.hide();
		if (res.success === true) {
			this.showSuccess('success', res.message);
			this.newESGcheckListForAccess = [];
      this.getGreenRatingStatus(this.loanApplicationId);
      this.submitGreenRatingSummary()
			// this.ESGDueDilligenceList = [];
			// this.activeIndex = 0;
			this.displayESGCheckListDetails = false
      this.displayGreenRatingDetails = false;
		} else {
			this.showSuccess('error', res.message);
		}
		}, (err) => {
		this.showSuccess('error', JSON.stringify(err));
		});

	}

  grade = [
		{checklistStatusId: 0, grade: ''},
		{checklistStatusId: 1, grade: 'A'},
		{checklistStatusId: 5, grade: 'B'},
		{checklistStatusId: 6, grade: 'C'}
  ];

  getScoreGrade(checklistStatusId: number): string {
	//   console.log(checklistStatusId);
	return this.grade.find(c => c.checklistStatusId == checklistStatusId).grade;
  }

  closeModal() {
    this.displayESGCheckListDetails = false;
    this.displayGreenRatingDetails = false;
    this.activeIndex = 0;
    this.newESGcheckListForAccess = [];
  }

  handleChange(e) {
    this.activeIndex = e.index;
  }

  handleChangeView(e) {
    this.activeIndexView = e.index;
  }

  loanApplicationdetailsList(id) {
    this.loadingService.show();
    this.loanApplicationDetailLists = [];
    this.loanAppService.getAllloanApplicationdetails(id).subscribe((data) => {
      this.loanApplicationDetailLists = data.result;
      this.loadingService.hide();
    }, (err) => {
    });
  }

  checklistFacilityList(id) {
    this.loadingService.show();
    this.checklistFacilityLists = [];
    this.checklistService.getChecklistFacilityList(id).subscribe((data) => {
      this.loadingService.hide();
      if (data.success == true) {
        this.checklistFacilityLists = data.result;
      } else {
        this.replicate = false;
        this.showSuccess('error', "You have no facility to replicate");
      }
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  onSelectedFacilityChanged(index) {
    this.facilityDetailId = index;
    this.replicateEGSOverSummary = null;
    this.replicateESGOverAllRiskStatusId = null;
	this.getESGChecklistDetail(this.facilityDetailId);
	this.getESGChecklistStatus(this.facilityDetailId);
  }

  submitESGChecklistSummary() {
    let detailId = this.facilityDetailId > 0 ? this.facilityDetailId : this.loanApplicationDetailId;
    this.loadingService.show();
    let body = {
	  loanApplicationDetailId: detailId,
	  ratingId: this.ESGChecklistDetailsForm.get('overAllRiskStatusId').value,
	  comment: this.ESGChecklistDetailsForm.get('overSummary').value,
    //   comment: this.EGSOverSummary,
    //   ratingId: this.ESGOverAllRiskStatusId
    }
    this.checklistService.addESGChecklistSummary(body).subscribe((res) => {
      this.loadingService.hide();
      if (res.success === true) {
        this.showSuccess('success', res.message);
        this.facilityDetailId = null;
        // this.EGSOverSummary = null;
        // this.ESGOverAllRiskStatusId = null;
		// this.activeIndexView = 0;
		
        this.displayESGChecklistvalidation = false
      } else {
        this.showSuccess('error', res.message);
      }
    }, (err) => {
      this.showSuccess('error', JSON.stringify(err));
    });
  }

  submitGreenRatingSummary() {
    this.loadingService.show();
    let body = {
	  loanApplicationDetailId: this.loanApplicationId,
	  ratingId: this.ESGChecklistDetailsForm.get('overAllRiskStatusId').value,
	  comment: this.ESGChecklistDetailsForm.get('overSummary').value,
    }
    this.checklistService.addGreenRatingSummary(body).subscribe((res) => {
      this.loadingService.hide();
      if (res.success === true) {
        this.showSuccess('success', res.message);
        this.facilityDetailId = null;
        this.displayESGChecklistvalidation = false
      } else {
        this.showSuccess('error', res.message);
      }
    }, (err) => {
      this.showSuccess('error', JSON.stringify(err));
    });
  }

  onSelectedApplicationDetailChanged(id) {
    if (this.filterChecklistDetailsValidationList != undefined) {
      this.ChecklistDetailsValidationList = this.filterChecklistDetailsValidationList.filter(x => x.targetId == id)
    }
  }

  replicateChecklist(event) {
    if (event) {
      this.replicate = true;
      this.checklistFacilityList(this.loanApplicationId);
    } else {
      this.replicate = false;
    }
  }

  submitESGChecklistDetailReplication() {
    this.loadingService.show();
    let body = [];
    let detailId = this.loanApplicationDetailId > 0 ? this.loanApplicationDetailId : this.facilityDetailId;
    this.ESGChecklistDetailsList.forEach((res) => {
      let bodyObj = {
        esgChecklistDetailId: 0,
        esgChecklistDefinitionId: res.esgChecklistDefinitionId,
        loanApplicationDetailId: detailId,
        esgClassId: res.esgClassId,
        esgTypeId: res.esgTypeId,
        checkStatusId: res.checkStatusId,
        description: res.description,
        comment: res.comment,
        overAllRiskStatusId: this.replicateESGOverAllRiskStatusId,
        overSummary: this.replicateEGSOverSummary
      };
      body.push(bodyObj);
    });
    this.checklistService.addESGChecklistDetail(body).subscribe((res) => {
      this.loadingService.hide();
      if (res.success == true) {
        this.showSuccess('success', res.message);
        this.getESGChecklistStatus(detailId);
        this.activeIndex = 0;
        this.replicate = false;
        this.replicateEGSOverSummary = null;
        this.replicateESGOverAllRiskStatusId = null;
        this.ESGOverAllRiskStatusId = null;
        this.ESGChecklistDetailsForm.get('overAllRiskStatusId').setValue(null);
			  this.ESGChecklistDetailsForm.get('overSummary').setValue(null);
        this.ESGChecklistDetailsList = [];
        this.displayESGCheckListDetails = false
      } else {
        this.showSuccess('error', res.message);
      }
    }, (err) => {
      this.loadingService.hide(1000);
      this.showSuccess('error', JSON.stringify(err));
    });

  }

  regulatoryChecklistAutomapping(customerId, targetId) {
    
    this.checklistService.RegulatoryChecklistAutomapping(customerId, targetId).subscribe((data) => {
      
    });
  }

}
