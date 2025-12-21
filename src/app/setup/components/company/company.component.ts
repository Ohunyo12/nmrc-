import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

import { LoadingService } from '../../../shared/services/loading.service';
import { CompanyService } from '../../services';
import { CurrencyService } from '../../services';
import { CountryStateService } from '../../services';
import swal, { SweetAlertType } from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { ValidationService } from '../../../shared/services/validation.service';
import { CustomerService } from '../../../customer/services/customer.service';

@Component({
    templateUrl: 'company.component.html'
})

export class CompanyComponent implements OnInit {
    display: boolean = false;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    companies: any[];
    countries: any[];
    currencies: any[];
    languages: any[];
    natureOfBusinesses: any[];
    companyForm: FormGroup;
    entityName: string = "New Company";
    selectedCompanyId: number = null;
    activeTabindex: number = 0;
    disableDirectorTab: boolean = true;

    selectedCompanyInfomation: any = {};
    displayDirector: boolean = false;
    companyDirectorForm: FormGroup;
    entityDirectorName: string;
    titleList: any[];
    genderList: any[];
    companiesDirectors: any[] = [];
    constructor(private coyService: CompanyService,
        private loadingSrv: LoadingService,
        private fb: FormBuilder,
        private countryService: CountryStateService,
        private currencyService: CurrencyService,
        private customerService: CustomerService) { }

    ngOnInit() {
        this.clearControls();
        this.getCompanies();
        this.getCountry();
        this.getCurrencies();
        this.getLanguages();
        this.getNatureOfBusiness();
        this.initializeCompanyDirector();
        this.getListOfGender();
        this.getListOfTitle();
        this.getAllCompanyDirectors();
    }

    getCompanies() {
        this.loadingSrv.show();
        this.coyService.getAllCompanies()
            .subscribe((res) => {
                this.loadingSrv.hide();
                this.companies = res.result;
            }, (err) => {
                this.loadingSrv.hide();
            })
    }
    getAllCompanyDirectors() {
        this.loadingSrv.show();
        this.coyService.getAllCompanyDirectors()
            .subscribe((res) => {
                this.companiesDirectors = res.result;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            })
    }

    getListOfTitle() {
        this.titleList = this.customerService.getTitleList()
    }
    getListOfGender() {
        this.genderList = this.customerService.getGenderList()
    }
    getNatureOfBusiness() {
        this.coyService.getAllNatureOfBusiness()
            .subscribe((res) => {
                this.natureOfBusinesses = res.result;
            });
    }
    getLanguages() {
        this.coyService.getAllLanguages()
            .subscribe((res) => {
                this.languages = res.result;
            });
    }

    getCurrencies() {
        this.loadingSrv.show();
        this.currencyService.getAllCurrencies()
            .subscribe((res) => {
                this.loadingSrv.hide();
                this.currencies = res.result;
            }, (err) => {
                this.loadingSrv.hide();
            })
    }


    getCountry() {
        this.loadingSrv.show();
        this.countryService.getAllCountries()
            .subscribe((res) => {
                this.loadingSrv.hide();
                this.countries = res.result;

            }, (err) => {
                this.loadingSrv.hide();
            })
    }
    clearControls() {
        this.companyForm = this.fb.group({
            companyId: [0],
            currencyId: ['', Validators.required],
            parentId: ['', Validators.required],
            countryId: ['', Validators.required],
            natureOfBusiness: [''],
            dateOfIncorporation: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            address: ['', Validators.required],
            languageId: ['', Validators.required],
            telephone: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
            natureOfBusinessId: ['', Validators.required],
            companyName: ['', Validators.required],
            nameOfScheme: [''],
            website: [''],
            nameOfRegistrar: [''],
            dateOfRenewalOfRegistration: [''],
            dateOfCommencement: [''],
            accountingStandardId: [''],
            managementTypeId: [''],
            investmentObjective: [''],
            authorisedShareCapital: [''],
            fileData: ['', Validators.required],
            imagePath: ['', Validators.required],
        });
    }

