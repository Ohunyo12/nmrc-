import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../../../customer/services/customer.service';

import { LoanApplicationService } from '../../../services'; 
@Component({
    selector: 'app-sector-limit',
    templateUrl: `./sector-limit.component.html`,
    styles: [``]
})
export class ChildSectorLimitComponent implements OnInit {
    sectorLimitData: any;   
    rMLimitData: any; 
    lrMLimit: number;
    orMLimit: number;
    lsectorLimit:  number;
    osectorLimit: number;

    @Input() sectorId: number;
sectorialId : number;
    constructor(private customerService: CustomerService, private loanAppService: LoanApplicationService, ) { }


    ngOnInit(): void {
        
     }
ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.sectorialId = this.sectorId;
        this.load()
}

    load() {         
        if(this.sectorialId != undefined || this.sectorialId != null )
        this.getSectorLimit(this.sectorialId);
    }
    temprelationshipManagerId: number;


      getSectorLimit(subSectorId) {
        this.loanAppService.getSectorLimit(subSectorId)
            .subscribe((res) => {
 
                this.sectorLimitData = res.result;
               this.osectorLimit = res.result.outstandingBalance;
                this.lsectorLimit = res.result.limit;

            }, (err) => {

            });
    }


     
    }
