import { log } from 'util';
import { saveAs } from 'file-saver';
import { EndOfDayService } from '../../services';
import { CountryStateService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanService } from 'app/setup/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Pipe } from '@angular/core';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-public-holiday',
  templateUrl: './end-of-day.component.html',
})
export class EndOfDayProcessComponent implements OnInit {
  publicHolidays: any[];
  endOfDay: any[];
  schedules:any[];
  scheduleMonitoring:any[];
  selectedId: number = null;
  entityName: string = "New Public Holiday";
  holidayForm: FormGroup;
  eodForm: FormGroup;
  nextCurrentDate: Date;
  lastEODRefreshDate:Date;
  displayAddModal: boolean = false;
  displayScheduleModalForm: boolean = false;
  countries: any[];
  currentDate: Date = new Date;
  show: boolean = false; 
  message: any; 
  title: any; 
  cssClass: any;
  EndOfDayData:any[];
  id: any;

  timeLeft: number = 60;
  interval;

  constructor(private loanService: LoanService,private loadingService: LoadingService, private fb: FormBuilder,
    private countryStateSrv: CountryStateService, private eodService: EndOfDayService) { }

  ngOnInit() {
    this.getnextApplicationDate();
    this.getApplicationEODLastRefreshedDate();
    this.getAllPublicHoliday();
    this.getEndOfDay();
    this.getCountries();
    this.clearControls();
  }

  showAddModal() {
    this.clearControls();
    this.entityName = "New Public Holiday";
    this.displayAddModal = true;
  }

  getCountries() {
    this.countryStateSrv.getAllCountries()
      .subscribe((response: any) => {
        this.countries = response.result;
      });
  }

