import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApprovalGroupRole, ApprovalStatus, GlobalConfig, ApplicationStatus } from '../../../shared/constant/app.constant';
import { ProductService } from '../../../setup/services/product.service';
import { LoanService } from '../../services/loan.service';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentService } from '../../../setup/services/document.service';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';



import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
// import { log } from 'util';

@Component({
    // templateUrl: 'test.html'
    templateUrl: 'secretariat.component.html'
})

export class SecretariatComponent implements OnInit, OnDestroy {

    products: any[];
    applications: any[];
    displaySearchForm: boolean = false;
    searchForm: FormGroup;
    contractGroup: FormGroup;
    // workingLoanApplication: string = null;
    disableUploadTab: boolean = true;
    disableDecisionTab: boolean = true;

    isBoard: boolean = false;
    lastString: string = '';
    activeTabindex:number = 0;
    reload: number = 0;
    isLLLViolated = false;
    legalLendingLimitImpact = 0;

    privilege: any = {
        canApprove: true,
    };
    private subscriptions = new Subscription();
     ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    constructor(
        private loadingService: LoadingService,
        // private productService: ProductService,
        private loanService: LoanService,
        private documentService: DocumentService,
        private camService: CreditAppraisalService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.clearControls();
        // this.loadDropdowns();
    }
    
    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 0) { this.reset(); }
    }
    
    clearControls() {
        this.searchForm = this.fb.group({
            applicationTypeId: [null, Validators.required],
            searchString: ['', Validators.required], // 1213456258
        });
        this.commentForm = this.fb.group({
            // members: this.fb.array([]),
            vote: ['', Validators.required],
            comment: ['', Validators.required],
            
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
        this.commentFormLms = this.fb.group({
            vote: ['', Validators.required],
            comment: ['', Validators.required],
        });
    }

    // ---------------------------- search -------------------------------

    // showSearchForm() { this.displaySearchForm = true; }

    getApplications(id) {
        this.loadingService.show();
        this.subscriptions.add(
        this.loanService.getCommiteeCreditApplications(id).subscribe((response: any) => {
            ////console.log('response--=>', response);
            this.applications = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.loadingService.hide(1000);
        }));
    }

    uploadCount: number = 0;
    // displayApplicationDetail: boolean = false;
    application: any = {};

    view(row) {
        ////console.log('row -- ', row);
        this.application = row;
       // console.log('application',this.application);
        // this.displayApplicationDetail = true;
        this.applicationReferenceNumber = this.application.applicationReferenceNumber; // redundant!
        if (this.selectedApplicationTypeId == 1) this.getLoanDetail();
        this.reload++;
        this.getLLLDetails();
        this.activeTabindex = 1;
        this.disableUploadTab = false;
        this.disableDecisionTab = false;
    }

    setUploadCount(count) {
        this.uploadCount = +count;
    }

    getLoanDetail(): void { // TODO
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanDetail(this.application.loanApplicationId).subscribe((response: any) => {
            this.proposedItems = response.result.facilities;
            this.loadingService.hide();
           ////console.log('proposedItems -> ', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }

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

    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            let processLabel = 'PROCESSING';
            // if (this.privilege.groupRoleId != ApprovalGroupRole.BU) { processLabel = 'CAM PROCESS'; }

            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">REJECTED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    // ------------------------------ secretariat form --------------------

    approvalLevelName: string;
    approvalGroupName: string;
    applicationReferenceNumber: string;
    decisionForm: FormGroup;
    // members: any[] = [];
    touchedItems: any[] = [];
    selectedLineId: number = null;
    commentLabel = 'Recommendation';
    useCommitteeOverallDecision: boolean = false;
    errorMessage: string = '';
    commentForm: FormGroup;
    commentFormLms: FormGroup;
    formarray: FormArray;

    createItem(member): FormGroup {
        return this.fb.group({
            staffId: [member.staffId],
            staffName: [member.staffName],
            vote: [''],
            comment: [member.comment, Validators.required],
        });
    }

    // save() {

    // }

    onVoteChange(vote) {
        ////console.log('vote -->', vote);
    }
    // onRowSelect(row) {
    //     if (this.useCommitteeOverallDecision) return;
    //     this.selectedLineId = row.staffId;
    //     this.decisionForm.controls['vote'].setValue(row.vote);
    //     this.decisionForm.controls['comment'].setValue(row.comment);
    // }

    // onLineItemChange(input, value) {
    //     this.commentLabel = (input == 2 && value > 2) ? 'Condition' : 'Recommendation';
    //     if (this.useCommitteeOverallDecision) {
    //         switch (input) {
    //             case 1: this.members.forEach(member => { member.comment = 'n/a'; }); break;
    //             case 2: this.members.forEach(member => { member.vote = value; ////console.log('>>',member.vote);
    //              }); break;
    //         }
    //         this.members.forEach(member => { this.touchedItems.push(member.staffId); });
    //         return;
    //     }

    //     let item = this.members.find(x => x.staffId == this.selectedLineId);
    //     switch (input) {
    //         case 1: item.comment = value; break;
    //         case 2: item.vote = value; break;
    //     }
    //     this.touchedItems.push(this.selectedLineId); // mark change made here *
    // }

    /*forwardCam() {
        let body = {
            applicationId: this.application.loanApplicationId,
            amount: this.application.approvedAmount,
            tenor: this.application.applicationTenor,
            investmentGrade: this.application.isInvestmentGrade,
            politicallyExposed: this.application.isPoliticallyExposed,
            votes: this.commentForm.value.members, // line item changes
        };
        this.errorMessage = '';
        // if (this.validLineItems() == false) {
        //     this.errorMessage = 'One or more votes have not been done.';
        //     return;
        // }
        ////console.log('forwarding..', JSON.stringify(body));
        this.loadingService.show();
        this.camService.forwardCamSecretariat(body).subscribe((res) => {
            if (res.success == true) {
                this.close();
                this.loadingService.hide();
                this.applications = [];
                // this.submitForm(this.searchForm);
            } else {
                this.loadingService.hide();
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }*/

    getLLLDetails(){
        this.loadingService.show();
        this.camService.getIsLLLViolated(6, this.application.loanApplicationId).subscribe((response: any) => {
        this.loadingService.hide();
       // console.log(response.result);
            this.isLLLViolated = response.result.item1;
            this.legalLendingLimitImpact = response.result.item2;
            //console.log('this.legalLendingLimit', this.legalLendingLimitImpact);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    forwardCam() {
        let body = {
            applicationId: this.application.loanApplicationId,
            amount: this.application.approvedAmount,
            tenor: this.application.applicationTenor,
            investmentGrade: this.application.isInvestmentGrade,
            politicallyExposed: this.application.isPoliticallyExposed,
            forwardAction: this.commentForm.value.vote,
            // appraisalMemorandumId: this.selectedAppraisalMemorandumId,
            applicationTenor: this.application.applicationTenor,
            productClassId: this.application.productClassId,
            productId: this.application.productId,
            receiverLevelId: null, // this.receiverLevelId, // refer back
            receiverStaffId: null, // this.receiverStaffId, // refer back
            vote: this.commentForm.value.vote == 2 ? 2 : 1, // -------------------------------------logic
            comment: this.commentForm.value.comment, // line item changes
            recommendedChanges: this.recommendedItems, // line item changes
            isBusiness: false,
            // untenored: this.untenored,//untenored
            interestRateConcession: null, // TODO
            legalLendingLimit: this.legalLendingLimitImpact
            // feeRateConcession: this.getConcession(), // TODO
        };
//console.log("body",body);
//console.log("app",this.application);
        ////console.log('forwarding..', JSON.stringify(body));
        this.errorMessage = '';

        this.loadingService.show();
        this.subscriptions.add(
        this.camService.forwardCam(body).subscribe((response: any) => {
            if (response.success == true) {
                this.reset();
                this.loadingService.hide();
                this.displayApplicationStatusMessage(response.result);
            } else {
                // this.finishBad(response.message);
                this.loadingService.hide();               
                this.errorMessage = response.message;
            }
        }, (err: any) => {
            this.loadingService.hide(1000);          
            this.finishBad(JSON.stringify(err));
        }));
    }

    forwardCamLms() {
        const OPERATION_ID = 46;
        let body = {
            operationId: OPERATION_ID,
            applicationId: this.application.loanApplicationId,
            forwardAction: this.commentFormLms.value.vote,
            comment: this.commentFormLms.value.comment, // line item changes
            isBusiness: false,
        };

        ////console.log('forwarding..', JSON.stringify(body));
        this.errorMessage = '';

        this.loadingService.show();
        this.subscriptions.add(
        this.camService.forwardCamLms(body).subscribe((response: any) => {
            if (response.success == true) {
                this.reset();
                this.loadingService.hide();
                this.displayApplicationStatusMessage(response.result);
            } else {
                this.loadingService.hide();
                this.errorMessage = response.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        }));
    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}</strong>`, 'success');
        else{

            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    // displayApplicationStatusMessage(statusId: number) {
    //     if (statusId == ApprovalStatus.APPROVED)
    //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'The loan application has been <strong>approved</strong>!', 'success');

    //     if (statusId == ApprovalStatus.DISAPPROVED)
    //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'The loan application has been <strong>rejected</strong>!', 'error');
    // }

    // validLineItems(): boolean {
    //     let valid = true;
    //     this.members.forEach(e => {
    //         if (e.vote < 1) { valid = false; }
    //     });
    //     return valid;
    // }
    reset() { this.close(); }
    close() {
        // this.members = [];
        this.applications = [];
        this.applications = this.applications.slice();
        this.touchedItems = [];
        this.selectedLineId = null;
        this.commentLabel = 'Recommendation';
        this.useCommitteeOverallDecision = false;
        this.disableUploadTab = true;
        this.disableDecisionTab = true;
        this.activeTabindex = 0;
        this.clearControls();
    }

    
    // ----------------------- message -----------------------

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

    // test




    // ----------------------- new -----------------------


    // line recommended and proposed items

    fees: any[] = [];
    changeLog: any[] = [];
    proposedItems: any[] = [];
    recommendedItems: any[] = [];
    touchedLineItems: number[] = [];
    showChangeLog: boolean = false;
    displayChangeLog: boolean = false;
    showSpinnerChangeLog: boolean = false;

    onLineRowSelect(row) {
        this.selectedLineId = row.loanApplicationDetailId; // tobe used @ onLineItemChange()
        this.clearRecommendationForm(this.selectedLineId);
        let item = this.recommendedItems.find(x => x.detailId == row.loanApplicationDetailId);
        //const item = this.proposedItems.find(x => x.loanApplicationDetailId == id);
        ////console.log('touchedLineItems...', JSON.stringify(this.touchedLineItems));
        ////console.log('row id...', JSON.stringify(row.loanApplicationDetailId));
        this.computeTotalExposure();
        this.computeNewExposure();
        if (item == null) { return; }
        this.commentForm.controls['principal'].setValue(item.amount);
        this.commentForm.controls['rate'].setValue(item.interestRate);
        this.commentForm.controls['tenor'].setValue(item.tenor);
        this.commentForm.controls['productId'].setValue(item.productId);
        this.commentForm.controls['statusId'].setValue(item.statusId);
        this.commentForm.controls['exchangeRate'].setValue(item.exchangeRate);
    }

    computeInitialExposure() {
        var sum = this.proposedItems
            .map(x => x.convertedApprovedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        this.commentForm.controls['initialExposure'].setValue(sum.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return sum;
    }

    computeTotalExposure() {
        var sum = this.proposedItems
            .filter(x => x.statusId == ApprovalStatus.APPROVED)
            .map(x => x.convertedApprovedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        this.commentForm.controls['totalExposure'].setValue(sum.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return sum;
    }

    computeNewExposure() {
        var r = this.recommendedItems
            .filter(x => x.statusId == ApprovalStatus.APPROVED)
            .map(x => x.convertedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        var touchedIds = this.recommendedItems.map(x => x.detailId);
        var p = this.proposedItems
            .filter(x => x.statusId == ApprovalStatus.APPROVED && touchedIds.indexOf(x.loanApplicationDetailId) == -1)
            .map(x => x.convertedApprovedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        var sum = r + p;
        ////console.log('recommended...', JSON.stringify(this.recommendedItems));
        ////console.log('touched...', JSON.stringify(touchedIds));
        ////console.log('R...', JSON.stringify(r));
        ////console.log('P...', JSON.stringify(p));
        this.commentForm.controls['newExposure'].setValue(sum.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return sum;
    }


    onLineItemChange(input, value, id = null) {
        ////console.log('--=...', value);
        this.selectedLineId = id == null ? this.selectedLineId : +id;
        let item = this.recommendedItems.find(x => x.detailId == this.selectedLineId);
        if (item == null) {
            let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
            let newRecommendation = {
                detailId: o.loanApplicationDetailId,
                productId: o.approvedProductId,
                statusId: o.statusId,
                amount: o.approvedAmount,
                exchangeRate: o.exchangeRate,
                interestRate: o.approvedRate,
                tenor: o.approvedTenor,
                productName: o.approvedProductName,
                convertedAmount: o.convertedApprovedAmount
            };
            this.recommendedItems.push(newRecommendation);
            item = newRecommendation;
        }
        if (input == 1) { value = this.formatMCleanup(value); } // resolve the null=0 bug
        switch (input) {
            case 1: item.amount = value; item.convertedAmount = value * item.exchangeRate; break;
            case 2: item.interestRate = value; break;
            case 3: item.tenor = value * 30; break;
            case 4: item.productId = value; item.productName = this.getProductName(value); break;
            case 5: item.statusId = value; this.commentForm.controls['statusId'].setValue(value); this.setProductApprovalStatus(value); break;
            case 6: item.exchangeRate = value; item.convertedAmount = value * item.amount; break;
        }
        this.computeTotalExposure();
        this.computeNewExposure();
        this.touchedLineItems.push(this.selectedLineId); // mark change made here *
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

    clearRecommendationForm(id = null) {
        this.commentForm.controls['principal'].setValue('');
        this.commentForm.controls['rate'].setValue('');
        this.commentForm.controls['tenor'].setValue('');
        this.commentForm.controls['productId'].setValue('');
        this.commentForm.controls['statusId'].setValue(this.getProductApprovalStatus());
        this.commentForm.controls['exchangeRate'].setValue('');
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

    disableChanges() {
        return (this.selectedLineId == null
            || this.privilege.canApprove == false)
            ;
    }

    // lms committe

    selectedApplicationTypeId: number = null;
    applicationTypes: any[] = [
        { applicationTypeId: 1, applicationTypeName: 'Loan Origination' },
        { applicationTypeId: 2, applicationTypeName: 'Loan Management' }
    ];

    onApplicationTypeChange(id) { 
        this.selectedApplicationTypeId = id;
        this.getApplications(id); 
    }
}
