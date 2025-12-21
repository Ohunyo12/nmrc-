import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanApplicationService } from '../../../credit/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { GeneralSetupService } from '../../services';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal, { SweetAlertType } from 'sweetalert2';
import { log } from 'util';

@Component({
  selector: 'app-prudential-guidelines',
  templateUrl: './prudential-guidelines.component.html',
})
export class PrudentialGuidelinesComponent implements OnInit {
    prudentialGuidelineType: any;
  states: any[];
  
  prudentialGuidelineForm: FormGroup;
  LoanApplicationService: any;
  prudentialGuideline:any[];
  isUpdate = false;
  displayGuideline:Boolean=false;
  TitleName:string;
  selectedId:0;



  constructor( private fb:FormBuilder,
    private loadServ: LoadingService,
    private generalSetupService: GeneralSetupService,
   ) {  }


  ngOnInit() {
    this.loadServ.show();
    this.displayGuideline = false;
    this.getAllPrudentialGuides();
    this.IniPrudentialGuidelineForm();
    this.getPrudentialGuidesType();
    this.loadServ.hide();

  }

  IniPrudentialGuidelineForm(){
    this.prudentialGuidelineForm = this.fb.group({
      prudentialGuidelineId: [''],
      prudentialGuidelineTypeId:['',Validators.required],
      classification:['',Validators.required],
      internalMinimun: ['',Validators.required],
      internalMaximun:['',Validators.required],
      externalMinimun:['',Validators.required],
      externalMaximun:['',Validators.required],
      naration:['',Validators.required],
        
    })
}

getAllPrudentialGuides() {
    this.loadServ.show();
    this.generalSetupService.getPrudentialGuidelineList()
        .subscribe((response: any) => {
            this.prudentialGuideline = response.result;


            this.loadServ.hide();
        }, (err) => {
            this.loadServ.hide();
            
        });
}

getPrudentialGuidesType() {
    this.generalSetupService.getPrudentialType()
        .subscribe((response: any) => {
            this.prudentialGuidelineType = response.result;
        }, (err) => {
            this.loadServ.hide();
            
        });
  }
  
editPrudential(record){
  this.TitleName = 'Edit Prudential Guideline ';
  this.displayGuideline = true; 
 this.isUpdate = true;
 let row = record;

 this.selectedId = row.prudentialGuidelineId;
 this.prudentialGuidelineForm =this.fb.group({
  prudentialGuidelineId: [row.prudentialGuidelineId],
  prudentialGuidelineTypeId:[row.prudentialGuidelineTypeId],
  classification:[row.classification],
  internalMinimun: [row.internalMinimun],
  internalMaximun:[row.internalMaximun],
  externalMinimun:[row.externalMinimun],
  externalMaximun:[row.externalMaximun],
  naration:[row.naration],
 })
  this.selectedId = row.prudentialGuidelineId;

}

showDialog() {
  this.IniPrudentialGuidelineForm();
  this.isUpdate = false;
  this.displayGuideline = true; 
  this.TitleName = 'New Prudential Guideline';
 }

 savePrudemtialGuideline(formObj)
  {

        this.loadServ.show();

        let body = formObj.value;

        
        if(body.prudentialGuidelineId <= 0){
        this.generalSetupService.addPrudentialGuideline(body).subscribe((res) => {
                this.loadServ.hide();
                if (res.success === true) {
                    this.getAllPrudentialGuides();
                    
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                        this.displayGuideline=false
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`,  res.result, 'error');
                    }
            }, (err) => {
                this.loadServ.hide();
                this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.result, 'error');
            })
        }else{
            this.generalSetupService.UpdatePrudentialGuideline(body.prudentialGuidelineId, body)
            .subscribe((res) => {
                this.loadServ.hide();
                if (res.success === true) {
                    this.getAllPrudentialGuides();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                        this.displayGuideline=false
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`,  res.result, 'error');
                    }
            }, (err) => {
                this.loadServ.hide();
                 this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.result, 'error');
            })

        }
    }
    showMessage(title: string,message:string,messageType:SweetAlertType) {
        swal(title,message, messageType);
    }

    deletePrudentialGuideline(prudentialGuidelineId, evt) {
     // evt.preventDefault();

     // let row = index;
      const __this = this;

      swal({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
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
          __this.loadServ.show();
          __this.generalSetupService.deletePrudentialGuideline(prudentialGuidelineId).subscribe((res) => {
              __this.loadServ.hide();
              __this.displayGuideline = false;
              if (res.success === true) {
                  __this.IniPrudentialGuidelineForm();
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success')
                  __this.getAllPrudentialGuides();
              } else {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error')
              }
          }, (err: any) => {
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
              __this.loadServ.hide();
          });
      }, function (dismiss) {
          if (dismiss === 'cancel') {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
      });
  }
}
