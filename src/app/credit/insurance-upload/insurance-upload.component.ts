import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import {  AuthenticationService, ExchangeRateService } from 'app/admin/services';
import { CreditApprovalService } from 'app/credit/services';
import { ApprovalStatusEnum, GlobalConfig } from 'app/shared/constant/app.constant';
    
@Component({
    selector: 'bulk-insurance',
    templateUrl: 'insurance-upload.component.html',
})
    
export class InsuranceUploadComponent implements OnInit {
  username: string;
  systemDate: Date;
  collapseForm: boolean = false;
  displayLoanList: boolean = true;
  headerText: string = "Bulk Insurance Upload";
  pagetitle: string = "Bulk Insurance Upload";
  adAuthPassCode: string = null;

  currencies: any[] = [];
  userInfo: any;
  referredId: number;
  errorMessage: string = "";
  displayADAuth: boolean = false;

  uploadFileTitle: string = null;
  files: FileList;
  file: File;
  adActive: boolean = false;
  bulkUPload: boolean = false;
  buttonText: any;
  failedUpload: any;
  uploadedData: any[];
  uploadedFailedData: any[] = [];
  uploadedFailedError: any[];
  failedErrorSelection: any[];
  isFinal: boolean = false;
  excelData: any[] = [];
  bulkDisbursement: FormGroup;
  uploadSelection: any[];

  constructor(
    private fb: FormBuilder,
    private loadingSrv: LoadingService,
    private exchangeRateService: ExchangeRateService,
    private authService: AuthenticationService,
    private creditApprovalService: CreditApprovalService
  ) {}

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo();
    this.systemDate = this.userInfo.applicationDate;
    this.username = this.userInfo.userName;
    this.referredId = ApprovalStatusEnum.Referred;
  }

  getAllCurrencies() {
    this.exchangeRateService.getAllCurrencies().subscribe((response) => {
      this.currencies = response.result;
    });
  }

  data: any = {};
  // benjamin
  collapseSearchForm(flag: boolean) {
    this.collapseForm = flag;
    if (flag == true) {
      this.displayLoanList = true;
      this.headerText = "Disbursement List";
    } else {
      this.headerText = "Disbursement Bulk Upload";
      this.displayLoanList = false;
    }
  }

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }

  requestInsuranceBulk() {
    if (this.adActive) {
      this.buttonText = "Uploads Bulk Insurance";
      this.displayADAuth = true;
      this.bulkUPload = true;
    } else {
      this.adAuthPassCode = "";
      this.uploadBulkInsuranceFile();
    }
  }

  uploadBulkInsuranceFile() {
    this.loadingSrv.show();
    if (this.file != undefined || this.file != null) {
      let adAuthPassCode = btoa(this.adAuthPassCode);

      let body = {
        loanReferenceNumber: "",
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        loginStaffPassCode: adAuthPassCode,
        isFinal: this.isFinal,
      };

      this.creditApprovalService.uploadBulkInsuranceFile(this.file, body).then(
        (res: any) => {
          if (res.success == true) {
            this.collapseForm = false;
            this.loadingSrv.hide();
            swal("Fintrak Credit360", res.message, "success");
            this.uploadedData = res.result;
            //this.uploadedPassedData =  res.result.filter(x=>x.passed == true);
            //this.uploadedFailedData =  res.result.filter(x=>x.passed == false);
            this.uploadedFailedError = res.result.filter(x=>x.passed == false);
          } else {
            swal("Fintrak Credit360", res.message, "error");

            this.loadingSrv.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, "error");
          }
        },
        (error) => {
          this.loadingSrv.hide();
          swal(
            "Bulk Insurance Upload",
            JSON.stringify(error)
              ? JSON.stringify(error)
              : "uploading multiple bulk insurance generated error",
            "error"
          );
        }
      );
    } else {
      swal("Fintrak Credit360", "Please upload file", "error");
    }
    this.displayADAuth = false;
  }

  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  saveRecords() {
    const __this = this;
    swal({
      title: "Are you sure?",
      text: "Note: Only records with Validity Status passed would be saved. You won't be able to revert this!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingSrv.show();
        if (
          __this.uploadSelection == undefined ||
          __this.uploadSelection == null
        ) {
          __this.uploadSelection = __this.uploadedData;
        }

        //this.uploadSelection.forEach(item => {item.passed = true;});
        let recordsCounts = __this.uploadSelection.filter(
          (x) => x.passed == true
        );
        
        if (
          recordsCounts == null ||
          recordsCounts == undefined ||
          recordsCounts.length == 0
        ) {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "No record has passed. Kindly update your file and try again",
            "error"
          );
          __this.loadingSrv.hide(1000);
          return;
        }
        __this.creditApprovalService
          .saveMultipleInsurancePolicyRequests(__this.uploadSelection)
          .subscribe(
            (response) => {
              if (response.success === true) {
                swal(
                  `${GlobalConfig.APPLICATION_NAME}`,
                  response.message,
                  "success"
                );
                __this.uploadedData = null;
                __this.uploadSelection = null;
                __this.uploadedFailedError = null;
                __this.loadingSrv.hide(1000);
              } else {
                __this.loadingSrv.hide();
                swal(
                  `${GlobalConfig.APPLICATION_NAME}`,
                  response.message,
                  "error"
                );
              }
            },
            (err) => {
              __this.loadingSrv.hide();
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                JSON.stringify(err),
                "error"
              );
            }
          );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }
}
