import { Component, OnInit } from '@angular/core';
import { ContingentLoanService } from './contingentloan.service';
import { IContingentLoan } from './contingentloan.interface';

@Component({
    selector: 'contingent-usage-list',
    templateUrl: 'contingent-usage-list.component.html'
})

export class ContingentUsageListComponent implements OnInit {
    contingentData: IContingentLoan[];
    selectedContingentData: IContingentLoan;
    showDataForm: boolean = false;
    constructor(private service: ContingentLoanService ) { }

    ngOnInit() {
      this.loadList();
     }

     loadList(){
        this.service.getContingentLoan().subscribe((response: any)=> {
            this.contingentData = response.result;
         });
     }
     
     onRowSelect(row){
         this.selectedContingentData = row.data;
         this.showDataForm = true
     }
  
    toggleDataForm(evt) {      
        if (evt) this.showDataForm = false
        this.loadList();
    }

}