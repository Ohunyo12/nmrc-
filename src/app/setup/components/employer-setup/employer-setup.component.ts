import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
// import {  } from '@angular/forms/src/validators';
import { CountryStateService, GeneralSetupService } from '../../services';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal, { SweetAlertType } from 'sweetalert2';
//import * as XLSX from 'xlsx';

@Component({
    selector: 'app-employer',
    templateUrl: './employer-setup.component.html',
})
export class EmployerSetupComponent implements OnInit {
    [x: string]: any;

    employerSetupForm: FormGroup;
    isUpdate = false;
    displayEmployer: boolean = false;
    cities: any[];
    TitleName: string;
    selectedId: 0;
    state: any;
    states: any[];
    employersListTable: any[];
    emplyerType: any[];
    emplyerSubType: any[];

    constructor(private fb: FormBuilder, private loadServ: LoadingService,
        private countryService: CountryStateService, private genSetupServ: GeneralSetupService) {
    }

    ngOnInit() {
        this.IntEmployerEntitiesForm();
        this.getEmployerType();
        this.getAllStates();
        this.getAllEmployers();
    }

    IntEmployerEntitiesForm() {
        this.employerSetupForm = this.fb.group({
            employerId: [''],
            employerName: ['', Validators.required],
            address: ['', Validators.required],
            emailAddress: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            cityId: ['', Validators.required],
            stateId: ['', Validators.required],
            employerSubTypeId: ['', Validators.required],
            employerTypeId: ['', Validators.required]
        });
    }

    showDialog() {
        this.IntEmployerEntitiesForm();
        this.isUpdate = false;
        this.displayEmployer = true;
        this.TitleName = 'New Approved Employer';
    }
    getAllStates(): void {
        this.countryService.getStates().subscribe((response: any) => {
            this.states = response.result;

           

        }, (err) => {
            this.loadServ.hide(1000);
        });
    }
    getStateCities(id): void {
        this.countryService.getCityByState(id).subscribe((response: any) => {
            this.cities = response.result;
        }, (err) => {
            this.loadServ.hide(1000);
        });
    }
    getAllEmployers() {
        this.genSetupServ.getEmployersList()
            .subscribe((response: any) => {
                this.employersListTable = response.result;

                this.loadServ.hide();
            }, (err) => {
                this.loadServ.hide();

            });
    }

    getEmployerType(): void {
        this.genSetupServ.getEmployerType().subscribe((response: any) => {
            this.emplyerType = response.result;


        }, (err) => {
            this.loadServ.hide(1000);
        });
    }
    getEmployerSubType(emplyerTypeId): void {
        this.genSetupServ.getEmployerSubType(emplyerTypeId).subscribe((response: any) => {
            this.emplyerSubType = response.result;


        }, (err) => {
            this.loadServ.hide(1000);
        });
    }

    editEmployer(record) {
        this.TitleName = 'Edit Approved Employer';
        this.displayEmployer = true;
        this.isUpdate = true;
        let row = record;

        this.selectedId = row.employerId;
        this.employerSetupForm = this.fb.group({
            employerId: [row.employerId],
            employerName: [row.employerName],
            emailAddress: [row.emailAddress],
            phoneNumber: [row.phoneNumber],
            cityId: [row.cityId],
            address: [row.address],
            employerSubTypeId: [row.employerSubTypeId],
            stateId: [row.stateId],
            employerTypeId: [row.employerTypeId]
        })


        this.getStateCities(row.stateId);
        this.getEmployerSubType(row.employerTypeId);
        this.selectedId = row.employerId;
    }

    saveEmployer(formObj) {
        this.loadServ.show();
        let body = formObj.value;

        if (body.employerId <= 0) {
            this.genSetupServ.addEmployer(body)
                .subscribe((res) => {
                    this.loadServ.hide();
                    if (res.success === true) {
                        this.getAllEmployers();
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                        this.displayEmployer = false
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'error');
                    }
                }, (err) => {
                    this.loadServ.hide();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                })
        } else {
            this.genSetupServ.UpdateEmployer(body.employerId, body)
                .subscribe((res) => {
                    this.loadServ.hide();
                    if (res.success === true) {
                        this.getAllEmployers();
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                        this.displayEmployer = false
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'error');
                    }
                }, (err) => {
                    this.loadServ.hide();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                })

        }
    }
    showMessage(title: string, message: string, messageType: SweetAlertType) {
        swal(title, message, messageType);
    }
    exportToExcel() {
        // this.exportAsExcelFile(this.employersListTable, "ApprovedEmployerRecord")
    }
    public exportAsExcelFile(json: any[], excelFileName: string): void {
        // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        //this.saveAsExcelFile(excelBuffer, excelFileName);
    }


}