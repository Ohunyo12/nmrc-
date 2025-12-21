import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule, TabViewModule, DialogModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerService } from '../../../customer/services/customer.service';
import { CustomerFSCaptionService } from '../../services';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig, AppConstant } from '../../../shared/constant/app.constant';
import { CustomerGroupService } from '../../../customer/services/customer-group.service';

@Component({
    templateUrl: './customer-fscaption-detail.component.html',
    styleUrls: ['./customer-fscaption.style.scss']
})

export class CustomerFSCaptionDetailComponent implements OnInit {

    customerTableData: any[];
    custGrpTableData: any[] = [];
    customerTableCols: any[];
    custGrpTableCols: any[];
    customerModel: any;
    custGrpModel: any;
    customerFsCaptionGroups: any[];
    unMappedFsCaptionsTableData: any[] = [];
    unMappedFsCaptionsTableCols: any[];
    mappedFSCaptionTableData: any[] = []; 
    allMappedFSCaptionTableData: any[] = [];
    mappedFSCaptionTableCols: any[];
    selectedUnmappedFsCaption: any;
    selectedMappedFsCaption: any;
    multiple?: number;
    searchQuery: string;
    selectedDate: Date;
    selectedCaptionGroup: any;
    selectedUnmappedFsCaptionIndex: number;
    selectedFsCaptionId: number;

    displaySearchResults = false;
    displayCreateEditModal = false;
    displayCustomerResults = false;
    displayUnmappedCustomerFsCaption = false;
    displayfsCaptionDetailModal = false;
    displayMappedCaptions = false;
    hideCaptionDetails = false;

    // showAmount: boolean = true;
    // showValue: boolean = false;

    setCaptionAmountsForm: FormGroup;
    unMappedCaptionsForm: FormGroup;

    activeIndex = 0;

    searchFormObj: any;
    captionGrpId = 0;
    selectedValue = "1";
    dateStr: string;
    calculateFSRatioValue: any = 0;

    constructor(
        private fb: FormBuilder, private loadingService: LoadingService,
        private custFSCaptionService: CustomerFSCaptionService, private custService: CustomerService,
        private custGroupService: CustomerGroupService
    ) { }

    ngOnInit() {

        this.loadingService.show();

        this.customerTableCols = [
            { field: 'customerCode', header: 'Customer Code' },
            { field: 'customerName', header: 'Customer Name' },
            { field: 'phoneNumber', header: 'Phone Number' },
            { field: 'customerTypeName', header: 'Customer Type' },
        ];

        this.unMappedFsCaptionsTableCols = [
            // { field: 'fsCaptionCode', header: 'FS Caption Code' },
            { field: 'fsCaptionName', header: 'FS Caption Name' },
            { field: 'fsCaptionGroupName', header: 'FS Caption Group ID' },
            { field: 'parentIdFSCaptionName', header: 'Parent FS Caption ID' },
            { field: 'accountCategoryName', header: 'Account Category ID' },
            { field: 'fsTypeName', header: 'FS Type ID' },
            { field: 'position', header: 'Position' },
            { field: 'isTotalLine', header: 'Is Total Line' }
        ];

        this.mappedFSCaptionTableCols = [
            { field: 'customerCode', header: 'Customer Code' },
            { field: 'fsCaptionName', header: 'FS Caption Name' },
            { field: 'fsCaptionPosition', header: 'FS Caption Position' },
            { field: 'accountCategoryName', header: 'Account Category' },
            { field: 'fsTypeName', header: 'FS Type' },
            // { field: 'fsDate', header: 'Date' },
            // {field: 'amount', header: 'Amount'}
        ];

        this.loadAllForms();
        this.loadingService.hide();
        this.selectedValue = "1";

    }

    loadAllForms() {
        this.setCaptionAmountsForm = this.fb.group({
            customerGroupId: [''],
            fsCaptionId: [''],
            fsDate: [''],
            amount: ['', Validators.compose([Validators.required, ValidationService.isNumber])],
            // value: ['', Validators.required],
            textValue: [''],
            valueType: [this.selectedValue]
        });

        //this.selectedValue = "1";
        // this.onValueTypeSelect(Number(this.selectedValue));
    }

