import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng'; 
import { LoadingService } from '../../shared/services/loading.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import {  ApprovalStatusEnum, LMSOperationEnum } from '../../shared/constant/app.constant';
import {  GlobalConfig } from '../../shared/constant/app.constant';
import { ProductService } from '../../setup/services/product.service';
import { LoanService } from '../services/loan.service';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { AuthenticationService } from 'app/admin/services';
import swal from 'sweetalert2';
import { LoanOperationService } from '../services';
import { LoanReviewOperationsComponent } from '../loan-management/loan-operations/loan-review-operation.component';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'operation-route.component.html'
})

export class OperationRouteComponent implements OnInit, OnDestroy {
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    searchString: string = '';
    searching: boolean = false;
    products: any[] = [];
    itemTotal: number = 0; 
    showLoadIcon: boolean = false; 
    applicationSelection: any; 
    disableApplicationInformationTab = true;
    operationType: number = 1;
    userInfo: any;
    referredId: ApprovalStatusEnum;
    approvedLoanReviewData: any;
    workflowTargets: WorkflowTarget[] = [];
    routableMode: boolean = false;
    multipLoanData:any;
    routeButtonText: string = 'Display Route';
    @ViewChild(LoanReviewOperationsComponent, {static: false}) operationObj: LoanReviewOperationsComponent;
    @Input() operationId: number ;
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
        private loanOperationService: LoanOperationService,
    ) { }

    ngOnInit() {
        this.getApprovedLoanReview();
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
    
    // getApprovedLoanReview() {
    //     this.loanOperationService.getApprovedLoanReview().subscribe(results => {
    //       this.loadingService.hide();
    //       this.approvedLoanReviewData = results.result;
    //     });
    //   }
    getApprovedLoanReview() {
        this.subscriptions.add(
        this.loanOperationService.getApprovedLoanReviewRouteAndOperation().subscribe(results => {
          this.loadingService.hide();
          if(results.success){
            this.approvedLoanReviewData = results.result;
          this.approvedLoanReviewData.splice;
          }
        }));
      }
      
    currentLazyLoadEvent: LazyLoadEvent;
    onSelectedLoanReviewChange(data) {
        this.disableApplicationInformationTab = false;
        this.operationObj.onSelectedLoanReviewChange(data);
        this.operationId = LMSOperationEnum.LmsOperations;
        this.reviewSelection = data;
        this.activeTabindex = 1;
    }

    updateWorkflowTargetLms() { console.log('updateWorkflowTargetLms',116)
    this.workflowTarget.targetId = this.reviewSelection.loanReviewApplicationId;
    this.workflowTarget.operationId = LMSOperationEnum.LmsOperations;
    //this.workflowTarget.productClassId = null;
    //this.workflowTarget.productId = null;
}

    updateWorkflowTarget() { console.log('updateWorkflowTarget',LMSOperationEnum.LmsOperations);
        this.workflowTarget.targetId = this.applicationSelection.lmsApplicationDetailId;
        this.workflowTarget.operationId = LMSOperationEnum.LmsOperations;
    }

    pushSelectedLoans(row){
        this.workflowTarget = new WorkflowTarget;
        var record = this.applicationSelection = row.data;
        this.workflowTarget.targetId = record.lmsApplicationDetailId;
        this.workflowTarget.operationId = LMSOperationEnum.LmsOperations;
        this.workflowTargets.push(this.workflowTarget);
    }

    popSelectedLoans(row) {
        var record = row.data;
        var index = this.workflowTargets.findIndex(x=>x.targetId == record.loanBookingRequestId)
        this.workflowTargets.splice(index,1);
        if(this.workflowTargets.length <= 0){
            this.routableMode =false;
        }
    }

    setRouteMode(){
        if(this.routableMode){
            this.routableMode = false;
            this.routeButtonText ='Display Route';
        } else{
            this.routableMode = true
            this.routeButtonText ='Hide Route';
        }
    }

    approveActionLabel: string = 'Approve';
    authorizeActionLabel: string = 'Authorize';
    allStaff: any[] = [];
 
    refreshTabs() {
        this.disableApplicationInformationTab = false;
    }

    customerIds: number[] = [];
    changeLog: any[] = [];
    proposedItems: any[] = [];
    selectedLineId: number;
    displayChangeLog: boolean = false;
    showSpinnerChangeLog: boolean = false;
    
    getLoanDetail(): void {
        this.proposedItems =null;
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanDetail(this.applicationSelection.loanApplicationId).subscribe((response: any) => {
            this.proposedItems = response.result.facilities;
            const ids: number[] = this.proposedItems.map(x => x.customerId);
            this.customerIds = Array.from(new Set(ids)); // unique of ids
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }
    
    getLoanDetailChangeLog(): void { 
        this.showSpinnerChangeLog = true;
        // this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanDetailChangeLog(this.applicationSelection.loanApplicationId).subscribe((response: any) => {
            this.changeLog = response.result;
            // this.loadingService.hide();
            this.displayChangeLog = true;
            this.showSpinnerChangeLog = false;
        }, (err) => {
            // this.loadingService.hide(1000);
            this.showSpinnerChangeLog = false;
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
        this.disableApplicationInformationTab = true;
        //this.getApprovedLoanReview();
        //this.getLoanApplications(0, 10); // refresh list
        //this.getLoanReviewApplications(0, 10);
        this.reloadRouting = true;
        swal(`${GlobalConfig.APPLICATION_NAME}`, `Routing Successful`, 'success');
        this.getApprovedLoanReview();
    }

    onTabChange(e) {
        this.activeTabindex = e.index;
    }

    // trail: any[] = [];
    // trailCount: number = 0;

    // getTrail(operationId: number = this.OPERATION_ID) {
    //     this.loadingService.show();
    //     this.camService.getTrail(this.applicationSelection.loanApplicationId,operationId).subscribe((response: any) => {
    //         this.trail = response.result;
    //         this.trailCount = this.trail.length;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // CUSTOMER INFORMATION TAB
    loadAllLoanApplicationDetails(appl) {
        this.getCustomerExistingLoans(appl.customerId);
    }

    existingLoans: any[] = [];
    outstandingAmt: number;
    totalApproved: number;
    existingExposure: string;
    existingApproved: string;

    getCustomerExistingLoans(customerId) { 
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
        }));
    }

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

    // displayPresetForm: boolean = false;
    // presetCollection: any = {
    //     approvalLevels: [],
    //     applicationStatus: [],
    // };

    // getPresetCollection() {
    //     if (this.presetCollection.applicationStatus.length > 0) return;
    //     this.loadingService.show();
    //     this.camService.getPresetCollection(this.OPERATION_ID, this.applicationSelection.productClassId).subscribe((response: any) => {
    //         this.presetCollection = response.result;
    //         this.loadingService.hide();
    //     }, (err: any) => {
    //         this.finishBad(JSON.stringify(err));
    //         this.loadingService.hide();
    //     });
    // }

    // presetRoute(form) {
    //     if (form.value.finalApprovalLevelId.length == 0
    //         && form.value.nextApplicationStatusId.length == 0
    //         ) {
    //             this.errorMessage = 'All fields cannot be empty!';
    //         }
    //     let body = {
    //         applicationId: this.applicationSelection.loanApplicationId,
    //         finalApprovalLevelId: form.value.finalApprovalLevelId,
    //         nextApplicationStatusId: form.value.nextApplicationStatusId,
    //     };
    //     this.loadingService.show();
    //     this.camService.savePresetRoute(body).subscribe((res) => {
    //         if (res.success == true) {
    //             this.displayPresetForm = false;
    //             this.loadingService.hide();
    //         } else {
    //             this.finishBad(res.message);
    //             this.errorMessage = res.message;
    //         }
    //     }, (err: any) => {
    //         this.finishBad(JSON.stringify(err));
    //     });
    // }


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
        }));
    }

    reviewDetailSelection: any[];
    onApplicationSelected(selected) {        
        this.proposedItems = null;
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

                this.proposedItems = this.reviewDetailSelection;
            }
    onSelectedReviewApplicationChange(selected): void {
        this.proposedItems =null;
        this.reviewSelection = selected;
        let mappedDetails = this.reviewSelection.applicationDetails.map(x => { return {
            loanApplicationDetailId: x.detailId,
            approvedProductName: x.loanSystemTypeName, 
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
        this.operationType = 2;
        this.activeTabindex = 1;
        this.updateWorkflowTargetLms();
        this.refreshTabs();
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

