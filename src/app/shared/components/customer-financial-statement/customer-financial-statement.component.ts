import { ValidationService } from '../../services/validation.service';
import swal from 'sweetalert2';
import { AppConstant, GlobalConfig } from '../../constant/app.constant';
import { CustomerService } from '../../../customer/services/customer.service';
import { CustomerGroupService } from '../../../customer/services/customer-group.service';
import { CustomerFSCaptionService } from '../../../setup/services/customer-fscaption.service';
import { LoadingService } from '../../services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-customer-financial-statement',
  templateUrl: './customer-financial-statement.component.html',

})
export class CustomerFinancialStatementComponent implements OnInit {
  fsCaptionGroups: any = null;
  fsRatioValueTableCols: any[];
  fsRatioValueData: any[];
  mappedFSCaptionDetailTableData: any;
  custGrpTableData: any[] = [];
  customerTableCols: any[];
  custGrpTableCols: any[];
  customerModel: any;
  custGrpModel: any;
  customerFsCaptionGroups: any[];
  unMappedFsCaptionsTableData: any[] = [];
  unMappedFsCaptionsTableCols: any[];
  mappedFSCaptionTableData: any[] = [];
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

  setCaptionAmountsForm: FormGroup;
  unMappedCaptionsForm: FormGroup;

  activeIndex = 0;

  searchFormObj: any;
  captionGrpId = 0;

  @Input() displayFinancialStatement: boolean = false;
  @Input("canDoFinancialStatementEntry") canDoFinancialEntry: boolean = false;
  @Input() viewCustomerFinancialStatement: boolean = false;
  @Input() isAnalyst: boolean = false;

  @Input() set customerId(value: number) {
    if (value > 0 && this.viewCustomerFinancialStatement == true) this.loadCustomerDetails(value);
  }

  constructor(private fb: FormBuilder, private loadingService: LoadingService,
    private custFSCaptionService: CustomerFSCaptionService, private custService: CustomerService,
    private custGroupService: CustomerGroupService) { }

  ngOnInit() {
    this.loadingService.show();
    // this.loadCustomerDetails(this.customerId);
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
      { field: 'fsGroupName', header: 'FS Caption Group' },
      { field: 'fsCaptionName', header: 'FS Caption Name' },
      //{ field: 'fsCaptionPosition', header: 'FS Caption Position' },
      // { field: 'accountCategoryName', header: 'Account Category' },
      //{ field: 'fsTypeName', header: 'FS Type' },
      // { field: 'fsDate', header: 'Date' },
      // {field: 'amount', header: 'Amount'}
    ];

