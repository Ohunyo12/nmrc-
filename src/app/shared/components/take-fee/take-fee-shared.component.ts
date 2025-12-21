import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanReviewApplicationService, LoanOperationService } from 'app/credit/services';
import { CasaService } from 'app/customer/services/casa.service';

@Component({
  selector: 'take-fee-shared',
  templateUrl: './take-fee-shared.component.html',

})
export class TakeFeeSharedComponent implements OnInit {



  @Input() selectedLoanId:any;
  @Input() isLms:any;
  @Input() selectedLoanDetailId:any;
  @Input() selectedPerformanceTypeId:any;
  @Input() selectedLoanProductId:any;
  @Input() currencyId:any;
  @Input() amount:any;


  // @Input() customerId:any;

  @Input() loanSystemTypeId:any;
  @Input() hideTab:boolean;
  @Input() menuPage:boolean;
  @Output() takeFees: EventEmitter<any> = new EventEmitter<any>();

@Input() set customerId(value: number) { 
     if (value > 0) this.getLoanCustomerAccounts(value, this.currencyId); 
 }

// @Input() set targetId(value: number) { 
//     this.detailed = this.all;
//     if (value > 0) this.getApprovalTrail(value); 
// }



	list: any = {
		casaAccounts: [],
		loanSystemTypes: [],
		operationTypes: [],
		interestFrequencyTypes: [],
		principalFrequencyTypes: [],
		feeCharges: [],
	};
	feeCharges: any[]=[];
	casaAccounts: any[]=[];
	applicationCollection: any[] = [];
	applicationForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private reviewService: LoanReviewApplicationService,
    private loanOperationService: LoanOperationService,
    private casaSrv: CasaService,
    ) { }

  ngOnInit() {
this.getAllSelectList();
this.clearApplicationForm();
    
  }
  getAllSelectList(): void {
    this.loadingService.show();
    this.reviewService.getAllSelectList().subscribe((response: any) => {
        this.list = response.result;
        ////console.log('list--',this.list);
        this.feeCharges = this.list.feeCharges;

        this.loadingService.hide();
    }, (err) => {
        this.loadingService.hide(1000);
    });
}
getLoanCustomerAccounts( customerId:number, currencyId: number) {
  this.casaSrv.getAllCustomerAccountByCustomerIdandCurrency(customerId,currencyId).subscribe((data) => {
      this.casaAccounts = data.result;
      ////console.log('customerAccounts',this.customerAccounts)
  }, err => { });
}
clearApplicationForm() {
  this.applicationForm = this.fb.group({
      chargeFee: ['', Validators.required],
      description: ['', Validators.required],
      casaAccount: ['', Validators.required],
      feeAmount: ['', Validators.required],

  });
}

collectionId: number = 0;

addApplicationCollection(form) {
	//const operation = this.list.operationTypes.find(x => x.id == form.value.operationTypeId);
	const feeName = this.list.feeCharges.find(x=>x.id == form.value.chargeFee)
	const casaAccount = this.casaAccounts.find(x=>x.casaAccountId == form.value.casaAccount)
	//const feeAmount = (this.amount * form.value.feeAmount)/100;
	const feeAmount = this.isRate == true ? (this.amount * form.value.feeAmount)/100 : Number(
	form.value.feeAmount.replace(/[,]+/g, "").trim()
);

  this.applicationCollection.push({
      id: this.collectionId++,
      loanId: this.selectedLoanId,
      loanSystemTypeId: this.loanSystemTypeId,
      casaAccount: form.value.casaAccount,
      chargeFeeId: form.value.chargeFee, // change
      casaAccountName: casaAccount == null ? 'n/a' : casaAccount.productAccountNumber,
      chargeFee: feeName == null ? 'n/a' : feeName.name,
      description: form.value.description,
      feeAmount: this.isRate == false ? Number(
        form.value.feeAmount.replace(/[,]+/g, "").trim()
      ) : feeAmount,
      feeRate: this.isRate == true ? form.value.feeAmount : 0,

  });
  this.applicationCollection = this.applicationCollection.slice();
  this.takeFees.emit(this.applicationCollection);  
  this.clearApplicationForm();
}


validateSubAllocationTranche(form) { //THIS SHOULD HAPPEN AT THE API
  this.addApplicationCollection(form);
}

removeApplicationCollection(row) {
  const index = this.applicationCollection.findIndex(x => x.chargeFeeId == row.chargeFeeId);
  this.applicationCollection.splice(index, 1);
  this.applicationCollection = this.applicationCollection.slice();
  this.takeFees.emit(this.applicationCollection);  
}

restrictNumber(e) { 
  var x = e.target.value;
    if(x > 100 || x < 0){
      this.applicationForm.controls['feeAmount'].setValue(null);
      const applicationFormControl = this.applicationForm.get('feeAmount');
      applicationFormControl.setValidators(Validators.required);
      applicationFormControl.updateValueAndValidity();          
  }
  }

  isRate: boolean =false;
  record: any;
  onChargeFeeChange(event){
      let chargeFeeId = event;
      this.reviewService.getChargeFeeDetails(chargeFeeId).subscribe((response: any) => {
      this.record = response.result;
     // console.log(this.record );
      if (this.record.feeTypeId == 1 || this.record.feeTypeId == 5){
          this.isRate =true;
          this.applicationForm.controls['feeAmount'].setValue(this.record.rate);

      }else{
          this.isRate =false;
          this.applicationForm.controls['feeAmount'].setValue(this.record.amount);

      }
      //console.log(this.isRate );

      }, (err) => {
      });
  }
}
