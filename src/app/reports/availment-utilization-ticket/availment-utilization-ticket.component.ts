import { LoadingService } from './../../shared/services/loading.service';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';

@Component({
  selector: 'app-availment-utilization-ticket',
  templateUrl: './availment-utilization-ticket.component.html',
})
export class AvailmentUtilizationTicketComponent implements OnInit {

   ready = false;
   reportSource: SafeResourceUrl;
   @Input() customerId:any;
   @Input() loanApplicationDetailId:any;

  constructor(
      private sanitizer: DomSanitizer,
      private reportServ: ReportService
      ) { }

  ngOnInit() {
    this.getAvailmentUtilizationTicketReport();
  }

  // ngOnChanges() {
  //   this.getAvailmentUtilizationTicketReport();
  // }

  getAvailmentUtilizationTicketReport(): void {
    let path = '';
        this.reportServ.getAvailmentUtilizationTicketReport(this.loanApplicationDetailId).subscribe((response: any) => {
             path = response.result;
             this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
             this.ready = true;
        });
   }

}
