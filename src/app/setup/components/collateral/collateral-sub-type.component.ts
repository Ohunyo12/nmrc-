import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService, CurrencyService } from '../../services';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant, GlobalConfig } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'collateral-sub-type.component.html'
})
export class CollateralSubTypeComponent implements OnInit {
    
    subTypes: any[];
    collateralTypes: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Sub Type';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    disableVisitationBox: boolean;
    collateralCoverageForm: FormGroup;
    collateralCoverage: any;
    currencies: any;
    collateralSubTypeId: any;
    displayCollateralCoverage: boolean;
    rowData: any;
    constructor(
        private fb: FormBuilder, 
        private loadingService: LoadingService, 
        private collateralService: CollateralService,
        private currencyService: CurrencyService,
    ) { }

    ngOnInit() {
        this.getCollateralTypes();
        this.getAllSubTypes();  
        this.clearControls();
    }

    getCollateralTypes() {
        this.collateralService.getCollateralTypes().subscribe((response: any) => {
           this.collateralTypes = response.result;
           ////console.log(response);
        }); 


        this.currencyService.getAllCurrencies().subscribe((response: any) => {
            this.currencies = response.result;
        });
    }

    getCollateralTypeName(id) {

        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }

    getAllSubTypes(): void {
        this.loadingService.show();
        this.collateralService.getSubTypes().subscribe((response: any) => {
            this.subTypes = response.result;
            ////console.log('subs...', response.result);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    showAddModal() {
        this.clearControls();
        this.displayAddModal= true;
    }

    clearControls() {
        this.selectedId = null;
        this.addForm = this.fb.group({
            collateralSubTypeName: ['', Validators.required],
            collateralTypeId: ['', Validators.required],
            GPScollateralType: ['', Validators.required],
            haircut: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            revaluationDuration: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            visitationCycle: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
           // allowSharing: [false],
            
            
        });

        this.collateralCoverageForm = this.fb.group({
            currencyId: ['', Validators.required],
            coverage: ['', Validators.required],
           // collateralSubTypeId:['']
        });
    }

    editRow(rowData) {
        var row = rowData;
        //var row = this.subTypes[index];
        this.selectedId = row.collateralSubTypeId;
        this.addForm = this.fb.group({
            collateralSubTypeName: [row.collateralSubTypeName, Validators.required],
            collateralTypeId: [row.collateralTypeId, Validators.required],
            GPScollateralType: [row.GPScollateralType, Validators.required],
            haircut: [row.haircut],
            revaluationDuration: [row.revaluationDuration],
            visitationCycle:[row.visitationCycle]
           // allowSharing: [row.allowSharing],
        });
        this.displayAddModal = true;
    }

    submitForm(form) { 
        this.loadingService.show();
        let body = {
            collateralSubTypeName: form.value.collateralSubTypeName,
            collateralTypeId: form.value.collateralTypeId,
            GPScollateralType: form.value.GPScollateralType,
            haircut: form.value.haircut,
            revaluationDuration: parseFloat(String(form.value.revaluationDuration).replace(/,/g,'')),
            // tslint:disable-next-line:radix
            visitationCycle : parseInt(String(form.value.visitationCycle).replace(/,/g,'')),
           // allowSharing: form.value.allowSharing,
        };
        if (this.selectedId === null) { 
            this.collateralService.saveSubType(body).subscribe((res) => {
                ////console.log('SAVE!');
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllSubTypes();
                    this.displayAddModal = false;
                    ////console.log('GOOD!',JSON.stringify(res.message));
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD ==> ',JSON.stringify(res.error));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else { 
            this.collateralService.updateSubType(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllSubTypes();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
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

    CheckForVisitationCycleSetup( collateralTypeId)
    {

        if(collateralTypeId!=null)
        {

            let item = this.collateralTypes.find(x => x.collateralTypeId == collateralTypeId);

            if(item!=null )
            {
            
                this.disableVisitationBox = item.requireVisitation;

                let ctrl = this.addForm.get('visitationCycle');
                
                if(this.disableVisitationBox==true)
                {
                    ctrl.enable();
                }else{
                    ctrl.disable();
                }
                
            }
        }
    }

    submiCollateralCoverage(form) {
        let data = {
            collateralSubTypeId: this.collateralSubTypeId,
            currencyId: form.value.currencyId,
            coverage: form.value.coverage
        }
        this.loadingService.show();
        this.collateralService.AddCollateralCoverage(data).subscribe((response: any) => {
            this.collateralCoverage = response.result;
            this.GetCollateralCoverage(this.collateralSubTypeId);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });

    }

    DeleteCollateralCoverage(d) {
        //console.log('-----', d);
       
        this.loadingService.show();
        this.collateralService.DeleteCollateralCoverage(d.collateralCoverageId).subscribe((response: any) => {
            this.loadingService.hide();
            if(response.success) {
                this.collateralCoverage = response.result;
                this.GetCollateralCoverage(this.rowData.collateralSubTypeId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                
              
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            
        }
    }, (err) => {
        this.loadingService.hide(1000);
    });

}

    GetCollateralCoverage(id): void {
        this.loadingService.show();
        this.collateralCoverage=[]
        this.collateralService.GetCollateralCoverage(id).subscribe((response: any) => {
            this.collateralCoverage = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    AddCoverage(d) {
        this.rowData = d;
        this.collateralSubTypeId = d.collateralSubTypeId;
        this.displayCollateralCoverage = true;

        this.GetCollateralCoverage(d.collateralSubTypeId);
    }
}
