import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import {  AuthenticationService, ExchangeRateService } from 'app/admin/services';
import { CreditApprovalService } from 'app/credit/services';
import { ApprovalStatusEnum, GlobalConfig } from 'app/shared/constant/app.constant';
import { ValidationService } from './../../../../shared/services/validation.service';
    
@Component({
    selector: 'bulk-disbursement-approval',
    templateUrl: 'bulk-dibursement-approval.component.html',
})
    
export class BulkDisbursementApprovalComponent implements OnInit {
        username: string;
        systemDate: Date;
        collapseForm: boolean = false;
        displayLoanList: boolean = true;
        headerText: string = 'Bulk Loan Disbursement Approval';
        pagetitle: string ="Bulk Loan Disbursement Approval";
        adAuthPassCode: string = null;
        bulkApprovalForm: FormGroup;
        data: any = {};
        currencies: any[] = [];
        userInfo: any;
        referredId: number;
        errorMessage: string = '';
        displayADAuth: boolean = false;
    
        uploadFileTitle: string = null;
        files: FileList;
        file: File;
        adActive: boolean = false;
        bulkUPload: boolean= false;
        buttonText: any;
        failedUpload: any;
        uploadedData: any;
        isFinal: boolean =false;
        excelData: any[] = [];
        bulkDisbursement: FormGroup;
        disburseSelection: any;

        constructor(
            private fb: FormBuilder,
            private loadingSrv: LoadingService,
            private exchangeRateService: ExchangeRateService,
            private authService: AuthenticationService,
            private creditApprovalService: CreditApprovalService,
            private validationService: ValidationService,

        ) { }
    
        ngOnInit() {
            this.userInfo = this.authService.getUserInfo();
            this.systemDate = this.userInfo.applicationDate;
            this.username = this.userInfo.userName;
            this.referredId = ApprovalStatusEnum.Referred;

            this.getSavedBulkLoanDisbursement();
            this.bulkApprovalForm = this.fb.group({
                comment: ['', Validators.required],
                status: ['', Validators.compose([ValidationService.isNumber, Validators.required])],          
            });
        }
    
        getAllCurrencies() {
            this.exchangeRateService.getAllCurrencies().subscribe((response: any) => {
                this.currencies = response.result;
            });
        } 

        bulkLoanEntries: any;
        getSavedBulkLoanDisbursement() {
            this.creditApprovalService.getSavedBulkLoanDisbursementData().subscribe((response: any) => {
                this.bulkLoanEntries = response.result;
                // console.log(' this.bulkLoanEntries', this.bulkLoanEntries);
                // console.log("================ data========================", this.bulkLoanEntries);
            });
        }
    
        
        // benjamin
         collapseSearchForm(flag: boolean) {
            this.collapseForm = flag;
            if (flag==true) {
                this.displayLoanList=true;
            this.headerText = 'Disbursement List';
            }
            else {
            this.headerText = 'Disbursement Bulk Upload';
            this.displayLoanList=false;
          }
        }
    
        onFileChange(event) {
            this.files = event.target.files;
            this.file = this.files[0];
        }
    
        requestPasswordBulk(){ 
            if(this.adActive){ 
                this.buttonText ="Uploads Bulk Disbursement";
                this.displayADAuth=true;
                this.bulkUPload =true;
            }
            else{ 
                this.adAuthPassCode="";
                this.uploadBulkCustomerLoanFileForDisbursment();
            }
        
        }
      
        uploadBulkCustomerLoanFileForDisbursment() {
            this.loadingSrv.show();
            if (this.file != undefined || this.file != null) { 
                let adAuthPassCode = btoa(this.adAuthPassCode);
    
                let body = {
                    loanReferenceNumber: '',
                    fileName: this.file.name,
                    fileExtension: this.fileExtention(this.file.name),                
                    loginStaffPassCode: adAuthPassCode,
                    isFinal: this.isFinal,
                }; 
    
                this.creditApprovalService.uploadBulkCustomerLoanFileForDisbursment(this.file, body).then((res: any) => {
                    if (res.success == true) { 
                        this.collapseForm = false;
                        this.loadingSrv.hide();
                        this.uploadedData =  res.result;
                       
                    } 
                    else {
                       swal('Fintrak Credit360',res.message, 'error');
    
                        this.loadingSrv.hide();
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                }, (error) => {
                    this.loadingSrv.hide();
                    swal('Bulk Disbursement Upload', JSON.stringify(error) ? JSON.stringify(error) : 'uploading multiple bulk disbursement generated error', 'error')
                });
            } {
                
            }
            this.displayADAuth=false;
        }
    
    
    
        fileExtention(name: string) {
            var regex = /(?:\.([^.]+))?$/;
            return regex.exec(name)[1];
        }
    
        disburseChanged() {
            this.loadingSrv.show(); 
            this.disburseSelection.forEach(item => {
                item.shouldDisburse = true;
            });
            this.creditApprovalService.diburseMultipleLoanRequests(this.disburseSelection).subscribe((response: any) => {
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.loadingSrv.hide(1000);
                } else {
                    this.loadingSrv.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
    
                }
            }, (err) => {
                this.loadingSrv.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }
    
        schedules: any[];
        scheduleHeader: any = {};
        maturityDate: any;
        displayScheduleModalForm: boolean;

        getSchedules(data) { 
            if (data.length>0) {
                var details = {
                    principalAmount: data.principalAmount,
                    interestRate: new Date, //body.interestRate,
                    effectiveDate: new Date, //body.effectiveDate,
                    maturityDate: '',
                    effectiveInterestRate: 0,
                    schedules: data.periodicSchedule
                }
    
                this.schedules = details.schedules;
                this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
                details.maturityDate = this.maturityDate;
                details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
                this.scheduleHeader = details;
                this.displayScheduleModalForm = true;
                // console.log("===========Schedule================= ", JSON.stringify(this.scheduleHeader));
           }
           this.displayScheduleModalForm = true;
        }
    
     
}
    
    