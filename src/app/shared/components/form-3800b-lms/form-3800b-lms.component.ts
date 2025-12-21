import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-form-3800b-lms',
  templateUrl: './form-3800b-lms.component.html',
 // styleUrls: ['./form-3800b-lms.component.scss']
})
export class Form3800bLmsComponent implements OnInit {
  ready = false;
  reportSource: SafeResourceUrl;
  @Input() applicationReferenceNumber:any;
  documentations: any;

  constructor(      private sanitizer: DomSanitizer,
    private reportServ: ReportService,
    private loadingService: LoadingService,
 
    
    ) { }

  ngOnInit() {
    this.form3800b(this.applicationReferenceNumber);
  }

  form3800b(applicationReferenceNumber): void {
    if (applicationReferenceNumber != null) {
        
        let path = '';
        const data = {
            applicationRefNumber:applicationReferenceNumber,

        }

        this.reportServ.printLMSForm3800BLMS(data.applicationRefNumber).subscribe((response: any) => {
           // path = response.result;
            //this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
             this.documentations = response.result;
            this.ready = true;
            this.loadingService.hide();
            
        });

        return;
    }
   
}
}