  getAllPublicHoliday(): void {
    this.loadingService.show();
    this.eodService.getPublicHoliday().subscribe((response: any) => {
      this.publicHolidays = response.result;

      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  
  getnextApplicationDate(): void {
    this.loadingService.show();
    this.eodService.getnextApplicationDate().subscribe((response: any) => {
      this.nextCurrentDate = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.finishBad(err.message);
      this.loadingService.hide(1000);
    });
  }
 
  getApplicationEODLastRefreshedDate(): void {
    this.loadingService.show();
    this.eodService.getApplicationEODLastRefreshedDate().subscribe((response: any) => {
      this.lastEODRefreshDate = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.finishBad(err.message);
      this.loadingService.hide(1000);
    });
  }
  
  getEndOfDay(): void {
    this.loadingService.show();
    this.eodService.getEndOfDay().subscribe((response: any) => {
      this.endOfDay = response.result;
      //console.log('Log', this.endOfDay);
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  runEodReload(){ console.log('Run EOD Reload Initiated ...')
    window.sessionStorage.setItem('eodActive','1');
    this.startTimer();
    this.runEod();
    this.getMonitoring();
    this.getEndOfDay();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.getMonitoring();
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    },1000)
  }


  pauseTimer() {
    clearInterval(this.interval);
  }


  getMonitoring(){
    this.getEndofdayOperationLogMonitoring();
  }


  getEndofdayOperationLogMonitoring(): void {
    //  let pipe = new DatePipe('en-US');
    //   let date = pipe.transform(eodDate, 'dd-MM-yyyy');
  
      let data = 
      { 
        eodDate:  new Date(),
      };
  
      //console.log("This Date Format ",data);
      //this.loadingService.show();
      this.eodService.getEndofdayOperationLogMonitoring().subscribe((response: any) => {
        this.scheduleMonitoring = response.result;
        //console.log("This Date Format ", this.schedules );
        //this.loadingService.hide();
      }, (err) => {
        //this.loadingService.hide(1000);
      });
    }

  getEndofdayOperationLog(eodDate): void {
  //  let pipe = new DatePipe('en-US');
  //   let date = pipe.transform(eodDate, 'dd-MM-yyyy');

    let data = 
    { 
      eodDate:  eodDate,
    };

    //console.log("This Date Format ",data);
    this.loadingService.show();
    this.eodService.getEndofdayOperationLog(data).subscribe((response: any) => {
      this.schedules = response.result;
      //console.log("This Date Format ", this.schedules );
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  isProcessInStarted: boolean = false;

  refreshLoanClassification() {
    let loading = this.loadingService;
    let srv = this.loadingService;
   // let dataObj = this.loanSelectedData;
   let data = 
    { 
     Date: new Date()
    };
    const __this = this;
    swal({
        title: 'Are you sure you want to Refresh Loan Classification?',
        text: 'You won\'t be able to revert this!',
        type: 'question',
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusCancel: false,
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
        __this.eodService.refreshLoanClassification().subscribe((response: any) => {
            __this.loadingService.hide();
            if (response.success === true) {
                __this.getnextApplicationDate();
                __this.getApplicationEODLastRefreshedDate();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            __this.isProcessInStarted = false;
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

 deactivateInactiveUsers() {
  let loading = this.loadingService;
  let srv = this.loadingService;
 // let dataObj = this.loanSelectedData;
 let data = 
  { 
   Date: new Date()
  };
  const __this = this;
  swal({
      title: 'Are you sure you want to Deactivate Inactive Users?',
      text: 'You won\'t be able to revert this!',
      type: 'question',
      allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusCancel: false,
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
      __this.eodService.deactivateInactiveUsers().subscribe((response: any) => {
          __this.loadingService.hide();
          if (response.success === true) {
              __this.getnextApplicationDate();
              __this.getApplicationEODLastRefreshedDate();
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          } else {
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
          }
          __this.isProcessInStarted = false;
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

logOutActiveUsers() {
    let loading = this.loadingService;
    let srv = this.loadingService;
   // let dataObj = this.loanSelectedData;
   let data = 
    { 
     Date: new Date()
    };
    const __this = this;
    swal({
        title: 'Are you sure you want to Log Out Active Users?',
        text: 'You won\'t be able to revert this!',
        type: 'question',
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusCancel: false,
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
        __this.eodService.logOutActiveUsers().subscribe((response: any) => {
            __this.loadingService.hide();
            if (response.success === true) {
                __this.getnextApplicationDate();
                __this.getApplicationEODLastRefreshedDate();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            __this.isProcessInStarted = false;
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


  runEodBukPosting() {
    let loading = this.loadingService;
    let srv = this.loadingService;
   // let dataObj = this.loanSelectedData;
   let data = 
    { 
     Date: new Date()
    };
    const __this = this;
    swal({
        title: 'Are you sure you want to Refresh Flexcube Bulk Posting?',
        text: 'You won\'t be able to revert this!',
        type: 'question',
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusCancel: false,
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
        __this.eodService.runEodBukPosting().subscribe((response: any) => {
            __this.loadingService.hide();
            if (response.success === true) {
                __this.getnextApplicationDate();
                __this.getApplicationEODLastRefreshedDate();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            __this.isProcessInStarted = false;
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


 
//  changeApplicationDate() {
//   let loading = this.loadingService;
//   let srv = this.loadingService;
//  // let dataObj = this.loanSelectedData;
//  let data = 
//   { 
//    Date: new Date()
//   };
//   const __this = this;

//   swal({
//       title: 'Are you sure you want to change application date?',
//       text: 'You won\'t be able to revert this!',
//       type: 'question',
//       allowEnterKey: false,
//       allowEscapeKey: false,
//       allowOutsideClick: false,
//       focusCancel: false,
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'No, cancel!',
//       confirmButtonClass: 'btn btn-success btn-move',
//       cancelButtonClass: 'btn btn-danger',
//       buttonsStyling: true,
//   }).then(function () {
     
//    // __this.loadingService.show();
      
    
//     __this.eodService.changeApplicationDate(data).subscribe((response: any) => {
//           //__this.loadingService.hide();
          
//           if (response.success === true) {
//               __this.getnextApplicationDate();
            
//               swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
//           } else {
//               swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
//           }
          
//           this.pauseTimer();
          
//           __this.isProcessInStarted = false;
//       }, (err) => {
//          // __this.loadingService.hide();
//           swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
//       });


//   }, function (dismiss) {
//       if (dismiss === 'cancel') {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
//       }
//   });
// }


  runEod() {
    let loading = this.loadingService;
    let srv = this.loadingService;
   // let dataObj = this.loanSelectedData;
   let data = 
    { 
     Date: new Date()
    };
    const __this = this;

    swal({
        title: 'Are you sure you want to run End of day?',
        text: 'You won\'t be able to revert this!',
        type: 'question',
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusCancel: false,
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
        
     // console.log('You accepted to run ...')
      __this.eodService.runEodOperation(data).subscribe((response: any) => {
            __this.loadingService.hide();
            
            if (response.success === true) {
                __this.getnextApplicationDate();
                __this.getApplicationEODLastRefreshedDate();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            
            __this.pauseTimer();
            
            __this.isProcessInStarted = false;
        }, (err) => {
           __this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        },()=>{
          window.sessionStorage.removeItem('eodActive');
        });


    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
 }

  runEod_() {
    let data = { 
      Date: new Date()
    };

    this.isProcessInStarted = true;
    this.loadingService.show();
    this.eodService.runEodOperation(data).subscribe((res) => {
        if (res.success == true) 
        {
          this.getnextApplicationDate();
          this.getApplicationEODLastRefreshedDate();
          this.loadingService.hide();
          this.finishGood( res.message +"\n"+" New Application date: "+ this.nextCurrentDate);
        } 
        else 
        {
          this.finishBad( res.message);
          this.loadingService.hide();
        }
        this.isProcessInStarted = false;

      }, (err: any) => {
        this.loadingService.hide();
      });
      this.isProcessInStarted = false;
  }

  isWeekendProcessStarted: boolean = false;
  loadWeekends() 
  {
    let data = 
    { 
      Date: new Date()
    }

    this.loadingService.show();
    this.isWeekendProcessStarted = true;

    this.eodService.loanYearWeekends(data).subscribe((res) => {
        if (res.success == true) 
        {
          this.loadingService.hide();
          this.finishGood( res.message);
        } 
        else 
        {
          this.finishBad( res.message);
          this.loadingService.hide();
        }
        this.isWeekendProcessStarted = false;
      }, 
      (err: any) => {
        this.loadingService.hide();
      });
      this.isWeekendProcessStarted = false;
  }

  submitForm(formObj) 
  {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) 
    {
      this.eodService.save(bodyObj).subscribe((res) => {
        if (res.success == true) 
        {
          this.finishGood(res.message);
          this.getAllPublicHoliday();
          this.displayAddModal = false;
        } 
        else 
        {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else 
    {
      this.eodService.update(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) 
        {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllPublicHoliday();
          this.displayAddModal = false;
        } 
        else 
        {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }

  clearControls() 
  {
    this.selectedId = null;
    this.holidayForm = this.fb.group({
      publicHolidayId: [''],
      date: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.eodForm = this.fb.group({
      eodDate: [new Date, Validators.required],
      });

  }

  finishBad(message) 
  {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) 
  {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }

  showMessage(message: string, cssClass: string, title: string) 
  {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  hideMessage(event) 
  {
    this.show = false;
  }

 
  editHoliday (index) 
  {
    this.entityName = "Edit Public Holiday";
    var row = this.publicHolidays[index];
    this.selectedId = row.publicHolidayId;

    this.holidayForm = this.fb.group({
      publicHolidayId: [row.publicHolidayId],
      date: [new Date(row.date), Validators.required],
      countryName: [row.countryName],
      description: [row.description, Validators.required],
    });
    this.displayAddModal = true;
  }

  editLog (date) 
  {
    this.displayScheduleModalForm = true;
    this.getEndofdayOperationLog(date);
  }


  delete(id): void {
    const __this = this;

    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'question',
      allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        focusCancel: false,
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
      
      __this.eodService.delete(id).subscribe((response: any) => {
        __this.message = response.result;
        __this.loadingService.hide();
        __this.getAllPublicHoliday();
          
      }, (err: any) => {
          swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
          __this.loadingService.hide();
      });
  }, function (dismiss) {
      if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
  });

}



ExportToExcel(currentData){
  
  //console.log("currentData",currentData);
 
  this.loadingService.show();
  
  // let data ={
  //   date:currentData.date,
  //   eodStatus:currentData.eodStatus,
  //   status : currentData.status,
  //   }

    this.loanService.getEODErrorLog(currentData).subscribe((response: any) => {
      let doc = response.result;

      if (doc.length != 0) {
        let excel = doc;
         
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
         
     }  
     this.loadingService.hide();
    })

}

}