    onSubmit(formObj) {
        const data = formObj.value;
        data.fileName = this.file.name;
        data.fileExtension = this.fileExtention(this.file.name);

        this.loadingSrv.show();

       if (this.selectedCompanyId == 0) {
            // this.coyService.save(data)
            this.coyService.save(this.file,data)
                .then((res: any) => {
                    this.loadingSrv.hide();
                    if (res.success === true) {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                        this.getCompanies();
                        this.display = false;
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                }, (err) => {
                    this.loadingSrv.hide();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                })
        } else {
            this.coyService.update(data.companyId, data)
                .subscribe((res) => {
                    this.loadingSrv.hide();
                    if (res.success === true) {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                        this.getCompanies();
                        this.display = false;
                    } else {
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                }, (err) => {
                    this.loadingSrv.hide();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                })
        }

    }
    
    logoName: any;
    editCompany(indx) {
        this.entityName = "Edit Company";
        var selectedCompany = indx;
        this.logoName = indx.fileName;
        this.selectedCompanyId = selectedCompany.companyId;
        this.companyForm = this.fb.group({
            companyId: [selectedCompany.companyId],
            currencyId: [selectedCompany.currencyId, Validators.required],
            parentId: [selectedCompany.parentId],
            countryId: [selectedCompany.countryId, Validators.required],
            natureOfBusiness: [selectedCompany.natureOfBusiness],
            dateofBirth: [selectedCompany.dateofBirth],
            email: [selectedCompany.email, Validators.compose([Validators.required, ValidationService.isEmail])],
            languageId: [selectedCompany.languageId, Validators.required],
            address: [selectedCompany.address, Validators.required],
            natureofbusinessId: [selectedCompany.natureofbusinessId, Validators.required],
            companyName: [selectedCompany.companyName, Validators.required],
            schemeName: [selectedCompany.schemeName],
            website: [selectedCompany.website],
            dateOfIncorporation: [new Date(selectedCompany.dateOfIncorporation), Validators.required],
            telephone: [selectedCompany.telephone, [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
            nameOfScheme: [selectedCompany.nameOfScheme],
            nameOfRegistrar: [selectedCompany.nameOfRegistrar],
            dateOfRenewalOfRegistration: [selectedCompany.dateOfRenewalOfRegistration],
            dateOfCommencement: [selectedCompany.dateOfCommencement],
            accountingStandardId: [selectedCompany.accountingStandardId],
            managementTypeId: [selectedCompany.managementTypeId],
            investmentObjective: [selectedCompany.investmentObjective],
            authorisedShareCapital: [selectedCompany.authorisedShareCapital],
            fileData: [selectedCompany.fileData],
            imagePath: [selectedCompany.imagePath],
        });
        this.display = true;
    }

    showDialog() {
        this.clearControls();
        this.entityName = "New Company"
        this.selectedCompanyId = 0;
        this.display = true;
    }

    showMessage(title: string, message: string, alertType: SweetAlertType) {
        swal(title, message, alertType);
    }

    hideMessage(event) {
        this.show = false;
    }

    onTabChange(e) {
        if (e.index == 0) {
            this.disableDirectorTab = true;
        }
        if (e.index == 1) {
            this.disableDirectorTab = false;
        }
        this.activeTabindex = e.index;
    }
    initializeCompanyDirector() {
        this.companyDirectorForm = this.fb.group({
            companyDirectorId: [0],
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: [''],
            shareHoldingPercentage: ['', Validators.required],
            lastName: ['', Validators.required],
            gender: ['', Validators.required],
            bvn: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
            address: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            phoneNumber: ['', Validators.compose([Validators.required, ValidationService.isNumber, Validators.minLength(8)])],
            isActive: [false],
            companyId: [''],
        });
    }
    getCustomerCompanyDirectorsByCompanyId(companyId) {
        this.loadingSrv.show()
        this.coyService.getCustomerCompanyDirectorsByCompanyId(companyId)
            .subscribe((res) => {
                this.companiesDirectors = res.result;
                this.loadingSrv.hide()
            });
    }
    onSelectedCompanyChange() {
        this.disableDirectorTab = false;
        this.selectedCompanyId = this.selectedCompanyInfomation.companyId;
        this.getCustomerCompanyDirectorsByCompanyId(this.selectedCompanyId);
    }
    editCompanyDirector(index) {
        this.initializeCompanyDirector();
        this.entityDirectorName = "Edit Company Director";
        const row = index;
        this.selectedCompanyId = row.companyId;
        this.companyDirectorForm = this.fb.group({
            companyDirectorId: row.companyDirectorId,
            title: [row.title, Validators.required],
            shareHoldingPercentage: [row.shareHoldingPercentage, Validators.required],
            firstName: [row.firstName, Validators.required],
            middleName: [row.middleName, Validators.required],
            lastName: [row.lastName, Validators.required],
            gender: [row.gender, Validators.required],
            bvn: [row.bvn, [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
            address: [row.address, Validators.required],
            email: [row.email, Validators.compose([Validators.required, ValidationService.isEmail])],
            phoneNumber: [row.phoneNumber, Validators.compose([Validators.required, ValidationService.isNumber, Validators.minLength(8)])],
            isActive: [row.isActive],
            companyId: [row.companyId],
        });
        this.displayDirector = true;
    }
    deleteDirector(companyDirectorId) {
        const __this = this;
        swal({
            title: 'Delete Company Director?',
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

            __this.coyService.deleteCompanyDirector(companyDirectorId).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Delete successful.', 'success');
                    this.getCustomerCompanyDirectorsByCompanyId(this.selectedCompanyId);
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                }
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }
    onCompanyDirectorSubmit(formObj) {
        const data = formObj.value;
        let body = {
            companyDirectorId: data.companyDirectorId,
            title: data.title,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            gender: data.gender,
            bvn: data.bvn,
            address: data.address,
            email: data.email,
            phoneNumber: data.phoneNumber,
            isActive: data.isActive,
            companyId: this.selectedCompanyId,
            shareHoldingPercentage: data.shareHoldingPercentage
        }
        this.loadingSrv.show();

        this.coyService.appUpdateCompanyDirector(body)
            .subscribe((res) => {
                this.loadingSrv.hide();
                if (res.success === true) {
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.getCustomerCompanyDirectorsByCompanyId(this.selectedCompanyId);
                    this.displayDirector = false;
                } else {
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadingSrv.hide();
                this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
            })
    }

    showDirectorDialog() {
        this.entityDirectorName = "Add New Company Director";
        this.initializeCompanyDirector();
        this.displayDirector = true;
    }

    files: FileList;
    file: File;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }
}