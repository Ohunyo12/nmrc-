import { Component, OnInit } from '@angular/core'; 
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import swal, { SweetAlertType } from 'sweetalert2';
import { LoanApplicationService } from '../../../credit/services';

import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    selector: 'app-loan-principal',
    templateUrl: './loan-principal.component.html',

})
export class LoanPrincipalComponent implements OnInit {
    LoanApplicationService: any;

    loanPrincipalForm:FormGroup;
    loanPrincipal:any[];
    displayLoanPrincipal:Boolean=false;
    isUpdate = false;
    TitleName:string;
    selectedId: number = null;

    
    constructor(private fb: FormBuilder, private loanappService: LoanApplicationService, private loadServ: LoadingService) { }

    ngOnInit() { 
        this.loadServ.show();
        this.InitLoanPrincipalForm();
        this.getAllLoanPrincipals();
        this.isUpdate = false;
    }
    
    InitLoanPrincipalForm(){
        this.loanPrincipalForm =this.fb.group({
            principalSpecialNumber: ['',Validators.required],
            name: ['',Validators.required],
            customerAccount: ['',Validators.required],
             emailAddress: ['',Validators.email],
             phoneNumber: ['',Validators.required],
             address: ['',Validators.required],
             principalId: [0,Validators.required],
           //  loanPrincipal:any
             
        })
    }

    getAllLoanPrincipals() {
        this.loanappService.getLoanPrincipals()
            .subscribe((response: any) => {
                this.loanPrincipal = response.result;
                ////console.log('loanPrincipal ', this.loanPrincipal);
                this.loadServ.hide();
            }, (err) => {
                this.loadServ.hide();
                ////console.log('server error', err);
               
            });
    }

    // editLoanPrincipal()
    // {
    //     this.LoanApplicationService.getLoanPrincipal()
    //     .subscribe((response: any) => {
    //         this.loanPrincipal = response.result;
    //     }, (err) => {
    //         ////console.log('server error', err);
    //     });
    // }
    UpdateLoanPrincipal()
    {
        this.LoanApplicationService.updateLoanPrincipal()
        .subscribe((response: any) => {
            this.loanPrincipal = response.result;
        }, (err) => {
            ////console.log('server error', err);
        });
    }
   
    saveLoanPrincipal()
    {
        // if(selectedId===null)
        // {
        this.loadServ.show();
        let body = {
            principalsRegNumber: this.loanPrincipalForm.value.principalSpecialNumber,
            name :this.loanPrincipalForm.value.name,
            accountNumber:    this.loanPrincipalForm.value.customerAccount, 
            emailAddress: this.loanPrincipalForm.value.emailAddress,
            phoneNumber: this.loanPrincipalForm.value.phoneNumber,
            address: this.loanPrincipalForm.value.address,
            principalId:this.loanPrincipalForm.value.principalId,
        }
        if(body.principalId==0){
        this.loanappService.addLoanPrincipal(body)
            .subscribe((res) => {
                this.loadServ.hide();
                if (res.success === true) {
                    this.getAllLoanPrincipals();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                        this.displayLoanPrincipal=false;
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                    }
            }, (err) => {
                this.loadServ.hide();

                this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'success');
            })
        }else{

            this.loanappService.updateLoanPrincipal(body)
            .subscribe((res) => {
                this.loadServ.hide();
                if (res.success === true) {
                    ////console.log('BODY',body);
                    this.getAllLoanPrincipals();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                        this.displayLoanPrincipal=false;
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                    }
            }, (err) => {
                this.loadServ.hide();
                this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'success');
            })
        }
    }

    DeleteLoanPrincipal()
    {
        this.LoanApplicationService.DeleteLoanPrincipal()
        .subscribe((response: any) => {
            this.loanPrincipal = response.result;
        }, (err) => {
            ////console.log('server error', err);
        });
    }
    showDialog() {
        this.InitLoanPrincipalForm();
        this.isUpdate = false;
        this.displayLoanPrincipal = true;
        this.TitleName ="New Loan Principal";
    }

    editLoanPrincipal(record){
        this.TitleName = 'Edit Loan Principal';
        this.displayLoanPrincipal = true;
        this.isUpdate = true;
        let row = record;
        //let row = this.loanPrincipal.filter(x=>x.principalId === principalId);
        ////console.log('TURAYA',record)

        this.selectedId = row.principalId;
        this.loanPrincipalForm =this.fb.group({
            principalSpecialNumber:[row.principalsRegNumber,Validators.required],
            name: [row.name, Validators.required],
            customerAccount: [row.accountNumber, Validators.required],
             emailAddress: [row.emailAddress, Validators.email],
             phoneNumber: [row.phoneNumber, Validators.required],
             address: [row.address, Validators.required],
            principalId: this.selectedId,
 
        })
    }
    showMessage(title: string,message:string,messageType:SweetAlertType) {
        swal(title,message, messageType);
    }
}