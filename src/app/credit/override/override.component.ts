import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
 import { Subject } from 'rxjs';
import { CustomerService } from '../../customer/services/customer.service';
import { OverrideService } from '../services/override.service';
//import { Response } from '@angular/http/src/static_response';
import { GeneralSetupService } from '../../setup/services';
import { GlobalConfig } from '../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
@Component({
    selector: 'override',
    templateUrl: './override.component.html'
   // styleUrls: ['./name.component.scss']
})
export class OverrideComponent implements OnInit {
    overrideForm: FormGroup;
    displaySearchModal: boolean; 
    showdata: boolean = false;
    search: string;
    seachItemForm: FormGroup; displayOverrideForm: boolean = false;
    selectedItems: any[]=[];
    searchStagingTerm$ = new Subject<any>();
    searchResults: any[]; overrideRequest: any;
    constructor(private fb: FormBuilder, private customerService: CustomerService, 
        private overrideServ: OverrideService, private loadingSrv: LoadingService, ) {
     
     }



    ngOnInit() {       
        this.getOverrideRequest();
        this.overrideItems();
        this.initOverrideForm();
        this.seachItemForm = this.fb.group({
            search:['']
        });
    }

    getOverrideRequest()
    {
        this.overrideServ.getAllOverrideRequest().subscribe((response: any)=> {
            this.overrideRequest = response.result;
        })
    }

    addOverride(){
        this.displayOverrideForm = true;
    }
    initOverrideForm() {
        this.overrideForm = this.fb.group({
            customerCode: ['', Validators.required],
            customerName:['', Validators.required],
            reason: ['', Validators.required]
        })
    }
   


    
    selectedSearchCustomer(selected) {
        this.showdata = false;
        this.searchResults=[];
        this.overrideForm.patchValue({
            customerCode:  selected.customerCode ,
            customerName:selected.customerName,
          //  overrideItemId: ['']
        });

        
       this.seachItemForm.setValue({
        search:['']
       });

    }
    overrideItem: any[];
    overrideItems(){
         this.overrideServ.getOverrideItems().subscribe((response: any)=> {
            this.overrideItem = response.result;
         })
    }
    
    onSelect(event, edata, indx){ 
        if(event){              
            this.selectedItems.push(edata)
        }else{             
           this.selectedItems.splice(indx,1)
        }         
    }

    onSubmit() {
        this.loadingSrv.show();
        let ovf = this.overrideForm.value
        let overrideData: any[] = [];
        for (let i = 0; this.selectedItems.length > i ; i++) {
            let body = {
                customerCode: ovf.customerCode,
                reason: ovf.reason,
                overrideItemId: this.selectedItems[i].itemId
            }
            overrideData.push(body);
        }
        this.overrideServ.addOverrideRequest(overrideData)
        .subscribe((response: any)=>{ 
           if(response.result){
            this.overrideItems();
            this.overrideForm.reset();
            this. getOverrideRequest();
            this.loadingSrv.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message
            , 'success');
            this.displayOverrideForm = false;
           }         
           else {
            this.loadingSrv.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message
            , 'error');
           }  
        }, (err) => {
            this.loadingSrv.hide();
        });
     }
}