import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { LetterGenerationRequestService } from 'app/credit/services/letter-generation-request.service';
import { GlobalConfig, ApprovalStatus } from 'app/shared/constant/app.constant';
import { GeneralSetupService } from 'app/setup/services';
import { LoanService } from 'app/credit/services/loan.service';
import { CreditAppraisalService } from 'app/credit/services';
import { request } from 'https';
import { ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'letter-generation-request-approval',
  templateUrl: 'letter-generation-request-approval.component.html',
  styleUrls: ['./letter-generation-request-approval.component.scss']
})
export class LetterGenerationRequestApprovalComponent implements OnInit 
{

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    camsolLoans: any;
    activeTabindex: any;
    camsolLoanDocHtml: any;
    authorisedSignatories: any[] = [];

    @Input() set reload(value: number) { if (value > 0) this.getLetterGenerationRequests(); }

    formState: string = 'New';
    selectedId: number = null;

    customerButtonTitle = 'Change Customer';
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
    displayCommentForm: boolean = false;
    commentForm: FormGroup;
    trailApprovalLevels: any;
    letterGenerationRow: any;
    letterGenerationsignatories: any[] = [];
    letterGenerationCamsolList: any[] = [];
    customerId = 0;
    customerIds = [];

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
        {name: 'Auditor\'s enquiry', id: 3}
    ];
    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private genSetupService: GeneralSetupService,
        private LetterGenServ: LetterGenerationRequestService,
        private loanBookingService: LoanService,
        private camService: CreditAppraisalService,
        private route: ActivatedRoute,
    ) { }


    ngOnInit() {
        this.initializeControls();
        // this.getAllAuthorisedSignatories();
        this.route.params.forEach((params:Params) =>{
            let id = +params['requestId'];
        this.getAllLetterGenSignatories(id)});
        this.getLetterGenerationRequests();
        this.getAllApprovalStatus();
        this.showCommentForm(true);
    }

    showCommentForm(init = false) {
      this.commentForm = this.fb.group({
        comment: ['', Validators.required],
        approvalLevelId: ['', Validators.required]
      });
      if (init == false) this.displayCommentForm = true;
    }

    initializeControls() {
        this.customerButtonTitle = 'Get Customer';
        this.clearControls();
        this.lcForwardForm = this.fb.group({
            forward: ['', Validators.required],
            comment: ['', Validators.required]
        });
    }

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
        // console.log(event);
        // this.customerId = event.customerId;
        // this.getAllCustomerAccount(event.customerId);
        this.customerIds.push(event.customerId);
        this.customerId = event.customerId;
        this.letterGenerationRequestForm.controls['customerId'].setValue(event.customerId);
        this.letterGenerationRequestForm.controls['customerName'].setValue(event.customerName);
        //console.log(this.letterGenerationRequestForm.value);
        this.showSearchCustomerDialog = false;
        this.getCamsolLoansByCustomerCode(event.customerName, event.customerCode);
    }

    //  getAllAuthorisedSignatories() {
    //      this.loadingService.show();
    //      this.genSetupService.getAllSignatories().subscribe((response: any) => {
    //          this.authorisedSignatories = response.result;
    //          this.loadingService.hide();
    //      }, (err) => {
    //          this.loadingService.hide(1000);
    //      });
    //  }

    getAllLetterGenSignatories(requestId: number) {
        this.loadingService.show();
        this.LetterGenServ.getLetterGenSignatories(requestId).subscribe((response: any) => {
            this.letterGenerationsignatories = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        })
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
        //console.log('On approval status change ' + value);
    }

    getCamsolLoansByCustomerCode(customerName: string, customerCode: string) {
        this.LetterGenServ.getCamsolLoansByCustomerCode(customerName, customerCode).subscribe((response: any) => {
            this.camsolLoans = response.result;
        });
    }

    getCamsolLoanDocument(typeId: Number, data: any) {
        //console.log("data: ", data);
        var body = {
            customerId: data.customerId,
            customerCode: data.customerCode,
            customerName: data.customerName,
            accountNumber: data.accountNumber,
            asAtDate: data.asAtDate,
            requestRef: data.requestRef,
            loanBalance: data.loanBalance
        }

        this.LetterGenServ.getCamsolLoanDocument(typeId, body).subscribe((response: any) => {
            this.camsolLoanDocHtml = response.result;
        });
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    printCamsolLoanDocument() {
        var print_div = document.getElementById("camsolLoanDocument");
        var print_area = window.open();
        print_area.document.write(print_div.innerHTML);
        print_area.document.close();
        print_area.focus();
        print_area.print();
        print_area.close();
    }

    // ------------------- api-calls --------------------
 
    goForApproval() {
            this.loadingService.show();
        if (this.lcForwardForm.controls['forward'].value == 2) {
            if (this.privilege.canApprove == true) {
                this.vote = this.lcForwardForm.controls['forward'].value;
                this.forwardAction = this.lcForwardForm.controls['forward'].value;
            } else {
                this.vote = this.lcForwardForm.controls['forward'].value;
                this.forwardAction = 0;
            }
        } else {
            this.vote = this.lcForwardForm.controls['forward'].value;
            this.forwardAction = this.lcForwardForm.controls['forward'].value;
        }
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
                    this.showLcForward = false;
                    this.displayLetterGenerationRequestForm = false;
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
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.LetterGenServ.updateLetterGenerationRequest(body, this.selectedId).subscribe((response: any) => {
                if (response.success == true) {
                    //console.log(response);
                    this.reloadGrid();
                    this.editLetterGenerationRequest(response.result);
                    this.finishGood(response.message);
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
        this.LetterGenServ.getLetterGenerationRequestsForApproval().subscribe((response: any) => {
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

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.letterGenerationRequestForm = this.fb.group({
            // requestId: [''],
            customerName: ['', Validators.required],
            customerId: ['', Validators.required],
            requestDate: ['', Validators.required],
            requestType: ['', Validators.required],
            asAtDate: ['', Validators.required],
            comment: ['', Validators.required],
            loanBalance: ''
        });
    }

    editLetterGenerationRequest(row) {
        // console.log("row: ", row);
        this.customerIds.push(row.customerId);
        this.customerId = row.customerId;
        if (row.customerName != null) {
            this.customerName = row.customerName;
        }
        this.getAllLetterGenSignatories(row.requestId);
        this.letterGenerationsignatories = row.letterGenerationsignatories;
        this.letterGenerationCamsolList = row.letterGenerationCamsolList;
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

        // console.log(this.letterGenerationRequestForm.value);
        this.displayLetterGenerationRequestForm = true;
        this.letterGenerationRow = row;
        this.getApprovalTrail();
        this.getCamsolLoanDocument(row.requestType, row);
        // this.getCamsolLoansByCustomerCode(row.customerName, row.customerCode);
    }

    showLetterGenerationRequestForm() {
        this.clearControls();
        this.selectedId = null;
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

    getApprovalTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.letterGenerationRow.requestId, this.letterGenerationRow.operationId).subscribe((response: any) => {
            if(response.success){
                this.trailApprovalLevels = response.result;
                this.loadingService.hide();
                //console.log('trailApprovalLevels',this.trailApprovalLevels);
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    
      returnBack(form) {
        const __this = this;
        const target = {
            targetId: this.letterGenerationRow.requestId,
            comment: form.value.comment,
            operationId: this.letterGenerationRow.operationId,
            approvalLevelId: form.value.approvalLevelId
        };
    
        swal({
            title: 'Are you sure?',
            text: 'You want to refer back?',
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
    
            __this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
                __this.loadingService.hide();
                if (res.success === true) {
                    __this.getLetterGenerationRequests();
                    __this.displayLetterGenerationRequestForm = false;
                    __this.displayCommentForm = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                  __this.getLetterGenerationRequests();
                  __this.displayLetterGenerationRequestForm = false;
                  __this.displayCommentForm = false;
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
}