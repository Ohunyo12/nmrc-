import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { fromEvent } from 'rxjs';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { isNullOrUndefined } from 'util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-reassign-request',
  templateUrl: './reassign-request.component.html'
})
export class ReassignRequestComponent implements OnInit {
    @Input() approvalTrailId = 0;
    @Input() approvalTrailIds: number[];
    @Input() nextLevelId = 0; //deprecated as an input
    @Input() newUsage = false;
    @Input() showInPanel = true;
    @Input() isMultiple = false;
    @Input() panelLabel = '';
    @Input() reassignButtonLabel = 'Re-assign';
    @Input() enableReassign = false;
    @Input() enableRoute = false;
    @Input() enableRoutePreset = false;
    @Input() enableRouteOperation = false;
    @Output() showCallerDialogue = new EventEmitter<boolean>();
    @Output() refreshCallerGrid = new EventEmitter<boolean>();

    availableApprovers: any[] = [];
    multipleTraildIdFirst = 0;
    displayReassignForNewUsage = false;
    @ViewChild('staffInPut', {static: false}) staffInPut: ElementRef;
    showReassignDialog = false;

	constructor(
		private camService: CreditAppraisalService,
        private realSearchSrv: StaffRealTimeSearchService,
        private loadingService: LoadingService,
	) { }

	ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        this.availableApprovers = [];
        this.getTrailBytrailId();
	}
	
	ngOnInit() {
    }
    
    getTrailBytrailId() {
        if (this.isMultiple) {
            if (!isNullOrUndefined(this.approvalTrailIds) && this.approvalTrailIds.length > 0) {
                this.loadingService.show();
                if (this.multipleTraildIdFirst == this.approvalTrailIds[0] && this.nextLevelId > 0) {
                    return; //to avoid recalling the API on each change to the approvalTrailIds array
                }
                this.multipleTraildIdFirst = this.approvalTrailIds[0];
                this.camService.getApprovalTrailByTrailId(this.multipleTraildIdFirst).subscribe((result) => {
                    this.loadingService.hide();
                    if (result.success == true) {
                        this.nextLevelId = result.result.toApprovalLevelId;
                    }
                }, (err: any) => {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
                    this.loadingService.hide(1000);
                });
            }
        } else {
            if (this.approvalTrailId > 0) {
                this.loadingService.show();
                this.camService.getApprovalTrailByTrailId(this.approvalTrailId).subscribe((result) => {
                    this.loadingService.hide();
                    if (result.success == true) {
                        this.nextLevelId = result.result.toApprovalLevelId;
                    }
                }, (err: any) => {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
                    this.loadingService.hide(1000);
                });
            }
        }
    }

    displayReassignForOldUsage(): boolean{
        // return ((!this.newUsage && this.showReassignDialog == true));
        return (!this.newUsage);
    }

    showRerouteForm() {
        this.showReassignDialog = true;
        this.displayReassignForNewUsage = (this.newUsage && this.showReassignDialog);
    }

    hideRerouteForm() {
        this.showReassignDialog = false;
    }

	pickSearchedApprover(row){
        const selectedApprover = row.staffCode + ' -- ' + row.firstName + ' ' + row.lastName;
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to assign this application to ' + selectedApprover + '?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            if (__this.isMultiple == true) {
                __this.loadingService.show();
                __this.camService.assignMultipleRequests(__this.approvalTrailIds, row.staffId).subscribe((result) => {
                    __this.loadingService.hide();
                    if (result.success == true) {
                        __this.displayReassignForNewUsage = false;
                        __this.returnToCaller();
                        swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    }
                }, (err) => {
                    __this.loadingService.hide(1000);
                });
            } else {
                __this.loadingService.show();
                __this.camService.assignApplication(__this.approvalTrailId, row.staffId).subscribe((result) => {
                    __this.loadingService.hide();
                    if (result.success == true) {
                        __this.returnToCaller();
                        swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    }
                }, (err) => {
                    __this.loadingService.hide(1000);
                });
            }
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
	}

	ngAfterViewInit(): void {
		fromEvent(this.staffInPut.nativeElement, 'keyup').pipe(
		debounceTime(150),
		distinctUntilChanged(),)
		.subscribe(() => {
			this.realSearchSrv.searchApproversEntries(this.staffInPut.nativeElement.value,this.nextLevelId)
			.subscribe(results => {
				if (results != null) {
					this.availableApprovers = results.result;
				}
			});
		});
    }
    
    searchApprover(searchString) {
	}

	refresh(){
		this.availableApprovers = [];
        this.approvalTrailId = 0;
        this.approvalTrailIds = [];
        this.nextLevelId = 0;
	}
	
    returnToCaller() {
        if (this.newUsage) {
            this.refreshCallerGrid.emit(true);
        } else {
            this.showCallerDialogue.emit(false);
        }
		this.refresh();
	}
}
