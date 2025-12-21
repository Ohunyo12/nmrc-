import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
// import { CasaService } from 'app/customer/services/casa.service';
import { CasaService } from "../../customer/services/casa.service";
import swal from 'sweetalert2';
import { GlobalConfig } from '../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CreditAppraisalService } from '../services/credit-appraisal.service';

@Component({
  selector: 'app-consumer-protection',
  templateUrl: './consumer-protection.component.html',
  styleUrls: ['./consumer-protection.component.scss']
})
export class ConsumerProtectionComponent implements OnInit {

  consumerProtectionForm: FormGroup;
  consumerProtectionId: any;
  consumerProtections: any;
  displayConsumerProtectionForm: boolean = false;
  displayConsumerProtectionMemo: boolean = false;
  OPERATION_ID: number = 271;
  appendForm: FormGroup;

  sectionContent: any;
  sectionDescription: any = '';
  documentationSections: any[] = [];
  applicationListData: any[] = [];
  editMode: boolean = false;
  selectedSectionId: number = null;
  selectedSectionIdIndex: number = null;
  documentSectionForm: FormGroup;
  documentations: any[] = [];
  selectedId: number = null;
  private subscriptions = new Subscription();
  documentTemplates: any;
  showLoadDocumentModal: boolean = false;
  displayAppendModal: boolean;
  displayConsumerProtectionModal: boolean = false;
  isThirdPartyFacility: boolean = false;
  displayDocumentation: boolean = false;

  constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
    private casaService: CasaService,
    private camService: CreditAppraisalService) { }

  ngOnInit() {
    this.clearControlsa();
    this.loadCasaForm();
    this.getAllConsumerProtections();
  }

  clearControlsa() {
    this.selectedId = null;
    this.documentSectionForm = this.fb.group({
      sectionId: ['', Validators.required],
    });

    this.appendForm = this.fb.group({
      creditTemplateId: ['', Validators.required],
    });
  }

  loadDocumentTemplate(form) {
    const body = {
      templateId: form.value.creditTemplateId,
      operationId: this.OPERATION_ID,
      targetId: this.consumerProtectionId,
    }

    this.loadingService.show();
    this.subscriptions.add(
      this.camService.loadDocumentTemplate(body).subscribe((response: any) => { // heavy call!
        this.loadingService.hide();
        this.getLoadedDocumentationConsumerProtection(this.consumerProtectionId, this.OPERATION_ID);
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }


  addNewConsumerProtection() {
    this.displayConsumerProtectionForm = true;
  }

  viewConsumerProtectionMemo(row) {
    this.consumerProtectionId = row.consumerProtectionId;
    this.displayConsumerProtectionModal = true;
    //this.getLoadedDocumentationConsumerProtection(row.consumerProtectionId, this.OPERATION_ID);
    //this.displayConsumerProtectionMemo = true;
  }

  onDocumentSectionChange(sectionId) {
    this.loadingService.show();
    this.subscriptions.add(
      this.casaService.getDocumentSectionConsumerProtection(this.OPERATION_ID, this.consumerProtectionId, sectionId).subscribe((response: any) => {
        if (response.result == null) return;
        this.editMode = response.result.editable;
        this.sectionContent = response.result.templateDocument;
        this.sectionDescription = response.result.description;
        this.selectedSectionId = sectionId;
        this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  ckeditorChanges: any;
  contentChange(updates) { this.ckeditorChanges = updates; }

  nextSection(direction) {
    const max = this.documentationSections.length - 1;
    let index = direction == 1 ? this.selectedSectionIdIndex - 1 : this.selectedSectionIdIndex + 1;
    if (index > max) index = 0;
    if (index < 0) index = max;
    const sectionId = this.documentationSections[index].sectionId;
    this.documentSectionForm.controls['sectionId'].setValue(sectionId);
    this.onDocumentSectionChange(sectionId);
  }

  saveSection(alert = false) {
    this.sectionContent = this.ckeditorChanges;
    const body = {
      templateDocument: this.sectionContent,
      sectionId: this.selectedSectionId
    };
    this.subscriptions.add(
      this.camService.saveSection(body).subscribe((response: any) => {
        this.ckeditorChanges = null;
        if (alert == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document saved!', 'success');
        }
      }));
  }

  loadCasaForm() {
    this.consumerProtectionForm = this.fb.group({
      loanAmount: ['', Validators.required],
      annualInterestRate: ['', Validators.required],
      totalFees: ['', Validators.required],
      insurance: ['', Validators.required],
      termOfLoanInYears: ['', Validators.required],
      loanAPR: ['', Validators.required],
      monthlyPayment: ['', Validators.required],
      numberOfPayments: ['', Validators.required],
      totalFeesAndCharges: ['', Validators.required],
      actualAmountBorrowed: ['', Validators.required],
    });
  }

  submitConsumerProtection(consumerProtectionForm) {
    let body = {
      loanAmount: consumerProtectionForm.value.loanAmount,
      annualInterestRate: consumerProtectionForm.value.annualInterestRate,
      totalFees: consumerProtectionForm.value.totalFees,
      insurance: consumerProtectionForm.value.insurance,
      termOfLoanInYears: consumerProtectionForm.value.termOfLoanInYears,
      loanAPR: consumerProtectionForm.value.loanAPR,
      monthlyPayment: consumerProtectionForm.value.monthlyPayment,
      numberOfPayments: consumerProtectionForm.value.numberOfPayments,
      totalFeesAndCharges: consumerProtectionForm.value.totalFeesAndCharges,
      actualAmountBorrowed: consumerProtectionForm.value.actualAmountBorrowed,
    }

    this.loadingService.show();
    this.casaService.addConsumerProtection(body).subscribe(response => {
      this.loadingService.hide();

      if (response.success == true) {
        this.consumerProtectionId = response.result;
        this.displayConsumerProtectionForm = false;
        this.getAllConsumerProtections();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
      } else {
        this.displayConsumerProtectionForm = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }

      // this.showSubmitModal = false;
    });
  }

  getAllConsumerProtections(): void {
    this.loadingService.show();
    this.casaService.getAllConsumerProtections().subscribe((response: any) => {
      this.loadingService.hide();
      this.consumerProtections = response.result;
    });
  }

  getLoadedDocumentationConsumerProtection(consumerProtectionId: number, operationId: number): void {
    this.loadingService.show();
    this.casaService.getLoadedDocumentationConsumerProtection(consumerProtectionId, operationId).subscribe((response: any) => {
      this.documentationSections = response.result;
      this.loadingService.hide();
      this.displayConsumerProtectionMemo = false;

      if (this.documentationSections.length < 1) {
        this.getDocumentTemplate(this.showLoadDocumentModal);
      }
    });
  }

  getDocumentTemplate(showLoadDocumentModal: boolean) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentTemplates(this.OPERATION_ID).subscribe((response: any) => {
        this.documentTemplates = response.result;
        this.displayConsumerProtectionMemo = showLoadDocumentModal;
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  previewDocumentation(print = false) {
    this.loadingService.show();
    this.subscriptions.add(
      this.casaService.getLoadedDocumentationConsumerProtection(this.consumerProtectionId, this.OPERATION_ID).subscribe((response: any) => {
        this.documentations = response.result;
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
        else setTimeout(() => this.print(), 1000);
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  closeDocumentation() {
    this.displayDocumentation = false;
    this.documentations = [];
  }

  print(): void {
    let printTitle = 'CONSUMER PROTECTION STATEMENT';
    let printContents, popupWin;
    let content = '<div class="row">';
    this.documentations.forEach(x => {
      content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
    });
    content = content + '</div>';

    printContents = content;// document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
        <head>
        <title style="font face: arial; size:12px">${printTitle}</title>
        <style>
        //........Customized style.......
        </style>
        </head>
        <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }

}