    searchCustomers(queryString) {
        this.loadingService.show();
        this.custService.searchCustomer(queryString).subscribe((data) => {
            this.customerTableData = data.result;
            this.displayCustomerResults = true;
            this.loadAllFSCaptionGroups();
            this.loadingService.hide();
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }

    loadAllFSCaptionGroups() {
        this.custFSCaptionService.getAllCustomerFSCaptionGroup().subscribe((data) => {
            this.customerFsCaptionGroups = data.result;
        });
    }

    onFSCaptionGroupSelect(fsCaptionGrpId) {
        this.loadingService.show();
        var dateStr = new Date(this.selectedDate).toLocaleString().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
        this.searchFormObj = {
            fsCaptionGroupId: fsCaptionGrpId,
            customerId: this.customerModel.customerId,
            fsDate: dateStr
        };

        this.captionGrpId = this.searchFormObj.fsCaptionGroupId;

        ////console.log('form', this.searchFormObj);

        this.loadUnmappedFsCaptions(this.searchFormObj);
        this.loadMappedFsCaptions(this.searchFormObj);
        this.loadingService.hide();
    }

    onCaptionDateSelect(fsCaptionDate) {
        this.loadingService.show();
        var dateStr = new Date(fsCaptionDate).toLocaleString().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
        this.dateStr = dateStr;
        
        if (this.captionGrpId > 0) {
            this.searchFormObj = {
                fsCaptionGroupId: this.captionGrpId,
                customerId: this.customerModel.customerId,
                fsDate: dateStr
            };

            ////console.log('form', this.searchFormObj);

            this.loadUnmappedFsCaptions(this.searchFormObj);
            this.loadMappedFsCaptions({
                fsCaptionGroupId: this.captionGrpId,
                customerId: this.customerModel.customerId,
                fsDate: dateStr
            });

            
        }

        this.loadAllMappedFsCaptions({
            customerId: this.customerModel.customerId,
            fsDate: dateStr
        });
        
        this.loadingService.hide();
    }

    loadUnmappedFsCaptions(formObj) {
        this.custFSCaptionService.getUnmappedCustomerFSCaption(AppConstant.ObjectsToParams(formObj))
            .subscribe((data) => {
                this.unMappedFsCaptionsTableData = data.result;
                this.displaySearchResults = true;
                ////console.log('unmapped captions', this.unMappedFsCaptionsTableData);
                this.loadingService.hide();
            }, err => {
                ////console.log('error', err);
                this.loadingService.hide();
            });
    }

    loadMappedFsCaptions(formObj) {
        this.displayMappedCaptions = false;
        this.custFSCaptionService.getFSCaptionDetailByCustomer(AppConstant.ObjectsToParams(formObj))
            .subscribe((data) => {
                this.mappedFSCaptionTableData = data.result;
                this.displayMappedCaptions = true;
                this.loadingService.hide();
            }, (err) => {
                ////console.log('error', err);
                this.loadingService.hide();
            });
    }

    loadAllMappedFsCaptions(formObj) {
        //this.displayMappedCaptions = false;
        this.custFSCaptionService.getAllFSCaptionDetailByCustomer(AppConstant.ObjectsToParams(formObj))
            .subscribe((data) => {
                this.allMappedFSCaptionTableData = data.result;
                //this.displayMappedCaptions = true;
                this.loadingService.hide();
            }, (err) => {
                ////console.log('error', err);
                this.loadingService.hide();
            });
    }


    showModalForm() {
        this.loadingService.show();
        // this.loadAllFSCaptionGroups();
        this.displayCreateEditModal = true;
        this.loadingService.hide();
    }

    selectCustomer(index, evt) {
        evt.preventDefault();

        if (evt.target.checked) {
            this.customerModel = this.customerTableData[index];
            ////console.log('selected customer', this.customerTableData[index]);
        } else {
            this.customerModel = [];
        }
    }

    createCustomerFsMap(index, evt) {
        evt.preventDefault();

        this.selectedUnmappedFsCaptionIndex = index;
        this.selectedUnmappedFsCaption = this.unMappedFsCaptionsTableData[index];
        //console.log("selectedUnmappedFsCaption: ", this.selectedUnmappedFsCaption);

        this.loadAllMappedFsCaptions({
            customerId: this.customerModel.customerId,
            //fsDthisate: this.dateStr,
            fsDate: this.dateStr
        });

        this.selectedValue = "1";
        this.onValueTypeSelect(Number(this.selectedValue));        

        if (this.selectedUnmappedFsCaption.isRatio == true) {
            var postObj = {
                customerId: this.customerModel.customerId,
                fsCaptionId: this.selectedUnmappedFsCaption.fsCaptionId,
                fsCaptionGroupId: this.selectedUnmappedFsCaption.fsCaptionGroupId,
                fsDate: this.dateStr,
            }

            this.calculateFSRatioValueForDerived(postObj);
        }    
        else {
            this.calculateFSRatioValue = 0;
            this.setCaptionAmountsForm.controls['amount'].setValue(null);
            this.displayCreateEditModal = true;
        }
    }

    calculateFSRatioValueForDerived(postObj) {
        this.custFSCaptionService.calculateFSRatioValueForDerived(postObj).subscribe((response: any) => {
            if (response.success == true) {
                this.calculateFSRatioValue = response.result;
                this.setCaptionAmountsForm.controls['amount'].setValue(this.calculateFSRatioValue);
                //this.setCaptionAmountsForm.controls['amount'].disable();
                //console.log("calculateFSRatioValue: ", this.calculateFSRatioValue);
                this.displayCreateEditModal = true;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    removeCustomerFsMap(index, evt) {
        evt.preventDefault();

        const selectedFsCaption = this.mappedFSCaptionTableData[index];
        ////console.log('selected fs caption', selectedFsCaption);
        this.selectedFsCaptionId = selectedFsCaption.fsdetailId;

        this.custFSCaptionService.deleteCustomerFSCaptionDetail(this.selectedFsCaptionId).subscribe((reponse) => {
            this.loadingService.hide();
            if (reponse.success === true) {
                // this.unMappedFsCaptionsTableData.push(selectedFsCaption);
                this.loadUnmappedFsCaptions(this.searchFormObj);
                this.mappedFSCaptionTableData.splice(index, 1);
                swal(`${GlobalConfig.APPLICATION_NAME}`, reponse.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, reponse.message, 'error');
            }
            this.loadAllForms();
            this.selectedValue = "1";
            this.onValueTypeSelect(Number(this.selectedValue));
        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }

    submitForm(form) {
        this.loadingService.show();
        var dateStr = new Date(this.selectedDate).toLocaleString().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
        const formObj = {
            customerId: this.customerModel.customerId,
            fsCaptionId: this.selectedUnmappedFsCaption.fsCaptionId,
            fsDate: dateStr,
            amount: form.value.amount,
            textValue: form.value.textValue
        };

        //formObj.value = null;

        const unmappedIndex = this.unMappedFsCaptionsTableData.findIndex((item) =>
            item.fsCaptionId === this.selectedUnmappedFsCaption.fsCaptionId);

        this.custFSCaptionService.addCustomerFSCaptionDetail(formObj).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.loadMappedFsCaptions(this.searchFormObj);

                this.loadAllMappedFsCaptions({
                    customerId: this.customerModel.customerId,
                    fsDate: dateStr
                });
                
                this.displayCreateEditModal = false;
                this.unMappedFsCaptionsTableData.splice(unmappedIndex, 1);
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            this.loadAllForms();
            this.selectedValue = "1";
            this.onValueTypeSelect(Number(this.selectedValue));
        }, (error) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(error), 'error');
            this.loadingService.hide();
        });

        this.calculateFSRatioValue = 0;
    }

    createMultipleCaptionMappings() {
        ////console.log('after edits', this.mappedFSCaptionTableData);
    }

    handleChange(e) {
        this.activeIndex = e.index;
        ////console.log(this.activeIndex);

        if (this.activeIndex === 0) {
            this.displaySearchResults = false;
            this.displayMappedCaptions = false;
        }
    }


    onValueTypeSelect(value) {
       // console.log(value);
        var showAmount = document.getElementById("showAmount");
        var showValue = document.getElementById("showValue");

        const amountControl = this.setCaptionAmountsForm.get('amount');
        const valueControl = this.setCaptionAmountsForm.get('textValue');

        if (value == 1) {
            showAmount.style.display = "block";
            showValue.style.display = "none";
            valueControl.setValue("");

            valueControl.clearValidators();
            amountControl.setValidators([Validators.required]);

            valueControl.updateValueAndValidity();
            amountControl.updateValueAndValidity();
            //console.log("Amount");
        }
        else {
            amountControl.clearValidators();
            valueControl.setValidators([Validators.required]);
            amountControl.setValue("");

            amountControl.updateValueAndValidity();
            valueControl.updateValueAndValidity();

            showAmount.style.display = "none";
            showValue.style.display = "block";
        }
    }

}
