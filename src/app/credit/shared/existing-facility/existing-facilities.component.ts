import { element } from 'protractor';
import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ApplicationStatus } from 'app/shared/constant/app.constant';


/**
* This class represents the lazy loaded HomeComponent.
*/
@Component({
    selector: 'expfacility',
    templateUrl: 'existing-facilities.component.html'
})
export class ExistingFacilitiesComponent {
    customerExposure: any[] = [];  relatedParty: any[];
    @Input() customer: number[];
    @Input() newLoans: any[]=[];
    @Input() loanTypeId: number;
    @Output() customerExposureResult: EventEmitter<any> = new EventEmitter<string>();
    @Input() set reload(value: number) { if (value > 0) this.getExistingLoanDetails(); }

    constructor(private LoanServ: LoanService,private loadingService: LoadingService) { }
    ngOnInit() {
    // console.log('customer existing facilities', this.customer);
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.getExistingLoanDetails();
    }


    getExistingLoanDetails(){
        // if (this.customer == null || this.customer == undefined) {
            if (this.customer == null || this.customer == undefined || this.loanTypeId == null || this.loanTypeId == undefined) {
            return;
        }
        this.loadingService.show();
        this.LoanServ.getCurrentCustomerExposure(this.customer.map(x => ({ 'customerId': x })), this.loanTypeId)
        .subscribe((response: any) => {
            this.loadingService.hide();
            this.customerExposure = response.result;
            this.customerExposureResult.emit(this.customerExposure);
        }, (err: any) => {
            this.loadingService.hide(1000);
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

    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

}


