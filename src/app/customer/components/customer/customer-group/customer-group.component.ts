import { Component, OnInit } from '@angular/core';
import {
    DataTableModule, SharedModule, TabViewModule,
    ConfirmDialogModule, ConfirmationService
} from 'primeng/primeng';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingService } from '../../../../shared/services/loading.service';
import { CustomerGroup, CustomerGroupMap, CustomerGroupRelationship } from '../../../models/customer';
import { CustomerGroupService } from '../../../services/customer-group.service';
import { CustomerService } from '../../../services/customer.service';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: './customer-group.component.html',
    providers: [ConfirmationService]
})
export class CustomerGroupComponent implements OnInit {

    custGroups: CustomerGroup[];
    custGroupMappings: CustomerGroupMap[];
    custGroupRelTypes: any[];

    customerGroupForm: FormGroup;
    groupMappingForm: FormGroup;
    customerSearchForm: FormGroup;
    mappingForm: FormGroup;
    custGroupMappingModel: any[] = [];
    custGroupTableCols: any[];

    activeIndex: 0;
    displayModalForm: boolean = false;
    displayGroupMappingForm: boolean = false;
    displaySearchResults: boolean = false;
    displayMappedCustomers: boolean = false;

    searchQuery: string;
    branches: any[];
    customerTypes: any[];
    customersNotMapped: any[];
    customersMapped: any[];
    selectedCustomerIndex: number;
    selectedGroupId: number = null;
    grpMapId: any;
    selectedGroup: any;
    selectedRelationship: any;
    riskRatings: any[];
    entityTitle: string = "New customer Group"
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    custTempGroups: any;

    constructor(private loadingService: LoadingService, private fb: FormBuilder, private customerService: CustomerService,
        private custGroupService: CustomerGroupService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.loadingService.show();

        // this.custGroupRelTypes = [
        //     { relationshipTypeId: 1, relationshipTypeName: 'Supplier' },
        //     { relationshipTypeId: 2, relationshipTypeName: 'Distributor' },
        //     { relationshipTypeId: 3, relationshipTypeName: 'Spouse' },
        //     { relationshipTypeId: 4, relationshipTypeName: 'Sibling' },
        //     { relationshipTypeId: 5, relationshipTypeName: 'Relative' }
        // ];

        this.custGroupTableCols = [
            { field: 'groupName', header: 'Group Name' },
            { field: 'groupCode', header: 'Group Code' },
            { field: 'groupDescription', header: 'Group Description' },
            { field: 'riskRating', header: 'Risk Rating' }
        ];
        this.loanAllRiskRating();
        this.getAllCustomers();
        this.loadAllCustomerGroups();
        this.loadAllTempCustomerGroups();
        this.loadCustomerGroupRelationshipTypes();
        this.loadCustomerGroupForm();
        this.loadGroupMappingForm();
        this.clearSearchForm();
        // this.loadDropdowns();

    }

    loanAllRiskRating() {
        this.customerService.getCustomerRiskRating().subscribe((response: any) => {
            this.riskRatings = response.result;
        });
    }

    loadAllCustomerGroups(): void {
        let dataObj: any;
        this.custGroupService.getCustomerGroups().subscribe((data) => {
            dataObj = data;
            this.custGroups = data.result;
            this.loadingService.hide();
        }, (err) => {
            ////console.log('Error', dataObj.message);
            this.loadingService.hide();
        });
    }

    loadAllTempCustomerGroups(): void {
        let dataObj: any;
        this.custGroupService.getTempCustomerGroups().subscribe((data) => {
            dataObj = data;
            this.custTempGroups = data.result;
           // console.log("this.custTempGroups: ", this.custTempGroups);
            this.loadingService.hide();
        }, (err) => {
            ////console.log('Error', dataObj.message);
            this.loadingService.hide();
        });
    }

