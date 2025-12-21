import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalService, BranchService } from 'app/setup/services';
import { LoanApplicationService } from 'app/credit/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { ReportService } from '../service/report.service';

@Component({
  selector: 'app-risk-asset-by-ifrs-classification',
  templateUrl: './risk-asset-by-ifrs-classification.component.html',
  styleUrls: ['./risk-asset-by-ifrs-classification.component.scss']
})

export class RiskAssetByIfrsClassificationComponent implements OnInit {
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
  RiskAssetByIfrsClassificationForm: FormGroup;
 
  constructor(private approvalSer: ApprovalService, private loadingService: LoadingService,
    private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
    private reportServ: ReportService, private branchService: BranchService, private fb: FormBuilder) {
      
     }

    ngOnInit() {
    this. RiskAssetByIfrsClassificationForm = this.fb.group({
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
      
       this.reportServ.GetRiskAssetByIFRSClassificationReport(body).subscribe((response: any) => {
         path = response.result;
         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
         this.displayTestReport = true;
      });
      this.loadingService.hide(10000);
      this.displayReport = true;
      return;
    
  }

  clearInput() {
   
    this.RiskAssetByIfrsClassificationForm.setValue({
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

