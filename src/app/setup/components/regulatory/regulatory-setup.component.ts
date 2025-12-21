import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { RegulatoryService } from '../../services/regulatory.service';
import swal from 'sweetalert2';
import { CustomerService } from '../../../customer/services/customer.service';

@Component({
    selector: 'regulatory-setup',

    templateUrl: 'regulatory-setup.component.html'
})
export class RegulatorySetupComponent implements OnInit {
    entityName: string = 'Regulatory Setup';
    customerTypes: any[];

    regulatories: any[];
    regulatorytypes: any[];
selectedRegulatoryId: any;
displayModalForm: boolean = false;
regulatoryForm: FormGroup;
show: boolean = false; message: any; title: any; cssClass: any; // message box
selectedRegTypeId: number = null;
displayFilterForm: boolean = true;
filterForm: FormGroup;
displayList: boolean = true;
constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private customerService: CustomerService,
    private regulatoryService: RegulatoryService) { }


    ngOnInit() {
         this.getAllRegulatoryType();
        // this.getAllRegulatorySetup();
        this.loadDropdowns();
                this.clearControls();
        this.clearFilterForm();
    }
    getCustomerType(id) {
        let item = this.customerTypes.find(x => x.customerTypeId == id);
        if (item != undefined) { return item.name; }
        return 'n/a';
    }
    loadDropdowns()
    {
        this.customerService.getAllCustomerTypes().subscribe((response: any) => {
            this.customerTypes = response.result;
        });
    }
    clearFilterForm() {
        this.filterForm = this.fb.group({
            // productClassId: ['', Validators.required],
            crmsTypeId: ['', Validators.required],
        });

         this.regulatoryForm.controls['crmsTypeId'].setValue('',{onlySelf:true})

    }
    customerTypeChanged(type) {
            this.selectedRegTypeId = type;
        this.regulatories = [];
        this.loadingService.show();
        this.regulatoryService.getAllRegulatoryTypeById(type).subscribe((response: any) => {
            // this.documentService.getDocumentByLevelProduct(this.selectedLevelId,this.selectedProductId).subscribe((response: any) => {
            ////console.log('----> ');

            this.regulatories = response.result;
            if (this.regulatories.length > 0) {
                // this.displayList = true;
            }
            ////console.log('DOCS: ',JSON.stringify(response.result));
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    submitFilterForm(form = null): void {
        if (form != null) {
            // this.selectedProductId = form.value.productClassId;
            this.selectedRegTypeId = form.value.crmsTypeId;
        }
        // let body = {
        //     productClassId: this.selectedProductId,
        //     approvalLevelId: this.selectedLevelId
        // };
        // this.displayList = false;
        this.regulatories = [];
        this.loadingService.show();
        this.regulatoryService.getAllRegulatoryTypeById(this.selectedRegTypeId).subscribe((response: any) => {
            // this.documentService.getDocumentByLevelProduct(this.selectedLevelId,this.selectedProductId).subscribe((response: any) => {
            ////console.log('----> ');

            this.regulatories = response.result;
            if (this.regulatories.length > 0) {
                // this.displayList = true;
            }
            ////console.log('DOCS: ',JSON.stringify(response.result));
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    getAllRegulatoryType() {
        this.regulatoryService.getAllRegulatoryType().subscribe((response: any) => {
          this.regulatorytypes = response.result;
        });
      }
      getRegulatoryTypeName(id) {
        let model = this.regulatorytypes.find(x => x.crmsTypeId == id);
        return (model == null) ? null : model.description;
    }
    getAllRegulatorySetup(): void {
        this.loadingService.show();
        this.regulatoryService.getAllRegulatorySetup().subscribe((response: any) => { // <----?
            ////console.log("x---", response.result)
          this.regulatories = response.result; // <----?
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
      }
      showAddModal() {
        this.clearControls();
        this.regulatoryForm.controls['crmsTypeId'].setValue(this.selectedRegTypeId,{onlySelf:true})
        this.displayModalForm = true;
    }
    clearControls() {
        this.selectedRegulatoryId = null;
        this.regulatoryForm = this.fb.group({
            crmsTypeId:['',Validators.required],
            customerTypeId:['',Validators.required],
            code: ['', Validators.required],
            description: ['', Validators.required],
        });
    }
    editRegulatorySetup(row) {
        // var row = this.documents[index];
        this.selectedRegulatoryId = row.regulatoryId;
        this.regulatoryForm = this.fb.group({
            crmsTypeId:[row.crmsTypeId,Validators.required],
            code: [row.code, Validators.required],
            customerTypeId: [row.customerTypeId, Validators.required],        
           description: [row.description, Validators.required],
        });
        this.displayModalForm = true;

    }
    removeRegulatorySetup(row) {
        let regulatoryId = row.regulatoryId;
        const __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You want to delete this record!',
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
            __this.regulatoryService.removeRegulatorySetup(regulatoryId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllRegulatorySetup();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
    submitForm(form) {
        this.loadingService.show();
        let body = {
            crmsTypeId:form.value.crmsTypeId,
            customerTypeId:form.value.customerTypeId,
 code: form.value.code,
            description: form.value.description,
        };
        if (this.selectedRegulatoryId === null) {
            this.regulatoryService.saveRegulatorySetup(body).subscribe((res) => {
                if (res.success == true) {
                    this.regulatoryService.getAllRegulatoryTypeById(this.selectedRegTypeId).subscribe((response: any) => {
                        // this.documentService.getDocumentByLevelProduct(this.selectedLevelId,this.selectedProductId).subscribe((response: any) => {
                        ////console.log('----> ');
            
                        this.regulatories = response.result;
                        if (this.regulatories.length > 0) {
                            // this.displayList = true;
                        }
                        ////console.log('DOCS: ',JSON.stringify(response.result));
                        this.loadingService.hide();
                    }, (err) => {
                        this.loadingService.hide(1000);
                    });
                                        this.finishGood(res.message);
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.regulatoryService.updateRegulatorySetup(body, this.selectedRegulatoryId).subscribe((res) => {
                if (res.success == true) {
                    this.regulatoryService.getAllRegulatoryTypeById(this.selectedRegTypeId).subscribe((response: any) => {
                        // this.documentService.getDocumentByLevelProduct(this.selectedLevelId,this.selectedProductId).subscribe((response: any) => {
                        ////console.log('----> ');
            
                        this.regulatories = response.result;
                        if (this.regulatories.length > 0) {
                            // this.displayList = true;
                        }
                        ////console.log('DOCS: ',JSON.stringify(response.result));
                        this.loadingService.hide();
                    }, (err) => {
                        this.loadingService.hide(1000);
                    });
                    this.finishGood(res.message);
                    this.displayModalForm = false;
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
}