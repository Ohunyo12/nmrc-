import { CustomerInformationDetailComponent } from '../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng'; // lazyloading
import { LoadingService } from '../../shared/services/loading.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { ApprovalStatus, ApprovalStatusEnum } from '../../shared/constant/app.constant';
import {  GlobalConfig } from '../../shared/constant/app.constant';
import { ProductService } from '../../setup/services/product.service';
import { LoanService } from '../services/loan.service';

import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { AuthenticationService } from 'app/admin/services';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: 'availment-route.component.html'
})

export class AvailmentRouteComponent implements OnInit, OnDestroy {

    workflowTarget: WorkflowTarget = new WorkflowTarget();

    loanApplicationId: number = null;
    readonly OPERATION_ID: number = 38;
    @Input() operationId: number ;
    
    selectedId: number = null;
    feedback: string = null;
    commentLabel: string = 'Recommendation';
    errorMessage: string = '';
    searchString: string = '';
    searching: boolean = false;
    applications: any[];
    products: any[] = [];
    departments: any[] = [];
    conditions: any[] = [];
    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    applicationSelection: any; // selection
    lineSelection: any;
    workingLoanApplication: string = null;
    disableApplicationInformationTab = true;
    isAnalyst:boolean=false;
    
    searchResults: Object;
    // searchTerm$ = new Subject<any>();
    displaySearchModal: boolean = false;
    selectedSearchedId: number = null;
    operationType: number = 1;

    formState: string = 'New';
    info: any[] = [];
    @ViewChild(CustomerInformationDetailComponent , {static: false}) customerInfo: CustomerInformationDetailComponent;
    customerId: any;
    userInfo: any;
    referredId: ApprovalStatusEnum;
    private subscriptions = new Subscription();
    ngOnDestroy(): void {
          this.subscriptions.unsubscribe();
      }
    constructor(
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private productService: ProductService,
        private loanService: LoanService,
        private authService: AuthenticationService,

    ) { }

    ngOnInit() {
        this.getApprovedLoanApplicationsDueForAvailment();
        this.userInfo = this.authService.getUserInfo();
        this.referredId = ApprovalStatusEnum.Referred;

        this.loadDropdowns();
    }

