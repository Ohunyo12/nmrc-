import { AdminService } from '../../services/admin.service';
import { Component, OnInit } from '@angular/core';
// import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { LazyLoadEvent } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subject } from 'rxjs';


@Component({
    templateUrl: 'deleted-staff-log.component.html'
})

export class DeletedStaffLogComponent implements OnInit {

    audits: any[] = [];
    itemTotal: number;
    multiSortMeta: any = [];
    filters: any = [];
    searchBox: any = '';
    gb: any;
    searchTerm$ = new Subject<any>();

    constructor(private auditService: AdminService,
        private loadingService: LoadingService) { 

            // this.auditService.searchAuditLog(this.searchTerm$)
            // .subscribe(results => {
            //     this.audits = results.result;
            //     this.itemTotal = results.count;
            // });
        }

    ngOnInit() {
        this.getAuditTrails();
    }

    getAuditTrails() {
        this.loadingService.show();
        this.auditService.getDeletedStaffLog()
            .subscribe((response: any) => {
                this.audits = response.result;
                this.itemTotal = response.count;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });

    }

    // searchDB(page, searchString) {
    //     this.searchTerm$.next('?page='+ page + '&searchQuery='+ searchString);
    // }

    onEditInit(evt) {
    };
    onEdit(evt) {

    };
    onEditComplete(obj) {

    };
    onEditCancel(obj) {
    };
}