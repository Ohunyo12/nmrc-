import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig, ConvertString } from 'app/shared/constant/app.constant';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';

@Component({
  selector: 'app-recovery-reporting-retail',
  templateUrl: './recovery-reporting-retail.component.html'
})
export class RecoveryReportingRetailComponent implements OnInit {

  schemeSelection: any;
  loanOperationApprovalData: any[] = [];
  retailReportForm: FormGroup;
  PAGEOPERATION = 6;
  displayTestReport: boolean = false;
  startDate: Date;
  loanApplication: any[];
  displayReport: boolean = false;
  reportSrc: SafeResourceUrl;
  username?: any; 
  searchResults: any;
  searchTerm$ = new Subject<any>();
  displayReportSearch: boolean = false;
  displayCustomerField: boolean = false;
  stagingSearch: any;
  firstTransaction: any[] = [];
  secondTransaction: any[] = [];
  recoveryAgents: any[] = [];
  recoveryCustomers: any[] = [];


  show: boolean = false; message: any; title: any; cssClass: any; 
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private reportServ: ReportService, 
  ) {
    
  }

  ngOnInit() {
    this.agentList();
    this.retailReportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      consultant: ['', Validators.required],
      customer: [''],
    });

    this.startDate = new Date();
    
  }


  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood() {
    this.loadingService.hide();
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  hideMessage(event) {
    this.show = false;
  }

  popoverSeeMore(form) {
    this.loadingService.show();
    this.displayReportSearch = true;
    var start = new Date(form.value.startDate);
    var end = new Date(form.value.endDate);
    let startDate = JSON.stringify(start);
    let endDate = JSON.stringify(end);
    startDate = startDate.slice(1, 11);
    endDate = endDate.slice(1, 11);
    let accreditedConsultantId = form.value.consultant;
    let customerId = form.value.customer;

    this.reportServ.GetRetailRecoveryReport(startDate, endDate, accreditedConsultantId, customerId).subscribe((response: any) => {
      let statementList = response.result;
      this.firstTransaction = statementList;
    });

    this.loadingService.hide(10000);
    this.displayReport = true;
    return;
  }

  agentList() {
    this.loadingService.show();
    this.reportServ.GetAllRecoveryAgents().subscribe((response: any) => {
      this.recoveryAgents = response.result;
      this.loadingService.hide(10000);
    });
    this.loadingService.hide(10000);
    return;
  }

  customerList($event) {
    this.displayCustomerField = true;
    let agent = $event.target.value;
    this.loadingService.show();
    this.reportServ.GetAllRecoveryCustomersAssignedToAgent(agent).subscribe((response: any) => {
      this.recoveryCustomers = response.result;
      this.loadingService.hide(10000);
    });

    this.loadingService.hide(10000);
    return;
  }

  clearInput() {
    this.retailReportForm.setValue({
      startDate: null,
      endDate: null,
    });

  }

}