    loadDropdowns() {
        this.subscriptions.add(
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        }));
    }
    camApprovedLoans: any[] = [];
    // lazyloading table
    getApprovedLoanApplicationsDueForAvailment() {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getApplicationsDueForAvailmentRoute().subscribe((response: any) => {
            this.camApprovedLoans = response.result;
            if(response.success){
                this.camApprovedLoans.splice;
            }
            this.loadingService.hide();
        }, (err) => {
            ////console.log('error', err);
            this.loadingService.hide();
        }));
    }
    reloadGrid: number = 0;
    

    currentLazyLoadEvent: LazyLoadEvent;

    loadData(event: LazyLoadEvent) {
        this.getLoanApplications(event.first, event.rows);
        this.getLoanReviewApplications(event.first, event.rows);
        this.currentLazyLoadEvent = event;
    }

    getLoanApplications(page: number, itemsPerPage: number, search: boolean = false) {
        if (search == false) { this.searchString = ''; this.searching = false; } else { this.searching = true; }
        this.loadingService.show();
        this.showLoadIcon = true;
        this.subscriptions.add(
        this.camService.getLoanApplicationJobsByRegion(page, itemsPerPage, this.searchString).subscribe((response: any) => {
            this.itemTotal = response.count;
            this.applications = response.result;
            this.showLoadIcon = false;
            this.loadingService.hide();
            ////console.log('applications..', response);
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log("error", err);
        }));
    }

    onSelectedApplicationChange(): void {
        this.operationType = 1;
        const applicationId = this.applicationSelection.loanApplicationId;
        this.loanApplicationId = applicationId;
        //this.customerInfo.loadLoanCustomerList(applicationId);
        this.workingLoanApplication = this.applicationSelection.applicationReferenceNumber;// + ' ' + appl.applicantName;
        // this.getUserPrivileges(this.applicationSelection.currentApprovalLevelId); // call this inside getObligorInformation
        // this.getNextLevelStaff();
        this.customerId = this.applicationSelection.customerId;
        this.refreshTabs();
        this.getLoanDetail();
        this.loadAllLoanApplicationDetails(this.applicationSelection); // foreign!
        this.activeTabindex = 1;
        
        this.updateWorkflowTarget();
    }

    updateWorkflowTarget() { 
        if(this.operationId > 0  ){  this.operationId = this.OPERATION_ID}
        this.workflowTarget.targetId = this.applicationSelection.loanApplicationId;
        this.workflowTarget.operationId = 38;
        this.workflowTarget.toStaffId = this.applicationSelection.toStaffId; // optional
        this.workflowTarget.responsiblePerson = this.applicationSelection.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.currentApprovalLevel = this.applicationSelection.currentApprovalLevel; // required if toStaffId is given
        this.workflowTarget.finalApprovalLevelId = this.applicationSelection.finalApprovalLevelId;
        this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }

    // resolve privileges

    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: 0,
        // investmentGradeApprovalLimit: 10000, // todo later
        // maximumTenor: 223, // todo later
        groupRoleId: 1, // bu,ca,md,comm,bd
    };

    canForward() {
        if (this.applicationSelection.currentApprovalLevelId > 0
            && (this.applicationSelection.currentApprovalLevelId == this.privilege.approvalLevelId)) {
                return true;
        }
        if (this.privilege.currentApprovalLevelId < 1
            || this.privilege.currentApprovalLevelId == this.applicationSelection.currentApprovalLevel) { 
                return true; 
        }
        return false;
    }

    canEditDocument() {
        if (this.applicationSelection.currentApprovalLevelId > 0 
            && (this.privilege.canEditDocument == false
            || this.privilege.owner == false)
        ) {
            return false;
        }
        return true;
    }

    getLowestUserLevelId() {
        if (this.privilege.userApprovalLevelIds.length > 0) {
            return this.privilege.userApprovalLevelIds[0];
        }
        return 0;
    }

    withinApprovalLimits() {
        if (this.privilege.approvalLimit >= this.applicationSelection.applicationAmount) { // <------------------- tenor and investment grade not factored in !!!!!
            return true;
        }
        return false;
    }

    approveActionLabel: string = 'Approve';
    authorizeActionLabel: string = 'Authorize';

    getApproveButtonLabel() {
        if (this.withinApprovalLimits() == true) {
            return this.approveActionLabel;
        }
        return this.authorizeActionLabel;
    }

