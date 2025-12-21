import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { emit } from 'cluster';

@Component({
  selector: 'custom-search',
  templateUrl: './custom-search.component.html',
})
export class CustomSearchComponent implements OnInit {
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  @Input() displaySearchModal: boolean = false;
  @Output() selectedCustomer = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {

  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }


  pickSearchedData(item) {
    this.selectedCustomer.emit(item);
  }
}
