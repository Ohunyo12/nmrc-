import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanOperationService } from '../../services';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-loan-camsol',
  templateUrl: './loan-camsol.component.html',
})
export class LoanCamsolComponent implements OnInit {
  targetCustomer: any;
  viewCusotmerDetail: boolean;
  customerLoanCamsol: any;
  loanCamsolType: any;
  loanCamsolValue: any;
  entityName: any;
  loanCamsolData: any;
  camsolForm: FormGroup;
  viewDetail: boolean;
  searchValue: any;
  camsoltypeid: any;
  customercode: any;
  updateOption: boolean;
  response: any;
  collapseForm: boolean = true;
  failedUpload: any;
  uploadedData: any;
  files: FileList;
  file: File;
  headerText: string = 'Written-off Accounts List';

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanOperationService: LoanOperationService,
  ) { }

  ngOnInit() {
    this.viewDetail = false;
  }

  getCamsolPropeties() {
    this.camsolForm = this.fb.group({
      customercode: ['', Validators.required],
      loanid: ['', Validators.required],
      balance: ['', Validators.required],
      date: ['', Validators.required],
      loansystemtypeid: ['', Validators.required],
      customername: ['', Validators.required],
      principal: ['', Validators.required],
      interestinsuspense: ['', Validators.required],
      camsoltypeid: ['', Validators.required],
      accountnumber: ['', Validators.required],
      accountname: ['', Validators.required],
      remark: ['', Validators.required],
      cantakeloan: ['', Validators.required],
    });
  }

  GetLaonCamsol() {
    this.loadingService.show();
    this.loanOperationService.getAllCamsol()
      .subscribe(results => {
        this.loanCamsolData = results.result;

      });
    this.loadingService.hide();
  }
  ViewLaonCamsolById(id) {
    this.loadingService.show();
    this.loanOperationService.getAllCamsolByCamsolTypeId(id)
      .subscribe(results => {
        this.loanCamsolValue = results.result;
        this.viewDetail = true;
        this.entityName = this.loanCamsolData.loansystemtype;
        this.loadingService.hide();
      });
  }

  GetLaonCamsolByType(id) {
    this.loadingService.show();
    this.loanOperationService.getLoanCamsolTypeId(id)
      .subscribe(results => {
        this.loanCamsolData = results.result;
        this.loadingService.hide();
      });
  }

  GetLaonCamsolType() {
    this.loanOperationService.getLoanCamsolType()
      .subscribe(results => {
        this.loanCamsolType = results.result;
      });
  }

  GetAllSearchCamsol() {
    if (this.searchValue != null) {
      this.loadingService.show();
      this.loanOperationService.getAllSearchCamsol(this.searchValue).subscribe(results => {
        this.loadingService.hide();
        if (results.result.length == 0) {
          this.loanCamsolData = results.result;
          //console.log('loanCamsolData',this.loanCamsolData);
          swal('FinTrak Credit 360', "No matching record found! : ", 'warning');
        } else {
          this.loanCamsolData = results.result;
          //console.log('loanCamsolData',this.loanCamsolData);
        }
      });
    } else {
      swal('FinTrak Credit 360', "Search parameter is required : ", 'error');

    }
  }

  GetLaonCamsolById() {
    if (this.searchValue != null) {
      this.loanOperationService.getAllSearchCamsol(this.searchValue)
        .subscribe(results => {
          this.loanCamsolData = results.result;
          this.targetCustomer = this.searchValue;
          // this.entityName = this.loanCamsolData.loansystemtype;

        });
    } else {
      swal('FinTrak Credit 360', "Search parameter is required : ", 'error');

    }
  }

  EditLaonCamsolByCustomerName(customercode) {

    this.loadingService.show();
    this.loanOperationService.getLoanCamsolByCostomerCode(customercode)
      .subscribe(results => {
        this.customerLoanCamsol = results.result;

        this.loadingService.hide();
        this.viewCusotmerDetail = true;
      });
  }



  ApproveLoan() {
    var __this = this;
    swal({
      title: 'Are you sure?',
      text: ' This process will go through approvals. Are you sure you want to proceed?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success btn-move',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,

    }).then(function () {

      const data = {
        customercode: __this.customerLoanCamsol[0].customercode,
        updateOption: __this.updateOption
      }


      __this.loadingService.show();

      __this.loanOperationService.approveLoan(data)
        .subscribe(results => {
          __this.response = results.result;
          if (results.success) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, __this.response, 'success');
          } else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, results.message, 'error');
          }

          __this.loadingService.hide();
          __this.EditLaonCamsolByCustomerName(__this.searchValue);
          __this.searchValue = "";
          __this.viewCusotmerDetail = false;


        });

      // this.displayModalForm = false;
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });

  }
  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }
  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }
  collapseSearchForm(flag: boolean) {
    this.collapseForm = flag;
    if (flag) this.headerText = 'Camsol List';
    else this.headerText = 'Camsol Bulk Upload';
  }
  uploadCamsolFile() {
    this.loadingService.show();
    if (this.file != undefined || this.file != null) {
      let body = {
        loanReferenceNumber: '',
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
      };
      this.loanOperationService.uploadCamsolFile(this.file, body).then((res: any) => {
        if (res.success == true) {
          if (res.result != undefined || res.result != null) {
            res.result.commitedRows == undefined ? this.uploadedData = []
              : this.uploadedData = res.result.commitedRows;

            res.result.discardedRows == undefined ? this.failedUpload = []
              : this.failedUpload = res.result.discardedRows;

            this.loadingService.hide();
            if (res.result.commitedRows.length <= 0 && res.result.discardedRows.length > 0) {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Camsol upload failed' + '\n' + 'See log for more info', 'warning');
            }
            else if ((res.result.commitedRows.length > 0) && (res.result.discardedRows.length > 0)) {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Upload was successful but some records failed to upload', 'info');
            }
            else {
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'info');
            }
          }
        } else {
          if (res.result != null || res.result != undefined) {
            this.uploadedData = res.result.commitedRows;
            this.failedUpload = res.result.discardedRows;
          }

          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
      }, (error) => {
        this.loadingService.hide();
        swal('Bulk Camsol Upload', JSON.stringify(error) ? JSON.stringify(error) : 'uploading multiple camsol generated error', 'error')
      });
    } {
    }
  }
}
