import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ConditionPrecedentService } from '../../services';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'compliance-timeline.component.html'
})
export class ComplianceTimelineComponent implements OnInit {

    list: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Timeline';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private conditionService: ConditionPrecedentService,
    ) { }

    ngOnInit() {
        this.refresh();
        this.clearControls();
        // this.apiTest(); // <------------------------------- development only
    }

    refresh(): void {
        this.loadingService.show();
        this.conditionService.getAllComplianceTimeline().subscribe((response: any) => {
            this.list = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showAddModal() {
        this.clearControls();
        this.displayAddModal = true;
    }

    clearControls() {
        this.selectedId = null;
        this.addForm = this.fb.group({
            timeline: ['', Validators.required],
            duration: ['', Validators.required],

        });
    }

    submitForm(form) {
        let body = {
            timeline: form.value.timeline,
            duration: form.value.duration,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.conditionService.saveComplianceTimeline(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.refresh();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.conditionService.updateComplianceTimeline(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.refresh();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    edit(row) {
        this.selectedId = row.timelineId;
        this.addForm = this.fb.group({
            timeline: [row.timeline, Validators.required],
            duration: [row.duration, Validators.required],
        });
        this.displayAddModal = true;
    }


    remove(row) {
        const __this = this;
        swal({
            title: 'Remove Compliance Timeline?',
            text: 'You won\'t be able to revert this!',
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

            __this.conditionService.removeComplianceTimeline(row.timelineId).subscribe((res) => {
                    if (res.success == true) {
                        __this.refresh();
                    }
                }, (err: any) => {
                    __this.finishBad(JSON.stringify(err));
                });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }

    // ==============DEVELOPMENT ONLY===============    
    apiTest() {
        let form = this.fb.group({
            condition: ['wert off data', Validators.required],
            isExternal: [false],
            corporate: [false],
            retail: [false],
            productId: [''],
        });
        this.submitForm(form);
        this.refresh();
        this.selectedId = 2; // change
        this.submitForm(form);
        this.selectedId = null;
    }
    // =============================================    


}