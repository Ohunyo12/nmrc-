import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from '../services/loan.service';
import { Subject } from 'rxjs';
import { CollateralService, CurrencyService } from 'app/setup/services';
import { ApplicationStatus, GlobalConfig, CollateralType } from 'app/shared/constant/app.constant';
import { fbind } from 'q';
import { ApprovalService } from 'app/setup/services';
import { CustomerInformationDetailComponent } from 'app/customer/components';

@Component({
    templateUrl: 'atc-lodgment.component.html',
    selector: 'atc-lodgment',
 //   providers: [_SERVICE_IMPORT_, LoadingService] 
})
export class AtcLodgmentComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    AtcLodgments: any;
    activeTabindex: any;
    singleCustomerType: number;
    selectedCustomerId: any;
    selectedCustomerName: any;
    customerList: any;
    searchCustomerId:any;
    showCusotmerSearch:boolean=false;
    AtcType: any;
    customerId: any;
    showAdditionalDocument:any;
    atcLodgmentDetail: FormGroup;
    AtcLodgmentDetail:any;
    atcLodgmentId: any;
    AtcLodgmentDetailList: any;
    showPhoneNumberSearch: boolean = false;
    showNewTypeInput: boolean = false;
    actTypeName: any;
    atcTypeForm: FormGroup;
    branches: any[];
    currencies: any[];
    customerIdForEdit: any;
    collateralList: any;
    selectedCollateralId: any;
    selectedRow: any;
    mainCollateralDetail: any;
    customerCollateral: any;
    isVisitation: any;
    isInsurancePolicy: any;
    collateralId: any;
    customerName: any;
    collateralMarketableSecurity: boolean;
    mainCollateralView: boolean;
    collateralProperty: boolean;
    collateralGaurantee: boolean;
    collateralEquipment: boolean;
    collateralVehicle: boolean;
    collateralStock: boolean;
    collateralPreciousMetal: boolean;
    collateralCasa: boolean;
    collateralDeposit: boolean;
    collateralItemPolicy: boolean;
    collateralPromissory: boolean;
    indemnity: boolean;
    domiciliationContract: boolean;
    domiciliationSalary: boolean;
    useSearch: boolean;
    selectedAtcLodgementRows: any[] = [];
    hideGrid: boolean;
    supportingDocuments: any;
    originalDocumentApproval: any;
    collateralIspo: boolean;
    rowToEdit: any;
    arrayLength: number = 0;

    
    @Input() set reload(value: number) { if (value > 0) this.getAtcLodgments(); }
    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
    formState: string = 'New';
    selectedId: number = null;

    atcLodgments: any[] = [];
    atcLodgmentForm: FormGroup;
    displayAtcLodgmentForm: boolean = false;
    displayAccountBalance: boolean = false;
    accountBalances: any;
    showDocumentUpload: any;

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private loanService: LoanService,
        private collateralService: CollateralService,
        private currencyService: CurrencyService,
        private approvalService: ApprovalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getAtcLodgments();
        this.getAtcType();
        this.getBranch();
        this.getAllCurrencies();
    }

    // ------------------- api-calls --------------------

    saveAtcLodgment(form) {

        let body = {
            customerId: this.customerId,
            atcTypeId: form.value.atcTypeId,
            description: form.value.description,
            depot: form.value.depot,
            unitValue: form.value.unitValue,
            unitNumber: form.value.unitNumber,
            numberOfBags: form.value.numberOfBags,
            branchId:form.value.branchId,
            currencyId : form.value.currencyId,
        };

        this.loadingService.show();
        if (this.selectedId === null) {
            this.loanService.saveAtcLodgment(body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true){ this.reloadGrid();
                    this.activeTabindex = 0; this.clearControls();
                    this.displayAtcLodgmentForm = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');}
                else{ this.finishBad(response.message);}
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {

            let body = {
                customerId: this.customerIdForEdit,
                atcTypeId: form.value.atcTypeId,
                description: form.value.description,
                depot: form.value.depot,
                unitValue: form.value.unitValue,
                unitNumber: form.value.unitNumber,
                numberOfBags: form.value.numberOfBags,
                branchId:form.value.branchId,
                currencyId : form.value.currencyId,
                approvalStatusId: this.rowToEdit.approvalStatusId,
            };
            this.loanService.editAtcLodgment(this.selectedId,body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) 
                {
                    if(this.rowToEdit.approvalStatusId == 5)
                    {
                        this.saveAtcLodgmentForApproval(this.rowToEdit);
                    }
                    this.reloadGrid();
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
        
    }
 
    showCustomerInformation(customerId) {
        this.customerInfo.viewSingleCustomerDetails(customerId);
    }

    onRowSelect(data) {
        let index = this.selectedAtcLodgementRows.findIndex(obj => obj.atcLodgmentId == data.atcLodgmentId);  
        if(data.approvalStatusId != 2 && index < 0 || index == null)
        {
            this.selectedAtcLodgementRows.push ({
              approvalStatusId: data.approvalStatusId,
              approvalStatusName: data.approvalStatusName,
              atcLodgmentId: data.atcLodgmentId,
              atcReleaseId: data.atcReleaseId,
              atcTypeId: data.atcTypeId,
              branchId: data.branchId,
              branchName: data.branchName,
              companyId: data.companyId,
              createdBy: data.createdBy,
              customerCode: data.customerCode,
              customerId: data.customerId,
              customerName: data.customerName,
              depot: data.depot,
              description: data.description,
              numberOfBags: data.numberOfBags,
              totalValue: data.totalValue,
              unitNumber: data.unitNumber,
              unitValue: data.unitValue,
              dateCreated: data.dateCreated
          });
          this.arrayLength = this.selectedAtcLodgementRows.length;
        }
        else 
        {
          this.message = 'ERROR!\nInvalid Input or ATC already approved';
          swal(`${GlobalConfig.APPLICATION_NAME}`, this.message, 'error');
        }
    }

    remove(row){
        let index = this.selectedAtcLodgementRows.findIndex(obj=> obj.atcLodgmentId == row.atcLodgmentId);
        if(index > -1)
        {
          this.selectedAtcLodgementRows.splice(index, 1);
        }
      }

    onRowSelectUnselect(row){
        this.remove(row);
        this.arrayLength = this.selectedAtcLodgementRows.length;
      }
    saveAtcLodgmentForApproval(row) {

        //console.log('row', row);
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This will go for Approval, Are you sure you want to proceed?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            
            
        let body = {
            approvalStatusId: row.approvalStatusId,
            atcLodgmentId: row.atcLodgmentId,
            customerId: row.customerId,
            atcTypeId: row.atcTypeId,
            description: row.description,
            depot: row.depot,
            unitValue: row.unitValue,
            unitNumber: row.unitNumber,
            numberOfBags: row.numberOfBags,
            branchId: row.branchId,
            currencyId : row.currencyId,

        };

        
        __this.loadingService.show();
            __this.loanService.saveAtcLodgmentForApproval(body).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success == true){ __this.reloadGrid();
                    __this.activeTabindex = 0; __this.clearControls();
                    __this.displayAtcLodgmentForm = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Transaction has been Successfully sent for Approval', 'success');}
                else{ __this.finishBad(response.message);}
            }, (err: any) => {
                __this.loadingService.hide();
                __this.finishBad(JSON.stringify(err));
            });
        // else {
        //     console.log('__this.selectedId', __this.selectedId);
            
        //     __this.loanService.editAtcLodgment(__this.selectedId,body).subscribe((response: any) => {
        //         __this.loadingService.hide();
        //         if (response.success == true) __this.reloadGrid();
        //         else __this.finishBad(response.message);
        //     }, (err: any) => {
        //         __this.loadingService.hide();
        //         __this.finishBad(JSON.stringify(err));
        //     });
        // }
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
        
    }

    getAtcLodgments() {
        this.loanService.getAtcLodgments().subscribe((response: any) => {
            this.AtcLodgments = response.result;
                     
            
        });
    }
    getAtcType() {
        this.loanService.getAtcType().subscribe((response: any) => {
            this.AtcType = [];
            this.AtcType = response.result;
            //console.log(' this.AtcType', this.AtcType);
            
        });
    }

    saveAtcLodge(){
 
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
          
          __this.loadingService.show();
          __this.loanService.saveAtcLodgmentForApproval(__this.selectedAtcLodgementRows).subscribe((response: any) => {
            if (response.success == true) {
      
              __this.selectedAtcLodgementRows=[];
              __this.arrayLength = 0;
              __this.getAtcLodgments();
              __this.getAtcLodgments();
              __this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`,  response.message, 'success');
             // __this.activeTabindex =4;
            
            } else {
              __this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
              __this.selectedAtcLodgementRows=[];
              __this.arrayLength = 0;
              __this.getAtcLodgments();
              __this.getAtcLodgments();
             // __this.activeTabindex = 4;
            }
            
          
        });
      
      
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });      
             
      }

    getBranch() {
        this.loanService.getAllBranch().subscribe((response: any) => {
            this.branches = [];
            this.branches = response.result;
            //console.log(' branches', this.branches);
            
        });
    }
    
    deleteAtcLodgment(row) { 
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            
            
        __this.loanService.deleteAtcLodgment(row.atcLodgmentId).subscribe((response: any) => {
            if (response.result == true) __this.reloadGrid();
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    reloadGrid() {
        this.displayAtcLodgmentForm = false;
        this.getAtcLodgments();
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.atcLodgmentForm = this.fb.group({
            atcTypeId: ['', Validators.required],
            description: ['', Validators.required],
            depot: ['', Validators.required],
            unitValue: ['', Validators.required],
            numberOfBags:['', Validators.required],
            unitNumber: ['', Validators.required],
            totalValue:[''],
            branchId:['',Validators.required],
            currencyId:['',Validators.required]

        });

        this.atcLodgmentDetail = this.fb.group({
            value: ['', Validators.required],
            detail: ['', Validators.required],
        });

        this.atcTypeForm = this.fb.group({
            actTypeName:['',Validators.required]               
        })
    }

    convertToNumber(pamount) {

        if (typeof (pamount) == "string") {
            return pamount = pamount.replace(/[^0-9-.]/g, '');
        } else if (typeof (pamount) == "number") {
            return pamount = pamount;
        }

    }

    getTotal() {
       
        
        let unit = this.convertToNumber(this.atcLodgmentForm.get('unitNumber').value);
        let value = this.convertToNumber(this.atcLodgmentForm.get('unitValue').value);
        let bags = this.convertToNumber(this.atcLodgmentForm.get('numberOfBags').value);
        let total = +unit * +value * +bags;
        
        this.atcLodgmentForm.controls['totalValue'].setValue(total);
   
    }


    editAtcLodgment(row) {
        this.clearControls();
        this.rowToEdit = row;
        this.formState = 'Edit';
        this.selectedId = row.atcLodgmentId;
        this.customerIdForEdit = row.customerId;
        this.atcLodgmentForm = this.fb.group({
            customerId: [row.customerId, Validators.required],
            atcTypeId: [row.atcTypeId, Validators.required],
            description: [row.description, Validators.required],
            depot: [row.depot, Validators.required],
            unitValue: [row.unitValue, Validators.required],
            numberOfBags: [row.numberOfBags, Validators.required],
            unitNumber: [row.unitNumber, Validators.required],
            totalValue: [row.totalValue, Validators.required],
            branchId: [row.branchId, Validators.required],
            currencyId:[row.currencyId ,Validators.required]
        });
        this.displayAtcLodgmentForm = true;
        
    }

    showAtcLodgmentForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayAtcLodgmentForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
      }

     
    getCustomerDetail(id, name = null): void {
        this.searchCustomerId = id;
        this.customerId = id;
        this.clearControls();
        this.showCustomerInformation(this.customerId);
        this.getCustomerCollateral(this.searchCustomerId);
        this.showCusotmerSearch = false;
        this.activeTabindex = 1;
    }


    getCustomerCollateral(id, name = null): void {
        this.loadingService.show();
        this.collateralService.getCustomerCollateral(id, null).subscribe((response: any) => {
            this.collateralList = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
        //console.log('collateralList',this.collateralList);
    }

    viewValuationDetail(row) {
        //console.log('row', row);
        this.selectedCollateralId = row.collateralId;
        var collateralDetail = this.getCollateralInformation(row.collateralId);
        this.selectedRow = row;
       // console.log("collateralDetail:", collateralDetail);
        this.getOriginalDocumentByCollateralCustomerId(row.collateralId);
    }
    

    public getCollateralInformation(collateralCustomerId: number): any {
        this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
            .subscribe((res) => {
                this.mainCollateralDetail = res.result[0];
               // console.log(' this.mainCollateral', this.mainCollateralDetail);

                this.collateralService.GetCollateralDetailsByCollateral(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
                    .subscribe((res) => {
                        //console.log('res', res);
                        this.customerCollateral = res.result;

                        this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
                        this.isVisitation = this.mainCollateralDetail.requireVisitation;
                        this.collateralId = this.mainCollateralDetail.collateralId;
                        this.customerName = this.mainCollateralDetail.customerName;
                        this.customerId = this.mainCollateralDetail.customerId

                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.IMMOVABLE_PROPERTY) { this.collateralProperty = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.MARKETABLE_SECURITIES) { this.collateralMarketableSecurity = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.GUARANTEE) { this.collateralGaurantee = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.PLANT_AND_EQUIPMENT) { this.collateralEquipment = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.VEHICLE) { this.collateralVehicle = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.STOCK) { this.collateralStock = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.PRECIOUS_METAL) { this.collateralPreciousMetal = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.CASA) { this.collateralCasa = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.FIXED_DEPOSIT) { this.collateralDeposit = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.POLICY) { this.collateralItemPolicy = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.PROMISSORY) { this.collateralPromissory = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.INDEMNITY) { this.indemnity = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.ISPO) { this.collateralIspo = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONCONTACT) { this.domiciliationContract = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONSALARY) { this.domiciliationSalary = true; this.mainCollateralView = true; }

                        this.customerCollateral != null ? this.useSearch = false : this.useSearch = true;

                        this.getSupportingDocuments(collateralCustomerId);
                        // this.getCollateralValuations(collateralCustomerId);
                        // if (this.isInsurancePolicy) {
                        //   this.getCollaterTempItemPolicies(collateralCustomerId);
                        // }
                    });

                this.activeTabindex = 3;
            });
        this.hideGrid = true;
        return this.customerCollateral;
    }
    // public getCollateralInformation(collateralCustomerId: number): any {
    //     this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
    //         .subscribe((res) => {
    //             this.mainCollateralDetail = res.result[0];
    //             console.log(' this.mainCollateral', this.mainCollateralDetail);

    //             this.collateralService.getSubFormItems(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
    //                 .subscribe((res) => {
    //                     console.log('res', res);
    //                     this.customerCollateral = res.result;

    //                     this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
    //                     this.isVisitation = this.mainCollateralDetail.requireVisitation;
    //                     this.collateralId = this.mainCollateralDetail.collateralId;
    //                     this.customerName = this.mainCollateralDetail.customerName;
    //                     this.customerId = this.mainCollateralDetail.customerId

    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.IMMOVABLE_PROPERTY) { this.collateralProperty = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.MARKETABLE_SECURITIES) { this.collateralMarketableSecurity = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.GUARANTEE) { this.collateralGaurantee = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.PLANT_AND_EQUIPMENT) { this.collateralEquipment = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.VEHICLE) { this.collateralVehicle = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.STOCK) { this.collateralStock = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.PRECIOUS_METAL) { this.collateralPreciousMetal = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.CASA) { this.collateralCasa = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.FIXED_DEPOSIT) { this.collateralDeposit = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.POLICY) { this.collateralItemPolicy = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.PROMISSORY) { this.collateralPromissory = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.INDEMNITY) { this.indemnity = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.ISOP) { this.collateralList = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONCONTACT) { this.domiciliationContract = true; this.mainCollateralView = true; }
    //                     if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONSALARY) { this.domiciliationSalary = true; this.mainCollateralView = true; }

    //                     this.customerCollateral != null ? this.useSearch = false : this.useSearch = true;

    //                     this.getSupportingDocuments(collateralCustomerId);
    //                     // this.getCollateralValuations(collateralCustomerId);
    //                     // if (this.isInsurancePolicy) {
    //                     //   this.getCollaterTempItemPolicies(collateralCustomerId);
    //                     // }
    //                 });

    //             this.activeTabindex = 1;
    //         });
    //     this.hideGrid = true;
    //     return this.customerCollateral;
    // }

    getSupportingDocuments(id) {
        this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
        });
    }

    getOriginalDocumentByCollateralCustomerId(id) {
        this.approvalService.getOriginalDocumentByCollateralCustomerId(id).subscribe((response: any) => {
            this.originalDocumentApproval = response.result;
            //console.log(' this.originalDocumentApproval', this.originalDocumentApproval);

        });
    }

    saveAtcLodgmentDetail(form){
        let body = {
            atcLodgmentId: this.atcLodgmentId,
            value: form.value.value,
            detail: form.value.detail,
        };
        this.loadingService.show();
        this.loanService.saveAtcLodgmentDetail(body).subscribe((response: any) => {
            this.getAtcLodgmentDetail(this.atcLodgmentId);
            this.loadingService.hide();
        });

       
    }

    getAtcLodgmentDetail(id){
        this.loanService.getAtcLodgmentDetail(id).subscribe((response: any) => {
            this.AtcLodgmentDetailList = response.result;
            this.clearControls();
            
        });
    }

    addAdditionalDetail(d){
        this.atcLodgmentId = d.atcLodgmentId
        this.showAdditionalDocument=true;
        
        this.getAtcLodgmentDetail(this.atcLodgmentId);
    }
    deleteAtcLodgmentDetail(d){
        this.loadingService.show();
        this.loanService.deleteAtcLodgmentDetail(d.atcLodgmentDetailId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
            this.getAtcLodgmentDetail(this.atcLodgmentId);
            this.loadingService.hide();
        });
    }

    getCusotmerAccountBalance(){
        this.accountBalances = this.getAccountBalance("");
        this.displayAccountBalance=true;
    }
    getAccountBalance(customerId) {
        let list: any = [
            { 'AccountNumber': '34343434343', 'AccountBalance': '20000000' },
            { 'AccountNumber': '34343434222', 'AccountBalance': '45000000' },
            { 'AccountNumber': '34343112222', 'AccountBalance': '64555000' },
            { 'AccountNumber': '32223434222', 'AccountBalance': '39900000' },
        ];
        return list;
    }
    deleteAtcAtcType(d) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loanService.deleteAtcType(d.atcTypeId).subscribe((response: any) => {
                __this.getAtcType();
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    addAtcAtcType(form) {

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {

            let data = {
                actTypeName: form.value.actTypeName
            }
            __this.loanService.addAtcType(data).subscribe((response: any) => {
                if (response.success == true) {
                    __this.showNewTypeInput = false;
                    __this.getAtcType();
                    __this.clearControls();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
            });
        
    }
    getDescription(id){
      let desc =  this.AtcType.find(o=>o.atcTypeId==id).atcTypeName;
      this.atcLodgmentForm.controls["description"].setValue(desc);
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.currencies = res.result;
           // console.log("currencies", this.currencies);
        }, (err) => {
            ////console.log(err);
        });
    }
}


