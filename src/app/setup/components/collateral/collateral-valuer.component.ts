import { Component, OnInit } from '@angular/core';

import { CountryStateService } from '../../services/state-country.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../services';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
    templateUrl: 'collateral-valuer.component.html'
})
export class CollateralValuerComponent implements OnInit {

    valuers: any[]; // <----?
    cities: any[];
    countries: any[];
    valuerTypes: any[];
    displayForm: boolean = false;
    entityName: string = 'New Valuer Information';
    valuerForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;

    constructor(
        private loadingService: LoadingService, private fb: FormBuilder,
        private collateralService: CollateralService, private countryStateSrv: CountryStateService
    ) { }

    ngOnInit() {
        this.getCities();
        this.getCountries();
        this.getValuerTypes();
        this.getAllValuer();
        this.clearControls();
    }

    getAllValuer(): void {
        this.loadingService.show();
        this.collateralService.getValuers().subscribe((response: any) => { // <----?
            this.valuers = response.result; // <----?
            ////console.log('valuers: ', response);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    getCities() {
        this.countryStateSrv.getAllCities().subscribe((response: any) => {
            this.cities = response.result;
        });
    }
    getCountries() {
        this.countryStateSrv.getAllCountries().subscribe((response: any) => {
            this.countries = response.result;
        });
    }
    getValuerTypes() {
        this.collateralService.getValuerType().subscribe((response: any) => {
                this.valuerTypes = response.result;
            ////console.log('this ones', this.valuerTypes)
        });
    }
    showForm() {
        this.clearControls();
        this.entityName = 'New Valuer Information';
        this.displayForm = true;
    }

    clearControls() {
        this.selectedId = null;
        this.valuerForm = this.fb.group({
            collateralValuerId: [0],
            valuerLicenceNumber: ['', Validators.required],
            name: ['', Validators.required],
            valuerTypeId: [''],
            cityId: [''],
            countryId: [''],
            // accountNumber: ['', Validators.required],
            // valuerBVN: ['', Validators.required],
            emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            phoneNumber: [''],
            address: [''],
        });
    }

    editValuer(row) {
        this.entityName = "Edit Valuer Information"
        ////console.log('row -=> ', row);
        
        this.selectedId = row.collateralValuerId; // <----?
        this.valuerForm = this.fb.group({
            collateralValuerId: [row.collateralValuerId],
            valuerLicenceNumber: [row.valuerLicenceNumber],
            name: [row.name],
            valuerTypeId: [row.valuerTypeId],
            cityId: [row.cityId],
            countryId: [row.countryId],
            accountNumber: [row.accountNumber, Validators.required],
            valuerBVN: [row.valuerBVN, Validators.required],
            emailAddress: [row.emailAddress || '', Validators.compose([Validators.required, ValidationService.isEmail])],
            phoneNumber: [row.phoneNumber],
            address: [row.address],
        });
        this.displayForm = true;
    }

    submitForm(form) {
        this.loadingService.show();
        let body = form.value;
        ////console.log('body--=> ',body);
        
        if (this.selectedId === null) {
            this.collateralService.saveValuer(body).subscribe((res) => {
                ////console.log('SAVE!');
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllValuer();
                    this.displayForm = false;
                    ////console.log('GOOD!', JSON.stringify(res.message));
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.collateralService.updateValuer(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllValuer();
                    this.selectedId = null;
                    this.displayForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        // this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
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

}
