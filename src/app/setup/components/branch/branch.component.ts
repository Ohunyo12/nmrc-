import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { BranchService } from '../../services';
import { CountryStateService } from '../../services';
import { DataTableModule, SharedModule } from 'primeng/primeng';

@Component({
    templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
    regions: any[];
    branches: any[];
    states: any[];
    cities: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Branch';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; 
    loggedInUserBranch: string;
    loggedInUserCompany: string;
    selectedId: number = null;

    constructor(
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private branchService: BranchService,
        private countryService: CountryStateService
    ) { }

    ngOnInit() {
        this.getAllBranches();
        this.getAllStates();
        this.getAllRegion();
        this.clearControls();
    }
    getAllRegion() {
        this.branchService.getAllRegion().subscribe((res) => {
            this.regions = res.result;

            ////console.log('this.regions',this.regions);
        });
    }
    getAllBranches(): void {
        this.loadingService.show();
        this.branchService.get().subscribe((response: any) => {
            this.branches = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getAllStates(): void {
        this.countryService.getStates().subscribe((response: any) => {
            this.states = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getStateCities(id): void {
        this.countryService.getCityByState(id).subscribe((response: any) => {
            this.cities = response.result;
            ////console.log('CITIES', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    onChangeSelectedState(id) {
        this.getStateCities(id);
    }

    showAddModal() {
        this.clearControls();
        this.displayAddModal = true;
    }

    clearControls() {
        this.selectedId = null;
        this.addForm = this.fb.group({
            branchName: ['', Validators.required],
            stateId: ['', Validators.required],
            regionId: ['', Validators.required],
            branchCode: ['', Validators.required],
            cityId: ['', Validators.required],
            addressLine1: [''],
            addressLine2: [''],
            comment: [''],
        });
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            branchName: form.value.branchName,
            branchCode: form.value.branchCode,
            regionId: form.value.regionId,
            stateId: form.value.stateId,
            cityId: form.value.cityId,
            addressLine1: form.value.addressLine1,
            addressLine2: form.value.addressLine2,
            comment: form.value.comment,
        };
        if (this.selectedId === null) {
            this.branchService.save(body).subscribe((res) => {
                ////console.log('SAVE!');
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllBranches();
                    this.displayAddModal = false;
                    ////console.log('GOOD!', JSON.stringify(res.message));
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.branchService.update(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllBranches();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    editBranch(row) {
        // var row = this.branches[index];
        this.getStateCities(row.stateId);
        this.selectedId = row.branchId;

        ////console.log('row.regionId',row.regionId);

        this.addForm = this.fb.group({
            branchName: [row.branchName, Validators.required],
            stateId: [row.stateId, Validators.required],
            regionId: [row.regionId],
            branchCode: [row.branchCode, Validators.required],
            cityId: [row.cityId, Validators.required],
            addressLine1: [row.addressLine1],
            addressLine2: [row.addressLine2],
            comment: [row.comment],
        });
        this.displayAddModal = true;
        
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
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