import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../services';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';
import { ProductFeeService } from '../../services';
import { NumericDictionary } from 'lodash';

@Component({
    templateUrl: 'collateral-type.component.html'
})
export class CollateralTypeComponent implements OnInit {

    collateralTypes: any[];
    displayForm: boolean = false;
    showCollateralTypeForm: boolean = true;
    entityName: string = 'Collateral Type';
    collateralTypeForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    accounts: any[];
    displayModalDocumentType: boolean = false;
    displaydocumentTypeFormModal: boolean = false;
    documentTypeForm: FormGroup;
    constructor(
        private loadingService: LoadingService, private fb: FormBuilder, 
        private collateralService: CollateralService,
        private productFeeService: ProductFeeService
    ) { }
                        
    ngOnInit() {
        this.getAllCollateralType();
        this.clearControls();
        this.loadDropdowns();
        // this.showForm(); // ----------------------------- ONLY FOR TESTING
    }

    loadDropdowns() {
        this.productFeeService.getAllChartOfAccounts().subscribe((response: any) => {
            this.accounts = response.result;
        });
    }

    getAllCollateralType(): void {
        this.loadingService.show();
        this.collateralService.getCollateralTypes().subscribe((response: any) => {
            this.collateralTypes = response.result;
            ////console.log('list: ',response.result);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    showForm() {
        this.clearControls();
        this.displayForm = true;
    }
    selectedcollateralTypeId:number;
    clearDocumentTypeControls(){
        this.selectedDocumentTypeId=null;
        this.documentTypeForm=this.fb.group({
            documentTypeName:['',Validators.required]
        })
    }
    clearControls() {
        this.selectedId = null;
        this.selectedcollateralTypeId=null;
        this.collateralTypeForm = this.fb.group({
            collateralTypeName: ['', Validators.required],
            details: ['', Validators.required],
            requireInsurancePolicy: ['', Validators.required],
            chargeGLAccountId: ['', Validators.required],
            requireVisitation:['', Validators.required],
            collateralClassificationId:['', Validators.required],
        });
        this.clearDocumentTypeControls();
    }
    
      editCollateralType(index) {
        var row = this.collateralTypes[index];
        this.selectedId = row.collateralTypeId;
        this.collateralTypeForm = this.fb.group({
            collateralTypeName: [row.collateralTypeName, Validators.required],
            details: [row.details, Validators.required],
            requireInsurancePolicy: [row.requireInsurancePolicy, Validators.required],
            chargeGLAccountId: [row.chargeGLAccountId, Validators.required],
            requireVisitation:[row.requireVisitation, Validators.required],
            collateralClassificationId: [row.collateralClassificationId, Validators.required],
        });
        this.displayForm = true;
    }
    editDocumentTypes(row){
        this.selectedDocumentTypeId=row.documentTypeId;
        this.selectedcollateralTypeId =row.collateralTypeId;
        this.documentTypeForm = this.fb.group({
            documentTypeName: [row.documentType, Validators.required],          
        });
        this.displaydocumentTypeFormModal = true; 
    }
    collateralTypeName:any;
    getDocumentTypes(row) {
        this.collateralTypeName=row.collateralTypeName;
        this.selectedcollateralTypeId =row.collateralTypeId;

        this.getAllDocumentsByColateralTypeId(row.collateralTypeId);
        this.displayModalDocumentType = true;
    }
    collateralDocumentTypes: any[];
    selectedDocumentTypeId: number;
    getAllDocumentsByColateralTypeId(id):void{
            this.loadingService.show();
            this.collateralService.getCollateralDocumentTypes(id).subscribe((response: any) => {
                this.collateralDocumentTypes = response.result;
                ////console.log('list: ',response.result);
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });        
    }


    submitdocumentTypeForm(form){
        this.loadingService.show();
        let body = {
            documentType: form.value.documentTypeName,
            collateralTypeId: this.selectedcollateralTypeId,
            documentTypeId: this.selectedDocumentTypeId,  
        };
        //console.log(body);
        this.collateralService.addCollateralDocumentType(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGoodDocument(res.message);
                    this.getAllDocumentsByColateralTypeId(body.collateralTypeId);
                    this.clearDocumentTypeControls();
                    this.displaydocumentTypeFormModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
    }
    showAdddocumentTypeModal(){
        this.clearDocumentTypeControls();
        this.displaydocumentTypeFormModal=true;
    }
    submitForm(form) { 
        this.loadingService.show();
        let body = {
            collateralTypeName: form.value.collateralTypeName,
            details: form.value.details,
            requireInsurancePolicy: form.value.requireInsurancePolicy,
            chargeGLAccountId: form.value.chargeGLAccountId,
            requireVisitation: form.value.requireVisitation,
            collateralClassificationId:form.value.collateralClassificationId
        };
            this.collateralService.updateCollateralType(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllCollateralType();
                    this.displayForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
    }                   
                        
    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }
    finishGoodDocument(message) {
        //this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
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
        
    getClassificationType(id){
        if(id == 1){
            return "Tangible Related";
        }else if(id== 2){
            return "Comfort Related";
        }else{
            return "";
        }
    }
}
