import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService } from '../../setup/services';
import { LoanApplicationService } from '../../credit/services';
import { ReportService } from '../service/report.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overline-report',
  templateUrl: './overline-report.component.html',
  //styleUrls: ['./overline-report.component.scss']
})
export class OverlineReportComponent implements OnInit {
  PAGEOPERATION = 6; 
  displayTestReport: boolean = false; 
  startDate: Date;   
  loanApplication: any[]; 
  displayReport: boolean = false; 
  reportSource: SafeResourceUrl;
  username?: any; BranchList: any[];
  searchResults: any;
  searchTerm$ = new Subject<any>();
  displaySearchModal: boolean = false;
  displayReportArea: boolean = false;
  displayReportSearch: boolean = true;
  AuditTypeSearched: any;
  auditTypeId: any;
  stagingSearch: any;
  overlineReportForm: FormGroup;

  constructor(private approvalService: ApprovalService, 
              private loadingService: LoadingService,
              private loanApplicationService: LoanApplicationService, 
              private sanitizer: DomSanitizer,
              private reportService: ReportService, 
              private branchService: BranchService, 
              private fb: FormBuilder) { }

  ngOnInit() {
    this.overlineReportForm = this.fb.group({
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
      
      this.reportService.getOverlineReport(body).subscribe((response: any) => {
        path = response.result;
        this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.displayTestReport = true;
      });

      this.loadingService.hide(10000);
      this.displayReport = true;

      return;
  }

  clearInput() {
   
    this.overlineReportForm.setValue({
      misCode: null,
      level:  null,
      runDate: null,
      exposureType: null,
      divisionName: null,
      groupName: null,
      branchName: null,
      regionName: null   
    });

    this.displayReportArea = false;
    this.displayReportSearch = true;
    this.displayReport = false
  }

}
