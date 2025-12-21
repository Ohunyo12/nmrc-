import { Component, OnInit,Output, Input, EventEmitter } from '@angular/core';
import { IContingentLoan } from './contingentloan.interface';
import {   FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CurrencyService } from '../../../setup/services';
import { LoanApplicationService } from '../../services';
import { ConvertString, GlobalConfig } from '../../../shared/constant/app.constant';
import { LoadingService } from '../../../shared/services/loading.service'; 
import { ContingentLoanService } from './contingentloan.service';
import swal from 'sweetalert2';
@Component({
    selector: 'contingent-usage',
    templateUrl: 'contingent-usage.component.html'
})

export class ContingentUsageComponent implements OnInit {
    allowedCurrencies: any[] = [];
    formData: FormGroup;
    DocumentForm:FormGroup;
    exchangeValue: number;
    exchange: any = {};
    IsBaseCurrency: boolean;
    exchangeRate: any;
   @Input() selectedContingentData: IContingentLoan;
   @Output() closeWindow = new EventEmitter<boolean>();
    loanId: number;
    loanSystemTypeId: any;
    displayFileUpload:boolean=false;
    files: any;
    file: any;
    reload: number = 0;
    showUploadForm:boolean=false;
    deleteLink:boolean=false;
   
    constructor(private service: ContingentLoanService, private fb: FormBuilder, private loadingSrv: LoadingService,private currencyService: CurrencyService, private loanAppService: LoanApplicationService) { }

    ngOnInit() { 
        this.InitForm();
        this.getAllCurrencies() ;
        this.reload++;
    }
    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }
    onSubmit() {
       
        this.loadingSrv.show();
        const cd = this.formData.value;
        const body = {
            contingentLoanId: this.selectedContingentData.contingentLoanId,
            amountRequested: cd.amountRequested,
            loanReferenceNumber: this.selectedContingentData.loanReferenceNumber,
            productName: this.selectedContingentData.productName,
            productId: this.selectedContingentData.productId,
            remark: cd.remark,
            loanReviewApplicationId : this.selectedContingentData.loanReviewApplicationId
        }

        this.service.saveContingentLoan(body).subscribe((response: any) => {
           if( response.success==true){
            this.closeDataForm();  
                      
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation Successful', 'success');
           }else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation has failed with an error', 'error');
           }
            this.loadingSrv.hide();
        }, (error) => {
            this.loadingSrv.hide();
        });
    }

    isFacilityUsedUp(): boolean {
        const newAmount: number = ConvertString.TO_NUMBER(this.formData.value.amountRequested);
        const usedAmount = ConvertString.TO_NUMBER (this.selectedContingentData.usedAmount);
        const totalUsage: number = (+usedAmount) +  (+newAmount) ;
        if (totalUsage > ConvertString.TO_NUMBER (this.selectedContingentData.facilityAmount))
            return true
        return false
    }

    closeDataForm(){
        this.closeWindow.emit(true);
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies()
            .subscribe((res) => {
                this.allowedCurrencies = res.result;
            }, (err) => {
            });
    }
    convertToNumber(pamount) {

        if (typeof (pamount) == "string") {
            return pamount = pamount.replace(/[^0-9-.]/g, '');
        } else if (typeof (pamount) == "number") {
            return pamount = pamount;
        }

    }

    getExchangeRate( ) {
        let amount =  this.convertToNumber(this.formData.controls['amountRequested'].value);
        let facilityAmount =  this.selectedContingentData.facilityAmount;
        let percentageRequested = +amount/+facilityAmount * 100 
        this.selectedContingentData.percentageRequested = percentageRequested.toString();

        if(this.isFacilityUsedUp()){
            this.formData.get('amountRequested').setValue(0);
            this.exchangeValue =0;
            this.setCurrency('', 0, this.IsBaseCurrency)
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approved Amount Exceeded', 'warning');
        return;
        }
        const id = this.selectedContingentData.currencyId
        if(id != undefined || id != null)
        this.exchangeValue = 0;
        
        this.loanAppService.getExchangeRate(+id)
            .subscribe((res) => {
                this.exchange = res.result;
                if (this.exchange !== undefined && this.exchange.sellingRate!== undefined ) {
                    const principalAmount: number = ConvertString.TO_NUMBER(this.formData.value.amountRequested);

                    this.exchangeValue = +principalAmount *  this.exchange.sellingRate;
                    this.IsBaseCurrency = this.exchange.isBaseCurrency;
                    this.setCurrency(this.exchange.sellingRate, this.exchangeValue, this.IsBaseCurrency)
                    if (this.IsBaseCurrency) {
                        this.exchangeRate = "N/A";
                    }
                }

            }, (err) => {
                this.loadingSrv.hide();
            });
    }
    setCurrency(exchangeRate: string, exchangeAmount: number, IsBaseCurrency: boolean): void {
        this.formData.patchValue({
            exchangeRate: exchangeRate,
            exchangeAmount: exchangeAmount
        });
    }
    InitForm(){
        const cd: IContingentLoan = this.selectedContingentData;
            
            

        this.loanId = cd.contingentLoanId;
        this.loanSystemTypeId = cd.loanSystemTypeId
        this.formData = this.fb.group({            
            contingentLoanId:[cd.contingentLoanId, Validators.required],            
            amountRequested:[cd.amountRequested, Validators.required],    
            loanReferenceNumber:[cd.loanReferenceNumber, Validators.required],   
            productName:[cd.productName, Validators.required],
            currencyId:[cd.currencyId, Validators.required],
            exchangeRate: [0, Validators.required],
            exchangeAmount: [0, Validators.required],
            productId: [cd.productId],
            remark: ['', Validators.required],
            loanReviewApplicationId:[cd.loanReviewApplicationId],
            loanApplicationNumber:[cd.loanApplicationNumber]
           
        })

        this.DocumentForm = this.fb.group({
            documentTitle: ['', Validators.required],
            documentFile: ['', Validators.required]
        });

        this.getExchangeRate();
    }
    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];

    }
    docTitle:any;
    isPrimaryLabel:string='Required'
    Uploaded:boolean=false;
    docType: any;
    AcceptImage()
    {
        this.docTitle = this.DocumentForm.get('documentTitle').value;

        this.isPrimaryLabel = this.docTitle;
        this.Uploaded = true;
        this.displayFileUpload = false;

        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document uploaded successfully', 'success');
    }
}