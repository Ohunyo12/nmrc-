import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { StaffRealTimeSearchService } from '../../services';
import { CustomerGroupService } from '../../../customer/services/customer-group.service';
import { CustomerRealTimeSearchService } from '../../../credit/services/customer-realtime-search.service';
import { GeneralSetupService } from '../../services';
import { StaffService } from '../../../admin/services/staff.service';
import { ProductService } from '../../services';
import { CustomerService } from '../../../customer/services/customer.service';
import { LimitsService } from '../../services';
import { BranchService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-limit-details',
  templateUrl: './limit-details.component.html',
})
export class LimitDetailsComponent implements OnInit {
  entityName: string = "New Limit Detail";
  limitId: number = 0;
  limitsTableData: any[];
  limitTypeList: any[];
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
  branchFilteredTableData: any[];
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

  customerModel: any;
  branchModel: any;
  staffModel: any;
  groupModel: any;
  sectorModel: any;

  limitDetailsObligorTableData: any[];
  limitDetailsObligorfilteredTableData: any[];
  limitDetailsBranchTableData: any[];
  limitDetailsSectorTableData: any[];
  limitDetailsRMTableData: any[];
  limitDetailsPENTableData: any[];
  limitDetailsCGTableData: any[];

  displayLimitDetailModal: boolean = false;
  displayStaffSearchModal: boolean = false;
  displayCustomerSearchModal: boolean = false;
  displayGroupSearchModal: boolean = false;
  disableLimitType: boolean = false;
  showCustomerTable: boolean = false;
  showBranchTable: boolean = false;
  showProductTable: boolean = false;
  showStaffTable: boolean = false;
  showSectorTable: boolean = false;
  showEditSectorTable: boolean = false;
  showGroupTable: boolean = false;
  showPenForm: boolean = false;

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
  sectorfilteredTableData: any[];
  staffFilteredData: any = [];
  groupFilteredData: any = [];
  limitDropdowm: any;
  multiple:any;
  
  limitDetailForm: FormGroup;
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
    this.loadAllLimitDetails()
    this.loadAllLimitTypes(); this.loadAllLimits();
    this.loadAllLimitMetrics(); this.loadAllLimitValueTypes();
    this.loadAllCustomerGroups(); this.loadAllSectors(); this.loadAllCustomers();
    this.loadAllBranches(); this.loadAllStaff(); this.loadAllFrequencyTypes();
    this.loadAllForms();
    this.limitDetailsTableCols = [
      { field: 'limitName', header: 'Limit Name' },
      { field: 'targetName', header: 'Defined For:' },
      { field: 'minimumValue', header: 'Minimum Value' },
      { field: 'maximumValue', header: 'Maximum Value' },
      { field: 'limitFrequencyTypeName', header: 'Limit Frequency' }
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
      { field: 'staffFullName', header: 'Staff Name' },
      { field: 'branchName', header: 'Staff Branch' },
      { field: 'email', header: 'Email' },
    ];

    this.sectorTableCols = [
      { field: 'sectorName', header: 'Sector Name' },
      //{ field: 'sectorCode', header: 'Sector Code' },
    ];

