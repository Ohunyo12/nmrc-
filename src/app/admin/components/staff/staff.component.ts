import { StaffRoleService } from '../../../setup/services/staff-role.service';
import { JobTitleService } from '../../../setup/services/jobtitle.service';
import { MisInfoService } from '../../../setup/services/misinfo.service';
import { CountryStateService } from '../../../setup/services/state-country.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { GlobalConfig, ConvertString } from '../../../shared/constant/app.constant';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { StaffService } from '../../services/staff.service';
import { DepartmentService } from '../../../setup/services/department.service';
import { CompanyService } from '../../../setup/services/company.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BranchService } from '../../../setup/services/branch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { StaffRealTimeSearchService, GeneralSetupService } from '../../../setup/services';
import { AdminService } from '../../services';
import { saveAs } from 'file-saver';
import { UserActivity } from 'app/admin/models/useractivity';

@Component({
    templateUrl: 'staff.component.html'
})

export class StaffComponent implements OnInit {
    displayOtherInformation: boolean = false;
    otherInformationForm: FormGroup;
    otherInformation: any = {};

    headerText: string = 'Staff List';
    failedUpload: any;
    uploadedData: any;
    user: any = {};
    staffUser: any = {};
    units: any;
    departmentUnits: any;

    display = false;
    show = false;
    message: any;
    title: any;
    cssClass: any;
    sensitivities: any[];
    companies: any[];
    branches: any[];
   
    staffFormGroup: FormGroup;
    staffSearchForm: FormGroup;
    branchLoaded = false;
    departments: any[];
    staffDataset: any[];
    states: any[];
    cities: any[];
    totalRecords: number;
    isUpdate = false;
    cityLoaded = false;
    jobTitles: any[];
    misInfo: any[];
    staffRoles: any[];
    displayDocumentUpload: boolean = false;
    displayADAuth: boolean = false;
    adAuthStaffCode: string = null;
    adAuthPassCode: string = null;
    selectedStaff: any = {};


    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    collapseForm: boolean = true;


    supervisorCode: any;
    supervisorName: any;
    supervisorBranch: any;
    supervisorEmail: any;
    SupervisorReportings: any;
    staffEmail: any;
    staffBranch: any;
    staffName: any;
    staffCodeNo: any;
    username: any;
    teamUnit: any;
    costCent: any;
    dept: any;
    region: any;
    group: any;
    directorate: any;
    mis: any;
    staffInfo: any;


    @ViewChild('fileInput', {static: false}) fileInput: any;

    activeIndex: number = 0;

    groups: any[];
    allActivities: any[];
    showAssignSupervisorButton: boolean = false;
    adActive: boolean = false;
    globalSetup: any;
    businessUnit: any;

    constructor(
        private companyService: CompanyService,
        private branchService: BranchService,
        private fb: FormBuilder,
        private deptService: DepartmentService,
        private staffService: StaffService,
        private loadingService: LoadingService,
        private userService: AuthenticationService,
        private countryStateSrv: CountryStateService,
        private misInfoService: MisInfoService,
        private jobTitleService: JobTitleService,
        private staffRolServ: StaffRoleService,
        private realSearchSrv: StaffRealTimeSearchService,
        private adminService: AdminService,
        private genSetupServ: GeneralSetupService,

    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }


    getRanks() {
        this.staffRolServ.get().subscribe((response: any) => {
            this.staffRoles = response.result;
        });
    }

    getMisInfo() {
        this.misInfoService.get().subscribe((response: any) => {
            this.misInfo = response.result;
        });
    }

    getJobTitles() {
        this.jobTitleService.get().subscribe((response: any) => {
            this.jobTitles = response.result;
        });
    }

    ngOnInit() {
        this.loadingService.show();
        this.getAllStaff();

        this.initializeForm();
        this.getJobTitles();
        this.getRanks();
        this.getMisInfo();
        this.getStateByCountryId();
        this.getUnits();
        this.getAllBranches();
        this.getSensitivityLevels();
        this.getAllGroups();
        this.getParentChildActivities();
        this.loadOtherInformation();
        this.getAllGlobalSettings();
        this.getProfileSetting();
        this.multipleActivities = [];
        this.changePassword = false;
        this.getProfileBusinessUnits();
        this.getCompanies();
        this.getBranches();
        this.loadingService.hide();
    }

