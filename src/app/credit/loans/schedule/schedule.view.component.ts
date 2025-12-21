import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'schedule-view-template',
    templateUrl: 'schedule.view.component.html'
})

export class ScheduleViewComponent implements OnInit {
    schedules: any[];
    scheduleHeader: any = {};
    maturityDate: any;
    constructor(private router: Router) { }

    ngOnInit() {
        this.getSchedules();
    }

    getSchedules() {
        if (window.sessionStorage.getItem("schedules")) {
            let rawSchedules = JSON.parse(window.sessionStorage.getItem("schedules"));
            // this.schedules = [];
            // rawSchedules.schedules.forEach(element => {
            //     this.schedules.pus
            // });
            this.schedules = rawSchedules.schedules;
            this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
            this.scheduleHeader = rawSchedules
        }
    }

    goBack() {
        //window.sessionStorage.removeItem("schedules");

        this.router.navigate(['/credit/loan/schedule']);
    }
}