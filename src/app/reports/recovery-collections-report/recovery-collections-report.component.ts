import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../shared/services/loading.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from '../service/report.service';


@Component({
  selector: 'app-recovery-collections-report',
  templateUrl: './recovery-collections-report.component.html'
})
export class RecoveryCollectionsReportComponent implements OnInit {

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
  RemedialAssetsReportForm: FormGroup;

  constructor(private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private reportServ: ReportService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.RemedialAssetsReportForm = this.fb.group({
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

    this.reportServ.GetRecoveryCollectionReport(body).subscribe((response: any) => {
      path = response.result;
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
      this.displayTestReport = true;
    });

    this.loadingService.hide(10000);
    this.displayReport = true;
    return;
  }

  clearInput() {
    this.RemedialAssetsReportForm.setValue({
      startDate: null,
      endDate: null,
    });

    this.displayReportArea = false;
    this.displayReportSearch = true;
    this.displayReport = false
  }

}