    this.loadAllForms();
    this.loadingService.hide();
  }
  loadAllFSCaptionGroups() {
    this.custFSCaptionService.getAllCustomerFSCaptionGroupWithoutRatio().subscribe((data) => {
      this.customerFsCaptionGroups = data.result;
    });
  }

  loadCustomerDetails(customerId) {
    this.loadingService.show();
    this.custService.getSingleCustomerGeneralInfoByCustomerId(customerId).subscribe((data) => {
      this.customerModel = data.result;
      if (this.customerModel != undefined) {
        if (this.canDoFinancialEntry == true) {
          this.loadAllFSCaptionGroups();
          this.loadMappedFsCaptionsDetails(this.customerModel.customerId);
        }
        this.loadRatioValue(this.customerModel.customerId);
      }
      this.displayCustomerResults = true;
      this.loadingService.hide();
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.loadingService.hide();
    });
  }

  onFSCaptionGroupSelect(fsCaptionGrpId) {
    this.loadingService.show();
    var dateStr = new Date(this.selectedDate).toLocaleString().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    this.searchFormObj = {
      fsCaptionGroupId: fsCaptionGrpId,
      customerId: this.customerModel.customerId,
      fsDate: dateStr //this.selectedDate.toLocaleDateString()
    };
    this.fsCaptionGroups = fsCaptionGrpId;
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
        customerId: this.customerModel.customerId,
        fsDate: dateStr //fsCaptionDate.toLocaleDateString()
      };

      ////console.log('form', this.searchFormObj);

      this.loadUnmappedFsCaptions(this.searchFormObj);
      this.loadMappedFsCaptions({
        fsCaptionGroupId: this.captionGrpId,
        customerId: this.customerModel.customerId,
        fsDate: dateStr //fsCaptionDate.toLocaleDateString()
      });
    }
    this.loadingService.hide();
  }

  loadUnmappedFsCaptions(formObj) {

    let params = `fsCaptionGroupId=${formObj.fsCaptionGroupId}&customerId=${formObj.customerId}&fsDate=${formObj.fsDate}`
    //this.custFSCaptionService.getUnmappedCustomerFSCaption(AppConstant.ObjectsToParams(formObj))
    this.custFSCaptionService.getUnmappedCustomerFSCaption(params)
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

  loadMappedFsCaptionsDetails(customerId) {
    this.displayMappedCaptions = false;
    this.custFSCaptionService.getFSCaptionDetailByCustomerId(customerId)
      .subscribe((data) => {
        this.mappedFSCaptionDetailTableData = data.result;
        this.displayMappedCaptions = true;
        this.loadingService.hide();
      }, (err) => {
        ////console.log('error', err);
        this.loadingService.hide();
      });
  }
  loadMappedFsCaptions(formObj) {
    this.displayMappedCaptions = false;
    let params = `fsCaptionGroupId=${formObj.fsCaptionGroupId}&customerId=${formObj.customerId}&fsDate=${formObj.fsDate}`
    //this.custFSCaptionService.getFSCaptionDetailByCustomer(AppConstant.ObjectsToParams(formObj))
    this.custFSCaptionService.getFSCaptionDetailByCustomer(params)
      .subscribe((data) => {
        this.mappedFSCaptionTableData = data.result;
        this.displayMappedCaptions = true;
        this.loadingService.hide();
      }, (err) => {
        ////console.log('error', err);
        this.loadingService.hide();
      });
  }

  createCustomerFsMap(index, evt) {
    evt.preventDefault();

    this.displayCreateEditModal = true;
    this.selectedUnmappedFsCaptionIndex = index;
    this.selectedUnmappedFsCaption = this.unMappedFsCaptionsTableData[index];


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
        this.loadMappedFsCaptionsDetails(this.customerModel.customerId);
        this.loadRatioValue(this.customerModel.customerId);
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

  showModalForm() {
    this.loadingService.show();
    // this.loadAllFSCaptionGroups();
    this.displayCreateEditModal = true;
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
  submitForm(form) {
    this.loadingService.show();
    var dateStr = new Date(this.selectedDate).toLocaleString().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    const formObj = {
      customerId: this.customerModel.customerId,
      fsCaptionId: this.selectedUnmappedFsCaption.fsCaptionId,
      fsDate: dateStr, //this.selectedDate.toLocaleDateString(),
      amount: form.value.amount
    };

    const unmappedIndex = this.unMappedFsCaptionsTableData.findIndex((item) =>
      item.fsCaptionId === this.selectedUnmappedFsCaption.fsCaptionId);

    this.custFSCaptionService.addCustomerFSCaptionDetail(formObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        this.loadMappedFsCaptions(this.searchFormObj);
        this.loadMappedFsCaptionsDetails(this.customerModel.customerId);
        this.loadRatioValue(this.customerModel.customerId);
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


  loadRatioValue(customerId) {
    this.fsRatioValueData = [];

    this.custFSCaptionService.getCustomerFSRatioValue(customerId).subscribe((data) => {
      this.fsRatioValueData = data.result;
      if (this.fsRatioValueData != null) {
        let fsDate1 = this.fsRatioValueData[0].fsDate1 != "1900-01-01T00:00:00+01:00" ? new Date(this.fsRatioValueData[0].fsDate1).toLocaleDateString("en-GB") : 'N/A';
        let fsDate2 = this.fsRatioValueData[0].fsDate2 != "1900-01-01T00:00:00+01:00" ? new Date(this.fsRatioValueData[0].fsDate2).toLocaleDateString("en-GB") : 'N/A';
        let fsDate3 = this.fsRatioValueData[0].fsDate3 != "1900-01-01T00:00:00+01:00" ? new Date(this.fsRatioValueData[0].fsDate3).toLocaleDateString("en-GB") : 'N/A';
        let fsDate4 = this.fsRatioValueData[0].fsDate4 != "1900-01-01T00:00:00+01:00" ? new Date(this.fsRatioValueData[0].fsDate4).toLocaleDateString("en-GB") : 'N/A';

        this.fsRatioValueTableCols = [
          // { field: 'ratioCaptionName', header: 'Caption' },
          { field: 'ratioValue1', header: fsDate1 },
          { field: 'ratioValue2', header: fsDate2 },
          { field: 'ratioValue3', header: fsDate3 },
          { field: 'ratioValue4', header: fsDate4 },
        ];
      }
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  
  showMapping() {
    this.activeIndex = 1;
  }
  handleChange(e) {
    this.activeIndex = e.index;
    ////console.log(this.activeIndex);

    if (this.activeIndex === 0) {
      this.displaySearchResults = false;
      this.displayMappedCaptions = false;
    }
  }
}
