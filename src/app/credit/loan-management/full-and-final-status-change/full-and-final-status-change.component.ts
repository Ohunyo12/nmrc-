import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanOperationService, LoanService } from 'app/credit/services';
import { ApplicationStatus, GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-full-and-final-status-change',
  templateUrl: './full-and-final-status-change.component.html',
  //styleUrls: ['./full-and-final-status-change.component.scss']
})
export class FullAndFinalStatusChangeComponent implements OnInit, OnDestroy {
  
    operations: any;
    products: any[];
    applications: any[];
    displaySearchForm:boolean=false;
    searchForm: FormGroup;
    activeTabindex:any;
    hideCancelPanel:boolean;
    hideGeneralInfoPanel:boolean;
    cancellationReason: any;
    loanApplicationId: any;
    loanApplicationDetail: any;
    showCancelButton:boolean=true;
    activeSearchTabindex: any;
    displaySearchTable:boolean=true;
    reload: number = 0;
    duplications: any;
    proposedItems: any;
    facilityCount: any;
    dynamicsList: any;
    conditionList: any;
    visible:boolean=false;
    displayDetail:boolean=false;
    //supportingDocuments: any;
    // binaryFile: any;
    // selectedDocument: any;
    // displayDocument: boolean;
    //fileDocument: any;
    changeLog: any;
    applicationReferenceNumber: any;
    displayReport: boolean;
    isOfferLetterAvailable: any;
    isLMS:boolean=true;
    showLoanFacilityArchive: boolean;
    selectedApplication: any;
    loanId: any;
    loanReviewOperationId:any;
    fullAndFinalStatus: any;
    fullAndFinalStatusId: any;
    loanScheduleDetails: any[];
    // fullAndFinalForm: FormGroup;
    private subscriptions = new Subscription();
    ngOnDestroy(): void {
          this.subscriptions.unsubscribe();
      }
  
  constructor(
      private loadingService: LoadingService,
      private loanOperationService: LoanOperationService,
      private loanService: LoanService,
      private fb: FormBuilder,
  ) { }
  
  ngOnInit() {
      this.hideCancelPanel=false;   
      this.hideGeneralInfoPanel=true;  
      this.intControl();  
      this.getFullAndFinalStatus();
  }

  showSearchForm() { this.displaySearchForm = true; }

  onTabChange(obj){  }

  GetLoanIregularInput(loanReviewOperationId) {
    this.subscriptions.add(
    this.loanService.getLoanIregularInput(loanReviewOperationId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;

        //console.log("Record",this.loanScheduleDetails)

      }));

  }

  // GetLaonScheduleByLoanId(loanId) {
  //   this.loanService.getLoanDetail(loanId)
  //     .subscribe(results => {
  //       this.loanScheduleDetails = results.result;

  //     });

  // }
  
  submitForm(form) { 
      let searchString = form.value.searchString
      
      this.loadingService.show();
      this.subscriptions.add(
      this.loanOperationService.fullAndFinalLoanSearch(searchString).subscribe((response: any) => {
          this.applications = response.result;
          if(this.applications[0] == undefined || this.applications[0] == null || this.applications[0].loanId == undefined){
            this.loadingService.hide();
            this.displaySearchForm = false;
              return;
          }
          //console.log('applications',this.applications);
          this.GetLoanIregularInput(this.applications[0].loanReviewOperationId)
          this.loadingService.hide();
          this.displaySearchForm = false;
          this.displaySearchTable = true;
      }, (err: any) => {
          this.loadingService.hide(1000);
      }));
  }
  
  getLoanApplicationStatus(id) {
    let item = ApplicationStatus.list.find(x => x.id == id);
    return item == null ? 'n/a' : item.name;
  }

  cancelAction(){
  this.hideCancelPanel=false;   
      this.hideGeneralInfoPanel=true; 
  }

  getFullAndFinalStatus() { 
    this.subscriptions.add(
        this.loanOperationService.GetfullAndFinalLoanStatus().subscribe((response: any) => {
            this.fullAndFinalStatus = response.result;
        }, (err: any) => {
        }));
  }

  intControl(){
    this.searchForm = this.fb.group({
      searchString:[''],
    })
    // this.fullAndFinalForm = this.fb.group({
    //     fullAndFinalStatusId:['',Validators.required]
    //   })
  }

  view(row) {
    //console.log("row",row);
    this.selectedApplication = row;
    this.showLoanFacilityArchive=true;
    this.loanId = row.loanId
    this.loanReviewOperationId = row.loanReviewOperationId;
    this.GetLoanIregularInput( this.loanReviewOperationId);
  //this.GetLaonScheduleByLoanId( this.loanId);
  }

  cancelFullAndFinal(){ 
    let __this = this;
        swal({
        title: 'Are you sure?',
        text: 'This this cancel this full and final. Are you sure you want to proceed?',
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

        ////console.log('insuranceForm >>',form);
        __this.loadingService.show();

        let loanId = __this.loanId;
        __this.subscriptions.add(
        __this.loanOperationService.cancelFullAndFinal(loanId,__this.fullAndFinalStatusId).subscribe((response: any) => {
            if (response.success === true) {
                swal('FinTrak Credit 360', "Operation Successful!", 'success');
                __this.loadingService.hide();
                this.displayModalForm = false;
            } else {
                swal('FinTrak Credit 360', "Operation Not Successful", 'error');
                __this.loadingService.hide();
            }
        }));
      // this.displayModalForm = false;
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation Cancelled', 'error');
            __this.loadingService.hide();
        }
    });
  }

}
