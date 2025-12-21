import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryStateService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-local-govt',
  templateUrl: './local-govt.component.html',
})
export class LocalGovtComponent implements OnInit {
  states: any;
    localGovt: any;
    display: boolean = false;
    localGovtForm: FormGroup;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    cities: any[];
    cityClasses: any[];
    panelHeader = 'New Local Govt';

  constructor(
    private loadingService: LoadingService, 
    private fb: FormBuilder,
    private countryStateSrv: CountryStateService
  ) { }

  ngOnInit() {
    this.clearControls();
    this.getLocalGovts();
    this.getStates();
}

clearControls() {

    this.localGovtForm = this.fb.group({
        stateId: ['', Validators.required],
        localGovtName:['',Validators.required],
        
    });
}
getStates() {
  this.countryStateSrv.getStates().subscribe((response: any) => {
          this.states = response.result;
      });
}
getLocalGovts() {
    this.loadingService.show();
    this.countryStateSrv.getAllLocalGovt().subscribe((response: any) => {
            this.loadingService.hide();
            this.localGovt = response.result;
            ////console.log('localGovt',this.localGovt);
            
        }, (err) => {
            this.loadingService.hide();
        });
}


getLocalGovtByLgaId(localGovernmentId): void {
    this.countryStateSrv.getAllLocalGovtByLgaId(localGovernmentId).subscribe((response: any) => {
            this.localGovt = response.result;
            ////console.log('this.localGovt',this.localGovt);
            
        }, (err) => {
        });

}



showCityForm() {
    this.panelHeader = 'New Local Govt.';
    this.clearControls();
    this.display = true;
    this.selectedId = null;
}

editLga(lga) {
    this.panelHeader = 'Edit Local Govt';
    this.display = true;
    let row =  lga;
    ////console.log('citi',lga);
    
    this.localGovtForm = this.fb.group({
        stateId: [row.stateId],
        localGovtName: [row.localGovtName],
    });
    this.selectedId = row.localGovernmentId;
}

selectedId: number = null;

submitForm(form) { 
    this.loadingService.show();
    let body = {
        stateId: form.value.stateId,
        localGovtName: form.value.localGovtName,
    };
    if (this.selectedId === null) {   

        this.countryStateSrv.addAllLocalGovt(body).subscribe((res) => {
            if (res.success == true) {
                this.finishGood(res.message);
                this.getLocalGovts();
                this.display = false;
                ////console.log('GOOD!',JSON.stringify(res.message));
            } else {
                this.finishBad(res.message);
                ////console.log('BAD!',JSON.stringify(res.message));
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    } else { 
        ////console.log('this.selectedId...', this.selectedId+' - '+body);
        
        this.countryStateSrv.updateAllLocalGovt(body, this.selectedId).subscribe((res) => {
            if (res.success == true) {
                this.finishGood(res.message);
                this.getLocalGovts();
                this.display = false;
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
