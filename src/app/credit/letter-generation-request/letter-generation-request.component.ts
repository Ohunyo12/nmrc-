import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { LetterGenerationRequestService } from '../services/letter-generation-request.service';
import { GlobalConfig, ApprovalStatus, ConvertString } from 'app/shared/constant/app.constant';
import { GeneralSetupService } from 'app/setup/services';
import { CreditAppraisalService } from '../services';

@Component({
    templateUrl: 'letter-generation-request.component.html',
    selector: 'letter-generation-request',
})
export class LetterGenerationRequestComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    camsolLoans: any;
    activeTabindex: any;
    loanBalance: number = 0;
    showNext: boolean;
    customerId = 0;
    customerIds = [];

    @Input() set reload(value: number) { if (value > 0) this.getLetterGenerationRequests(); }

    formState: string = 'New';
    selectedId: number = null;

    customerButtonTitle = 'Get Customer';
    forwardAction: number;
    vote: number;
    OPERATION_ID = 140;
    showLcForward = false;
    letterGenerationRequests: any[] = [];
    letterGenerationRequestForm: FormGroup;
    lcForwardForm: FormGroup;
    approvalStatusData: any[];
    displayLetterGenerationRequestForm: boolean = false;
    showSearchCustomerDialog = false;
    customerName: string;
    authorisedSignatories: any[] = [];
    letterGenerationsignatories: any[] = [];
    letterGenerationCamsolList: any[] = [];

    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        canEscalate: false,
        canAppendTemplate: true,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: null,
        staffId: null,
        roleId: null,
        userBranchId: null,
        // investmentGradeApprovalLimit: 10000, // todo later
        // maximumTenor: 223, // todo later
        groupRoleId: 1, // bu,ca,md,comm,bd
    };

    requestTypes = [
        {name: 'Letter Of Indebtedness', id: 1},
        {name: 'Letter Of Non-indebtness', id: 2},
        {name: 'Auditor\'s enquiry / Ex-Staff Enquiry', id: 3}
    ];
    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private genSetupService: GeneralSetupService,
        private LetterGenServ: LetterGenerationRequestService,
    ) { }

    ngOnInit() {
        this.initializeControls();
        this.getLetterGenerationRequests();
        this.getAllAuthorisedSignatories();
        this.getAllApprovalStatus();
    }

    initializeControls() {
        this.customerButtonTitle = 'Get Customer';
        this.clearControls();
        this.lcForwardForm = this.fb.group({
            // forward: ['', Validators.required],
            comment: ['', Validators.required]
        });
    }

    getAllAuthorisedSignatories() {
        this.loadingService.show();
        this.genSetupService.getAllSignatories().subscribe((response: any) => {
            this.authorisedSignatories = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getUserPrivileges(levelId = null) {
        let body = {
            levelId: levelId,
            operationId: this.OPERATION_ID,
            // targetId: this.loanSelection.loanApplicationId,
            // productClassId: this.loanSelection.productClassId,
            // productId: null
        }
        this.camService.getPrivilege(body).subscribe((response: any) => {
            this.privilege = response.result;
            // this.privilege.currentApprovalLevelId = this.obligor.currentApprovalLevelId;
            // this.privilege.currentApprovalLevel = this.loanSelection.currentApprovalLevel;
            // console.log('privilege <== ', (this.privilege));
        });
    }

    customerExposureResult: any[];
    setcustomerExposureResult(result) {
        this.customerExposureResult = result;
    }

    nextView() {
        this.activeTabindex += 1;
    }
    // getAllLetterGenSignatories(requestId: number) {
    //     this.loadingService.show();
    //     this.LetterGenServ.getLetterGenSignatories(requestId).subscribe((response: any) => {
    //         this.letterGenerationsignatories = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     })
    // }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    getApprovalStatus(approvalStatusId) {
        let processLabel = 'PROCESSING';
        if (approvalStatusId == ApprovalStatus.PROCESSING)
            return '<span class="label label-info">' + processLabel + '</span>';
        if (approvalStatusId == ApprovalStatus.AUTHORISED)
            return '<span class="label label-info">' + processLabel + '</span>';
        if (approvalStatusId == ApprovalStatus.REFERRED)
            return '<span class="label label-danger">REFERRED BACK</span>';
        if (approvalStatusId == ApprovalStatus.APPROVED)
            return '<span class="label label-success">APPROVED</span>';
        if (approvalStatusId == ApprovalStatus.DISAPPROVED)
            return '<span class="label label-danger">REJECTED</span>';
    return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    showCustomerSearchForm() {
        this.showSearchCustomerDialog = true;
    }

    setCustomer(event) {
        //console.log(event);
        // this.getAllCustomerAccount(event.customerId);
        this.customerIds.push(event.customerId);
        this.customerId = event.customerId;
        this.letterGenerationRequestForm.controls['customerId'].setValue(event.customerId);
        this.letterGenerationRequestForm.controls['customerName'].setValue(event.customerName);
        this.showSearchCustomerDialog = false;

        var customerName = event.customerName.replace(/[^a-zA-Z ]/g, '').trim();
        this.getCamsolLoansByCustomerCode(customerName, event.customerCode);
    }

    closeDialog() {
        this.showLcForward = false;
    }

    forward(row) {
        this.showLcForward = true;
        //console.log("row: ", row);
        this.selectedId = row.requestId;
    }

    resetButton(value) {
       // console.log('On approval status change ' + value);
    }

    // ------------------- api-calls --------------------
 
    goForApproval() {
        this.loadingService.show();
            this.vote = 2;
            this.forwardAction = 0;
        let body = {
                forwardAction: this.forwardAction,
                comment: this.lcForwardForm.controls['comment'].value,
                requestId: this.selectedId,
                // receiverLevelId: this.lcSelection.currentApprovalLevelId, // refer back
                // receiverStaffId: this.lcSelection.toStaffI // refer back
                vote: this.vote,
        };

        this.LetterGenServ.forwardLetterGen(body)
        .subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                    this.selectedId = null;
                    this.reload = 1;
                    this.getLetterGenerationRequests();
                    this.initializeControls();
                    this.displayLetterGenerationRequestForm = false;
                    this.showLcForward = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 
                    '<br/> ' + res.message , 'success');
            } else {
                this.showLcForward = false;
                this.finishBad(res.message);
                this.loadingService.hide();
            }
        }, (err) => {
            this.showLcForward = false;
            this.loadingService.hide();
            this.finishBad(err.message);
        });
                
    }

    saveLetterGenerationRequest(form) {
            this.customerName = form.value.customerName;

            let body = {
            requestId: this.selectedId,
            customerId: form.value.customerId,
            requestDate: form.value.requestDate,
            requestType: form.value.requestType,
            asAtDate: form.value.asAtDate,
            comment: form.value.comment,
            loanBalance: form.value.loanBalance,
            letterGenerationsignatories : this.letterGenerationsignatories,
            letterGenerationCamsolList: this.letterGenerationCamsolList
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.LetterGenServ.saveLetterGenerationRequest(body).subscribe((response: any) => {
                if (response.success == true) {
                   // console.log(response);
                    this.reloadGrid();
                    this.editLetterGenerationRequest(response.result);
                    this.finishGood(response.message);
                    this.displayLetterGenerationRequestForm = false;
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.LetterGenServ.updateLetterGenerationRequest(body, this.selectedId).subscribe((response: any) => {
                if (response.success == true) {
                   // console.log(response);
                    this.reloadGrid();
                    this.editLetterGenerationRequest(response.result);
                    this.finishGood(response.message);
                    this.displayLetterGenerationRequestForm = false;
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }

        this.displayLetterGenerationRequestForm = false;
    }

    getLetterGenerationRequests() {
        this.LetterGenServ.getLetterGenerationRequests().subscribe((response: any) => {
            this.letterGenerationRequests = response.result;
        });
    }

    deleteLetterGenerationRequest(row) {
        this.LetterGenServ.deleteLetterGenerationRequest(row.letterGenerationRequestId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        this.displayLetterGenerationRequestForm = false;
        this.getLetterGenerationRequests();
    }

    getRequestTypeName(id): string {
        return this.requestTypes.find(t => t.id == id).name;
    }

    getCamsolLoansByCustomerCode(customerName: string, customerCode: string) {
        this.LetterGenServ.getCamsolLoansByCustomerCode(customerName, customerCode).subscribe((response: any) => {
            this.camsolLoans = response.result;
            const loanBalance = this.letterGenerationRequestForm.get("loanBalance").value;   
            const balance: number = ConvertString.TO_NUMBER(loanBalance);        
        if(this.camsolLoans.length > 0 || balance > 0){
            this.enableTextField = true;
        }
        });
        //console.log("this.camsolLoans: ", this.camsolLoans);
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;

        if (this.activeTabindex == 1)
            this.showNext = false;
        else
            this.showNext = true;

        
    }

    onRowSelect(data) {
       // console.log('newTest: ', data);
       this.loanBalance = 0;
       this.letterGenerationCamsolList.forEach(c => {
            this.loanBalance += c.balance;
       });
        // this.loanBalance = this.loanBalance + (data.balance);
       // console.log("loanBalance: ", this.loanBalance);
        this.letterGenerationRequestForm.controls['loanBalance'].setValue(this.loanBalance);
    }

    onRowSelectUnselect(data) {
       // console.log('newTest: ', data);
       this.loanBalance = 0;
       this.letterGenerationCamsolList.forEach(c => {
            this.loanBalance += c.balance;
       });
       this.letterGenerationRequestForm.controls['loanBalance'].setValue(this.loanBalance);
       // this.loanBalance = this.loanBalance - (data.balance);
       // console.log("loanBalance: ", this.loanBalance);
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.letterGenerationRequestForm = this.fb.group({
            // requestId: [''],
            customerName: ['', Validators.required],
            customerId: ['', Validators.required],
            requestDate: [new Date(), Validators.required],
            requestType: ['', Validators.required],
            asAtDate: ['', Validators.required],
            comment: ['', Validators.required],
            loanBalance: '',
        });
    }


    enableTextField: boolean = true;

    editLetterGenerationRequest(row) {
        // this.getAllLetterGenSignatories(row.requestId);
        this.customerIds.push(row.customerId);
        this.customerId = row.customerId;
        this.letterGenerationsignatories = row.letterGenerationsignatories;
        this.letterGenerationCamsolList = row.letterGenerationCamsolList;
       // console.log("test3: ", row);
        if (row.customerName != null) {
            this.customerName = row.customerName;
            this.customerId = row.customerId;
        }
        this.customerButtonTitle = 'change Customer';
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.requestId;
        this.letterGenerationRequestForm.setValue({
            customerName: this.customerName,
            customerId: row.customerId,
            requestDate: new Date(row.requestDate),
            requestType: row.requestType,
            asAtDate: new Date(row.asAtDate),
            comment: row.comment,
            loanBalance: row.loanBalance
        });
        //console.log(this.letterGenerationRequestForm.value);
        this.displayLetterGenerationRequestForm = true;

        if (row.customerName != null) {
            var customerName = row.customerName.replace(/[^a-zA-Z ]/g, '').trim();
        }
        
        this.getCamsolLoansByCustomerCode(customerName, row.customerCode);
        
        const loanBalance = this.letterGenerationRequestForm.get("loanBalance").value;   
        const balance: number = ConvertString.TO_NUMBER(loanBalance);  
        if(this.customerExposureResult.length > 0 || this.camsolLoans.length == 0 || balance == 0){
            this.enableTextField = false;
        }else if(this.customerExposureResult.length == 0 && this.camsolLoans.length == 0){
            this.enableTextField = false;
        }
    }

    showLetterGenerationRequestForm() {
        this.getAllAuthorisedSignatories();
        this.clearControls();
        this.selectedId = null;
        this.customerId = 0;
        this.customerButtonTitle = 'Get Customer';
        this.displayLetterGenerationRequestForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood(message) { 
        this.showMessage(message, 'success', "FintrakBanking");
        this.loadingService.hide(); 
    }

    hideMessage(event) { this.show = false; }

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
}

