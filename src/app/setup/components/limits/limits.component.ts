import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    DataTableModule, SharedModule, TabViewModule,
    ConfirmDialogModule, ConfirmationService
} from 'primeng/primeng';

import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { LimitsService } from '../../services';
import { BranchService } from '../../services';
import { CustomerService } from '../../../customer/services/customer.service';
import { ProductService } from '../../services';
import { StaffService } from '../../../admin/services/staff.service';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GeneralSetupService } from '../../services/general-setup.service';
import { CustomerRealTimeSearchService } from '../../../credit/services/customer-realtime-search.service';
import { StaffRealTimeSearchService } from '../../services/staff-realtime-search.service';
import { Subject } from 'rxjs';
import { CustomerGroupService } from '../../../customer/services/customer-group.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: './limits.component.html',
    styles: [`
    .remove-btn{
        color:#bbb;
        font-size:27px;
        position:absolute;
        top:0;
        right:0;
        
    }
    `]
})

export class LimitsComponent implements OnInit {

    multiple:any;
    limitsTableData: any[];
    limitsTableCols: any[];
    limitDetailsTableData: any[];
    limitDetailsTableCols: any[];
    limitMetricData: any[];
    limitValueTypeData: any[];
    limitTypeData: any[];
    limitFrequencyTypeData: any[];
    customerTableData: any[];
    customerTableCols: any[];
    branchTableData: any[];
    branchTableCols: any[];
    productTableData: any[];
    productTableCols: any[];
    staffTableData: any[];
    staffTableCols: any[];
    sectorTableData: any[];
    sectorTableCols: any[];
    custGrpTableData: any[];
    custGrpTableCols: any[];
    penTableData: any[] = [];

    limitDefinitionForm: FormGroup;
    limitDetailForm: FormGroup;

    displayLimitDefinitionModal = false;
    displayLimitDetailModal = false;

    showCustomerTable = false;
    showBranchTable = false;
    showProductTable = false;
    showStaffTable = false;
    showSectorTable = false;
    showGroupTable = false;
    showPenForm = false;

    customerModel: any;
    branchModel: any;
    staffModel: any;
    groupModel: any;
    sectorModel: any;

    displayStaffSearchModal = false;
    displayCustomerSearchModal = false;
    displayGroupSearchModal = false;

    shareholdersFund = 0;
    sectorLimit = 0;
    sectorPercentBreakDown = 0;
    totalRiskAppetite = 0;

    staffSearchResults: Object;
    staffSearchTerm$ = new Subject<any>();
    custSearchResults: Object;
    custSearchTerm$ = new Subject<any>();
    custGrpSearchResults: Object;
    custGrpSearchTerm$ = new Subject<any>();

    selectedCustomer: any = {};
    selectedStaff: any = {};
    selectedGroup: any = {};

