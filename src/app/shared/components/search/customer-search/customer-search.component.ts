import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { emit } from 'cluster';
import { LoadingService } from '../../../services/loading.service';
import { ValidationService } from '../../../services/validation.service';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from '../../../../customer/services/customer.service';
import { BranchService } from '../../../../setup/services';

@Component({
  selector: 'simple-customer-search',
  templateUrl: './customer-search.component.html',
})
export class SimpleCustomerSearchComponent implements OnInit {
  searchTerm$ = new Subject<any>();
  searchResults: any[];
 searchParam: string;
 showresult:boolean = false;
  @Input() displaySearchModal: boolean = false;
  @Output() selectedCustomer = new EventEmitter<any>();
  constructor( 
    private loadingService: LoadingService, 
    private validationService: ValidationService,
    private fb: FormBuilder, 
    private customerService: CustomerService,
    private branchService: BranchService,) { 

      this.customerService.searchForCustomer(this.searchTerm$).subscribe(results => {
        this.searchResults = results.result;
        if(this.searchParam) {
          this.showresult = true;       
          this.loadingService.hide()
        } 
    });
    }

  ngOnInit() {
  }

  searchDB() {    
    this.loadingService.show()
    this.searchTerm$.next( this.searchParam);
  }


  pickSearchedData(item) {
    this.selectedCustomer.emit(item);
    this.showresult = false;
    this.searchParam='';
  }
}
