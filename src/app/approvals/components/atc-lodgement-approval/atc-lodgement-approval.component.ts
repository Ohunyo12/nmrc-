import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { LoanService } from 'app/credit/services/loan.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoanApplicationService } from 'app/credit/services';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { Subject } from 'rxjs';
import { StaffRealTimeSearchService } from 'app/setup/services';

@Component({
  selector: 'app-atc-lodgement-approval',
  templateUrl: './atc-lodgement-approval.component.html',
 //providers:[LoanService]
})
export class AtcLodgementApprovalComponent implements OnInit {

   // ------------------- declarations -----------------

   @Input() panel: boolean = false;
   @Input() label: string = '';
   AtcLodgments: any[] = [];
   activeTabindex: any;
   singleCustomerType: number;
   selectedCustomerId: any;
   selectedCustomerName: any;
   customerList: any;
    searchCustomerId: any;
    operationId: any;
    target: any;
   showCusotmerSearch:boolean=false;
   AtcType: any;
   customerId: any;
   showAdditionalDocument:any;
   atcLodgmentDetail: FormGroup;
   AtcLodgmentDetail:any;
   atcLodgmentId: any;
   AtcLodgmentDetailList: any;
   showApprovalBottun:any ;
   comment:any;
   approvalStatusId:any;
   showCustomer:boolean =false;
   showLodgement:boolean = true;

   formState: string = 'New';
   selectedId: number = null;

   atcLodgments: any[] = [];
   atcLodgmentForm: FormGroup;
   displayAtcLodgmentForm: boolean = false;
   displayAccountBalance: boolean = false;
   accountBalances: any;
    approvalLodgement: any;
    commentForm: FormGroup;
    displayCommentForm: boolean;
    loanSelection: any;
    trailApprovalLevels: any;
    searchTerm$ = new Subject<any>();
    searchResults: Object;
    //loopIn: boolean = false;
    displaySearchModal = false;
    searchedNameId: any;
    targetStaffStaffId: any;
    reassignedTo: any;
    isReassigned: boolean;
    targetId: number;
    rowSelected: boolean = false;
    
   // ---------------------- init ----------------------

   constructor(
       private fb: FormBuilder,
       private loanService: LoanService,
       private loanApplService: LoanApplicationService,
       private loanBookingService: LoanService,
       private camService: CreditAppraisalService,
       private realSearchSrv: StaffRealTimeSearchService,
       private loadingService: LoadingService) {
            // this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
            //     if (results != null) {
            //         this.searchResults = results.result; 
            //     }
            // });
       }

   ngOnInit() {
       this.getAtcLodgementApproval();
       this.showCommentForm(true);
       this.approvalStatusId=0;
      
   }
    showCommentForm(init = false) {
        this.showApprovalBottun = false;
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            searchedNameId: ['', Validators.required],
        });
        if (init == false) this.displayCommentForm = true;
    }
   // ------------------- api-calls --------------------

   searchDB(searchString) {
    searchString.preventDefault;
    this.searchTerm$.next(searchString);
}


   saveAtcLodgment(form) {

       let __this = this;
       swal({
           title: 'Are you sure?',
           text: "This will go through approval workflow. Are you sure you want to proceed?",
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
           customerId: __this.customerId,
           atcTypeId: form.value.atcTypeId,
           description: form.value.description,
           depot: form.value.depot,
           unitValue: form.value.unitValue,
           unitNumber: form.value.unitNumber,
       };

       
       __this.loadingService.show();
       if (__this.selectedId === null) {
           __this.loanService.saveAtcLodgment(body).subscribe((response: any) => {
               __this.loadingService.hide();
               if (response.success == true){ __this.reloadGrid();
                   __this.activeTabindex=1}
               else{ __this.finishBad(response.message);}
           }, (err: any) => {
               __this.loadingService.hide();
               __this.finishBad(JSON.stringify(err));
           });
       } else {
           __this.loanService.editAtcLodgment(body, __this.selectedId).subscribe((response: any) => {
               __this.loadingService.hide();
               if (response.success == true) __this.reloadGrid();
               else __this.finishBad(response.message);
           }, (err: any) => {
               __this.loadingService.hide();
               __this.finishBad(JSON.stringify(err));
           });
       }
          
       }, function (dismiss) {
           if (dismiss === 'cancel') {
               swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
           }
       });
       
   }

   getAtcLodgementApproval() {
       this.loanService.getAtcLodgementApproval().subscribe((response: any) => {
           this.AtcLodgments = response.result;
           
       });
   }
 

   reloadGrid() {
       this.displayAtcLodgmentForm = false;
       this.getAtcLodgementApproval();
    }
    

    viewAdditionalInfo(d) {
        let id = d.atcLodgmentId;
        this.loanService.getAtcLodgmentDetail(id).subscribe((response: any) => {
            this.AtcLodgmentDetailList = response.result;
            this.showAdditionalDocument = true;
            this.atcLodgmentId = d.atcLodgmentId;
            this.operationId = d.operationId;
            this.loanSelection = d;
        });
    }

   show: boolean = false; message: any; title: any; cssClass: any;

   finishGood() { this.loadingService.hide(); }

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

   onTabChange($event) {
       this.activeTabindex = $event.index;
     }

   
   getCusotmerAccountBalance(){
       this.accountBalances = this.getAccountBalance("");
       this.displayAccountBalance=true;
   }
   getAccountBalance(customerId) {
       let list: any = [
           { 'AccountNumber': '34343434343', 'AccountBalance': '20000000' },
           { 'AccountNumber': '34343434222', 'AccountBalance': '45000000' },
           { 'AccountNumber': '34343112222', 'AccountBalance': '64555000' },
           { 'AccountNumber': '32223434222', 'AccountBalance': '39900000' },
       ];
       return list;
   }

   customerInfo(d){
    this.searchCustomerId = d.customerId;
       this.customerId = d.customerId;
       this.activeTabindex = 1;
    this.showCustomer=true;
   
   }

   approval(d){
    this.atcLodgmentId = d.atcLodgmentId;
    this.targetId = d.atcLodgmentId;
    this.operationId = d.operationId;
    this.showApprovalBottun=true;
    this.approvalLodgement = d;
    this.rowSelected = true;
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
        
        let data={
            atcLodgmentId:__this.approvalLodgement.atcLodgmentId ,
          comment:__this.comment,
          approvalStatusId:__this.approvalStatusId
        }
        __this.loadingService.show();
    __this.loanService.submitLodgementApproval(data).subscribe((response: any) => {
        if (response.success == true) {
            __this.refreshApprovalCommentAndStatus();
            __this.getAtcLodgementApproval();
            __this.showApprovalBottun = false;
            __this.displayApplicationStatusMessage(response.result);
            __this.loadingService.hide();
        } else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
    });
       
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
    }
    
    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The ATC has been Successfully <strong>${response.statusName}</strong>`, 'success');
        else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    modalControl(event) {
        if(event == true) {
            this.displayCommentForm = false;
        }
      }
      
      referBackResultControl(event) {
        if(event == true) {
            this.getAtcLodgementApproval();
            this.displayCommentForm = false;
            this.showApprovalBottun = false;
        }
      }

      refreshApprovalCommentAndStatus() {
        this.approvalStatusId = 0;
        this.comment = "";
    }
}
