import { AdminService } from '../../services/admin.service';
import { Component, OnInit } from '@angular/core';
// import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { LazyLoadEvent } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subject } from 'rxjs';


@Component({
    templateUrl: 'audit.component.html'
})

export class AuditTrailComponent implements OnInit {

    audits: any[] = [];
    itemTotal: number;
    multiSortMeta: any = [];
    filters: any = [];
    searchBox: any = '';
    gb: any;
    searchTerm$ = new Subject<any>();

    constructor(private auditService: AdminService,
        private loadingService: LoadingService) { 

            this.auditService.searchAuditLog(this.searchTerm$)
            .subscribe(results => {
                this.audits = results.result;
                this.itemTotal = results.count;
            });
        }

    ngOnInit() {
        // this.getAuditTrails(this.page, this.itemsPerPage);
    }

    getAuditTrails(page: number, itemsPerPage: number) {
        this.loadingService.show();
        this.auditService.getAuditTrails(page, itemsPerPage)
            .subscribe((response: any) => {
                this.audits = response.result;
                this.itemTotal = response.count;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });

    }

    loadData(event: LazyLoadEvent) {
        // this.getAuditTrails(event.first, event.rows);


        // event.sortOrder = -1;

        // event.filters = {
        //     'auditType': {
        //         'value': 'account',
        //         'matchMode': 'contains'
        //     },
        //     'staffName': {
        //         'value': 'omoniyi',
        //         'matchMode': 'contains'
        //     }
        // };

        // event.multiSortMeta = [];
        // event.multiSortMeta.push({ field: 'auditType', order: 1 });
        // event.multiSortMeta.push({ field: 'staffName', order: -1 });
        // event.multiSortMeta.push({ field: 'details', order: -1 });

        // event.globalFilter;

        this.loadingService.show();
        this.auditService.getAuditTrails(event.first, event.rows)
            .subscribe((response: any) => {
                this.audits = response.result;
                this.itemTotal = response.count;

                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });

        if (event.globalFilter) {
            this.searchDB(event.first, event.globalFilter);
        }

    }

    searchDB(page, searchString) {
        this.searchTerm$.next('?page='+ page + '&searchQuery='+ searchString);
    }

    onEditInit(evt) {
    };
    onEdit(evt) {

    };
    onEditComplete(obj) {

    };
    onEditCancel(obj) {
    };
}