    loadCustomerGroupRelationshipTypes() {
        let custRelTypes: CustomerGroupRelationship[];
        this.custGroupRelTypes = [];
        this.custGroupService.getCustomerGroupRelationshipTypes().subscribe((data) => {
            custRelTypes = data.result;
            custRelTypes.forEach(element => {
                this.custGroupRelTypes.push({
                    relationshipTypeId: element.lookupId, relationshipTypeName: element.lookupName
                });
            });
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    showModalForm() {
        this.loadCustomerGroupForm();
        this.displayModalForm = true;
        this.entityTitle = "New Customer Group";
    }

    loadCustomerGroupForm() {
        this.customerGroupForm = this.fb.group({
            customerGroupId: [''],
            groupName: ['', Validators.required],
            groupCode: ['', Validators.required],
            groupDescription: [''],
            groupContactPerson: ['', Validators.required],
            groupAddress: ['', Validators.required],
            riskRatingId: ['']

        });
    }

    loadGroupMappingForm() {
        this.groupMappingForm = this.fb.group({
            customerId: [''],
            customerGroupId: [''],
            relationshipTypeId: ['']
        });
        this.mappingForm = this.fb.group({
            customerName: [''],
            customerGroupName: [''],
            relationshipTypeName: ['']
        });
    }

    clearSearchForm() {
        this.customerSearchForm = this.fb.group({
            customerName: ['', Validators.required],
            phoneNumber: [''],
            customerTypeId: [''],
            branchId: [''],
        });
    }

    getAllCustomers(): void {
        this.customerService.getCustomersByBranch().subscribe((response: any) => {
            this.customersNotMapped = response.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    onCustomerGroupChanged(grpId) {
       // console.log("Test: ", grpId);
        this.selectedGroupId = parseInt(grpId, 32);
        this.getMappedCustomers(grpId);
        // this.getMappedCustomers(parseInt(grpId, 32));
        this.selectedGroup = this.custGroups[parseInt(grpId, 32) - 1];
        ////console.log('selected Group', this.selectedGroup);
    }

    onRelationshipTypeChanged(relTypeId) {
        this.selectedRelationship = this.custGroupRelTypes[parseInt(relTypeId, 32) - 1];
    }

    getMappedCustomers(groupId: number) {
        //console.log("Test1: ", groupId);
        //this.custGroupService.getCustomerGroupMappingByGroupId(groupId).subscribe((data) => {
        this.custGroupService.getTempCustomerGroupMappingByGroupId(groupId).subscribe((data) => {
            this.customersMapped = data.result;
           // console.log('mapped customers', this.customersMapped);
            this.displayMappedCustomers = true;
            this.loadingService.hide();
        }, err => {
            this.loadingService.hide();
        });
    }

    editCustomerGroup(index): void {
        this.entityTitle = "Edit Customer Group";
        this.displayModalForm = true;

        let row = index;
        this.customerGroupForm = this.fb.group({
            customerGroupId: [row.customerGroupId],
            groupName: [row.groupName, Validators.required],
            groupCode: [row.groupCode, Validators.required],
            groupDescription: [row.groupDescription],
            groupContactPerson: [row.groupContactPerson, Validators.required],
            groupAddress: [row.groupAddress, Validators.required],
            riskRatingId: [row.riskRatingId]
        });
    }

    submitGroupForm(form) {
        this.loadingService.show();
        let bodyObj = {
            // customerGroupId: form.value.customerGroupId,
            groupName: form.value.groupName,
            groupCode: form.value.groupCode,
            groupDescription: form.value.groupDescription,
            groupContactPerson: form.value.groupContactPerson,
            groupAddress: form.value.groupAddress,
            riskRatingId: form.value.riskRatingId
        };
        let selectedId = form.value.customerGroupId;
        if (selectedId === '') { // creating a new group
            this.custGroupService.addCustomerGroup(bodyObj).subscribe((res) => {
                if (res.success === true) {                    
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadAllCustomerGroups();
                    this.displayModalForm = false;
                    //this.loadAllTempCustomerGroups();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadingService.hide();
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, (JSON.stringify(err)), 'error');
                this.loadingService.hide();
            });
            this.clearSearchForm();
            this.loadAllCustomerGroups();
            //this.loadAllTempCustomerGroups();
        } else { // updating an existing group
            this.custGroupService.updateCustomerGroup(bodyObj, selectedId).subscribe((res) => {
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadAllCustomerGroups();
                    this.displayModalForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadingService.hide();
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, (JSON.stringify(err)), 'error');
                this.loadingService.hide();
            });
            this.loadAllCustomerGroups();
        }
    }

    mapCustomerMultiple(index, evt) {
        evt.preventDefault();
        this.loadingService.show();
        const selectedCustomer = this.customersNotMapped[index];
        if (this.customersMapped === undefined) {
            this.customersMapped = [];
        }
        let addedGroup = {
            customerId: selectedCustomer.customerId,
            customerGroupId: 0,
            relationshipTypeId: 0
        };
        this.custGroupMappingModel.push(addedGroup);
        this.customersMapped.push(selectedCustomer);
        this.customersNotMapped.splice(index, 1);
        ////console.log('mapped security', this.custGroupMappingModel);
        this.loadingService.hide();
    }

    mapCustomer(index, evt) {
        evt.preventDefault();
        this.selectedCustomerIndex = index;
        let selectedCustomer = this.customersNotMapped[index];
        let tempForm = this.groupMappingForm.value;
        this.mappingForm = this.fb.group({
            customerName: [selectedCustomer.customerName],
            customerGroupName: [this.selectedGroup.groupName],
            relationshipTypeName: [this.selectedRelationship.relationshipTypeName]
        });
        // let mappingForm = this.groupMappingForm.value;
        // let postBody = this.fb.group({
        //     customerId: [selectedCustomer.customerId],
        //     customerGroupId: [mappingForm.customerGroupId],
        //     relationshipTypeId: [mappingForm.relationshipTypeId]
        // });
        this.displayGroupMappingForm = true;
        // this.custGroupService.addCustomerGroupMapping(postBody).subscribe((res) => {
        //     if (res.success === true) {
        //         this.finishGood(res.message);
        //         this.customersNotMapped.splice(this.selectedCustomerIndex, 1);
        //         this.getMappedCustomers(mappingForm.customerGroupId);
        //     } else {
        //         this.finishBad(res.message);
        //     }
        //     this.loadingService.hide();
        // }, (err: any) => {
        //     this.finishBad(JSON.stringify(err));
        //     this.loadingService.hide();
        // });
    }

    onFormSubmitted() {
        let index = this.selectedCustomerIndex;
        let selectedCustomer = this.customersNotMapped[index];
        let formObj = this.groupMappingForm.value;
        let postBody = {
            'customerId': selectedCustomer.customerId,
            'customerGroupId': formObj.customerGroupId,
            'relationshipTypeId': formObj.relationshipTypeId
        };
        this.loadingService.show();
        ////console.log('postBody', postBody);
        this.custGroupService.addCustomerGroupMapping(postBody).subscribe((res) => {
            if (res.success === true) {
                this.finishGood(res.message);
                this.customersNotMapped.splice(this.selectedCustomerIndex, 1);
                this.getMappedCustomers(formObj.customerGroupId);
            } else {
                this.finishBad(res.message);
            }
            this.loadingService.hide();
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide();
        });
    }
    onFormMultipleSubmitted() {
        let index = this.selectedCustomerIndex;
        let formObj = this.groupMappingForm.value;
        let postBody = [];
        this.customersMapped.forEach(element => {
            //this.custGroupMappingModel.forEach(element => {
            postBody.push({
                customerId: element.customerId,
                customerGroupId: formObj.customerGroupId,
                relationshipTypeId: formObj.relationshipTypeId
            });
        });
        this.loadingService.show();
        ////console.log('postBody', postBody);
        this.custGroupService.addCustomerGroupMappingMultiple(postBody).subscribe((res) => {
            if (res.success === true) {
                this.finishGood(res.message);
                this.customersNotMapped.splice(this.selectedCustomerIndex, 1);
                this.getMappedCustomers(formObj.customerGroupId);
            } else {
                this.finishBad(res.message);
            }
            this.loadingService.hide();
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide();
        });
    }
    removeCustomerMultiple(index, evt) {
        evt.preventDefault();
        this.loadingService.show();
        if (this.customersNotMapped === undefined) {
            this.customersNotMapped = [];
        }
        const SelectedCustomer = this.customersMapped[index];
        const selectedId = SelectedCustomer.customerId;
        this.customersNotMapped.push(SelectedCustomer);
        this.customersMapped.splice(index, 1);

        // this.customersNotMapped.splice(selectedId, 0, SelectedCustomer);

        this.loadingService.hide();
    }
    removeCustomerMap(index, evt) {
        event.preventDefault();

        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {
            __this.loadingService.show();
            let selectedCustomer = __this.customersMapped[index];
            let selectedId = selectedCustomer.customerGroupMappingId;
            __this.custGroupService.deleteCustomerGroupMaping(selectedId).subscribe((res) => {
                __this.loadingService.hide();
                if (res.success === true) {
                    __this.customersNotMapped.push(selectedCustomer);
                    __this.customersMapped.splice(index, 1);
                    // this.finishGood(res.message);
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    // this.finishBad(res.message);
                }
                __this.displayGroupMappingForm = false;
            }, (err: any) => {
                // this.finishBad(JSON.stringify(err));
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                __this.loadingService.hide();
            });
        });
    }

    handleChange(event) {
        this.activeIndex = event.index;
    }

    searchCustomers(query: string) {
        ////console.log('Query params', query);
        this.loadingService.show();
        if (this.selectedGroupId === null) {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please select  group before searching', 'error');
        }
        let tempObj: any;
        this.customerService.searchCustomer(query).subscribe((data) => {
            tempObj = data.result;
            this.customersNotMapped = tempObj;
            this.filterSearchResult();
            this.displaySearchResults = true;
            this.loadingService.hide();
        });
    }
    filterSearchResult() {
        //Compare two array and return the difference
        if (this.customersNotMapped === undefined) {
            this.customersNotMapped = [];
        }
        let listDiff: any[] = []; // new array to be returned
        for (let notMapped of this.customersNotMapped) {
            let isDup: boolean = false;
            for (let mapped of this.customersMapped) {
                if (notMapped.customerId === mapped.customerId) {
                    isDup = true;
                    break;
                }
            }
            if (!isDup) listDiff.push(notMapped); // append non-duplicated
        }
        this.customersNotMapped = listDiff;
    }

    finishBad(message) {
        this.showMessage(message, 'error', 'FintrakBanking');
        this.loadingService.hide();
    }

    finishGood(message) {
        // this.displayModalForm = false;
        // this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', 'FintrakBanking');
        // this.getAll();
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