// getUserPrivileges(levelId: number = null) {
//     let body = {
//         levelId: levelId, 
//         operationId: this.OPERATION_ID,
//         targetId: this.applicationSelection.loanApplicationId,
//         productClassId: this.applicationSelection.productClassId,
//         productId: null
//     }
//     this.camService.getPrivilege(body).subscribe((response: any) => {
//         if (response.result == undefined) return;
//         this.privilege = response.result;
//         this.privilege.currentApprovalLevelId = this.applicationSelection.currentApprovalLevelId;
//         this.privilege.currentApprovalLevel = this.applicationSelection.currentApprovalLevel;
//         this.refreshTabs();
//     });
// }
    
    // getNextLevelStaff() {
    //     this.camService.getNextLevelStaff(this.applicationSelection.loanApplicationId, this.loanApplication.operationId).subscribe((response: any) => {
    //         this.privilege = response.result;
    //     });
    // }

    allStaff: any[] = [];
    //     { staffId: '1558', staffName: 'pelumi' },
    //     { staffId: '1538', staffName: 'monique martin' }
    // ];
    // --------------- REALTIME SEARCH ----------------------

    

    // searchDB(searchString) {
    //     searchString.preventDefault;
    //     this.searchTerm$.next(searchString);
    // }

    // cam document

    refreshTabs() {
        this.disableApplicationInformationTab = false;
    }

    // append document

    // line recommended and proposed items

    customerIds: number[] = [];
    changeLog: any[] = [];
    proposedItems: any[] = [];
    recommendedItems: any[] = [];
    touchedLineItems: number[] = [];
    selectedLineId: number;
    displayChangeLog: boolean = false;
    showSpinnerChangeLog: boolean = false;
    
    getLoanDetail(): void {
        this.proposedItems =null;
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanDetail(this.applicationSelection.loanApplicationId).subscribe((response: any) => {
            this.proposedItems = response.result.facilities;
            // this.proposedItems = [...response.result]; // place settings 1 08118499104
            ////console.log('same ===== ',(this.proposedItems == this.proposedItems));
            const ids: number[] = this.proposedItems.map(x => x.customerId);
            this.customerIds = Array.from(new Set(ids)); // unique of ids
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }
    
    getLoanDetailChangeLog(): void { // PLEASE LAZY LOAD THIS!!!
        this.showSpinnerChangeLog = true;
        // this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanDetailChangeLog(this.applicationSelection.loanApplicationId).subscribe((response: any) => {
            this.changeLog = response.result;
            // this.loadingService.hide();
            this.displayChangeLog = true;
            this.showSpinnerChangeLog = false;
            ////console.log('change logs ===== ', response.result);
        }, (err) => {
            // this.loadingService.hide(1000);
            this.showSpinnerChangeLog = false;
            ////console.log('change logs error ', err);
        }));
    }

    getProductName(id) {
        return this.products.find(x => x.productId == id).productName;
    }

    setProductApprovalStatus(value) {
        let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
        o.statusId = value;
    }

    getProductApprovalStatus() {
        let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
        return o.statusId;
    }

    activeTabindex: number = 0;

    resetGrid(yes) {
        if (yes) this.reset();
    }
    reloadRouting: any;
    reset() {
        this.activeTabindex = 0;
        this.applicationSelection = null;
        this.workingLoanApplication = null;
        this.disableApplicationInformationTab = true;
        this.getLoanApplications(0, 10); // refresh list
        this.getLoanReviewApplications(0, 10);
        this.getApprovedLoanApplicationsDueForAvailment();
        this.reloadGrid++;
        this.reloadRouting = true;
        swal(`${GlobalConfig.APPLICATION_NAME}`, `Routing Successful`, 'success');
        
    }

    onTabChange(e) {
        this.activeTabindex = e.index;
    }

    // trail & comment

    trail: any[] = [];
    trailCount: number = 0;

    getTrail(operationId: number = this.OPERATION_ID) {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getTrail(this.applicationSelection.loanApplicationId,operationId).subscribe((response: any) => {
            this.trail = response.result;
            this.trailCount = this.trail.length;
            ////console.log('trail..', response.result);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }

    // CUSTOMER INFORMATION TAB

    loadAllLoanApplicationDetails(appl) {
        this.getCustomerExistingLoans(appl.customerId);
        //this.getcustomerLimitAndRating(appl.customerId);
    }

    existingLoans: any[] = [];
    outstandingAmt: number;
    totalApproved: number;
    existingExposure: string;
    existingApproved: string;

    getCustomerExistingLoans(customerId) { // credit\loans\start-loan-application\start-loan-application.component
        this.subscriptions.add(
        this.loanService.getCustomerLoans(customerId).subscribe((response: any) => {
            this.existingLoans = [];
            this.outstandingAmt = 0;
            this.totalApproved = 0;
            this.existingLoans = response.result;

            if (this.existingLoans.length > 0) {
                this.existingLoans.forEach(el => {
                    this.outstandingAmt += el.outstandingPrincipal;
                    this.totalApproved += el.approvedAmount;
                });
                this.existingExposure = this.outstandingAmt.toLocaleString('en-US', { minimumFractionDigits: 2 });
                this.existingApproved = this.totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
            // this.loanApplForm.controls['existingExposure'].setValue(`${this.existingExposure}`);
        }));
    }

    // Limit / Exposure
    /*
    customerRating: string;
    investmentGrade: boolean;

    isCleanLending = true; lgroupLimit: any; lrMLimit: any; lnPLLimit: any; lcustomerLimit: any;
    lsegmentLimit: any; lsectorLimit: any; lbranchLimit: any; ogroupLimit: any; orMLimit: any;
    onPLLimit: any; ocustomerLimit: any; osegmentLimit: any; osectorLimit: any; obranchLimit: any;

    getcustomerLimitAndRating(customerId) { // credit\loans\application\newloanapplication.component.h
        this.customerService.getCustomerRatingAndLimit(customerId).subscribe((res) => {
            this.lcustomerLimit = res.result.limit;
            this.customerRating = res.result.rating;
            this.investmentGrade = res.result.isInvestment;
        }, (err) => {
            ////console.log(err);
        });
    }
    */
    // ENDOF AUTLOAD ANALYST TEMPLATE

    /**

    CanDoRiskAssessment
    HasChecklist
    CanPerformFinancialAnalysis

    -- financial analysis ?
    -- checklist
    -- risk assessments & rating
    -- collateral evaluation
    -- convenant
     */

    // dropdown list

    maritalStatus = [
        { id: 1, name: 'Single' },
        { id: 2, name: 'Married' },
        { id: 3, name: 'Divorced' },
        { id: 4, name: 'Widowed' },
    ];

    getMaritalStatus(id) {
        let item = this.maritalStatus.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    // message

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
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

    // --------------------- forward -----------------------

    displayPresetForm: boolean = false;
    presetCollection: any = {
        approvalLevels: [],
        applicationStatus: [],
    };

    getPresetCollection() {
        if (this.presetCollection.applicationStatus.length > 0) return;
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getPresetCollection(this.OPERATION_ID, this.applicationSelection.productClassId).subscribe((response: any) => {
            ////console.log(response);
            this.presetCollection = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide();
        }));
    }

    presetRoute(form) {
        if (form.value.finalApprovalLevelId.length == 0
            && form.value.nextApplicationStatusId.length == 0
            ) {
                this.errorMessage = 'All fields cannot be empty!';
            }
        let body = {
            applicationId: this.applicationSelection.loanApplicationId,
            finalApprovalLevelId: form.value.finalApprovalLevelId,
            nextApplicationStatusId: form.value.nextApplicationStatusId,
        };
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.savePresetRoute(body).subscribe((res) => {
            if (res.success == true) {
                this.displayPresetForm = false;
                this.loadingService.hide();
            } else {
                this.finishBad(res.message);
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        }));
    }


    // ----------------------------------LMS--------------------------------

    reviewSelection: any; // selection
    reviewApplications: any[] = [];
    reloadLoanDetails: number = 0;
    loanSystemTypeId: number = 0;
    detail: any = {};
    
    getLoanReviewApplications(page: number, itemsPerPage: number, search: boolean = false) {
        if (search == false) { this.searchString = ''; this.searching = false; } else { this.searching = true; }
        this.loadingService.show();
        this.showLoadIcon = true;
        this.subscriptions.add(
        this.camService.getLoanReviewApplicationJobsByRegion(page, itemsPerPage, this.searchString).subscribe((response: any) => {
            this.itemTotal = response.count;
            this.reviewApplications = response.result;
            this.showLoadIcon = false;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log("error", err);
        }));
    }

    reviewDetailSelection: any[];
    onApplicationSelected(selected) {        
        this.proposedItems = null;
                //this.refresh();
                this.reviewDetailSelection = selected;
                let mappedDetails = this.reviewDetailSelection.map(x => { return {
                    loanApplicationDetailId: x.detailId,
                    approvedProductName: x.loanSystemTypeName, // looan id needed!
                    obligorName: x.obligorName + ' - ' + x.operationName,
                    loanId: x.loanId,
                    customerId: x.customerId,
                    proposedTenor: x.proposedTenor,
                    proposedRate: x.proposedRate,
                    proposedAmount: x.proposedAmount,
                    approvedTenor: x.approvedTenor,
                    approvedRate: x.approvedRate,
                    approvedAmount: x.approvedAmount,
                    proposedTenorString: x.proposedTenorString,
                    loanSystemTypeId: x.loanSystemTypeId,
                }});
               // console.log("mappedDetails",mappedDetails);
               // console.log("this.reviewDetailSelection",this.reviewDetailSelection);
                
                //this.reviewSelection.applicationDetails = mappedDetails;
        
                this.proposedItems = this.reviewDetailSelection;
                // this.operationType = 2;
                // this.activeTabindex = 1;
                // this.updateWorkflowTargetLms();
                // this.refreshTabs();




               // this.reloadLoanDetails = selected.loanId;
                //this.disableApplicationInformationTab = false;
               // this.proposedItems = selected.applicationDetails;
                //this.disableSupportingDocumentsTab = false;
                //this.activeTabindex = 1;
                //this.currentApprovalLevelId = selected.currentApprovalLevelId;
                //this.applicationReferenceNumber = selected.referenceNumber;
                //this.form3800b(this.applicationReferenceNumber);
                //this.loanReviewApplicationId = this.application.loanReviewApplicationId;
                //this.updateWorkflowTarget();
        
                //this.showOfferLetterChecklist(this.application.loanReviewApplicationId)
                //this.reload++;
            }
    onSelectedReviewApplicationChange(selected): void {
        this.proposedItems =null;
        this.reviewSelection = selected;

        ////console.log(this.reviewSelection.applicationDetails);
        let mappedDetails = this.reviewSelection.applicationDetails.map(x => { return {
            loanApplicationDetailId: x.detailId,
            approvedProductName: x.loanSystemTypeName, // looan id needed!
            obligorName: x.obligorName + ' - ' + x.operationName,
            loanId: x.loanId,
            customerId: x.customerId,
            proposedTenor: x.proposedTenor,
            proposedRate: x.proposedRate,
            proposedAmount: x.proposedAmount,
            approvedTenor: x.approvedTenor,
            approvedRate: x.approvedRate,
            approvedAmount: x.approvedAmount,
            proposedTenorString: x.proposedTenorString,
            loanSystemTypeId: x.loanSystemTypeId,
        }});
        this.reviewSelection.applicationDetails = mappedDetails;

        // this.proposedItems = this.reviewSelection.applicationDetails;
         this.operationType = 2;
         this.activeTabindex = 1;
        this.updateWorkflowTargetLms();
        this.refreshTabs();
    }

    updateWorkflowTargetLms() {
        this.workflowTarget.targetId = this.reviewSelection.loanReviewApplicationId;
        this.workflowTarget.operationId = 48;//this.reviewSelection.operationId;
        this.workflowTarget.productClassId = null;
        this.workflowTarget.productId = null;
        //this.workflowTarget.toStaffId = this.reviewSelection.toStaffId; // optional
        this.workflowTarget.responsiblePerson = this.reviewSelection.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.currentApprovalLevel = this.reviewSelection.currentApprovalLevel; // required if toStaffId is given
        this.workflowTarget.finalApprovalLevelId = this.reviewSelection.finalApprovalLevelId;
        this.workflowTarget.nextApplicationStatusId = 5; // offer letter

    }


    onFacilityChange(id) {
        const x = this.reviewDetailSelection.find(x => x.loanApplicationDetailId == id);
        if (x == null) { return; }
        this.loanSystemTypeId = x.loanSystemTypeId;
        this.reloadLoanDetails = x.loanId;
        this.getLoanApplicationDetail(x.loanId, x.loanSystemTypeId);
    }

    getLoanApplicationDetail(loanId, loanTypeId) {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanApplicationDetail(loanId, loanTypeId).subscribe((response: any) => {
            this.detail = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }
}





/*{
  "loanApplicationId": 5927,
  "applicationDate": "2018-03-23T00:00:00+01:00",
  "applicationReferenceNumber": "1523985833",
  "branchId": 2,
  "applicationAmount": 80000000,
  "interestRate": 0,
  "applicationTenor": 212,
  "submittedForAppraisal": true,
  "approvalStatusId": 1,
  "loanApplicationDetail": [],
  "customerId": 60,
  "operationId": 6,
  "approvalTrailId": 14060,
  "currentApprovalLevel": "Head of Unit",
  "requestStaffId": 1536,
  "toStaffId": null,
  "toApprovalLevelId": 78,
  "timeIn": "2018-04-17T18:40:59.663+01:00",
  "timeOut": "2018-04-17T18:44:09.513+01:00",
  "responsiblePerson": "",
  "companyId": 0,
  "companyName": null,
  "createdBy": 0,
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