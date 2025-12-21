import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { CreditAppraisalService, LoanService } from 'app/credit/services';
import { StaffRealTimeSearchService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig, OperationsEnum } from 'app/shared/constant/app.constant';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-refer-back',
  templateUrl: './refer-back.component.html',
  styleUrls: ['./refer-back.component.scss']
})

export class ReferBackComponent implements OnInit {

    targetId:any;
    @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() notifyAfterReferBack: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() displayLoopInFeature = false;
    @Input() isClassified = false;
    @Input() currentLevelId = 0;
    getAll = true;
    @Input() forbidExternalNotification = false;
    @Input() set getAllReferTrail(value: boolean) {
            this.getAll = value;
    }

    isLMSCrossWorkflowStatus: boolean;
    @Input() isLmsOperations = false;
    @Input() set isLMSCrossWorkflow(value: boolean) {
        this.isLMSCrossWorkflowStatus = value;
        if (value == true) {
            this.getApprovalTrail();
        }
    }

   @Input() set referBackTargetId(value: any) {
        if (value > 0) {
            this.targetId = value;
          this.getApprovalTrail();
        }
    }

    operationId:any;
    @Input() set referBackOperationId(value: any) {
        if (value > 0) {
            this.operationId = value;
            this.getApprovalTrail();
        }
    }

    
    comment:any;
    approvalStatusId:any;
   
    commentForm: FormGroup;
    trailApprovalLevels: any[];
    searchTerm$ = new Subject<any>();
    searchResults: Object;
    displaySearchModal = false;
    searchedName: any;
    targetStaffStaffId: any;
    
    
    private _loopIn: boolean = false;
    get loopIn(): boolean {
        return this._loopIn;
    }

    set loopIn(value: boolean) {
        this._loopIn = value;
    }

   constructor(
       private fb: FormBuilder,
       private loanBookingService: LoanService,
       private camService: CreditAppraisalService,
       private realSearchSrv: StaffRealTimeSearchService,
       private loadingService: LoadingService) {
            this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
                if (results != null) {
                    this.searchResults = results.result; 
                }
            });
       }

   ngOnInit() {
      //this.getApprovalTrail();
      this.showCommentForm();
      
   }

    showCommentForm(init = false) {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            searchedName: [''],
            loopInStaffId:['']
        });
    }

    notifyContainer() {
        this.searchedName = null;
        this.loopInStaffId = null;
        this.notify.emit(true);
    }
    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    loopInStaffId: any;
    pickSearchedData(data) {
        this.searchedName = data.fullName;
        this.loopInStaffId = data.staffId;
        this.targetStaffStaffId = data.staffId;
        this.displaySearchModal = false;
    }

   searchDB(searchString) {
    searchString.preventDefault;
    this.searchTerm$.next(searchString);
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

    
    getApprovalTrail() {
        // console.log("my application details target ID: "+this.targetId + " and operation Id is "+ this.operationId);
        this.loadingService.show();
        if(this.targetId == null || this.targetId == undefined || this.operationId == null || this.operationId == undefined) 
        {
            this.loadingService.hide();
            return;
        }

        this.camService.getTrailForReferBack(this.targetId, this.operationId, this.currentLevelId, this.getAll, this.isClassified,this.isLMSCrossWorkflowStatus).subscribe((response: any) => {
            if(response.success){
                this.trailApprovalLevels = response.result;
                // if(this.operationId == OperationsEnum.OfferLetterApproval)
                // {
                //     this.trailApprovalLevels = this.trailApprovalLevels.filter(x => x.fromApprovalLevelId == 81);  //Legal Approval Level
                // }
                this.loadingService.hide();
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    
    returnBack(form) {
        const __this = this;
        var levelRecord = this.trailApprovalLevels.find(x=>x.fromApprovalLevelId == form.value.approvalLevelId);
       // console.log('form.value',form.value);
       // console.log('this.trailApprovalLevels',this.trailApprovalLevels);
      //  console.log('levelRecord',levelRecord);
        const target = {
            targetId: this.targetId,
            comment: form.value.comment,
            operationId: this.operationId,
            approvalLevelId: form.value.approvalLevelId,
            loopedStaffId: this.loopInStaffId,
            toStaffId: isNullOrUndefined(levelRecord) ? null : levelRecord.requestStaffId,
            forbidExternalNotification : this.forbidExternalNotification,
            nextOperation: isNullOrUndefined(levelRecord) ? null : levelRecord.operationId,
            isClassified : this.isClassified,
            myLevelId: this.currentLevelId,
            isLmsOperations: this.isLmsOperations,
            isLms: this.isLMSCrossWorkflowStatus
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
            __this.loadingService.showKeyApiCall();

            __this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    __this.notifyAfterReferBack.emit(true);
                    
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                __this.loadingService.hideKeyApiCall();
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                __this.loadingService.hideKeyApiCall(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    loopStaff(checked) {
        this.loopIn = checked;

        const approvalTrailControl = this.commentForm.get('approvalLevelId');
        const searchedNameControl = this.commentForm.get('searchedName');
        if(!checked){
            this.searchedName =null;
            this.loopInStaffId = null;
            approvalTrailControl.setValidators(Validators.required);
            searchedNameControl.clearValidators();
            
        } else {
            approvalTrailControl.clearValidators();
            this.commentForm.controls['approvalLevelId'].setValue("");
            searchedNameControl.setValidators(Validators.required);
         }
        approvalTrailControl.updateValueAndValidity();
        searchedNameControl.updateValueAndValidity();
    }

}

