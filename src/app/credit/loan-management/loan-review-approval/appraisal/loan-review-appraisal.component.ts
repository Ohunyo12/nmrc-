import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { LoanReviewApplicationService } from '../../../services';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import { ApprovalGroupRole, ApprovalStatus, GlobalConfig, JobSourceEnum } from '../../../../shared/constant/app.constant';
import { CustomerService } from '../../../../customer/services/customer.service';
import { CollateralService } from 'app/setup/services/collateral.service';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import swal from 'sweetalert2';
import { Subscription ,  Subject ,  fromEvent } from 'rxjs';
import { StaffRoleService } from 'app/setup/services/staff-role.service';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthHttp } from 'app/admin/services';


@Component({
    templateUrl: 'loan-review-appraisal.component.html'
})
export class LoanReviewAppraisalComponent implements OnInit, OnDestroy {


    
    list: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Timeline';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    reload: number = 0;
    commentLabel: string = 'Recommendation';//'Comment';

    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    isSubsequent: boolean = false;
    isLoadTemplate: boolean = false;
    loanApplicationDetail: any;
    customerProposedAmount: number = 0;
    loanReferenceNumber: any;
    maximumAmount: number = 0;
    loanApplicationTagsForm: FormGroup;
    isRegistrationDoneViaLoanApplication = 1;
    allRequiredDocumentsAreUploaded = true;
    readonly OPERATION_ID_DOC: number = 6;

    detail: any = {};
    loanSystemTypeId: number = 0;
    facilityCount: number = 0;
    jobSourceId: number;
    canSwitch: boolean = false;
    AcceptButtonText = 'Accept';
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    loanApplicationDetailId: any;
    private subscriptions = new Subscription();
    loanApplicationId: any;
    currencyId: any;
    proposedCollateral: any;
    proposedTenor: any;
    approvedTenor: any;
    approvedRate: any;
    proposedRate: any;
    approvedAmount: any;
    proposedAmount: any;
    accountName: any;
    accountNumber: any;
    creditAppraisalLoanApplicationId: number = 0;
    creditAppraisalOperationId: number = 0;
    disableLoadTemplateForPMU: boolean = false;
    showReferBackForPMU: boolean = false;
    loanApplicationTags: any;
    isThirdPartyFacility: boolean = false;
    selectedApprover: string = '';
    availableApprovers: any[] = [];
    searchTerm$ = new Subject<any>();
    displayApproverSearchForm: boolean = false;
    nextLevelId = 0;
    showCustomer: boolean = false;
    showFinanceStatement: boolean = false;
    showCollateral: boolean = false;
    showCreditCondition: boolean = false;
    showAccountStatistics: boolean = false;
    countryCode: string;
    @ViewChild('approvalInPut', {static: false}) approvalInPut: ElementRef;

    disableApplicationInformationTab = true;
    disableLoanInformationTab = true;
    disableSupportingDocumentsTab = true;
    disableAppraisalMemorandumTab = true;
    disableConditionsTab = true;
    disableDynamicsTab = true;
    disableTriggersTab: boolean = true;
    activeTabindex: number = 0;
    application: any = {};
    selectedLoanId: number = null;
    reloadGrid: number = 0;
    selectedDetailId: any;
    selectedApplicationLoanId: number = 0;
    reloadLoanDetails: number = 0;
    OPERATION_ID: number = 0; //= 46;
    customerId: number = 0;
    proposedItems: any[] = [];
    applicationCustomers: any[] = [];
    fromYear: any = null;
    fromMonth: any = 0;
    toYear: any = null;
    toMonth: any = 0;
    account: any = 0;
    accounts: any[] = [];
    operationName: any;
    operationTypeNames: any;
    loanApplicationIds: any;

    // @ViewChild(JobRequestViewComponent) jobRequestViewObj: JobRequestViewComponent;

    ngOnDestroy(): void {
        if (this.showComponents) { console.log('show component is true'); this.subscriptions.unsubscribe(); }
    }

    constructor(
        private fb: FormBuilder,
        private realSearchSrv: StaffRealTimeSearchService,
        private loadingService: LoadingService,
        private reviewService: LoanReviewApplicationService,
        private camService: CreditAppraisalService,
        private customerService: CustomerService,
        private collateralService: CollateralService,
        private staffRole: StaffRoleService,
        private authHttp: AuthHttp

    ) { }

