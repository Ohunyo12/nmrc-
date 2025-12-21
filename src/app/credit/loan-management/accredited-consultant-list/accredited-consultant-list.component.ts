import { Component, OnInit} from '@angular/core';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-accredited-consultant-list',
  templateUrl: './accredited-consultant-list.component.html'
})
export class AccreditedConsultantListComponent implements OnInit {

    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;
    displayConsultantForm:boolean=false;
    accreditedConsultants: any[] = [];

    constructor(
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.getAccreditedConsultants();
    }

    
    consultants: any[] = [];

    getAccreditedConsultants() {
        this.camService.getAccreditedStateConsultants().subscribe((response: any) => {
            this.accreditedConsultants = response.result;
        });
    }

   

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
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
