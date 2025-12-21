import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoanApplicationService } from '../../../credit/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from 'app/reports/service/report.service';

@Component({
  selector: 'app-valid-collateral',
  templateUrl: './valid-collateral.component.html',
  styleUrls: ['./valid-collateral.component.scss']
})
export class ValidCollateralComponent implements OnInit {
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
  validCollateralsReportForm: FormGroup;

  constructor(private approvalSer: ApprovalService, 
              private loadingService: LoadingService,
              private loanApplicationSer: LoanApplicationService, 
              private sanitizer: DomSanitizer,
              private reportServ: ReportService, 
              private branchService: BranchService, 
              private fb: FormBuilder) { }

  ngOnInit() {
    this.validCollateralsReportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
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
      startDate: form.value.startDate,
      endDate: form.value.endDate,
    }

    this.reportServ.getValidCollateralsReport(body).subscribe((response: any) => {
      path = response.result;
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
      this.displayTestReport = true;
    });

    this.loadingService.hide(10000);
    this.displayReport = true;
    return;
  }

  clearInput() {
    this.validCollateralsReportForm.setValue({
      startDate: null,
      endDate: null,
    });

    this.displayReportArea = false;
    this.displayReportSearch = true;
    this.displayReport = false
  }

}
