import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import swal, { SweetAlertType } from 'sweetalert2';
import { LoanApplicationService } from '../../../credit/services';
import { CountryStateService } from '../../services';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
    selector: 'app-approved-market',
    templateUrl: './approved-market.component.html',
    // styleUrls: ['./approved-market.component.scss']
})
export class ApprovedMarketComponent implements OnInit {
    states: any[];

    approvedMarketForm: FormGroup;
    LoanApplicationService: any;
    approveMarket: any[];
    isUpdate = false;
    displayMarket: Boolean = false;
    cities: any[];
    TitleName: string;
    selectedId: 0;
    state: any;

    constructor(private fb: FormBuilder,
        private loanappService: LoanApplicationService,
        private loadServ: LoadingService,
        private countryService: CountryStateService) {

    }

    ngOnInit() {
        this.loadServ.show();
        this.InitApprovedMarketForm();
        this.getAllStates();
        this.getAllLoanMarket();
    }

    InitApprovedMarketForm() {
        this.approvedMarketForm = this.fb.group({
            marketId: [''],
            marketName: ['', Validators.required],
            accountNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
            emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
            cityId: ['', Validators.required],
            address: ['', Validators.required],
            stateId: ['', Validators.required],

        })
    }
    getAllLoanMarket() {
        this.loanappService.getApprovedMarkets()
            .subscribe((response: any) => {
                this.approveMarket = response.result;


                this.loadServ.hide();
            }, (err) => {
                this.loadServ.hide();

            });
    }


    editMarket(record) {
        this.TitleName = 'Edit Approved Loan Market';
        this.displayMarket = true;
        this.isUpdate = true;
        let row = record;

        this.selectedId = row.marketId;
        this.approvedMarketForm = this.fb.group({
            marketId: [row.marketId],
            marketName: [row.marketName],
            emailAddress: [row.emailAddress],
            phoneNumber: [row.phoneNumber],
            cityId: [row.cityId],
            address: [row.address],
            accountNumber: [row.accountNumber],
            stateId: [row.stateId]
        })

        this.getStateCities(row.stateId)
        this.selectedId = row.marketId;
    }

    showDialog() {
        this.InitApprovedMarketForm();
        this.isUpdate = false;
        this.displayMarket = true;
        this.TitleName = 'New Approved Loan Market';

    }
    getAllStates(): void {
        this.countryService.getStates().subscribe((response: any) => {
            this.states = response.result;
        }, (err) => {
            this.loadServ.hide(1000);
        });
    }
    getStateCities(id): void {
        this.countryService.getCityByState(id).subscribe((response: any) => {
            this.cities = response.result;
        }, (err) => {
            this.loadServ.hide(1000);
        });
    }

    saveMarket(formObj) {
        this.loadServ.show();
        let body = formObj.value;

        if (body.marketId <= 0) {
            this.loanappService.addApprovedMarket(body).subscribe((res) => {
                this.loadServ.hide();
                if (res.success === true) {
                    this.getAllLoanMarket();

                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.displayMarket = false
                } else {
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadServ.hide();
                this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
            })
        } else {
            this.loanappService.updateApprovedMarket(body.marketId, body)
                .subscribe((res) => {
                    this.loadServ.hide();
                    if (res.success === true) {
                        this.getAllLoanMarket();
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                        this.displayMarket = false
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                }, (err) => {
                    this.loadServ.hide();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                })

        }
    }
    showMessage(title: string, message: string, messageType: SweetAlertType) {
        swal(title, message, messageType);
    }
}
