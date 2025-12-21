import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanService } from '../services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-letter-generation-search',
  templateUrl: './letter-generation-search.component.html',
  styleUrls: ['./letter-generation-search.component.scss'],
  providers:[LoanService]
})
export class LetterGenerationSearchComponent implements OnInit {
  activeTabindex: any;
  displaySearchForm: boolean = false;
  searchForm: FormGroup;
  searchString: any;
  applications: any[];
  displaySearchTable: boolean = true;


  constructor(
    private loadingService: LoadingService,
    private loanService: LoanService,
    private fb: FormBuilder,
  ) { }
  
 


  ngOnInit() {
    this.clearControls();
  }

  clearControls() {
    this.searchForm = this.fb.group({
        searchString: ['', Validators.required],
    });
}
 

  onTabChange(obj) { }
  showSearchForm() { this.displaySearchForm = true; }
  
  submitForm(form) {
    this.searchString = form.value.searchString;
    let body = {
        searchString: form.value.searchString
    };
    this.loadingService.show();
    this.loanService.letterGenerationSearch(body).subscribe((response: any) => {
        this.applications = response.result;
        this.loadingService.hide();
        this.displaySearchForm = false;
        this.displaySearchTable = true;
    }, (err: any) => {
        this.loadingService.hide(1000);
    });
}
   displayApplicationDetail: boolean = false;
    application: any = {};

    view(){}
  


}
