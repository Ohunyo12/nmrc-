import { element } from 'protractor';
import { Component, OnChanges, Input } from '@angular/core';
import { LoanService } from '../../services/loan.service';


/**
* This class represents the lazy loaded HomeComponent.
*/
@Component({
    selector: 'expcamsol',
    templateUrl: 'existing-camsol.component.html'
})
export class ExistingCamsolComponent {
    loanCamsolData: any[] = [];  relatedParty: any[];
    @Input() customer: number[];
    @Input() newLoans: any[]=[];
    @Input() loanTypeId: number;

    @Input() set reload(value: number) { if (value > 0) this.getExistingCamsolByCustomer(); }

    constructor(private LoanServ: LoanService) { }
    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.getExistingLoanDetails();
    }


    getExistingCamsolByCustomer(){
        this.LoanServ.getCurrentCamsolByCustomer(this.customer.map(x => ({ 'customerId': x })), this.loanTypeId)
        .subscribe((response: any) => {
            this.loanCamsolData = response.result;
        });
//              this.customerExposure.forEach(element => {
           
//                 if (this.element.length > 0) {
               
//                 this.pelement.forEach(element => {
//                     this.customerExposure.push({
//                         'existingLimit': 0,
//                         'proposedLimit': element.proposedLimit,
//                         'change': element.change,
//                         'outstandings': element.outstandings,
//                         'pastDueObligationsPrincipal': 0,
//                         'pastDueObligationsInterest': 0,
//                         'reviewDate': Date.now
//                     })
//                 });
//             }
//  });
     
    }

}


