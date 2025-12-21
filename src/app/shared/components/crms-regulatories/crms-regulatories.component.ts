import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoanService } from 'app/credit/services/loan.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { saveAs } from 'file-saver';
@Component({
  selector: 'crms-regulatories',
  templateUrl: './crms-regulatories.component.html',
  //styleUrls: ['./crms-regulatories.component.scss']
})
export class CrmsRegulatoriesComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  templateTypeId:number
  crmsForm: FormGroup;
  crmsFacilityDetail:any;
  crmsCode = '';
  crmsDate:any;
  count:any;

  @Input() set loanId(value: number) {
    if(value > 0){
      this._loanId = value;
      this.GetCrmsCode(true);
    }
  }
  _loanId = 0;
  @Input() isLms = false;

  @Input() loanSystemTypeId:any;
  @Input() hideTab:boolean;
  @Input() menuPage:boolean;
  @Output() success: EventEmitter<any> = new EventEmitter<any>();

  systemResponse: any;
  CRMSLoan: any;
  document: any;
  constructor(private fb:FormBuilder,private loanService: LoanService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    
  }

	GetCrmsCode(init = false) {
		let data = {
		loanId: this._loanId,
		isLms: this.isLms,
		};
		this.loadingService.showKeyApiCall();
		this.loanService.getCRMSData(data).subscribe((response: any) => {
			if (response.success == true) {
				this.crmsCode = response.result;
			} else {
				if(!init){
					this.finishBad(response.message);
				}
			}   
			this.loadingService.hideKeyApiCall();
		}, (err: any) => {    
			this.finishBad(err);
			this.loadingService.hideKeyApiCall(1000);
		});
	}

  ResetCrmsCode(){
    let __this = this;
    swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to reset the CRMS Code?',
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
    let data = {
      loanId: __this._loanId,
      isLms: __this.isLms,
    };
    __this.loadingService.show();
    __this.loanService.resetCrmsCode(data).subscribe((response: any) => {
      if (response.success == true) {
        __this.finishGood(response.message);
        __this.GetCrmsCode();
      } else {
        __this.finishBad(response.message);
      }   
      __this.loadingService.hide();
    }, (err: any) => {    
      __this.finishBad(err);
      __this.loadingService.hide(1000);
    });
  }, function (dismiss) {
    if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        __this.success.emit(false);  
    }
  });
  }

	GetFacilities():void {
		let data = {
			startDate : this.startDate,
			endDate : this.endDate,
			isLms: this.isLms,
		}
        this.loadingService.show();
		this.loanService.getAllLoanWithCRMSLoan(data).subscribe((response: any) => {
			this.loadingService.hide();
			if(response.result.length>0)
			{
				this.crmsFacilityDetail = response.result;
				this.count = response.count;
				
			}else{
				swal(`${GlobalConfig.APPLICATION_NAME}`, 'No Record Found', 'warning');
			}
				
		}, (err: any) => {    
			this.loadingService.hide(1000);
		  });  
	}

  InitiateCRMSForm(){
  this.crmsForm = this.fb.group({

  })
  }
  AddCBNCode(){

    
    
  }

  templateIdHasValue(): boolean{
    return this.templateTypeId > 0;
  }


  AddCRMSCode(){
    let __this = this;
    swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to assign this CRMS Code?',
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
  
      let data = {
      crmsCode:__this.crmsCode,
      loanId:__this._loanId,
      crmsDate:__this.crmsDate,
      isLms: __this.isLms,
      loanSystemTypeId:__this.loanSystemTypeId
    };
    __this.loanService.addCRMScode(data).subscribe((response: any) => {
      if (response.success == true) {
        swal(GlobalConfig.APPLICATION_NAME, 'Code Added Successfully, ' + response.result, 'success');
         __this.systemResponse = response.result;
         __this.success.emit(true);  
      __this.loadingService.hideKeyApiCall();
    } else {
        __this.finishBad(response.message);
        // __this.success.emit(false);  
        __this.loadingService.hideKeyApiCall(1000);
    }   

  }, (err: any) => {    
    __this.finishBad(err);
    // this.success.emit(false);  
    __this.loadingService.hideKeyApiCall(1000);
  });  
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            this.success.emit(false);  
        }
    });
          
  }
  show: boolean = false; message: any; title: any; cssClass: any; // message box

  hideMessage(event) { this.show = false; }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
  }

  finishGood(message) {
    this.showMessage(message, 'success', "FintrakBanking");
  }

showMessage(message: string, cssClass: string, title: string) {
  this.message = message;
  this.title = title;
  this.cssClass = cssClass;
  this.show = true;
}
  ExportToExcel(){

    this.loadingService.show();

    let data ={
      crmsCode:this.crmsCode,
      loanId:this._loanId,
      crmsDate:this.crmsDate,
      loanSystemTypeId:this.loanSystemTypeId,
      startDate:this.startDate,
      endDate:this.endDate,
      templateTypeId : this.templateTypeId

    }

    this.loanService.exportCRMSReportToExcel(data).subscribe((response: any) => {
      let doc = response.result;
    

       if (doc.length != 0) {
         let excel = doc
        // doc.forEach(excel => {
          
          var byteString = atob(excel.reportData);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);
      
          try {
              var file = new File([bb], excel.templateTypeName, {type: 'application/vnd.ms-excel' });
              saveAs(file);
          } catch (err) {
              var textFileAsBlob = new Blob([bb], {type: 'application/vnd.ms-excel' });
              window.navigator.msSaveBlob(textFileAsBlob, excel.templateTypeName+'.xlsx');
          }
        // });
        
      }  
     this.loadingService.hide();
    });
    this.loadingService.hide();

  }


}
