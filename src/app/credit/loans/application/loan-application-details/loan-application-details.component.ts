// import { Component, OnInit } from '@angular/core';
// import { LoanService } from 'app/credit/services/loan.service';
// import { LazyLoadEvent } from 'primeng/primeng';
// import { LoadingService } from 'app/shared/services/loading.service';
// import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';

// @Component({
//     templateUrl: './loan-application-details.component.html'    
// })
// export class LoanApplicationDetailsComponent implements OnInit {
//     application: any[];  itemTotal: number = 0;
//     showLoadIcon: boolean = false;
//     constructor(private loanSer: LoanService,  private loadingService: LoadingService,
//          private camService: CreditAppraisalService) { }

//     ngOnInit() { 
//         this.getLoanDetails();
//     }

//     getLoanDetails(){
//         this.loanSer.getLoanDetails().subscribe((response: any) => {
//             this.application = response.result;
//         });
//     }

//      // lazyloading table

//      currentLazyLoadEvent: LazyLoadEvent;
     
//          loadData(event: LazyLoadEvent) {
//              this.getLoanApplications(event.first, event.rows);
//              this.currentLazyLoadEvent = event;
//          }
     
//          getLoanApplications(page: number, itemsPerPage: number) {
//              this.loadingService.show();
//              this.showLoadIcon = true;
//              this.camService.getLoanApplicationJobs(page, itemsPerPage).subscribe((response: any) => {
//                  this.itemTotal = response.count;
//                  this.application = response.result;
//                  this.showLoadIcon = false;
//                  this.loadingService.hide();
//              }, (err) => {
//                  this.loadingService.hide(1000);
//              });
//          }
     

// }