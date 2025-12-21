import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalService, BranchService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanApplicationService } from 'app/credit/services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contigent-report',
  templateUrl: './contigent-report.component.html',
  styleUrls: ['./contigent-report.component.scss']
})

export class ContigentReportComponent implements OnInit {
  PAGEOPERATION = 6; 
  displayTestReport: boolean = false; 
  startDate: Date;   
  loanApplication: any[]; 
  displayReport: boolean = false; 
  reportSrc: SafeResourceUrl;
  username?: any; BranchList: any[];
  searchResults: any;
  searchTerm$ = new Subject<any>();
  displaySearchModal: boolean = false;
  displayReportArea: boolean = false;
  displayReportSearch: boolean = true;
  AuditTypeSearched: any;
  auditTypeId: any;
  stagingSearch: any;
  contigentReportForm: FormGroup;
 
  constructor(private approvalSer: ApprovalService, private loadingService: LoadingService,
    private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
    private reportServ: ReportService, private branchService: BranchService, private fb: FormBuilder) {
      
     }

    ngOnInit() {
    this.contigentReportForm = this.fb.group({
      misCode: ['', Validators.required],
      level:  ['', Validators.required],
      runDate: ['', Validators.required],
      exposureType: [''],
      divisionName: [''],
      groupName: [''],
      branchName: [''],
      regionName: ['']
  });

    this.startDate = new Date();
  }

  popoverSeeMore(form) {
    this.displayReportSearch = false;
    this.displayReportArea = true;
    this.loadingService.show();

      this.displayReport = true;
      let path = '';

     var body = {
          runDate: form.value.runDate,
          level: form.value.level,
          misCode: form.value.misCode,
          exposureType: form.value.exposureType,
          divisionName: form.value.divisionName,
          groupName: form.value.groupName,
          branchName: form.value.branchName,
          regionName: form.value.regionName
        }
      
       this.reportServ.GetRiskAssetsReport(body).subscribe((response: any) => {
         path = response.result;
         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
         this.displayTestReport = true;
      });
      this.loadingService.hide(10000);
      this.displayReport = true;
      return;
    
  }

  clearInput() {
   
    this.contigentReportForm.setValue({
      misCode: null,
      level:  null,
      runDate: null,
      exposureType:null,
      divisionName: null,
      groupName: null,
      branchName: null,
      regionName: null   
    });
    this.displayReportArea = false;
    this.displayReportSearch = true;
    this.displayReport=false
  }
 
}