    this.custGrpTableCols = [
      { field: 'groupCode', header: 'Group Code' },
      { field: 'groupName', header: 'Group Name' }
    ];

  }
  loadAllForms() {
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
  loadAllLimitDetails() {
    this.loadLimitDetailsBranch();
    this.loadLimitDetailsCustomerGroup();
    this.loadLimitDetailsObligor();
    this.loadLimitDetailsPEN();
    this.loadLimitDetailsRM();
    this.loadLimitDetailsSector();
  }
  loadLimitDetailsObligor() {
    this.limitService.getLimitDetailsObligor().subscribe((data) => {
      this.limitDetailsObligorTableData = data.result;
      this.limitDetailsObligorfilteredTableData = this.limitDetailsObligorTableData;
      this.loadingService.hide();
    }, (err) => {
      ////console.log('Error', err);
    });
  }
  loadLimitDetailsBranch() {
    this.limitService.getLimitDetailBranch().subscribe((data) => {
      this.limitDetailsBranchTableData = data.result;
      this.loadingService.hide();
    }, (err) => {
      ////console.log('Error', err);
    });
  }
  loadLimitDetailsCustomerGroup() {
    this.limitService.getLimitDetailCustomerGroup().subscribe((data) => {
      this.limitDetailsCGTableData = data.result;
      this.loadingService.hide();
    }, (err) => {
      ////console.log('Error', err);
    });
  }
  loadLimitDetailsRM() {
    this.limitService.getLimitDetailRelationshipManager().subscribe((data) => {
      this.limitDetailsRMTableData = data.result;
      this.loadingService.hide();
    }, (err) => {
      ////console.log('Error', err);
    });
  }
  loadLimitDetailsSector() {
    this.limitService.getLimitDetailSector().subscribe((data) => {
      this.limitDetailsSectorTableData = data.result;
      this.loadingService.hide();
    }, (err) => {
      ////console.log('Error', err);
    });
  }
  loadLimitDetailsPEN() {
    this.limitService.getLimitdetailPrelimemaryEvaluationNote().subscribe((data) => {
      this.limitDetailsPENTableData = data.result;
      this.loadingService.hide();
    }, (err) => {
      ////console.log('Error', err);
    });
  }
  loadAllLimits() {
    this.limitService.getAllLimit().subscribe((data) => {
      this.limitTypeList = [];
      this.limitsTableData = data.result;
      this.limitsTableData.forEach((role) => {
        this.limitTypeList.push({
          label: role.limitName,
          value: role.limitName
        })
      });

      ////console.log(" this.limitTypeList", this.limitTypeList);
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
      this.branchFilteredTableData = this.branchTableData;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

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
      // this.sectorfilteredTableData = this.sectorTableData;
      //Compare two array and return the difference
      let sectorDiff: any[] = []; // new array to be returned
      for (let sector of this.sectorTableData) {
        let isDup: boolean = false;
        for (let target of this.limitDetailsSectorTableData) {
          if (sector.sectorId === target.targetId) {
            isDup = true;
            break;
          }
        }
        if (!isDup) sectorDiff.push(sector); // append non-duplicated
      }
      this.sectorfilteredTableData = sectorDiff;
      ////console.log('sector list', this.sectorfilteredTableData);
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
  searchStaffDB(searchString) {
    this.staffSearchTerm$.next(searchString);
  }

  searchCustomerDB(searchString) {
    this.custSearchTerm$.next(searchString);
  }

  searchForCustomerGroup(searchString) {
    this.custGrpSearchTerm$.next(searchString);
  }
  onFilterByLimitMetris(selectedFilter) {
    ////console.log(selectedFilter);
    ////console.log(this.limitDetailsObligorfilteredTableData);
    this.limitDetailsObligorfilteredTableData = [];
    this.limitDetailsObligorfilteredTableData = this.limitDetailsObligorTableData.filter(x => x.limitId == selectedFilter);
    ////console.log(this.limitDetailsObligorfilteredTableData);
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
      case '2':
        this.showSectorTable = true;
        this.showCustomerTable = false;
        this.showStaffTable = false;
        this.showBranchTable = false;
        this.showGroupTable = false;
        this.showPenForm = false;
        this.branchModel = null; this.groupModel = null;
        this.staffModel = null; this.customerModel = null;
        break;
      case '3':
        this.showStaffTable = false;
        this.showCustomerTable = false;
        this.showBranchTable = true;
        this.showSectorTable = false;
        this.showGroupTable = false;
        this.showPenForm = false;
        this.branchModel = null; this.groupModel = null; this.sectorModel = null;
        this.customerModel = null;
        break;
      case '4':
        this.displayStaffSearchModal = true;
        this.showBranchTable = false;
        this.showCustomerTable = false;
        this.showStaffTable = false;
        this.showGroupTable = false;
        this.showPenForm = false;
        this.branchModel = null; this.groupModel = null; this.sectorModel = null;
        this.customerModel = null;
        break;
      case '5':
        this.showPenForm = true;
        this.showCustomerTable = false;
        this.showStaffTable = false;
        this.showBranchTable = false;
        this.showSectorTable = false;
        this.showGroupTable = false;
        this.branchModel = null; this.groupModel = null; this.sectorModel = null;
        this.staffModel = null; this.customerModel = null;
        break;
      case '6':
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
  onRowSelect(evt) {
    evt.preventDefault();

    if (this.sectorModel !== undefined) {
      this.sectorModel.forEach(element => {
        this.totalRiskAppetite += parseInt(element.sectorLimit);
      });
    }
  }
  showLimitDetailForm() {
    this.loadAllForms();
    this.entityName = "New Limit Details";
    this.disableLimitType = false;
    this.displayLimitDetailModal = true;
    this.showEditSectorTable = false;
    ////console.log(this.disableLimitType);
  }
  editLimitDetailObligor(index) {
    this.displayLimitDetailModal = true;
    var row = this.limitDetailsObligorTableData[index];
    this.entityName = "Edit Obligor Limit For:   " + row.targetName;
    this.limitDetailForm = this.fb.group({
      limitDetailId: [row.limitDetailId],
      limitTypeId: [row.limitTypeId],
      limitId: [row.limitId],
      maximumValue: [row.maximumValue],
      minimumValue: [row.minimumValue],
      targetId: [row.targetId],
      limitFrequencyTypeId: [row.limitFrequencyTypeId],
      allowOverride: [false],
    });
    this.disableLimitType = true;
    this.pickEditCustomerData(this.limitDetailForm.value);
  }
  editLimitDetailSector(index) {
    this.displayLimitDetailModal = true;
    var row = this.limitDetailsSectorTableData[index];
    this.entityName = "Edit Sector Limit For:   " + row.targetName;
    this.limitDetailForm = this.fb.group({
      limitDetailId: [row.limitDetailId],
      limitTypeId: [row.limitTypeId],
      limitId: [row.limitId],
      maximumValue: [row.maximumValue],
      minimumValue: [row.minimumValue],
      targetId: [row.targetId],
      limitFrequencyTypeId: [row.limitFrequencyTypeId],
      allowOverride: [false],
    });
    this.pickEditSectorData(this.limitDetailForm.value);
  }
  editLimitDetailBranch(index) {
    this.displayLimitDetailModal = true;
    var row = this.limitDetailsBranchTableData[index];
    this.entityName = "Edit Branch Limit For:   " + row.targetName;
    this.limitDetailForm = this.fb.group({
      limitDetailId: [row.limitDetailId],
      limitTypeId: [row.limitTypeId],
      limitId: [row.limitId],
      maximumValue: [row.maximumValue],
      minimumValue: [row.minimumValue],
      targetId: [row.targetId],
      limitFrequencyTypeId: [row.limitFrequencyTypeId],
      allowOverride: [false],
    });
    this.pickEditBranchData(this.limitDetailForm.value);
  }
  editLimitDetailStaff(index) {
    this.displayLimitDetailModal = true;
    var row = this.limitDetailsRMTableData[index];
    this.entityName = "Edit RElationship Manager Limit For:   " + row.targetName;
    this.limitDetailForm = this.fb.group({
      limitDetailId: [row.limitDetailId],
      limitTypeId: [row.limitTypeId],
      limitId: [row.limitId],
      maximumValue: [row.maximumValue],
      minimumValue: [row.minimumValue],
      targetId: [row.targetId],
      limitFrequencyTypeId: [row.limitFrequencyTypeId],
      allowOverride: [false],
    });
    this.pickEditStaffData(this.limitDetailForm.value);
  }
  editLimitDetailPEN(index) {
    this.displayLimitDetailModal = true;
    var row = this.limitDetailsPENTableData[index];
    this.entityName = "Edit Preliminary Evaluation Note Limit ";
    this.limitDetailForm = this.fb.group({
      limitDetailId: [row.limitDetailId],
      limitTypeId: [row.limitTypeId],
      limitId: [row.limitId],
      maximumValue: [row.maximumValue],
      minimumValue: [row.minimumValue],
      targetId: [row.targetId],
      limitFrequencyTypeId: [row.limitFrequencyTypeId],
      allowOverride: [false],
    });
    this.pickEditPenData(this.limitDetailForm.value);
  }
  editLimitDetailGroup(index) {
    this.displayLimitDetailModal = true;
    var row = this.limitDetailsCGTableData[index];
    this.entityName = "Edit Customer Group Limit For:   " + row.targetName;
    this.limitDetailForm = this.fb.group({
      limitDetailId: [row.limitDetailId],
      limitTypeId: [row.limitTypeId],
      limitId: [row.limitId],
      maximumValue: [row.maximumValue],
      minimumValue: [row.minimumValue],
      targetId: [row.targetId],
      limitFrequencyTypeId: [row.limitFrequencyTypeId],
      allowOverride: [false],
    });
    this.pickEditGroupData(this.limitDetailForm.value);
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
          return;
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

  pickEditCustomerData(item) {
    this.selectedCustomer = item;
    this.customerFilteredData = this.customerTableData.filter(x => x.customerId === item.targetId);
    this.displayCustomerSearchModal = false;
    this.showCustomerTable = true;
    this.showStaffTable = false;
    this.showBranchTable = false;
    this.showSectorTable = false;
    this.showEditSectorTable = false;
    this.showPenForm = false;
    this.branchModel = null; this.groupModel = null; this.sectorModel = null;
    this.staffModel = null;
  }
  pickEditSectorData(item) {
    this.sectorfilteredTableData = [];
    this.selectedCustomer = item;
    this.sectorfilteredTableData = this.sectorTableData.filter(x => x.sectorId === item.targetId);
    this.disableLimitType = true;
    this.showEditSectorTable = true;
    this.showSectorTable = false;
    this.showCustomerTable = false;
    this.showStaffTable = false;
    this.showBranchTable = false;
    this.showGroupTable = false;
    this.showPenForm = false;
    this.branchModel = null; this.groupModel = null;
    this.staffModel = null; this.customerModel = null;
  }
  pickEditBranchData(item) {
    this.branchFilteredTableData = [];
    this.selectedCustomer = item;
    this.branchFilteredTableData = this.branchTableData.filter(x => x.branchId === item.targetId);
    this.disableLimitType = true;
    this.showEditSectorTable = false;
    this.showSectorTable = false;
    this.showCustomerTable = false;
    this.showStaffTable = false;
    this.showBranchTable = true;
    this.showGroupTable = false;
    this.showPenForm = false;
    this.sectorModel = null; this.groupModel = null;
    this.staffModel = null; this.customerModel = null;
  }
  pickEditStaffData(item) {
    this.staffFilteredData = [];
    this.selectedCustomer = item;
    this.staffFilteredData = this.staffTableData.filter(x => x.staffId === item.targetId);
    this.disableLimitType = true;
    this.showEditSectorTable = false;
    this.showBranchTable = false;
    this.showCustomerTable = false;
    this.showStaffTable = true;
    this.showGroupTable = false;
    this.showPenForm = false;
    this.branchModel = null; this.groupModel = null; this.sectorModel = null;
    this.customerModel = null;
    ////console.log("this is just the begining", this.staffTableData);
  }
  pickEditPenData(item) {
    this.selectedCustomer = item;
    this.disableLimitType = true;
    this.showEditSectorTable = false;
    this.showPenForm = true;
    this.showCustomerTable = false;
    this.showStaffTable = false;
    this.showBranchTable = false;
    this.showSectorTable = false;
    this.showGroupTable = false;
    this.branchModel = null; this.groupModel = null; this.sectorModel = null;
    this.staffModel = null; this.customerModel = null;
  }

  pickEditGroupData(item) {
    this.groupFilteredData = [];
    this.selectedCustomer = item;
    this.groupFilteredData = this.custGrpTableData.filter(x => x.customerGroupId === item.targetId);
    this.disableLimitType = true;
    this.displayGroupSearchModal = false;
    this.showCustomerTable = false;
    this.showStaffTable = false;
    this.showBranchTable = false;
    this.showGroupTable = true;
    this.showPenForm = false;
    this.branchModel = null; this.sectorModel = null;
    this.staffModel = null; this.customerModel = null;
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
}
