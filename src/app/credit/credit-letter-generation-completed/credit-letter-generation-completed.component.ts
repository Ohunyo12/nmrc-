import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { LetterGenerationRequestService } from 'app/credit/services/letter-generation-request.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { GeneralSetupService, StaffRoleService } from 'app/setup/services';
import { LoanService } from 'app/credit/services/loan.service';
import { CreditAppraisalService } from 'app/credit/services';


@Component({
  selector: 'app-credit-letter-generation-completed',
  templateUrl: './credit-letter-generation-completed.component.html',
  styleUrls: ['./credit-letter-generation-completed.component.scss']
})
export class CreditLetterGenerationCompletedComponent implements OnInit 
{

    
    @Input() panel: boolean = false;
    @Input() label: string = '';
    camsolLoans: any;
    activeTabindex: any;
    camsolLoanDocHtml: any;
    staffRoleRecord: any;
    isCCO: boolean;
    isBRANCHMANAGER: boolean;

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
    letterGenerationCompleted: any[] = [];
    loanBalances: any;
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
        groupRoleId: 1, 
    };

    requestTypes = [
        {name: 'Letter Of Indebtedness', id: 1},
        {name: 'Letter Of Non-indebtness', id: 2},
        {name: 'Auditor\'s enquiry', id: 3}
    ];
   
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private staffRole: StaffRoleService,
        private genSetupService: GeneralSetupService,
        private LetterGenServ: LetterGenerationRequestService,
        private loanBookingService: LoanService,
        private camService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.initializeControls();
        this.getLetterGenerationCompleted();
        this.getAllApprovalStatus();
        this.showCommentForm(true);
        this.getUserRole();
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

    showCustomerSearchForm() {
        this.showSearchCustomerDialog = true;
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
            //console.log('privilege <== ', (this.privilege));
        });
    }

    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
           
            if (this.staffRoleRecord.staffRoleCode == 'CCO') {
                this.isCCO = true;
            } else {
                this.isCCO = false
            }
            if (this.staffRoleRecord.staffRoleCode == 'BRANCH MANAGER') {
                this.isBRANCHMANAGER = true;
            } else {
                this.isBRANCHMANAGER = false
            }
        });
    }

    setCustomer(event) {
        this.letterGenerationRequestForm.controls['customerId'].setValue(event.customerId);
        this.letterGenerationRequestForm.controls['customerName'].setValue(event.customerName);
        
        this.showSearchCustomerDialog = false;
        this.getCamsolLoansByCustomerCode(event.customerName, event.customerCode);
    }

    closeDialog() {
        this.showLcForward = false;
    }

    forward(row) {
        this.showLcForward = true;
        this.selectedId = row.requestId;
    }

    resetButton(value) {
       
    }

    getCamsolLoansByCustomerCode(customerName: string, customerCode: string) {
        this.LetterGenServ.getCamsolLoansByCustomerCode(customerName, customerCode).subscribe((response: any) => {
            this.camsolLoans = response.result;
        });
    }

    getCamsolLoanDocument(typeId: Number, data: any) {
        var body = {
            customerId: data.customerId,
            customerCode: data.customerCode,
            customerName: data.customerName,
            accountNumber: data.accountNumber,
            asAtDate: data.asAtDate,
            requestRef: data.requestRef,
            requestId: data.requestId,
            loanBalance: data.loanBalance
        }
        
        this.loanBalances = data.loanBalance
        this.LetterGenServ.getCamsolLoanDocument(typeId, body).subscribe((response: any) => {
            this.camsolLoanDocHtml = response.result;
        });
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    printCamsolLoanDocument() {
        var print_div = document.getElementById('camsolLoanDocument');
        var print_area = window.open();
        print_area.document.write(print_div.innerHTML);
        print_area.document.close();
        print_area.focus();
        print_area.print();
        print_area.close();
    }

  
    goForApproval() {
        this.loadingService.show();
        if (this.privilege.canApprove == true) {
            this.vote = this.lcForwardForm.controls['forward'].value;
            this.forwardAction = this.lcForwardForm.controls['forward'].value;
        } else {
            this.vote = this.lcForwardForm.controls['forward'].value;
            this.forwardAction = 0;
        }
        let body = {
                forwardAction: this.forwardAction,
                comment: this.lcForwardForm.controls['comment'].value,
                requestId: this.selectedId,
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

    getLetterGenerationCompleted() {
      this.LetterGenServ.getLetterGenerationCompleted().subscribe((response: any) => {
          this.letterGenerationCompleted = response.result;
      });
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

 
    clearControls() {
        this.formState = 'New';
        this.letterGenerationRequestForm = this.fb.group({
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
        this.getUserPrivileges(row.currentApprovalLevelId);
        if (row.customerName != null) {
            this.customerName = row.customerName;
        }
        this.customerIds.push(row.customerId);
        this.customerId = row.customerId;
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


