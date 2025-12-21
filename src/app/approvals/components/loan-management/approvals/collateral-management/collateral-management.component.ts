import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { flatten } from '@angular/compiler';
import { CollateralService } from '../../../../../setup/services';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { Subject } from 'rxjs';
import { CustomerService } from '../../../../../customer/services/customer.service';
import { CollateralType, GlobalConfig } from '../../../../../shared/constant/app.constant';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { AuthorizationService } from 'app/admin/services';

@Component({
    selector: 'app-collateral-management',
    templateUrl: './collateral-management.component.html',
})
export class CollateralManagementComponent implements OnInit {
    displayTwoFactorAuth: boolean = false;
    myDocExtention: any;
    pdfFileName: any;
    pdfFile: any;
    insurancePolicies: any;
    supportingDocuments: any;
    binaryFile: string;
    imageData: any;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    collateralId: any;
    toSearchBtnText: string;
    customerCollateralSelection: any;
    customers: any;
    collateralItemPolicy: any;
    hasInsurance: any;
    collateralDeposit: any;
    collateralPromissory: any;

    collateralCasa: any;
    collateralPreciousMetal: any;
    collateralStock: any;
    collateralVehicle: any;
    collateralEquipment: any;
    customerName: any;
    collateralGaurantee: any;
    collateralMarketableSecurity: any;
    collateralInsurancePolicy: any;
    collateralProperty: any;
    mainCollateralView: any;
    customerCollateral: any;
    searchResults: any[];
    searchTerm$ = new Subject<any>();
    searchStagingTerm$ = new Subject<any>();
    hideTable: boolean = true;
    hideGrid: boolean = false;
    collateralIspo: boolean = false;
    domiciliationSalary: boolean = false;
    domiciliationContract: boolean = false;
    indemnity: boolean = false;
    mainCollateralDetail: any = {};
    isInsurancePolicy: any;
    isVisitation: any;
    personal = false;
    corporate = false;
    loanApplicationId: number;
    @Input() isHeaderInfoBased: boolean = true;
    @Input() showCollateralInformation = true;
    @Input() collateralCustomerId: number;
    @Input() useSearch: boolean = true;
    @Input() collateralTypeId: number;
    @Input('searchQuery') searchQuery = new Subject<string>();



    @Output() selectedCaollateral: any;
    customerCollaterals: any[];
    comment: any;
    twoFactorAuthStaffCode: string;
    twoFactorAuthPassCode: string;
    operationId: number = 60;
    approvalStatusId: any;
    collateralVisitation: any;
    constructor(
        private collateralService: CollateralService,
        private loadingService: LoadingService,
        private customerService: CustomerService,
        private authorizationService: AuthorizationService,
    ) { }

    ngOnInit() {
        this.getTempCustomerCollateral();

    }