    ngOnInit() {
        this.jobSourceId = JobSourceEnum.LMSApplication;
        this.clearControls();
        this.getUserRole();
        this.countryCode = "NG";
        this.authHttp.setCountryCode("NG");
        this.camService.setCountryCode("NG");
        
        // this.apiTest(); // <------------------------------- development only
    }

    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 2) { this.getDocumentationSections(false); }

    }

    userisAnalyst: boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    userIsAccountOfficer2 = false;
    staffRoleRecord: any;

    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
            if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
                this.userIsAccountOfficer = true;
                this.AcceptButtonText = 'Submit';
            }

            if (this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP') {
                this.userIsAccountOfficer2 = true;
            }

            if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
                this.userIsRelationshipManager = true;
            }
            // console.log("this.userIsAccountOfficer: ", this.userIsAccountOfficer);
        });
    }



    showComponents: boolean;
    onApplicationSelected(selected) {
        const { countryCode } = selected;
        this.countryCode = countryCode;
        this.authHttp.setCountryCode(countryCode);
        this.authHttp.setIsLMS(true);
        this.camService.setCountryCode(countryCode);
        //console.log("selected: ", JSON.stringify(selected));
        this.refreshVariables();
        this.showComponents = true;
        if (selected.createdBy == selected.staffId && (selected.staffRoleCode == "PMU" || selected.staffRoleCode == "RMO" || selected.staffRoleCode == "CP" || selected.staffRoleCode == "AO" || selected.staffRoleCode == "AO / RO")) {
            this.disableLoadTemplateForPMU = false;
            this.showReferBackForPMU = false;
        }
        else {
            this.disableLoadTemplateForPMU = true;
            this.showReferBackForPMU = true;
        }

        this.refresh();
        this.customerId = selected.customerId;
        this.enebleFacilityChange = false;
        this.application = selected;
        this.loanReferenceNumber = this.application.referenceNumber;
        this.OPERATION_ID = selected.operationId;
        this.proposedItems = selected.applicationDetails;
        this.facilityCount = selected.applicationDetails.length;
        this.approvedRate = selected.applicationDetails[0].approvedRate;
        this.proposedRate = selected.applicationDetails[0].proposedRate;
        this.approvedTenor = selected.applicationDetails[0].approvedTenor;
        this.proposedTenor = selected.applicationDetails[0].proposedTenor;
        this.approvedAmount = selected.applicationDetails[0].approvedAmount;
        this.proposedAmount = selected.applicationDetails[0].proposedAmount;
        this.currencyId = selected.applicationDetails[0].currencyId;
        this.creditAppraisalLoanApplicationId = this.proposedItems[0].creditAppraisalLoanApplicationId;
        this.creditAppraisalOperationId = this.proposedItems[0].creditAppraisalOperationId;

        this.accountName = selected.applicationDetails[0].accountName;
        this.accountNumber = selected.applicationDetails[0].accountNumber;

        this.loanApplicationId = selected.applicationDetails[0].creditAppraisalLoanApplicationId;
        this.loanApplicationIds = selected.applicationDetails[0].loanApplicationId;
        this.operationTypeNames = selected.applicationDetails[0].reviewDetails;
        console.log("Hello " + selected.applicationDetails[0].loanSystemTypeId);
        if (selected.applicationDetails[0].loanSystemTypeId == 5) {
            this.isThirdPartyFacility = true;
        }

        // this.showCustomerInformation();
        // this.reloadLoanDetails = selected.loanId; // ----------------------------------dropdown
        this.activeTabindex = 1;
        this.enableTabs();
        this.getRatings();
        this.getUserPrivileges(this.application.currentApprovalLevelId, countryCode); // call this inside getObligorInformation
        this.getCustomerExistingLoans();
        this.getcustomerLimitAndRating();
        // this.refreshCollateral();
        //this.getCamDocument(selected.loanReviewApplicationId);
        this.getCustomerbyApplication(this.application.loanReviewApplicationId);
        this.getTrail();
        this.getMaximumApplicationOutstandingBalance(this.application.loanReviewApplicationId);
        this.getDocumentationSections(false);
        // this.proposedItems = [
        //     {
        //         obligorName: 'gfgfgfgfgfgf',
        //         proposedProductName: 'gfgfggfg',
        //         proposedTenorString: '445',
        //         proposedRate: '3',
        //         proposedAmount: '300000',
        //         loanApplicationDetailId: '1',
        //     },
        //     {
        //         obligorName: 'gfgfgfgfgfgf',
        //         proposedProductName: 'gfgfggfg',
        //         proposedTenorString: '445',
        //         proposedRate: '3',
        //         proposedAmount: '300000',
        //         loanApplicationDetailId: '2',
        //     },
        // ];
        this.updateWorkflowTarget();
        //this.getRatings();
        this.reloadGrids();
        //this.getSingleCustomerIds();
    }
    

    saveLoanApplicationTags(form) {
        let body = {
            isProjectRelated: form.value.isProjectRelated,
            isOnLending: form.value.isOnLending,
            isInterventionFunds: form.value.isInterventionFunds,
            withInstruction: form.value.withInstruction,
            domiciliationNotInPlace: form.value.domiciliationNotInPlace,
            isAgricRelated: form.value.isAgricRelated,

        };
        this.loadingService.show();
        this.camService.updateLoanApplicationTagsLMS(body, this.loanApplicationIds).subscribe((response) => {
            this.loadingService.hide();
            if (response.success == true) this.reloadGrids();
            else this.finishBad(response.message);
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    }

    DisplayFinanceStatementComponent() {
        this.showFinanceStatement = true;
    }

    DisplayCollateralComponent() {
        this.refreshCollateral();
        this.showCollateral = true;

    }
    DisplayCustomerComponent() {
        this.showCustomer = true;
    }

    getLoanApplicationTagsLMS() {
        this.camService.getLoanApplicationTagsLMS(this.loanApplicationIds).subscribe((response) => {
            this.loanApplicationTags = response.result;
            this.loanApplicationTagsForm.controls['isProjectRelated'].setValue(this.loanApplicationTags.isProjectRelated);
            this.loanApplicationTagsForm.controls['isOnLending'].setValue(this.loanApplicationTags.isOnLending);
            this.loanApplicationTagsForm.controls['isInterventionFunds'].setValue(this.loanApplicationTags.isInterventionFunds);
            this.loanApplicationTagsForm.controls['withInstruction'].setValue(this.loanApplicationTags.withInstruction);
            this.loanApplicationTagsForm.controls['domiciliationNotInPlace'].setValue(this.loanApplicationTags.domiciliationNotInPlace);
            this.loanApplicationTagsForm.controls['isAgricRelated'].setValue(this.loanApplicationTags.isAgricRelated);

        });
    }

    reloadGrids() {
        this.loanApplicationTagsForm.reset();
        this.getLoanApplicationTagsLMS();
        this.reload = this.creditAppraisalLoanApplicationId;
    }

    getCustomerbyApplication(applicationId) {
        this.subscriptions.add(
            this.camService.getCustomerbyApplication(applicationId, "LMS").subscribe((response) => {
                this.applicationCustomers = response.result;
            }));
    }

    loadDefaultDocumentTemplate() {
        if (this.documentTemplates.length > 0) {
            const body = {
                templateId: this.documentTemplates[0].templateId,
                operationId: this.OPERATION_ID,
                targetId: this.application.loanApplicationId,
            };
            this.loadingService.show();
            this.camService.loadDocumentTemplate(body).subscribe((response) => { // heavy call!
                this.loadingService.hide();
                this.displayAppendModal = false;
                if (response.success) {
                    this.previewDocumentation();
                }

            }, (err) => {
                this.loadingService.hide(1000);
            });
        }
        this.getDocumentationSections(false);
    }


    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.application.loanReviewApplicationId;
        this.workflowTarget.operationId = this.application.operationId;
        this.workflowTarget.productClassId = null;
        this.workflowTarget.productId = null;
        this.workflowTarget.toStaffId = this.application.toStaffId; // optional
        this.workflowTarget.responsiblePerson = this.application.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.currentApprovalLevel = this.application.currentApprovalLevel; // required if toStaffId is given
        this.workflowTarget.finalApprovalLevelId = this.application.finalApprovalLevelId;
        this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }

    //----------------------- privileges and buttons --------------------------

    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        canEscalate: false,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: null,
        groupRoleId: 1, // bu,ca,md,comm,bd
    };

    getUserPrivileges(levelId: number = null, countryCode) {
        debugger
        let body = {
            levelId: levelId,
            operationId: this.application.operationId, // this.OPERATION_ID,
            targetId: this.application.loanReviewApplicationId,
            productClassId: null,
            productId: null
        }
        if(countryCode == 'NG'|| countryCode == null || countryCode == undefined){
        this.subscriptions.add(
            this.camService.getPrivilege(body).subscribe((response) => {
                this.privilege = response.result;
                // console.log("this.privilege: ", this.privilege);
                this.setGroupRole(this.privilege.groupRoleId);
                this.setCanSwitch(this.privilege.levelTypeId);
                this.reload++;
                if (this.privilege.canApprove != true) this.commentLabel = 'Comment';
            }));}

            if(countryCode && countryCode !== 'NG'){
                this.privilege = this.camService.getPrivilegeByCode(body);
               }
    }

    
    setCanSwitch(id) {
        this.canSwitch = id == 3;
    }

    withinApprovalLimits() {
        if (this.application == null) return;
        if (this.privilege.approvalLimit >= this.maximumAmount) {
            return true;
        }
        return false;
    }

    approveActionLabel: string = 'Approve';
    // authorizeActionLabel: string = 'Authorize';

    getApproveButtonLabel() {
        if (this.withinApprovalLimits() == true) {
            return this.approveActionLabel;
        }
        return 'Submit'; // this.authorizeActionLabel;
    }


    setGroupRole(id) {
        this.isBoard = false;
        this.isAnalyst = false;
        this.isBusiness = false;
        this.isSubsequent = false;
        switch (id) {
            case 0: this.isBusiness = true; break;
            case ApprovalGroupRole.BU: this.isBusiness = true; break;
            case ApprovalGroupRole.CAP: this.isAnalyst = true; break;
            case ApprovalGroupRole.BOD: this.isBoard = true; break;
            default: this.isBusiness = true; break;
        }
    }

    canForward() {
        if (this.application.currentApprovalLevelId == null) return;
        if (this.privilege.userApprovalLevelIds == null) return false;
        const currentLevelIncluded = this.privilege.userApprovalLevelIds.some(x => x == this.application.currentApprovalLevelId);
        return currentLevelIncluded;

    }

    canEditDocument() { return true; }

    //-------------------------------------------------

    enableTabs() {
        this.disableApplicationInformationTab = false;
        this.disableSupportingDocumentsTab = false;
        this.disableAppraisalMemorandumTab = false;
        this.disableConditionsTab = false;
        this.disableDynamicsTab = false;
        this.disableTriggersTab = false;
    }



    showAddModal() {
        this.clearControls();
        this.displayAddModal = true;
    }

    edit(row) {
        this.selectedId = row.timelineId;
        this.addForm = this.fb.group({
            timeline: [row.timeline, Validators.required],
        });
        this.displayAddModal = true;
    }

    // ------------ cam doc ------------

    camDocuments: any[] = [];
    camDocument: any = '<p></p>';
    incommingCamDocument: any;
    // editMode: boolean = false;
    errorMessage: string = '';

    toggleEditMode() {
        if (this.editMode == false) {
            this.editMode = true;
            return;
        }
        let __this = this;
        setTimeout(function () {
            __this.editMode = __this.editMode == false; // delay for ckeditor update  // __this.editMode = __this.editMode == true ? false : true;
        }, 2000);
    }

    // ------------ append template ------------

    appendForm: FormGroup;
    documentTemplates: any[] = [];
    displayAppendModal: boolean = false;

    // showAppendModal() {
    //     this.clearControls();
    //     if (this.documentTemplates.length > 0) {
    //         this.displayAppendModal = true;
    //     } else {
    //         this.loadingService.show();
    //         this.documentService.getDocumentByLevelId(this.privilege.approvalLevelId).subscribe((response) => {
    //             this.documentTemplates = response.result;
    //             this.displayAppendModal = true;
    //             this.loadingService.hide();
    //         }, (err) => {
    //             this.loadingService.hide(1000);
    //         });
    //     }
    // }

    // appendDocument(form) {
    //     let doc = this.documentTemplates.find(x => x.creditTemplateId == form.value.creditTemplateId);
    //     if (doc != null) {
    //         // this.camDocument += '<br>'; this.camDocument += this.fillPlaceholders(doc.templateDocument); // append
    //         this.camDocument = this.fillPlaceholders(doc.templateDocument); // replace
    //         this.displayAppendModal = false;
    //     }
    // }

    // ------------ save & get cam doc ------------

    selectedCamDocumentId?: number = null;
    ckeditorUpdates: number = 0;
    // displayDocumentation: boolean = false;
    // documentations: any[] = [];

    // closeDocumentation() { this.displayDocumentation = false; }
    getDocumentValue(e) { this.incommingCamDocument = e; }

    updateDocument() {
        this.loadingService.show();
        this.ckeditorUpdates++;
        const __this = this;
        setTimeout(function () {
            __this.saveSection();
        }, 200); // delay for ckeditor to return data
    }

    // saveCamDocument(addNew = false) {

    //     let body = {
    //         documentation: this.incommingCamDocument,//this.camDocument,
    //         // documentation: this.camDocument,
    //         documentationId: this.selectedCamDocumentId,
    //         createNew: addNew,
    //         approvalLevelId: this.privilege.userApprovalLevelIds[0],//this.application.currentApprovalLevel, // of app or user
    //         applicationId: this.application.loanReviewApplicationId,
    //         referenceNumber: this.application.referenceNumber,
    //     }

    //     ////console.log('body...', body);
    //     this.loadingService.show();
    //     this.reviewService.saveCamDocument(body).subscribe((response) => {
    //         ////console.log(response);
    //         if (response.success == false) {
    //             this.finishBad(response.message);
    //         } else {
    //             this.camDocument = this.incommingCamDocument;
    //             this.incommingCamDocument = null; // clear browser
    //             this.selectedCamDocumentId = response.result;
    //         }
    //         this.editMode = false; 
    //         this.loadingService.hide();
    //     }, (err: any) => {
    //         this.finishBad(JSON.stringify(err));
    //     });
    // }

    // getCamDocument() { // get my cam
    //     // if (this.camDocument != '<p></p>') return; // prevent repeat
    //     this.camDocument = '<p></p>';
    //     this.loadingService.show();
    //     this.reviewService.getCamDocumentByLevel(
    //         this.application.loanReviewApplicationId).subscribe((response) => {
    //             ////console.log(response);
    //             this.camDocument = response.result.documentation;
    //             this.selectedCamDocumentId = response.result.documentationId;
    //             this.loadingService.hide();
    //         }, (err: any) => {
    //             this.finishBad(JSON.stringify(err));
    //         });

    // }

    // openDocumentation() {
    //     this.loadingService.show();
    //     this.reviewService.getCamDocuments(this.application.loanReviewApplicationId).subscribe((response) => {
    //         this.documentations = response.result;
    //         this.loadingService.hide();
    //         this.displayDocumentation = true;
    //         ////console.log('cams..', response.result);
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //         ////console.log("error", err);
    //     });
    // }

    // newDocumentation() {
    //     const _this = this;
    //     swal({
    //         title: 'Create New Appraisal Memorandum?',
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
    //         _this.saveCamDocument(true);
    //     }, function (dismiss) {
    //         if (dismiss === 'cancel') {
    //             swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
    //         }
    //     });
    // }


    // ------------ forms ------------

    clearControls() {
        this.selectedId = null;
        this.documentSectionForm = this.fb.group({
            sectionId: ['', Validators.required],
        });
        this.addForm = this.fb.group({
            timeline: ['', Validators.required],
        });
        this.appendForm = this.fb.group({
            creditTemplateId: ['', Validators.required],
        });
        this.commentForm = this.fb.group({
            comment: ['', Validators.required], // debug_test, flow_test
            vote: [2, Validators.required],
            principal: [''],
            rate: [''],
            tenor: [''],
            productId: [''],
            trailId: [''],
            statusId: [''],
            exchangeRate: [''],
            initialExposure: [''],
            totalExposure: [''],
            newExposure: [''],
        });

        this.loanApplicationTagsForm = this.fb.group({
            isProjectRelated: [''],
            isOnLending: [''],
            isInterventionFunds: [''],
            withInstruction: [''],
            domiciliationNotInPlace: [''],
            isAgricRelated: '',

        });


    }

    // forward / approve / refer back

    displayCommentForm: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    testModal: boolean = false;
    forward() {

        this.clearControls();
        if (this.isLoadTemplate == false && this.userIsAccountOfficer) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please kindly load a template for the request!', 'error');
            return;
        }
        this.forwardAction = ApprovalStatus.PROCESSING;
        this.displayCommentForm = true;
        this.commentTitle = 'Forward';
        // if (this.isBusiness || this.isAnalyst) 
        // if (this.isBusiness) 
        // { 
        this.commentForm.controls['vote'].setValue(2);
        //  }
    }

    approve() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.APPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Approve';
        // if (this.isBusiness) 
        // { 
        this.commentForm.controls['vote'].setValue(2);
        //  }
    }

    disapprove() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.DISAPPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Disapprove';
        this.commentForm.controls['vote'].setValue(3);
        // this.commentForm.controls['vote'].setValue(1);
    }

    refer() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.REFERRED;
        this.displayCommentForm = true;
        this.commentTitle = 'Refer Back';
        this.referBackTrail();
        // this.getTrail();
        let control = this.commentForm.controls['trailId'];
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
        this.commentForm.controls['vote'].setValue(5);
        // this.commentForm.controls['vote'].setValue(3);
    }

    escalate() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.ESCALATED;
        this.displayCommentForm = true;
        this.commentTitle = 'Escalate';
        this.commentForm.controls['vote'].setValue(2);
    }


    forwardCam(form) {
        var promptMessage;
        const __this = this;
        let body = {
            forwardAction: __this.forwardAction,
            applicationId: __this.application.loanReviewApplicationId,
            operationId: __this.OPERATION_ID,
            receiverLevelId: __this.receiverLevelId,
            receiverStaffId: __this.receiverStaffId,
            comment: form.value.comment,
            vote: +form.value.vote,
            isBusiness: __this.isBusiness,
            recommendedChanges: __this.recommendedItems,
            reviewStageId: 1,
            isFlowTest: true,
            referenceNumber: __this.application.loanReferenceNumber,
            loanId: __this.application.loanId
        };

        if (__this.isLoadTemplate == false) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please kindly load a template for the request!', 'error');
            return;
        }

        if (__this.forwardAction == 5) { body.isFlowTest = false }
        __this.errorMessage = '';

        __this.loadingService.show();
        __this.reviewService.forwardApplication(body).subscribe((response) => {
            __this.loadingService.hide();
            if (response.success == true) {
                if (__this.forwardAction == 5) {

                    __this.reset();
                    __this.displayCommentForm = false;
                    __this.clearRequestControls();
                    __this.loadingService.hide();

                    if (response.result.isFinal == true) {
                        // __this.reportServ.generateOoutPutDocument(__this.loanApplicationId).subscribe((res) => {
                        //     let  path = res.result;
                        //     if (path != null) {
                        //         __this.reportSrc = __this.sanitizer.bypassSecurityTrustResourceUrl(path);
                        //         __this.displayTestReport = false;

                        //     __this.displayApplicationStatusMessage(response.result);
                        // }

                        // });
                    }
                    else {
                        __this.displayApplicationStatusMessage(response.result);
                    }
                    return;
                }

                if (response.stateId == 3) {
                    if (this.OPERATION_ID == 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will been <strong>${response.statusName} and sent to operations.</strong> `, 'success'); }

                    if (this.OPERATION_ID != 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will be <strong>${response.statusName} and sent to availment</strong> `, 'success'); }

                    else { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will be <strong>${response.statusName}</strong>`, 'success'); }
                }
                else {
                    promptMessage = 'Application Status: ' + response.result.statusName + '. \n Next Approver: ' + response.result.nextLevelName + '-' + response.result.nextPersonName;
                }
                swal({
                    title: 'Workflow Destination Route',
                    text: promptMessage + '\n Do you want to proceed?',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    confirmButtonClass: 'btn btn-success btn-move',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: true,
                }).then(function () {

                    body.isFlowTest = false;
                    __this.loadingService.show();
                    __this.subscriptions.add(__this.reviewService.forwardApplication(body).subscribe((response) => {
                        if (response.success == true) {
                            __this.reset();
                            __this.displayCommentForm = false;
                            __this.clearControls();
                            __this.loadingService.hide();
                            __this.displayApplicationStatusMessage(response.result);
                        } else {
                            __this.finishBad(response.message);
                            __this.errorMessage = response.message;
                        }
                    }, (err: any) => {
                        __this.finishBad(JSON.stringify(err));
                        __this.errorMessage = err;
                    }));
                }, function (dismiss) {
                    if (dismiss === 'cancel') {
                        // __this.nextLevelId = response.result.nextLevelId;
                        __this.displayApproverSearchForm = true;
                        // swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                    }
                });

            } else {
                __this.finishBad(response.message);
                __this.errorMessage = response.message;
            }
        }, (err: any) => {
            __this.finishBad(JSON.stringify(err));
        });

    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3) {
            if (this.OPERATION_ID == 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}.</strong> Sent to operations.`, 'success'); }

            if (this.OPERATION_ID != 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}.</strong>`, 'success'); }

            else { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}</strong>`, 'success'); }
        }
        else
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
    }

    cancelForm() {
        this.displayCommentForm = false;
        this.errorMessage = '';
        // this.lineSelection = null;
        this.receiverLevelId = null;
        this.receiverStaffId = null;
        // this.selectedLineId = null;
    }

    reset() {
        let control = this.commentForm.controls['trailId'];
        control.setValidators(null);
        control.updateValueAndValidity();
        // this.monitoringTriggerCollection = [];
        this.activeTabindex = 0;
        this.application = {};
        // this.workingLoanApplication = null;
        this.disableApplicationInformationTab = true;
        this.disableAppraisalMemorandumTab = true;
        this.disableSupportingDocumentsTab = true;
        // this.disableApprovalsAndCommentsTab = true;
        // this.disableConditionsTab = true;
        // this.disableDynamicsTab = true;
        this.disableTriggersTab = true;
        this.reloadGrid++;
        this.nextLevelId = 0;
        this.selectedApprover = '';

        // this.filteredProductClass = null;
        // this.filteredProductClassId = null; // MUST RUN BEFORE getLoanApplications()
        // this.getLoanApplications(0, this.currentLazyLoadEvent.rows); // refresh list

        // this.loadProductPrograms();
        // this.selectedApplicationDetailId = null;
    }

    refreshVariables() {
        this.showCustomer = false;
        this.showFinanceStatement = false;
        this.showCollateral = false;
        this.showCreditCondition = false;
        this.showAccountStatistics = false;
    }

    clearRequestControls() {

        this.commentForm = this.fb.group({
            comment: ['', Validators.required], // debug_test, flow_test
            vote: ['', Validators.required],
            principal: [''],
            rate: [''],
            tenor: [''],
            productId: [''],
            trailId: [''],
            statusId: [''],
            exchangeRate: [''],
            initialExposure: [''],
            totalExposure: [''],
            newExposure: [''],
        });

        this.isBusiness == true ? 'Comment' : 'Recommendation';
    }

    // trail & comment

    trail: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;

    getTrail() {
        //this.loadingService.show();
        this.subscriptions.add(
            this.camService.getTrail(this.application.loanReviewApplicationId, this.OPERATION_ID).subscribe((response) => {
                this.trail = response.result;
                this.trailCount = this.trail.length;
                this.trailRecent = response.result[0];
                response.result.forEach((trail) => {
                    if (this.trailLevels.find(x => x.requestStaffId === trail.requestStaffId) === undefined) {
                        this.trailLevels.push(trail);
                    }
                });
                // this.referBackTrail();
                //this.loadingService.hide();
            }, (err) => {
                //this.loadingService.hide(1000);
            }));
    }

    referBackTrail(): any {
        this.backtrail = [];
        this.loadingService.show();
        this.camService.getTrailForReferBack(this.application.loanReviewApplicationId, this.OPERATION_ID, this.application.currentApprovalLevelId, false).subscribe((response) => {
            this.loadingService.hide();
            this.backtrail = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
        // this.trail.forEach(x => {
        //     if (this.backtrail.find(t =>
        //         t.fromApprovalLevelId == x.fromApprovalLevelId
        //         && t.requestStaffId == x.requestStaffId
        //     ) == null && x.fromApprovalLevelId != null
        //     ) {
        //         this.backtrail.push({
        //             approvalTrailId: x.approvalTrailId,
        //             fromApprovalLevelId: x.fromApprovalLevelId,
        //             fromApprovalLevelName: x.fromApprovalLevelName,
        //             requestStaffId: x.requestStaffId,
        //             staffName: x.staffName,
        //         });
        //     }
        // });
    }

    onTargetStaffLevelChange(trailId) {
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    // ----------- approval status ------------

    approvalStatus = [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Processing' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Disapproved' },
        { id: 4, name: 'Authorised' },
        { id: 5, name: 'Referred' },
    ];

    getApprovalStatus(id) {
        let item = this.approvalStatus.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    // ------------ MAKE COMPONENT ------------

    existingLoans: any[] = [];
    outstandingAmt: number;
    totalApproved: number;
    existingExposure: string;
    existingApproved: string;

    showSpinnerExistingLoans: boolean = false;
    displayExistingLoans: boolean = false;

    getCustomerExistingLoans(customerId = this.application.customerId) { // credit\loans\start-loan-application\start-loan-application.component
        if (this.reloadLoanDetails = 0) return;
        // this.showSpinnerExistingLoans = true;
        // this.loanService.getCustomerLoans(customerId).subscribe((response) => {
        //     this.existingLoans = [];
        //     this.outstandingAmt = 0;
        //     this.totalApproved = 0;
        //     this.existingLoans = response.result;
        //     this.showSpinnerExistingLoans = false;
        //     this.displayExistingLoans = true;
        //     if (this.existingLoans.length > 0) {
        //         this.existingLoans.forEach(el => {
        //             this.outstandingAmt += el.outstandingPrincipal;
        //             this.totalApproved += el.approvedAmount;
        //         });
        //         this.existingExposure = this.outstandingAmt.toLocaleString('en-US', { minimumFractionDigits: 2 });
        //         this.existingApproved = this.totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 });
        //     }
        // });
    }

    // Limit / Exposure
    customerRating: string;
    investmentGrade: boolean;

    isCleanLending = true; lgroupLimit: any; lrMLimit: any; lnPLLimit: any; lcustomerLimit: any;
    lsegmentLimit: any; lsectorLimit: any; lbranchLimit: any; ogroupLimit: any; orMLimit: any;
    onPLLimit: any; ocustomerLimit: any; osegmentLimit: any; osectorLimit: any; obranchLimit: any;

    getcustomerLimitAndRating(customerId = this.application.customerId) { // credit\loans\application\newloanapplication.component.h
        if (customerId == null) return;
        this.subscriptions.add(
            this.customerService.getCustomerRatingAndLimit(customerId).subscribe((res) => {
                ////console.log('res - ', res);
                if (res.success == true && res.result != null) {
                    this.lcustomerLimit = res.result.limit;
                    this.customerRating = res.result.rating;
                    this.investmentGrade = res.result.isInvestment;
                }
            }, (err) => {
                ////console.log(err);
            }));
    }

    scheduleTermsIsSet(event) { }

    // ---------------------- form cam ----------------------

    // ckeditor
    ckeditorChanges: any;
    contentChange(updates) { this.ckeditorChanges = updates; }

    sectionContent: any;
    sectionDescription: any = '';
    documentationSections: any[] = [];
    editMode: boolean = false;
    selectedSectionId: number = null;
    selectedSectionIdIndex: number = null;
    documentSectionForm: FormGroup;
    displayDocumentation: boolean = false;
    documentations: any[] = [];
    updateFromEditor: number = 0;
    TEMPLATE_OPERATION_ID: number = 6;
    LMS_TEMPLATE_OPERATION_ID: number = 46;

    getDocumentationSections(showLoadDocumentModal: boolean) {
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getDocumentSections(this.LMS_TEMPLATE_OPERATION_ID, this.application.loanReviewApplicationId).subscribe((response) => {
                this.documentationSections = response.result;
                this.loadingService.hide();
                if (this.documentationSections != null && this.documentationSections != undefined && this.documentationSections.length > 0) {
                    this.isLoadTemplate = true;
                }
                if (this.documentationSections.length < 1) {
                    this.getDocumentTemplate(showLoadDocumentModal);
                }
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    getDocumentTemplate(showLoadDocumentModal: boolean) {
        this.clearControls();
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getDocumentTemplates(this.TEMPLATE_OPERATION_ID).subscribe((response) => {
                this.documentTemplates = response.result;
                this.displayAppendModal = showLoadDocumentModal;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    loadDocumentTemplate(form) {
        const body = {
            templateId: form.value.creditTemplateId,
            operationId: this.TEMPLATE_OPERATION_ID,
            targetId: this.application.loanReviewApplicationId,
            lmsOperationId: this.LMS_TEMPLATE_OPERATION_ID,
            // targetId: this.application.loanReviewApplicationId,
        }
        //alert(JSON.stringify(body));
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.loadDocumentTemplateLms(body).subscribe((response) => {
                this.loadingService.hide();
                this.displayAppendModal = false;
                this.getDocumentationSections(false);
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }


    onDocumentSectionChange(sectionId) {
        if (this.isThirdPartyFacility == true) {
            this.loadingService.show();
            this.subscriptions.add(
                this.camService.getDocumentSectionForThirdparty(this.LMS_TEMPLATE_OPERATION_ID, this.application.loanReviewApplicationId, sectionId).subscribe((response) => {
                    if (response.result == null) return;
                    this.editMode = response.result.editable;
                    this.sectionContent = response.result.templateDocument;
                    this.sectionDescription = response.result.description;
                    this.selectedSectionId = sectionId;
                    this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
                    this.loadingService.hide();
                }, (err) => {
                    this.loadingService.hide(1000);
                }));
        }

        else {
            this.loadingService.show();
            this.subscriptions.add(
                this.camService.getDocumentSection(this.LMS_TEMPLATE_OPERATION_ID, this.application.loanReviewApplicationId, sectionId).subscribe((response) => {
                    if (response.result == null) return;
                    this.editMode = response.result.editable;
                    this.sectionContent = response.result.templateDocument;
                    this.sectionDescription = response.result.description;
                    this.selectedSectionId = sectionId;
                    this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
                    this.loadingService.hide();
                }, (err) => {
                    this.loadingService.hide(1000);
                }));
        }

    }

    printSelectedSection(): void {
        //this.previewDocumentation(true);
        let printTitle = 'FACILITY APPROVAL MEMO No.: ' + this.loanReferenceNumber;
        let printContents, popupWin;
        printContents = document.getElementById('print-selected-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title>${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
            </html>`
        );
        popupWin.document.close();

    }
    saveSection(alert = false) {
        this.sectionContent = this.ckeditorChanges; // on save click
        const body = {
            templateDocument: this.sectionContent,
            sectionId: this.selectedSectionId
        };
        this.subscriptions.add(
            this.camService.saveSection(body).subscribe((response) => {
                ////console.log('saved --> ', response);
                this.ckeditorChanges = null; // cleanup
                if (alert == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document saved!', 'success');
                }
            }));
    }

    nextSection(direction) {
        const max = this.documentationSections.length - 1;
        let index = direction == 1 ? this.selectedSectionIdIndex - 1 : this.selectedSectionIdIndex + 1;
        if (index > max) index = 0;
        if (index < 0) index = max;
        const sectionId = this.documentationSections[index].sectionId;
        this.documentSectionForm.controls['sectionId'].setValue(sectionId);
        this.onDocumentSectionChange(sectionId);
    }

    previewDocumentation(print = false) {
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getDocumentation(this.LMS_TEMPLATE_OPERATION_ID, this.application.loanReviewApplicationId, this.isThirdPartyFacility).subscribe((response) => {
                this.documentations = response.result;
                this.loadingService.hide();
                if (print == false) this.displayDocumentation = true;
                else setTimeout(() => this.print(), 1000);
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    previewDocumentationLOS(print = false) {
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getDocumentation(this.creditAppraisalOperationId, this.creditAppraisalLoanApplicationId, this.isThirdPartyFacility).subscribe((response) => {
                this.documentations = response.result;
                this.loadingService.hide();
                if (print == false) this.displayDocumentation = true;
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    print(): void {
        let printTitle = 'CREDIT APPRAISAL - ' + this.application.referenceNumber;
        let printContents, popupWin;
        let content = '<div class="row">';
        this.documentations.forEach(x => {
            content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
        });
        content = content + '</div>';

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

    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    loadEditor(body) {
        this.sectionContent = body;
    }

    // ------------ comment ------------

    warningMessage: string = '';
    touchedLineItems: number[] = [];
    recommendedItems: any[] = [];
    selectedLineId: number;
    enebleFacilityChange: boolean = false;

    // fees: any[] = [];
    // changeLog: any[] = [];
    // proposedItems: any[] = [];
    // touchedLineItems: number[] = [];
    // duplications: number[] = [];
    // showChangeLog: boolean = false;
    // displayChangeLog: boolean = false;
    // showSpinnerChangeLog: boolean = false;

    onLineRowSelect(row) {
        this.enebleFacilityChange = this.enableChanges();
        this.selectedLineId = row.loanApplicationDetailId; // tobe used @ onLineItemChange()
        this.clearRecommendationForm(this.selectedLineId);
        let item = this.recommendedItems.find(x => x.detailId == row.loanApplicationDetailId);
        // this.computeTotalExposure();
        // this.computeNewExposure();
        if (item == null) { return; }
        this.commentForm.controls['principal'].setValue(item.amount);
        this.commentForm.controls['rate'].setValue(item.interestRate);
        this.commentForm.controls['tenor'].setValue(item.tenor);
        // this.commentForm.controls['productId'].setValue(item.productId);
        this.commentForm.controls['statusId'].setValue(item.statusId);
        // this.commentForm.controls['exchangeRate'].setValue(item.exchangeRate);
    }

    onLineItemChange(input, value, id = null) {
        ////console.log('item changed...', value);
        if (value.toString().trim() == '') return;
        this.selectedLineId = id == null ? this.selectedLineId : +id;
        let item = this.recommendedItems.find(x => x.detailId == this.selectedLineId);
        if (item == null) {
            let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
            let newRecommendation = {
                detailId: o.loanApplicationDetailId,
                // productId: o.approvedProductId,
                statusId: o.statusId,
                amount: o.approvedAmount,
                // exchangeRate: o.exchangeRate,
                interestRate: o.approvedRate,
                tenor: o.approvedTenor,
                // productName: o.approvedProductName,
                convertedAmount: o.convertedApprovedAmount
            };
            this.recommendedItems.push(newRecommendation);
            item = newRecommendation;
        }
        if (input == 1) { value = this.formatMCleanup(value); } // resolve the null=0 bug
        switch (input) {
            case 1: item.amount = value; /*item.convertedAmount = value * item.exchangeRate;*/ break;
            case 2: item.interestRate = value; break;
            case 3: item.tenor = value * 30; break;
            //case 4: item.productId = value; item.productName = this.getProductName(value); break;
            case 5: item.statusId = value; this.commentForm.controls['statusId'].setValue(value); this.setProductApprovalStatus(value); break;
            // case 6: item.exchangeRate = value; item.convertedAmount = value * item.amount; break;
        }
        //this.computeTotalExposure();
        //this.computeNewExposure();
        this.touchedLineItems.push(this.selectedLineId); // mark change made here *
    }

    clearRecommendationForm(id = null) {
        this.commentForm.controls['principal'].setValue('');
        this.commentForm.controls['rate'].setValue('');
        this.commentForm.controls['tenor'].setValue('');
        // this.commentForm.controls['productId'].setValue('');
        this.commentForm.controls['statusId'].setValue(this.getProductApprovalStatus());
        // this.commentForm.controls['exchangeRate'].setValue('');
    }

    formatMCleanup(value) {
        var numberPart = value.substr(0, value.length - 1);
        var readablePart: string = value.substr(-1);
        numberPart = parseFloat(numberPart.replace(/,/g, '')).toString();
        if (readablePart === 'M' || readablePart == 'm') {
            return Number(numberPart) * 1000000;
        } else if (readablePart === 'T' || readablePart == 't' || readablePart === 'K' || readablePart === 'k') {
            return Number(numberPart) * 1000;
        } else if (readablePart === 'b' || readablePart === 'B') {
            return Number(numberPart) * 1000000000;
        } else {
            return Number(numberPart);
        }
    }

    setProductApprovalStatus(value) {
        let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
        o.statusId = value;
    }

    getProductApprovalStatus() {
        let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
        return o.statusId;
    }

    enableChanges() {
        return (this.isAnalyst == true && this.privilege.canMakeChanges == true)
            || (this.privilege.canApprove == true && this.privilege.canMakeChanges == true);
    }

    canSupport() {
        return this.privilege.canApprove && this.forwardAction != 3 && this.facilityCount > 1;
    }

    // ------ management position-------

    managementPosition: any;
    displayManagementPositionForm: boolean = false;

    editManagementPosition(row) {
        this.selectedDetailId = row.loanApplicationDetailId;
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getManagementPosition(row.loanApplicationDetailId).subscribe((response) => {
                this.managementPosition = response.result.managementPosition;
                this.displayManagementPositionForm = true;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
                ////console.log('ERROR getting management position!', JSON.stringify(err));
            }));
    }

    saveManagementPosition() {
        let body = {
            applicationDetailId: this.selectedDetailId,
            managementPosition: this.managementPosition,
        };
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.saveManagementPosition(body).subscribe((response) => {
                this.managementPosition = null;
                this.displayManagementPositionForm = false;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
                ////console.log('ERROR saving management position!', JSON.stringify(err));
            }));
    }

    getCustomerIds() {
        return this.proposedItems.map(item => item.customerId).filter((value, index, self) => self.indexOf(value) === index);
    }


    getSingleCustomerIds() {
        if (this.customerId > 0) { return this.customerId; }
        if (this.proposedItems.length > 0) return this.proposedItems[0].customerId;
        return 0;
    }

    // CUSTOMER rating
    ratings: any[] = [];
    riskRatingId: number = null;
    obligorLimitValidated: boolean = false;
    limitValidation: any = { outstandingBalance: 0, limit: 1, difference: 0, riskRatingId: 0 }
    obligorExposure: number = 0;
    availableLimit: number = 0;

    obligorLimitValid(amount = this.application.approvedAmount) {
        if (this.isAnalyst == false) return true;
        if (this.limitValidation.limit == 0) return true;
        let validity = false;
        validity = (amount + this.limitValidation.outstandingBalance) <= this.limitValidation.outstandingBalance;
        if (validity == false) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Obligor limit NOT validated!', 'error');
            return false;
        }
        return true;
    }

    getRatings() {
        //this.loadingService.show();
        this.subscriptions.add(
            this.camService.getRatings().subscribe((response) => {
                this.ratings = response.result;
                ////console.log(this.ratings);
                //this.loadingService.hide();
            }, (err) => {
                //this.loadingService.hide(1000);
            }));
    }

    saveCustomerRating() {
        const body = {
            scenerio: 2,
            customerId: 2222,
            applicationId: this.application.loanReviewApplicationId,
            riskRatingId: this.riskRatingId
        }
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.saveCustomerRating(body).subscribe((response) => {
                this.getCustomerLimitValidation();
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    getCustomerLimitValidation() {
        const body = {
            scenerio: 2,
            customerId: 2222,
            applicationId: this.application.loanReviewApplicationId,
            riskRatingId: this.riskRatingId
        }
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getCustomerLimitValidation(body).subscribe((response) => {
                this.limitValidation = response.result;
                this.availableLimit = this.limitValidation.limit - this.obligorExposure;
                ////console.log('rat',response);
                this.loadingService.hide();
                this.riskRatingId = this.limitValidation.riskRatingId;
                this.obligorLimitValidated = this.limitValidation.limit == 0
                    ? true : (this.application.approvedAmount + this.limitValidation.outstandingBalance) <= this.limitValidation.outstandingBalance;
                // this.obligorLimitValid();
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    // ------------ page 4 -------------

    displayPageFour: boolean = false;
    firstTransaction: any[] = [];
    secondTransaction: any[] = [];
    applicationCustomerId: number = 0;

    // onCustomerChange(event) {
    //     if (event != undefined) this.getCustomerTransaction(event);
    // }
    onCustomerChange() {
        if (this.applicationCustomerId > 0) { this.getCustomerTransaction(this.applicationCustomerId); }
        else { swal(`${GlobalConfig.APPLICATION_NAME}`, 'Kindly Select a Customer From Drop-Down', 'error'); }
    }

    getCustomerTurnover() {
        this.camService.getCustomerTurnoverLms(this.loanApplicationId).subscribe((response) => { // make refreshable
            this.loadingService.show();
            if (response.success == true) {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Loaded Customer Turnover', 'success');
            }
            else if (response.errorCode == "99") {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        });
    }

    selectedCustomerId: any;

    getCustomerTransaction(customerId) {

        this.selectedCustomerId = customerId;
        this.subscriptions.add(
            // this.camService.getCustomerTransactionAccounts(customerId, this.application.loanReviewApplicationId).subscribe((response) => { // make refreshable
            //     if (response.success == true) {
            //         let result = response.result;
            //         this.accounts = result;
            //         this.displayPageFour = true;
            //         //this.getLoanCustomerAccounts(customerId);
            //     }
            //     else {
            //          this.displayPageFour = false;
            //          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Doesnt Have any PageFour Record', 'error');
            //     } 

            // }));

            this.camService.getCustomerTransaction(customerId, this.loanApplicationId).subscribe((response) => { // make refreshable
                if (response.success == true) {
                    let result = response.result;
                    this.firstTransaction = result.firstTransaction;
                    this.secondTransaction = result.secondTransaction;
                    this.displayPageFour = true;

                }
                else {
                    this.displayPageFour = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Doesnt Have any PageFour Record', 'error');
                }
            }));
        // this.camService.getCustomerTransactionLms(customerId, this.application.loanReviewApplicationId).subscribe((response) => { // make refreshable
        //     if (response.success == true) {
        //         let result = response.result;
        //         this.firstTransaction = result.firstTransaction;
        //         this.secondTransaction = result.secondTransaction;
        //         this.displayPageFour = true;
        //     }
        //     else {
        //         this.displayPageFour = false;
        //     }
        // });
    }

    filter() {

        this.subscriptions.add(
            this.camService.getCustomerTransactionLmsfiltered(this.selectedCustomerId, this.application.loanReviewApplicationId, this.account, this.fromYear, this.fromMonth, this.toYear, this.toMonth).subscribe((response) => { // make refreshable
                if (response.success == true) {
                    let result = response.result;
                    this.firstTransaction = result.firstTransaction;
                    this.secondTransaction = result.secondTransaction;
                    //this.getLoanCustomerAccounts(customerId);
                    // this.displayPageFour = true;
                }
                else {
                    // this.displayPageFour = false;
                }
            }));
    }
    // ------------ message ------------

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message = 'ok') {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {

        this.show = false;
    }

    onFacilityChange(id) {
        const x = this.application.applicationDetails.find(x => x.loanApplicationDetailId == id);
        if (x == null) { return; }
        this.loanApplicationDetailId = x.loanApplicationDetailId;
        this.loanSystemTypeId = x.loanSystemTypeId;
        this.reloadLoanDetails = x.loanId;
        this.customerId = x.customerId;
        this.customerProposedAmount = x.customerProposedAmount;
        // this.loanReferenceNumber = x.reviewDetails;
        this.getLoanApplicationDetail(x.loanId, x.loanSystemTypeId);//loanSystemTypeId
    }

    getLoanApplicationDetail(loanId: number, loanTypeId: number) {
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getLoanApplicationDetail(loanId, loanTypeId).subscribe((response) => {
                this.detail = response.result;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    resetGrid(yes) {
        if (yes) this.reset();
    }

    setTrailCount(count) { this.trailCount = count; }

    refresh() {
        this.loanSystemTypeId = 0;
    }

    isNotBusiness() { return this.isBusiness == false; }

    getMaximumApplicationOutstandingBalance(applicationId) {
        this.subscriptions.add(
            this.camService.getMaximumApplicationOutstandingBalance(applicationId).subscribe((response) => {
                this.maximumAmount = response.result;
                if (this.isAnalyst) this.forwardCamStatus();
            }));
    }

    refreshCollateral() {
        this.getProposedCollateral(this.loanApplicationId);
    }

    getProposedCollateral(loanApplicationId): void {
        this.collateralService.getProposedCustomerCollateral(loanApplicationId, this.currencyId).subscribe((response) => {
            this.proposedCollateral = response.result;
        });
    }

    loadWithCustomerId: number;
    showCustomerInformation() {
        this.loadWithCustomerId = this.getSingleCustomerIds();
    }
    getCollateralCoverageStatus(): string {
        if (this.proposedCollateral == null || this.proposedCollateral == undefined || this.proposedCollateral.length == 0) {
            return '';
        }
        var totalPercentageCoverage = this.proposedCollateral[0].totalCoverage;
        var expectedCoveragePercentage = this.proposedCollateral[0].expectedCoveragePercentage;
        // this.proposedCollateral.forEach((p) => {
        //     totalPercentageCoverage + p.actualCoveragePercentage;
        // });
        if (totalPercentageCoverage < expectedCoveragePercentage) {
            return '<span class="label label-danger">FACILITY NOT FULLY COVERED</span>';
        } else if (totalPercentageCoverage >= expectedCoveragePercentage) {
            return '<span class="label label-success">FACILITY FULLY COVERED</span>';
        }
    }

    setrequiredUploadValue(value: boolean) {
        this.allRequiredDocumentsAreUploaded = value;
        // console.log( this.allRequiredDocumentsAreUploaded);
    }

    selectApprover() {
        this.selectedApprover = '';
        this.getNextLevel();
        this.displayApproverSearchForm = true;
        //if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    pickSearchedApprover(data) {
        // this.allStaff.push({ staffId: data.staffId, staffName: data.fullName });
        // let control = this.rerouteForm.get('staffId');
        // control.setValue(data.staffId);
        // control.updateValueAndValidity();
        if (data.secondName == undefined)
            this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.lastName;
        else
            this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.secondName + ' ' + data.lastName;

        this.receiverStaffId = data.staffId;
        this.displayApproverSearchForm = false;
    }

    searchApprover(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    ngAfterViewInit(): void {
        fromEvent(this.approvalInPut.nativeElement, 'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
                this.realSearchSrv.searchApproversEntries(this.approvalInPut.nativeElement.value,this.nextLevelId)
                    .subscribe(results => {
                        if (results != null) {
                            this.availableApprovers = results.result;
                        }
                        //console.log("availableApprovers :", this.availableApprovers);
                    });
            })
    }


    getNextLevel() {
        if (this.nextLevelId == 0) {
            this.forwardCamStatus();
        }
    }

    // -------------------------- test status -------------------------

    forwardCamStatus() {
        let body = {
            forwardAction: 2,
            applicationId: this.application.loanReviewApplicationId,
            totalExposureAmount: this.maximumAmount,
            applicationTenor: this.application.tenor,
            operationId: this.OPERATION_ID,
            comment: '',
            isBusiness: this.isBusiness,
        };
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.forwardCamStatusLms(body).subscribe((response) => {
                this.loadingService.hide();
                if (response.success == true) {
                    this.nextLevelId = response.result.nextLevelId;
                    if (response.result.statusId != 2) this.approveActionLabel = 'Submit';
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            }));
    }

    

}

/*{
  "loanReviewApplicationId": 1094,
  "loanId": 6392,
  "productTypeId": 0,
  "operationTypeId": 34,
  "reviewDetails": null,
  "applicationDetails": null,
  "interateRate": 0,
  "prepayment": null,
  "principalFrequencyTypeId": 0,
  "interestFrequencyTypeId": 0,
  "principalFirstPaymentDate": null,
  "interestFirstPaymentDate": null,
  "maturityDate": null,
  "tenor": 0,
  "casaAccountId": 0,
  "overDraftTopup": null,
  "feeCharges": null,
  "approvalStatusId": 0,
  "isManagementInterestRate": false,
  "approvalTrailId": 22701,
  "newApplicationDate": null,
  "currentApprovalLevelId": 30,
  "toStaffId": null,
  "branchId": 460,
  "applicationDate": "2018-04-26T00:00:00+01:00",
  "referenceNumber": "2345-0027-000002",
  "effectiveDate": "0001-01-01T00:00:00+01:00",
  "principalAmount": 0,
  "interestRate": 0,
  "customerName": "PELMA INTERNATIONAL PLC    ",
  "operationType": "Loan Termination",
  "currentApprovalLevel": "Relationship Manager (RM)",
  "lastComment": "New loan review application",
  "currentApprovalStateId": 0,
  "currentStage": "Loan Review Approval Appraisal",
  "currentApprovalState": null,
  "approvalStatus": "Pending",
  "customerId": 60,
  "branchName": "OBA AKRAN RD IKEJA BRANCH",
  "approvalState": "Processing",
  "companyId": 0,
  "companyName": null,
  "createdBy": 1558,
  "lastUpdatedBy": 0,
  "dateTimeCreated": "0001-01-01T00:00:00+01:00",
  "dateTimeUpdated": null,
  "deleted": false,
  "deletedBy": null,
  "dateTimeDeleted": null,
  "canModified": false,
  "userBranchId": 0,
  "userIPAddress": null,
  "applicationUrl": null,
  "staffId": 0
}*/