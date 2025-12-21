import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerFSCaptionService } from '../../services';
import { CustomerGroupService } from '../../../customer/services/customer-group.service';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig, AppConstant } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'customer-group-fscaption-detail.component.html'
})

export class CustomerGroupFSCaptionDetailComponent implements OnInit {

    customerGrpTableData: any[];
    customerGrpTableCols: any[];
    customerGrpModel: any = {};
    customerFsCaptionGroups: any[];
    unMappedFsCaptionsTableData: any[] = [];
    unMappedFsCaptionsTableCols: any[];
    mappedFSCaptionTableData: any[] = [];
    mappedFSCaptionTableCols: any[];
    selectedUnmappedFsCaption: any = {};
    selectedMappedFsCaption: any = {};

    searchQuery: string;
    selectedDate: Date;
    selectedCaptionGroup: any;
    selectedUnmappedFsCaptionIndex: number;
    selectedFsCaptionId: number;

    displaySearchResults = false;
    displayCreateEditModal = false;
    displayCustomerGrpResults = false;
    displayUnmappedCustomerFsCaption = false;
    displayfsCaptionDetailModal = false;
    displayMappedCaptions = false;
    hideCaptionDetails = true;

    setCaptionAmountsForm: FormGroup;
    unMappedCaptionsForm: FormGroup;

    activeIndex = 0;

    searchFormObj: any;
    captionGrpId = 0;

    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private custFSCaptionService: CustomerFSCaptionService, private custGroupService: CustomerGroupService) {

    }

    ngOnInit() {

        this.loadingService.show();

        this.customerGrpTableCols = [
            { field: 'groupCode', header: 'Group Code' },
            { field: 'groupName', header: 'Group Name' },
            { field: 'groupDescription', header: 'Group Description' }
        ];

        this.mappedFSCaptionTableCols = [
            { field: 'customerGroupCode', header: 'Group Code' },
            { field: 'fsCaptionName', header: 'FS Caption Name' },
            { field: 'fsCaptionPosition', header: 'FS Caption Position' },
            { field: 'accountCategoryName', header: 'Account Category' },
            { field: 'fsTypeName', header: 'FS Type' },
        ];

        this.loadAllForms();

        this.loadingService.hide();
    }

    loadAllForms() {
        this.setCaptionAmountsForm = this.fb.group({
            customerGroupId: [''],
            fsCaptionId: [''],
            fsDate: [''],
            amount: ['', Validators.compose([Validators.required, ValidationService.isNumber])]
        });
    }

    searchCustomerGroup(queryString) {
        this.loadingService.show();
        this.customerGrpModel = [];
        this.custGroupService.searchGroup(queryString).subscribe((data) => {
            this.customerGrpTableData = data.result;
            this.displayCustomerGrpResults = true;
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
            customerGroupId: this.customerGrpModel.customerGroupId,
            fsDate: dateStr
                        // fsDate: this.selectedDate.toLocaleDateString()

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
        
        if (this.captionGrpId > 0) {
            this.searchFormObj = {
                fsCaptionGroupId: this.captionGrpId,
                customerGroupId: this.customerGrpModel.customerGroupId,
                //fsDate: fsCaptionDate.toLocaleDateString()
                fsDate: dateStr
                
            };

            ////console.log('form', this.searchFormObj);

            this.loadUnmappedFsCaptions(this.searchFormObj);
            this.loadMappedFsCaptions({
                fsCaptionGroupId: this.captionGrpId,
                customerGroupId: this.customerGrpModel.customerGroupId,
                //fsDate: fsCaptionDate.toLocaleDateString()
                fsDate: dateStr
                
            });
        }
        this.loadingService.hide();
    }

    loadUnmappedFsCaptions(formObj) {
        this.custFSCaptionService.getUnmappedCustomerGroupFSCaption(AppConstant.ObjectsToParams(formObj))
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
        this.custFSCaptionService.getFSCaptionDetailByCustomerGroup(AppConstant.ObjectsToParams(formObj))
            .subscribe((data) => {
                this.mappedFSCaptionTableData = data.result;
                this.displayMappedCaptions = true;
                this.loadingService.hide();
                if (this.mappedFSCaptionTableData.length > 0) {
                    this.hideCaptionDetails = false;
                } else {
                    this.hideCaptionDetails = true;
                }
            }, (err) => {
                ////console.log('error', err);
                this.loadingService.hide();
            });
    }

    showModalForm() {
        this.loadingService.show();
        // this.loadAllFSCaptionGroups();
        ////console.log('customer group model', this.customerGrpModel);
        this.displayCreateEditModal = true;
        this.loadingService.hide();
    }

    selectCustomerGrp(index, evt) {
        evt.preventDefault();

        if (evt.target.checked) {
            this.customerGrpModel = this.customerGrpTableData[index];
            ////console.log('selected customer group', this.customerGrpTableData[index]);
        } else {
            this.customerGrpModel = [];
        }
    }

    createCustomerGrpFsMap(index, evt) {
        evt.preventDefault();

        this.displayCreateEditModal = true;
        this.selectedUnmappedFsCaptionIndex = index;
        this.selectedUnmappedFsCaption = this.unMappedFsCaptionsTableData[index];

        // let formObj = {
        //     customerId: this.selectedFsCaption.customerId,
        //     fsCaptionId: this.selectedFsCaption.fsCaptionId,
        //     fsDate: this.selectedFsCaption.fsDate
        // };
    }

    removeCustomerGrpFsMap(index, evt) {
        evt.preventDefault();

        const selectedFsCaption = this.mappedFSCaptionTableData[index];
        ////console.log('selected fs caption', selectedFsCaption);
        this.selectedFsCaptionId = selectedFsCaption.fsdetailId;

        this.custFSCaptionService.deleteCustomerGroupFSCaptionDetail(this.selectedFsCaptionId).subscribe((reponse) => {
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
        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }

    submitForm(form) {
        this.loadingService.show();
        var dateStr = new Date(this.selectedDate).toLocaleString().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
        
        const formObj = {
            customerGroupId: this.customerGrpModel.customerGroupId,
            fsCaptionId: this.selectedUnmappedFsCaption.fsCaptionId,
            fsDate: dateStr,
            
           // fsDate: this.selectedDate.toLocaleDateString(),
            amount: form.value.amount
        };
        const unmappedIndex = this.unMappedFsCaptionsTableData.findIndex((item) =>
            item.fsCaptionId === this.selectedUnmappedFsCaption.fsCaptionId);

        this.custFSCaptionService.addCustomerGroupFSCaptionDetail(formObj).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.loadMappedFsCaptions(this.searchFormObj);
                this.displayCreateEditModal = false;
                this.unMappedFsCaptionsTableData.splice(unmappedIndex, 1);
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            this.loadAllForms();
        }, (error) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(error), 'error');
            this.loadingService.hide();
        });

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

    next() {
        this.activeIndex = (this.activeIndex === 2) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

}