    getTempCustomerCollateral(): void {
        this.loadingService.show();
        this.collateralService.getTempCustomerCollateral().subscribe((response: any) => {
            this.customerCollaterals = response.result;

            this.loadingService.hide();

        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getTempCollateralByType(collateralId, typeId): void {
        this.loadingService.show();
        this.collateralService.getTempCollateralInformationByCollateralType(collateralId, typeId).subscribe((response: any) => {
            this.selectedCaollateral = response.result;

            ////console.log('sub items...', response);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }



    public getCollateralInformation(collateralCustomerId: number, collateralTypeId: number): any {

        ////console.log('collateralCustomerId', collateralCustomerId);
        ////console.log('collateralTypeId', collateralTypeId);

        this.collateralService.getTempCollateralInformationByCollateralType(collateralCustomerId, collateralTypeId)
            .subscribe((res) => {

               console.log('this.mainCollateralDetail.collateralTypeId', this.mainCollateralDetail.collateralTypeId);
                this.customerCollateral = res.result;


                if (this.customerCollaterals != null) { this.mainCollateralDetail = this.customerCollaterals.find(x => x.collateralId == collateralCustomerId) }


                this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
                this.isVisitation = this.mainCollateralDetail.requireVisitation;
                this.collateralId = this.mainCollateralDetail.collateralId;
                this.customerName = this.mainCollateralDetail.customerName;

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
                this.getcollateralVisitation(collateralCustomerId);
                if (this.isInsurancePolicy) {
                    this.getCollaterTempItemPolicies(collateralCustomerId);
                }
            });
        this.hideGrid = true;
        return this.customerCollateral;
    }
    onSlectedCustomerChange() {
        this.collateralCustomerId = this.customerCollateralSelection.collateralId;
        this.collateralTypeId = this.customerCollateralSelection.collateralTypeId;

        this.getCollateralInformation(this.collateralCustomerId, this.collateralTypeId);
    }

    turnOnSearch() {
        this.useSearch = true;
        this.customerCollateral = false;
        this.collateralDeposit = false;
        this.collateralPromissory = false;
        this.collateralCasa = false;
        this.collateralPreciousMetal = false;
        this.collateralStock = false;
        this.collateralVehicle = false;
        this.collateralEquipment = false;
        this.customerName = false;
        this.collateralGaurantee = false;
        this.collateralMarketableSecurity = false;
        this.collateralInsurancePolicy = false;
        this.collateralProperty = false;
        this.mainCollateralView = false,
        this.collateralIspo= false,
        this.domiciliationSalary= false,
        this.domiciliationContract= false,
        this.indemnity= false,
        this.hideTable = true;



    }

    promptForwardCollateralApproval(formObj) {
        // this.displayTwoFactorAuth = true;
        this.authorizationService.enable2FAForLastApproval(this.operationId
            , null, formObj.productId, 0).subscribe((res) => {
                if (res.result == true) {
                    this.displayTwoFactorAuth = true;
                } else {
                    this.forwardCollateralApproval();
                }
            });
    }

    forwardCollateralApproval() {

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: 'Are you sure you want to approve this collateral?',
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
            let data = {
                targetId: __this.customerCollateral.collateralId,
                comment: __this.comment,
                approvalStatusId: __this.approvalStatusId,
                userName: __this.twoFactorAuthStaffCode,
                passCode: __this.twoFactorAuthPassCode
            }
            __this.displayTwoFactorAuth = false;
            ////console.log('data', data);

            __this.collateralService.approveCustomerCollateralCreation(data).subscribe((response: any) => {
                __this.selectedCaollateral = response.result;
                let success = response.success;

                if (response) {

                    if (success == true) {
                        __this.displayTwoFactorAuth = false;
                        __this.getTempCustomerCollateral();
                        __this.turnOnSearch();
                        __this.loadingService.hide();
                        swal('FinTrak Credit 360', response.message, 'success');
                        __this.comment = "";
                        __this.approvalStatusId = ""
                        __this.twoFactorAuthStaffCode = null;
                        __this.twoFactorAuthPassCode = null;
                    } else {
                        __this.loadingService.hide();
                        __this.displayTwoFactorAuth = false;
                        swal('FinTrak Credit 360', response.message, 'error');
                    }

                }
                __this.loadingService.hide();
                __this.displayTwoFactorAuth = false;
            }, (err) => {
                __this.loadingService.hide(1000);
                __this.displayTwoFactorAuth = false;
            });



        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });





    }

    viewVisitationDocument(id: number) {
        this.collateralService.getTempCollateralVisitationFile(id).subscribe((response: any) => {
            this.imageData = response.result;

            ////console.log('documents..', this.imageData);
        });

        let doc = this.imageData;
        // let doc = this.imageData.find(x => x.targetId == id);
        if (doc != null) {

            ////console.log('doc.fileData..', doc.fileData);

            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }
    viewCollateralDocument() {
        this.collateralService.getCollateralDocument(this.collateralId).subscribe((response: any) => {
            this.imageData = response.result[0];
            ////console.log('documents..', this.imageData);
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        });

        let doc = this.imageData;
        // let doc = this.imageData.find(x => x.targetId == id);
        if (doc != null) {

            ////console.log('doc.fileData..', doc.fileData);

            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }

    // viewDocument(id: number) {

    //   let doc = this.supportingDocuments.find(x => x.documentId == id);
    //   if (doc != null) {
    //       this.binaryFile = doc.fileData;
    //       this.selectedDocument = doc.documentTitle;
    //       this.displayDocument = true;
    //   }
    //   ////console.log("binary file..", this.binaryFile);
    // }


    viewDocument(id: number) {
        this.loadingService.show();

        let doc = this.supportingDocuments.find(x => x.documentId == id);

        if (doc != null) {


            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }
        ////console.log("binary file..", this.binaryFile);
    }
    viewTempVisitationDocument(id: number) {
        this.loadingService.show();

        let doc = this.collateralVisitation.find(x => x.documentId == id);

        if (doc != null) {


            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }
        ////console.log("binary file..", this.binaryFile);
    }

    DownloadDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);

        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
                }
            }

        }

    }

    DownloadVisitationDocument(id: number) {
        //console.log('>>>>> IID >>>>>',id);
        
        let doc = this.collateralVisitation.find(x => x.documentId == id);

       // console.log('doc  >>>',doc);
        

        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
                }
            }

        }

    }


    getSupportingDocuments(id) {

        this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
        });
    }

    getCollaterTempItemPolicies(id) {
        this.collateralService.getTempItemPolicyList(id).subscribe((response: any) => {
            this.insurancePolicies = response.result;
            ////console.log('insurancePolicies..', response.result);
        });
    }

    getcollateralVisitation(id) {
        this.collateralService.getTempCollateralVisitationDetail(id).subscribe((response: any) => {
            this.collateralVisitation = response.result;
           // console.log('collateralVisitation..', response.result);
           // console.log('id..', id);
        });
    }

}