    initializeForm() {
        this.staffFormGroup = this.fb.group({
            companyId: ['', Validators.required],
            BranchId: ['', Validators.required],
            StaffId: [0],
            StaffCode: ['', Validators.required],
            FirstName: ['', Validators.required],
            MiddleName: [''],
            LastName: ['', Validators.required],
            //MisinfoId: ['', Validators.required],
            MisCode: ['', Validators.required],

            //departmentUnitId: ['', Validators.required],
            Email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            Phone: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(9)]],
            //JobTitleId: ['', Validators.required],
            StaffRoleId: ['', Validators.required],
            supervisorStaffId: [''],
            Gender: ['', Validators.required],
            Address: ['', Validators.required],
            StateId: ['', Validators.required],
            CityId: ['', Validators.required],
            DateOfBirth: ['', Validators.required],
            customerSensitivityLevelId: ['', Validators.required],
            NameOfNok: [''],
            PhoneOfNok: ['', [Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
            EmailOfNok: [''],
            GenderOfNok: [''],
            NokrelationShip: [''],
            AddressOfNok: [''],
            CreatedBy: [0],
            DateCreated: [new Date()],
            loanLimit: [0, [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
            workStartDuration: [''],
            workEndDuration: [''],
            businessUnitId: [''],
            user: this.fb.group({
                user_id: [0],
                staffId: [0],
                staffName: ['', Validators.required],
                username: ['', Validators.required],
                password: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]],
                confirmPassword: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]],
                securityQuestion: ['', Validators.required],
                securityAnswer: ['', Validators.required],
                changePassword: false,
                changeSecurityQuestion: false,
            }),
            group: [[]],
            activities: [[]]
        });

        this.staffSearchForm = this.fb.group({
            searchedName: [''],
        });


    }
    getAllGroups() {
        this.loadingService.show();
        this.adminService.getAllGroups()
            .subscribe((res) => {
                this.groups = res.result;
            });
    }
    getAllGlobalSettings() {
        this.loadingService.show();
        this.adminService.getAllGlobalSettings()
            .subscribe((res) => {
                this.globalSetup = res.result;
                let rec = this.globalSetup;

                if (this.globalSetup.useActiveDirectory == true) {
                    this.adActive = true;
                } else {
                    this.adActive = false;
                }
            });


    }
    profileSettings: any = {};
    minPasswordLength: number;
    minRequiredAlphNumeric: number;
    requiresQuestionAndAnswer: boolean = false;


    getProfileSetting() {
        this.adminService.getProfileSettings()
            .subscribe((response: any) => {
                this.profileSettings = response.result;
                this.minPasswordLength = this.profileSettings.minRequiredPasswordLength;
                this.minRequiredAlphNumeric = this.profileSettings.minrequiredNonAlphanumericChar;
                this.requiresQuestionAndAnswer = this.profileSettings.requiresQuestionAndAnswer;
                this.loadingService.hide();
            });
    }

    getMinChar() {
        let string = this.staffFormGroup.get('user').get('password').value;
        //console.log('HITTING_check_string', string );
        if (string.length < this.minPasswordLength) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Password Must Be Atleast ' + this.minPasswordLength + ' Character Long', 'warning');
        }
        var ab = new RegExp(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/gi);
        var abc = string.match(ab);
        if (abc != null) {
            var allFoundCharacters = string.match(ab).length;

        }
        else {
            if (this.minRequiredAlphNumeric == 0) {

            } else {
                this.staffFormGroup.get('user').get('password').setValue("");
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Password Must Contain Atleast ' + this.minRequiredAlphNumeric + ' Special Chatacter', 'warning');

            }
        }

        if (allFoundCharacters < this.minRequiredAlphNumeric) {
            this.staffFormGroup.get('user').get('password').setValue("");
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Password Must Contain Atleast ' + this.minRequiredAlphNumeric + ' Special Chatacter', 'warning');
            // this.staffFormGroup.controls['password'].setErrors({'incorrect': true});
        }

    }

    collapseSearchForm(flag: boolean) {
        this.collapseForm = flag;
        if (flag == true) this.headerText = 'Staff List';
        else if (flag == false) this.headerText = 'Staff Bulk Upload';
    }

    getParentChildActivities() {
        this.adminService.getActivityParentAndChild()
            .subscribe((response: any) => {
                this.allActivities = response.result;
                this.loadingService.hide();
            });
    }
    getSensitivityLevels() {
        this.sensitivities = [];
        // this.sensitivities.push({ level: 0, description: 'Negligible' });
        // this.sensitivities.push({ level: 1, description: 'Very Low' });
        // this.sensitivities.push({ level: 2, description: 'Low' });
        // this.sensitivities.push({ level: 3, description: 'Medium' });
        // this.sensitivities.push({ level: 4, description: 'High' });
        // this.sensitivities.push({ level: 5, description: 'Very High' });
        this.staffService.getAllSensitivityLevel()
            .subscribe((response: any) => {
                this.sensitivities = response.result;
            });
    }

    getCompanies() {
        this.companyService.getAllCompanies()
            .subscribe((response: any) => {
                this.companies = response.result;
                console.log(this.companies)
            }, (err) => {
            });
    }

    getAllBranches() {
        this.branchLoaded = false;
        this.branchService.getAllBranches()
            .subscribe((response: any) => {
                this.branches = response;
                //console.log(this.branches)
                if (this.branches) {
                    this.branchLoaded = true;
                } else {
                    this.branchLoaded = false;
                }
            }, (err) => {
            });
    }

    getBranches() {
        
        this.branchService.getBranches()
            .subscribe((response: any) => {
                this.branches = response.result;
                console.log(this.branches)
                // if (this.branches) {
                //     this.branchLoaded = true;
                // } else {
                //     this.branchLoaded = false;
                // }
            }, (err) => {
            });
    }

    getDepartments() {
        this.deptService.getDepartments()
            .subscribe((response: any) => {
                this.departments = response.result;
            }, (err) => {
            });
    }

    getUnits() {
        this.deptService.getUnits().subscribe((res) => {
            this.units = res.result;
        }, (err) => {
        });
    }

    getStateByCountryId() {
        this.countryStateSrv.getStates()
            .subscribe((response: any) => {
                this.states = response.result;
            });
    }
    getUsersByStaffId(staffId) {
        this.multipleActivities = [];
        this.adminService.getUsersByStaffId(staffId).subscribe((response: any) => {
            this.staffUser = response.result;
            this.multipleActivities = this.staffUser.activities;
            if (this.staffUser != undefined) {
                this.user = {
                    staffId: this.staffUser.staffId,
                    user_id: this.staffUser.user_id,
                    staffName: this.staffUser.staffName,
                    username: this.staffUser.username,
                    password: this.staffUser.password,
                    confirmPassword: this.staffUser.password,
                    securityQuestion: this.staffUser.securityQuestion,
                    securityAnswer: this.staffUser.securityAnswer,
                    changePassword: false,
                    changeSecurityQuestion: false
                }
                let groups = [];
                this.staffUser.groupId.forEach(element => {
                    groups.push(`${element.groupId}`);
                });

                let act = [];
                this.staffUser.activities.forEach(element => {
                    act.push(`${element.activityId}`);
                    // let record = {
                    //     userId: 0,
                    //     activityId: element.activityId,
                    //     activityName: element.activityName,
                    //     activityParentId: element.activityParentId,
                    //     activityParentName: element.activityParentName,
                    //     selected: element.selected,
                    //     expireOn: element.expireOn

                    // };
                    // this.multipleActivities.push(record)

                });
                this.staffFormGroup.controls['user'].setValue(this.user);
                this.staffFormGroup.controls['group'].setValue(groups);
                this.staffFormGroup.controls['activities'].setValue(act);

            }

        })
    }
    activities: UserActivity[];
    multipleActivities: any[];
    activitiesModal: boolean = false;
    activeActivitiesModal: boolean = false;
    activeActivities: UserActivity[];

    viewActivities(event) {
        this.activeActivities = [];
        let rec = event;
        let record = this.staffUser.activities.forEach(element => {
            if (element.activityParentId == rec.activityParentId) {
                this.activeActivities.push(element);
            }
        });;
        //this.activeActivities = record.find(a=>a.activityParentId == rec.activityParentId);
        this.activeActivitiesModal = true;
    }



    getActivities(event) {
        let rec = event;



        // this.tempSelectedActivities =  this.selectedActivities;

        this.adminService.getActivityDetailsByParent(rec.activityParentId)
            .subscribe((response: any) => {
                this.activities = response.result;
                // this.activities.forEach(act => {
                //     act.expireOn
                // })
                // this.activities.forEach(a => {
                //     a.expireOn = new Date();
                // });
                // let record =  this.selectedActivities;
                // record.push(this.selectedActivities.find(a=>a.activityParentId == parentId));

                // this.selectedActivities =  record;
                this.loadingService.hide();
            });
        this.activitiesModal = true;
    }

    hideModal() {
        this.display = false;
    }

    onStateChanged() {
        let stateId = this.staffFormGroup.value.StateId
        if (stateId) {
            this.countryStateSrv.getCityByState(stateId).subscribe((response: any) => {
                this.cities = response.result;
                if (this.cities.length) {
                    this.cityLoaded = true;
                } else {
                    this.cityLoaded = false;
                }
            });
        }

    }

    onBranchChanged() {
        let branchId = this.staffFormGroup.value.BranchId;
    }
    changePassword: boolean = true;
    showchangePassword: boolean = false;
    changeSecurityQuestion: boolean = true;
    showchangeSecurityQuestion: boolean = false;
    togglePassword(event) {
        if (event === true) {
            this.changePassword = true;
        } else {
            this.changePassword = false;
        }
    }
    toggleChangePassword(event) {
        const securityQuestionControl = this.staffFormGroup.get('user').get('securityQuestion')
        const securityAnswerControl = this.staffFormGroup.get('user').get('securityAnswer')

        if (event === true) {
            securityAnswerControl.setValidators(Validators.required);
            securityQuestionControl.setValidators(Validators.required);
            this.changeSecurityQuestion = true;
        } else {
            securityAnswerControl.clearValidators();
            securityQuestionControl.clearValidators();
            this.changeSecurityQuestion = false;
        }
        securityAnswerControl.updateValueAndValidity();
        securityQuestionControl.updateValueAndValidity();
    }

    onSubmit(formObj) {
        const record = formObj.value;
        if (this.changePassword) {
            if (record.user.password != record.user.confirmPassword) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Password does not match', 'error');
                return;
            }
        }

        this.loadingService.show();

        var groups = [];
        record.group.forEach(result => {
            groups.push({
                groupId: result,
                groupKey: ''
            });
        });

        let constActivities = [];
        this.multipleActivities.forEach(result => {
            constActivities.push({
                userId: 0,
                activityId: result.activityId,
                expireOn: result.expireOn
            });
        });


        // record.activities.forEach(result => {
        //     constActivities.push({
        //         userId: 0,
        //         activityId: result
        //     });
        // });

        let bodyObj = {
            branchId: record.BranchId,
            companyId: record.companyId,
            supervisorStaffId: this.selectedSupervisorId,
            staffId: record.StaffId,
            staffCode: record.StaffCode,
            firstName: record.FirstName,
            lastName: record.LastName,
            middleName: record.MiddleName,
            //jobTitleId: record.JobTitleId,
            staffRoleId: record.StaffRoleId,
            phone: record.Phone,
            email: record.Email,
            address: record.Address,
            dateOfBirth: record.DateOfBirth,
            gender: record.Gender,
            nameOfNok: record.NameOfNok,
            phoneOfNok: record.PhoneOfNok,
            emailOfNok: record.EmailOfNok,
            addressOfNok: record.AddressOfNok,
            genderOfNok: record.GenderOfNok,
            nokrelationShip: record.NokrelationShip,
            //misinfoId: record.MisinfoId,
            misCode: record.MisCode,
            //departmentUnitId: record.departmentUnitId,
            businessUnitId: record.businessUnitId,
            stateId: record.StateId,
            cityId: record.CityId,
            customerSensitivityLevelId: record.customerSensitivityLevelId,
            SensitivityLevel: record.customerSensitivityLevelId,

            loanLimit: record.loanLimit,
            workStartDuration: record.workStartDuration,
            workEndDuration: record.workEndDuration,
            user: {
                user_id: record.user.user_id,
                staffId: record.user.staffId,
                username: record.user.username,
                password: record.user.password,
                confirmPassword: record.user.confirmPassword,
                securityQuestion: record.user.securityQuestion,
                securityAnswer: record.user.securityAnswer,
                group: groups,
                activities: constActivities,
                changePassword: this.changePassword,
                changeSecutirtyQuestion: this.changePassword,
            }
        }


        if (this.isUpdate == true) {
            this.staffService.updateStaff(bodyObj.staffId, bodyObj).subscribe((res) => {
                if (res.success === true) {
                    this.getAllStaff();
                    this.initializeForm();
                    this.loadingService.hide();
                    this.display = false;
                    this.activeIndex = 0;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    this.display = true;
                    this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();
                this.display = true;
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        } else {
            this.staffService.addStaff(bodyObj).subscribe((res) => {
                if (res.success === true) {
                    this.getAllStaff();
                    this.initializeForm();
                    this.loadingService.hide();
                    this.display = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    this.loadingService.hide();
                    this.display = true;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();
                this.display = true;
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }
    }
    adDetails: any;
    firstName: any;
    middleName: any;
    lastName: any;
    bulkUPload: boolean = false;
    buttonText: any;

    requestPasswordSingle() {
        this.buttonText = "Get Details";
        this.bulkUPload = false;
        this.displayADAuth = true;
    }

    requestPasswordBulk() {
        if (this.adActive) {
            this.buttonText = "Uploads Staffs";
            this.displayADAuth = true;
            this.bulkUPload = true;
        }
        else {
            this.adAuthPassCode = "";
            this.uploadStaffRecordFile();
        }

    }

    performAction() {
        if (this.bulkUPload == false) {
            this.getADDetails();
        } else {
            this.uploadStaffRecordFile();
        }
    }
    staffRole: any;
    staffRolExist: boolean = false;
    getADDetails() {
        const staffCode = this.staffFormGroup.get('StaffCode').value;
        // const adAuthPassCode = this.adAuthPassCode;
        let adAuthPassCode = btoa(this.adAuthPassCode);
        //this.loadingService.show();
        this.loadingService.show();

        this.adminService.getStaffADDetails(staffCode, adAuthPassCode).subscribe((val) => {
            this.adDetails = val.result;
            if (val.success) {
                this.firstName = this.adDetails.firstName;
                this.middleName = this.adDetails.middleName;
                this.lastName = this.adDetails.lastName;
                this.staffRole = this.adDetails.staffRole;
                if (this.staffRole != null) {
                    this.staffFormGroup.controls['StaffRoleId'].setValue(this.adDetails.staffRoleId);
                    this.staffRolExist = true
                } else {
                    this.staffRolExist = false
                }
                if (this.middleName == null) {
                    this.middleName = "";
                }
                if (this.firstName == null) {
                    this.firstName = "";
                }
                if (this.lastName == null) {
                    this.lastName = "";
                }
                let userStaffName = this.lastName + " " + this.firstName + " " + this.middleName;
                this.staffFormGroup.get('user').get('staffName').setValue(userStaffName);
                this.displayADAuth = false;
                this.loadingService.hide();
            } else {
                this.loadingService.hide();
                this.displayADAuth = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, val.message, 'error');
            }

            // this.loadingService.hide();
        }, (err) => {
            //this.loadingService.hide();
            this.loadingService.hide();
        });
    }
    getAllStaff() {
        this.loadingService.show();
        this.staffService.getAllStaff().subscribe((val) => {
            this.staffDataset = val.result;
            this.loadingService.hide();
        }, (err) => {
        });
    }
    onStaffNameChange() {
        const firstNameControl = this.staffFormGroup.get('FirstName').value;
        const middleNameControl = this.staffFormGroup.get('MiddleName').value;
        const lastNameControl = this.staffFormGroup.get('LastName').value;
        let userStaffName = lastNameControl + " " + firstNameControl + " " + middleNameControl
        this.staffFormGroup.get('user').get('staffName').setValue(userStaffName);
    }

    onStaffCodeChange() {
        const staffCodeControl = this.staffFormGroup.get('StaffCode').value;
        let userName = staffCodeControl;
        this.staffFormGroup.get('user').get('username').setValue(userName);
    }
    isEdit: boolean = false;

    editStaff(index) {
        // this.initializeForm();
        this.changePassword = false;

        this.showchangePassword = true;
        this.changeSecurityQuestion = false;

        this.showchangeSecurityQuestion = true;


        this.activeIndex = 0;
        this.showAssignSupervisorButton = false;
        this.selectedStaff = index;
        this.getUsersByStaffId(this.selectedStaff.staffId);
        let loanLimitValue = this.selectedStaff.loanLimit != undefined ? this.selectedStaff.loanLimit : 0;
        let loanLimit = ConvertString.ToNumberFormate(loanLimitValue);
        this.staffFormGroup.controls['BranchId'].setValue(this.selectedStaff.branchId);
        this.staffFormGroup.controls['StaffCode'].setValue(this.selectedStaff.staffCode);
        this.staffFormGroup.controls['FirstName'].setValue(this.selectedStaff.firstName);
        this.staffFormGroup.controls['MiddleName'].setValue(this.selectedStaff.middleName);
        this.staffFormGroup.controls['LastName'].setValue(this.selectedStaff.lastName);
        //this.staffFormGroup.controls['MisinfoId'].setValue(this.selectedStaff.misinfoId);
        this.staffFormGroup.controls['MisCode'].setValue(this.selectedStaff.misCode);

        // this.staffFormGroup.controls['DepartmentId'].setValue(this.selectedStaff.departmentId);
        this.staffFormGroup.controls['Email'].setValidators(Validators.compose([Validators.required, ValidationService.isEmail]));
        this.staffFormGroup.controls['Email'].setValue(this.selectedStaff.email);
        this.staffFormGroup.controls['Phone'].setValue(this.selectedStaff.phone);
        //this.staffFormGroup.controls['JobTitleId'].setValue(this.selectedStaff.jobTitleId);
        this.staffFormGroup.controls['StaffRoleId'].setValue(this.selectedStaff.staffRoleId);
        this.staffFormGroup.controls['supervisorStaffId'].setValue(this.selectedStaff.supervisorStaffId);
        this.staffFormGroup.controls['Gender'].setValue(this.selectedStaff.gender);
        this.staffFormGroup.controls['Address'].setValue(this.selectedStaff.address);
        this.staffFormGroup.controls['StateId'].setValue(this.selectedStaff.stateId);
        this.onStateChanged();
        this.staffFormGroup.controls['CityId'].setValue(this.selectedStaff.cityId);
        this.staffFormGroup.controls['DateOfBirth'].setValue(new Date(this.selectedStaff.dateOfBirth));
        this.staffFormGroup.controls['customerSensitivityLevelId'].setValue(this.selectedStaff.customerSensitivityLevelId);
        this.staffFormGroup.controls['NameOfNok'].setValue(this.selectedStaff.nameOfNok);
        this.staffFormGroup.controls['PhoneOfNok'].setValue(this.selectedStaff.phoneOfNok);
        this.staffFormGroup.controls['EmailOfNok'].setValue(this.selectedStaff.emailOfNok);
        this.staffFormGroup.controls['GenderOfNok'].setValue(this.selectedStaff.genderOfNok);
        this.staffFormGroup.controls['NokrelationShip'].setValue(this.selectedStaff.nokRelationship);
        this.staffFormGroup.controls['AddressOfNok'].setValue(this.selectedStaff.addressOfNok);
        this.staffFormGroup.controls['StaffId'].setValue(this.selectedStaff.staffId);
        // this.staffFormGroup.controls['departmentUnitId'].setValue(this.selectedStaff.departmentUnitId);
        this.staffFormGroup.controls['loanLimit'].setValue(loanLimit);
        this.staffFormGroup.controls['workStartDuration'].setValue(this.selectedStaff.workStartDuration);
        this.staffFormGroup.controls['workEndDuration'].setValue(this.selectedStaff.workEndDuration);
        this.staffFormGroup.controls['businessUnitId'].setValue(this.selectedStaff.businessUnitId);
        this.staffFormGroup.controls['companyId'].setValue(this.selectedStaff.companyId);

        //this.departmentUnits = this.slectedStaff.departmentUnits;
        this.staffFormGroup.get('user').get('staffName').setValue(this.selectedStaff.firstName + ' ' + this.selectedStaff.middleName + ' ' + this.selectedStaff.lastName);
        this.staffFormGroup.get('user').get('username').setValue(this.selectedStaff.staffCode);
        // this.staffFormGroup.get('user').get('changePassword').setValue(false);
        const passwordControl = this.staffFormGroup.get('user').get('password')
        const confirmPasswordControl = this.staffFormGroup.get('user').get('confirmPassword')
        const securityQuestionControl = this.staffFormGroup.get('user').get('securityQuestion')
        const securityAnswerControl = this.staffFormGroup.get('user').get('securityAnswer')
        passwordControl.clearValidators();
        confirmPasswordControl.clearValidators();
        securityQuestionControl.clearValidators();
        securityAnswerControl.clearValidators();
        passwordControl.setValidators(Validators.minLength(this.minPasswordLength));
        confirmPasswordControl.setValidators(Validators.minLength(this.minPasswordLength));
        passwordControl.updateValueAndValidity();
        confirmPasswordControl.updateValueAndValidity();
        securityQuestionControl.updateValueAndValidity();
        securityAnswerControl.updateValueAndValidity();
        this.isEdit = true;
        if (this.staffDataset != null || this.staffDataset != undefined || this.staffDataset.length > 0) {
            var supervisorData = this.staffDataset.find(x => x.staffId == this.selectedStaff.supervisorStaffId)
            let supervisorFullName = supervisorData != null ? supervisorData.staffFullName : null;
            this.staffSearchForm.controls['searchedName'].setValue(supervisorFullName);
        }

        this.isUpdate = true;
        this.display = true;

        //supervisor/MIS info
        this.getStaffMIS(this.selectedStaff.staffCode);
        this.getSupervisorDetail(this.selectedStaff.staffCode);

    }

    deleteStaff(id) {
        this.staffService.removeStaff(id).subscribe((res: any) => {
            if (res.success == true) {
                swal('Fintrak Credit 360', res.message, 'success');
                this.getAllStaff();
                this.staffDataset.slice;
            } else {
                swal('Fintrak Credit 360', res.message, 'error');
            }
        }, (error) => {
            this.loadingService.hide();
            swal('Fintrak Credit 360', JSON.stringify(error) ? JSON.stringify(error) : 'Error occured', 'error')
        });
    }

    confirmDelete(row) {
        const __this = this;
        var id = row.staffId;
        swal({
            title: 'Are you sure?',
            text: 'Are you sure You want to delete this user. You will not be able to undo once comitted.',
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
            __this.loadingService.show();
            __this.deleteStaff(id);
            __this.loadingService.hide(1000);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    showDialog() {
        this.initializeForm();
        this.isUpdate = false;
        this.display = true;
        this.activeIndex = 0;
        this.showAssignSupervisorButton = false;
        this.isEdit = false;
        this.showchangePassword = false;
        this.changePassword = true;
        this.showchangeSecurityQuestion = false;
        this.changeSecurityQuestion = true;
    }

    showBulkUploadDialog() {
        this.initializeForm();
        this.displayDocumentUpload = true;
        //this.display = false;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadStaffRecordFile() {
        this.loadingService.show();
        if (this.file != undefined || this.file != null) {
            let adAuthPassCode = btoa(this.adAuthPassCode);

            let body = {
                loanReferenceNumber: '',
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                loginStaffPassCode: adAuthPassCode,
            };
            this.staffService.uploadStaffRecordFile(this.file, body).then((res: any) => {
                if (res.success == true) {
                    if (res.result != undefined || res.result != null) {
                        res.result.commitedRows == undefined ? this.uploadedData = []
                            : this.uploadedData = res.result.commitedRows;

                        res.result.discardedRows == undefined ? this.failedUpload = []
                            : this.failedUpload = res.result.discardedRows;

                        this.loadingService.hide();
                        if (res.result.commitedRows.length <= 0 && res.result.discardedRows.length > 0) {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Staff upload failed' + '\n' + 'See log for more info', 'warning');
                        }
                        else if ((res.result.commitedRows.length > 0) && (res.result.discardedRows.length > 0)) {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Upload was successful but some records failed to upload', 'info');
                        }
                        else {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'info');
                        }
                    }
                } else {
                    if (res.result != null || res.result != undefined) {
                        this.uploadedData = res.result.commitedRows;
                        this.failedUpload = res.result.discardedRows;
                    }

                    this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (error) => {
                this.loadingService.hide();
                swal('Bulk Staff Upload', JSON.stringify(error) ? JSON.stringify(error) : 'uploading multiple staff generated error', 'error')
            });
        } {

        }
        this.displayADAuth = false;
    }

    // DownloadSampleTemplate()
    // {
    //     this.adminService.downloadFile().subscribe(blob => {
    //         importedSaveAs(blob, 'fbnStaffupload');
    //     }
    // )
    // }

    handleChange(evt) {
        this.activeIndex = evt.index;
    }


    // RELIEVER
    selectedSupervisorId: number = null;

    assignSupervisor(id) {
        const __this = this;
        let status = 'Add';
        if (+id == 2) { status = 'Change'; }
        if (+id == 3) { status = 'Unassign'; }

        swal({
            title: status + ' Supervisor?',
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

            const body = {
                status: status,
                statusId: id,
                supervisorId: __this.selectedSupervisorId,
                supervisorStaffId: __this.selectedStaff.staffId,
                staffCode: __this.selectedStaff.staffCode,
            }


            __this.loadingService.show();
            __this.staffService.updateSupervisor(body).subscribe((res) => {
                if (res.success === true) {
                    __this.loadingService.hide();
                    swal(GlobalConfig.APPLICATION_NAME, 'Operation successful.', 'success');
                } else {
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                __this.display = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }




    searchResults: Object;
    searchTerm$ = new Subject<any>();
    displaySearchModal: boolean = false;
    selectedSearchedId: number = null;
    errorMessage: string = '';

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        this.staffSearchForm.controls['searchedName'].setValue(data.fullName);
        this.selectedSupervisorId = data.staffId;
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    DownloadDocument() {
        this.staffService.getSampleStaffBulkUploadDocument().subscribe((response: any) => {
            let fileDocument = response.result;
            if (fileDocument != undefined) {
                //var byteString = atob(fileDocument);
                var byteString = atob(fileDocument);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                var file = new File([bb], 'Staff Bulk Upload  Template.xlsx', { type: 'application/vnd.ms-excel' });
                saveAs(file);

            }
        });
    }


    loadOtherInformation() {
        this.otherInformationForm = this.fb.group({
            staffId: [''],
            field1: [''],
            field2: [''],
            field3: [''],
            field4: [''],
            field5: [''],
            field6: [''],
            field7: [''],
            field8: [''],
            field9: [''],
            field10: [''],
        })
    }
    showEditOtherInfomation() {
        this.loadOtherInformation();
        this.displayOtherInformation = true;
        this.otherInformationForm = this.fb.group({
            staffId: [this.otherInformation.staffId],
            field1: [this.otherInformation.field1],
            field2: [this.otherInformation.field2],
            field3: [this.otherInformation.field3],
            field4: [this.otherInformation.field4],
            field5: [this.otherInformation.field5],
            field6: [this.otherInformation.field6],
            field7: [this.otherInformation.field7],
            field8: [this.otherInformation.field8],
            field9: [this.otherInformation.field9],
            field10: [this.otherInformation.field10],
        })
    }
    submitcustomerOtherInformation(formObj) {

    }
    prevButton(evt) {
        this.activeIndex = this.activeIndex - 1;
    }
    nextButton(evt) {
        this.activeIndex = this.activeIndex + 1;
    }


    getSupervisorDetail(staffCode: string) {
        this.loadingService.show();
        this.staffRolServ.StaffSupervosor(staffCode).subscribe((response: any) => {
            this.SupervisorReportings = response.result;

            if (this.SupervisorReportings != null) {
                this.supervisorCode = this.SupervisorReportings.staffCode;
                this.supervisorName = this.SupervisorReportings.firstName;
                this.supervisorBranch = this.SupervisorReportings.branchName;
                this.supervisorEmail = this.SupervisorReportings.email;
            }
            this.loadingService.hide();
        });
    }


    getStaffMIS(staffCode: string) {
        this.loadingService.show();
        this.staffRolServ.StaffMIS(staffCode).subscribe((response: any) => {
            this.mis = response.result;

            if (this.mis != null) {
                this.username = this.mis.username;
                this.teamUnit = this.mis.teamUnit;
                this.costCent = this.mis.costCent;
                this.dept = this.mis.dept;
                this.region = this.mis.region;
                this.group = this.mis.group;
                this.directorate = this.mis.directorate;
            }
            this.loadingService.hide();
        });
    }

    getProfileBusinessUnits() {
        this.genSetupServ.getProfileBusinessUnits().subscribe((response: any) => {
            this.businessUnit = response.result;
        });
    }
}