    customerFilteredData: any[];
    staffFilteredData: any = [];
    groupFilteredData: any = [];

    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private limitService: LimitsService, private branchService: BranchService,
        private customerService: CustomerService, private productService: ProductService,
        private staffService: StaffService, private genSetupService: GeneralSetupService,
        private customerRealTimeServ: CustomerRealTimeSearchService, private staffRealTimeServ: StaffRealTimeSearchService,
        private customerGrpService: CustomerGroupService) {

        this.staffRealTimeServ.search(this.staffSearchTerm$).subscribe(results => {
            if (results != null) {
                this.staffSearchResults = results.result;
            }
        });

        this.customerRealTimeServ.searchForCustomer(this.custSearchTerm$).subscribe(results => {
            if (results != null) {
                this.custSearchResults = results.result;
            }
        });

        this.customerRealTimeServ.searchForCustomerGroup(this.custGrpSearchTerm$).subscribe(results => {
            if (results != null) {
                this.custGrpSearchResults = results.result;
            }
        });
    }

    ngOnInit() {
        this.loadingService.show();

        this.limitsTableCols = [
            { field: 'limitName', header: 'Limit Name' },
            { field: 'companyName', header: 'Company' },
            { field: 'limitMetric', header: 'Limit Metric' },
            { field: 'limitValueType', header: 'Limit Value Type' },
        ];

        this.limitDetailsTableCols = [
            { field: 'limitName', header: 'Limit Name' },
            { field: 'limitTypeName', header: 'Limit Type' },
            { field: 'minimumValue', header: 'Minimum Value' },
            { field: 'maximumValue', header: 'Maximum Value' },
            { field: 'targetId', header: 'Target' },
            { field: 'limitFrequencyTypeName', header: 'Limit Frequency' }
        ];

        this.customerTableCols = [
            { field: 'customerCode', header: 'Customer Code' },
            { field: 'firstName', header: 'Firstname' },
            { field: 'lastName', header: 'lastname' },
        ];

        this.branchTableCols = [
            { field: 'branchCode', header: 'Branch Code' },
            { field: 'branchName', header: 'Branch Name' },
            { field: 'stateName', header: 'State Name' },
        ];

        this.productTableCols = [
            { field: 'productCode', header: 'ProductCode' },
            { field: 'productName', header: 'Product Name' },
            { field: 'productCategoryName', header: 'Product Category' },
        ];

        this.staffTableCols = [
            { field: 'staffName', header: 'Staff Name' },
            { field: 'username', header: 'Staff Username' },
            { field: 'email', header: 'Email' },
        ];

        this.sectorTableCols = [
            { field: 'sectorName', header: 'Sector Name' },
            { field: 'sectorCode', header: 'Sector Code' },
        ];

        this.custGrpTableCols = [
            { field: 'groupCode', header: 'Group Code' },
            { field: 'groupName', header: 'Group Name' }
        ];

        this.loadAllForms(); this.loadAllLimits(); this.loadAllLimitDetails(); this.loadAllLimitMetrics();
        this.loadAllLimitValueTypes(); this.loadAllLimitTypes(); this.loadAllCustomers();
        this.loadAllCustomerGroups();
        this.loadAllBranches(); this.loadAllStaff(); this.loadAllFrequencyTypes();
        this.loadAllSectors();
        // this.loadAllProducts();
    }

    searchStaffDB(searchString) {
        this.staffSearchTerm$.next(searchString);
    }

    searchCustomerDB(searchString) {
        this.custSearchTerm$.next(searchString);
    }

    searchForCustomerGroup(searchString) {
        this.custGrpSearchTerm$.next(searchString);
    }

    loadAllForms() {
        this.limitDefinitionForm = this.fb.group({
            limitId: [''],
            limitName: ['', Validators.required],
            limitValueTypeId: ['', Validators.required],
            limitMetricId: ['', Validators.required],
        });

        this.limitDetailForm = this.fb.group({
            limitDetailId: [''],
            limitTypeId: ['', Validators.required],
            limitId: ['', Validators.required],
            maximumValue: ['0', Validators.required],
            minimumValue: ['0', Validators.required],
            targetId: ['-1'],
            limitFrequencyTypeId: ['1', Validators.required],
            allowOverride: [false],
        });

        this.showCustomerTable = false;
        this.showStaffTable = false;
        this.showBranchTable = false;
        this.showProductTable = false;
        this.showSectorTable = false;
        this.showGroupTable = false;
        this.showPenForm = false;

        this.penTableData = [{ maximumValue: '', allowOverride: false }];

    }

    loadAllLimits() {
        this.limitService.getAllLimit().subscribe((data) => {
            this.limitsTableData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllLimitDetails() {
        this.limitService.getLimitDetailsObligor().subscribe((data) => {
            this.limitDetailsTableData = data.result;
            this.loadingService.hide();
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllLimitMetrics() {
        this.limitService.getAllLimitMetrics().subscribe((data) => {
            this.limitMetricData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllLimitValueTypes() {
        this.limitService.getAllLimitValueTypes().subscribe((data) => {
            this.limitValueTypeData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllLimitTypes() {
        this.limitService.getAllLimitTypes().subscribe((data) => {
            this.limitTypeData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    onLimitTypeSelect(targetId) {
        switch (targetId) {
            case '1':
                this.displayCustomerSearchModal = true;
                this.showCustomerTable = false;
                this.showStaffTable = false;
                this.showBranchTable = false;
                this.showSectorTable = false;
                this.showPenForm = false;
                this.branchModel = null; this.groupModel = null; this.sectorModel = null;
                this.staffModel = null;
                break;
            case '3':
                this.showSectorTable = true;
                this.showCustomerTable = false;
                this.showStaffTable = false;
                this.showBranchTable = false;
                this.showGroupTable = false;
                this.showPenForm = false;
                this.branchModel = null; this.groupModel = null;
                this.staffModel = null; this.customerModel = null;
                break;
            case '4':
                this.showStaffTable = false;
                this.showCustomerTable = false;
                this.showBranchTable = true;
                this.showSectorTable = false;
                this.showGroupTable = false;
                this.showPenForm = false;
                this.branchModel = null; this.groupModel = null; this.sectorModel = null;
                this.customerModel = null;
                break;
            case '5':
                this.displayStaffSearchModal = true;
                this.showBranchTable = false;
                this.showCustomerTable = false;
                this.showStaffTable = false;
                this.showGroupTable = false;
                this.showPenForm = false;
                this.branchModel = null; this.groupModel = null; this.sectorModel = null;
                this.customerModel = null;
                break;
            case '6':
                this.showPenForm = true;
                this.showCustomerTable = false;
                this.showStaffTable = false;
                this.showBranchTable = false;
                this.showSectorTable = false;
                this.showGroupTable = false;
                this.branchModel = null; this.groupModel = null; this.sectorModel = null;
                this.staffModel = null; this.customerModel = null;
                break;
            case '8':
                this.displayGroupSearchModal = true;
                this.showCustomerTable = false;
                this.showStaffTable = false;
                this.showBranchTable = false;
                this.showGroupTable = false;
                this.showPenForm = false;
                this.branchModel = null; this.sectorModel = null;
                this.staffModel = null; this.customerModel = null;
                break;
            default:
                this.showCustomerTable = false;
                this.showStaffTable = false;
                this.showBranchTable = false;
                this.showSectorTable = false;
                this.showGroupTable = false;
                this.showPenForm = false;
                this.branchModel = null; this.groupModel = null; this.sectorModel = null;
                this.staffModel = null; this.customerModel = null;
                break;
        }
    }

    loadAllCustomers() {
        this.customerService.getCustomersByBranch().subscribe((data) => {
            this.customerTableData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllBranches() {
        this.branchService.get().subscribe((data) => {
            this.branchTableData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    // loadAllProducts() {
    //     this.productService.getAllProducts().subscribe((data) => {
    //         this.productTableData = data.result;
    //     }, (err) => {
    //         ////console.log('Error', err);
    //     });
    // }

    loadAllStaff() {
        this.staffService.getAllStaff().subscribe((data) => {
            this.staffTableData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllFrequencyTypes() {
        this.limitService.getAllLimitFrequencyTypes().subscribe((data) => {
            this.limitFrequencyTypeData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllSectors() {
        this.genSetupService.getAllSectors().subscribe((data) => {
            this.sectorTableData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllCustomerGroups() {
        this.customerGrpService.getCustomerGroups().subscribe((data) => {
            this.custGrpTableData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    showLimitDefinitionForm() {
        this.loadAllForms();
        this.displayLimitDefinitionModal = true;
    }

    showLimitDetailForm() {
        this.loadAllForms();
        this.displayLimitDetailModal = true;
    }

    editLimitDefinition(index) {
        this.displayLimitDefinitionModal = true;

        let row = this.limitsTableData[index];
        this.limitDefinitionForm = this.fb.group({
            limitId: [row.limitId],
            limitName: [row.limitName],
            limitValueTypeId: [row.limitValueTypeId],
            limitMetricId: [row.limitMetricId],
        });
    }

    editLimitDetail(index) {
        this.displayLimitDetailModal = true;

        let row = this.limitDetailsTableData[index];
        this.limitDetailForm = this.fb.group({
            limitDetailId: [row.limitDetailId],
            limitTypeId: [row.limitTypeId],
            limitId: [row.limitId],
            maximumValue: [row.maximumValue],
            minimumValue: [row.maximumValue],
            targetId: [row.targetId],
            limitFrequencyTypeId: [row.limitFrequencyTypeId]
        });

        ////console.log('selected limit detail', this.limitDetailForm.value);
    }

    submitLimitDefinitionForm(form) {
        this.loadingService.show();

        let bodyObj = {
            limitName: form.value.limitName,
            limitValueTypeId: form.value.limitValueTypeId,
            limitMetricId: form.value.limitMetricId
        };

        let selectedId = form.value.limitId;
        if (selectedId === '') { // creating a new group
            this.limitService.addLimit(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllLimits();
                this.displayLimitDefinitionModal = false;
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        } else {
            this.limitService.updateLimit(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllLimits();
                this.displayLimitDefinitionModal = false;
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        }
    }

    submitLimitDetailForm(form) {
        this.loadingService.show();

        if (this.customerModel != null) {
            ////console.log('customer', this.customerModel);
            this.limitDetailForm.controls['targetId'].setValue(this.customerModel.customerId);
        }
        if (this.branchModel != null) {
            ////console.log('branch', this.branchModel);
            this.limitDetailForm.controls['targetId'].setValue(this.branchModel.branchId);
            this.limitDetailForm.controls['maximumValue'].setValue(this.branchModel.branchLimit);
        }
        if (this.groupModel != null) {
            ////console.log('group', this.groupModel);
            this.limitDetailForm.controls['targetId'].setValue(this.groupModel.customerGroupId);
        }
        if (this.staffModel != null) {
            ////console.log('staff', this.staffModel);
            this.limitDetailForm.controls['targetId'].setValue(this.staffModel.staffId);
            // this.limitDetailForm.controls['maximumValue'].setValue(this.staffModel.branchLimit);
        }

        let bodyObj = {
            limitTypeId: form.value.limitTypeId,
            limitId: form.value.limitId,
            maximumValue: form.value.maximumValue,
            minimumValue: form.value.minimumValue,
            targetId: form.value.targetId,
            limitFrequencyTypeId: form.value.limitFrequencyTypeId,
        };

        ////console.log('body obj', bodyObj);

        let selectedId = form.value.limitDetailId;

        if (selectedId === '') { // creating a new group
            this.limitService.addLimitDetail(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllLimitDetails();
                this.displayLimitDetailModal = false;
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        } else {
            this.limitService.updateLimitDetail(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllLimitDetails();
                this.displayLimitDetailModal = false;
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        }
    }

    pickSearchedCustomerData(item) {
        this.selectedCustomer = item;
        this.customerFilteredData = this.customerTableData.filter(x => x.customerId === item.customerId);
        this.displayCustomerSearchModal = false;
        this.showCustomerTable = true;
    }

    pickSearchedStaffData(item) {
        this.selectedStaff = item;
        this.staffFilteredData = this.staffTableData.filter(x => x.staffId === item.staffId);
        this.displayStaffSearchModal = false;
        this.showStaffTable = true;
    }

    pickSearchedGroupData(item) {
        this.selectedGroup = item;
        this.groupFilteredData = this.custGrpTableData.filter(x => x.customerGroupId === item.customerGroupId);
        this.displayGroupSearchModal = false;
        this.showGroupTable = true;
    }

    submitMutlipleLimitDetails(form) {
        ////console.log('sector data', this.sectorTableData);

        let formObj = [];

        this.sectorModel.forEach(element => {
            formObj.push({
                limitTypeId: form.value.limitTypeId,
                limitId: form.value.limitId,
                maximumValue: element.sectorLimit,
                minimumValue: form.value.minimumValue,
                targetId: element.sectorId,
                limitFrequencyTypeId: form.value.limitFrequencyTypeId,
            });
        });

        ////console.log('final form obj', formObj);

        this.limitService.addMultipleLimitDetail(formObj).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
            this.loadAllLimitDetails();
            this.displayLimitDetailModal = false;
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
        this.loadAllForms();
    }

    onRowSelect(evt) {
        evt.preventDefault();

        if (this.sectorModel !== undefined) {
            this.sectorModel.forEach(element => {
                this.totalRiskAppetite += parseInt(element.sectorLimit);
            });
        }
    }
}
