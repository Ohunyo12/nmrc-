import { AuthenticationService } from './../../admin/services/authentication.service';
import { MenuVisibiltyService } from '../services/role-menu.service';
import { Component, Input, OnInit, EventEmitter, ViewChild, Inject, forwardRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { MainLayoutComponent } from '../layout/mainlayout.component';
import * as _ from 'lodash';


@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: MenuItem[];
    userInfo: any;


    constructor(@Inject(forwardRef(() => MainLayoutComponent)) public app: MainLayoutComponent,
        private authService: AuthenticationService,
        private menuGuardSrv: MenuVisibiltyService) { }


        ngOnInit() {
            this.model = [
                {
                    label: 'Dashboard', icon: 'equalizer', routerLink: ['/'],
                    // visible: this.menuGuardSrv.hideOrShow(['dashboard'])
                },
                
                {
                    label: 'Admin', icon: 'business',
                    visible: this.menuGuardSrv.hideOrShow([
                        'eod process',
                        'api log',
                        'app error log',
                        'custom batch posting',
                        'user group', 
                        'group activity',
                        'staff registration',
                        'user registration',
                        'signature management',
                        'user account management',
                        'user-role setup',
                        'profile-settings',
                        'collateral type setup',
                        'collateral sub-type setup',
                        'accredited consultants',
                        'approved employers setup',
                        'approved fts markets setup',
                        'limit maintenance',
                        'email alert setup',
                        'document repository setup',
                        'checklist definition setup',
                        'default conditions setup',
                        'transaction dynamics setup',
                        'compliance timeline setup',
                        'covenant types setup',
                        'prudential guidelines setup',
                        'fs caption-group',
                        'fs caption',
                        'fs ratio-caption',
                        'fs ratio-detail',
                        'call limit setup',
                        'job request setup',
                        'group relationship type',
                        'customer group',
                        'group caption-detail',
                        'approval group',
                        'approval level',
                        'approval workflow',
                        'approval relief',
                        'company setup',
                        'region setup',
                        'branch setup',
                        'department setup',
                         'down payment setup',
                        'unit setup',
                        'state setup',
                        'city setup',
                        'tax setup',
                        'fee and charge setup',
                        'product process setup',
                        'product class setup',
                        'product group setup',
                        'product type setup',
                        'product definition setup',
                        'product maintenance setup',
                        'ledger account type',
                        'chart of account',
                        //'approval trail',
                        'dormant staff log',
                        'deleted staff log',
                        'bulk disbursement',
                        //'alert setup',
                        'document upload setup',
                        'document mapping setup',
                        'job hub management'
                    ]),
                    items: [
                        {
                            label: 'IT Admin', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'eod process',
                                'api log',
                                'app error log',
                                'custom batch posting',
                                //'approval trail',
                                'dormant staff log',
                                'deleted staff log',
                                //'alert setup',
                                'document upload setup',
                                //'data archive',
                                // 'manual data archive'
                                'support utility'
                            ]),
                            items: [
                                {
                                    label: 'EOD Process', icon: '', routerLink: ['/setup/end-of-day'],
                                    visible: this.menuGuardSrv.hideOrShow(['eod process'])
                                },
                                {
                                    label: 'API Log', icon: '', routerLink: ['/admin/api-log'],
                                    visible: this.menuGuardSrv.hideOrShow(['api log'])
                                },
                                {
                                    label: 'Application Error Log', icon: '', routerLink: ['/admin/error-log'],
                                    visible: this.menuGuardSrv.hideOrShow(['app error log'])
                                },
                                // {
                                //     label: 'Support Utility', icon: '',
                                //     visible: this.menuGuardSrv.hideOrShow([
                                //         'support utility customer',
                                //         'support utility staff',
                                //         'support utility workflow',,
                                //     ]),
                                //     items: [
                                //         {
                                //             label: 'Support Utility Customer', icon: '', routerLink: ['/admin/support-utility-customer'],
                                //             visible: this.menuGuardSrv.hideOrShow(['support utility customer'])
                                //         },
                                //         {
                                //             label: 'Support Utility Staff', icon: '', routerLink: ['/admin/support-utility-staff'],
                                //             visible: this.menuGuardSrv.hideOrShow(['support utility staff'])
                                //         },
                                //         {
                                //             label: 'Support Utility Workflow', icon: '', routerLink: ['/admin/support-utility-workflow'],
                                //             visible: this.menuGuardSrv.hideOrShow(['support utility workflow'])
                                //         },
                                //     ]
                                // },
                                {
                                    label: 'Deleted Staff Log', icon: '', routerLink: ['/admin/deleted-staff-log'],
                                    visible: this.menuGuardSrv.hideOrShow(['deleted staff log'])
                                },
                                {
                                    label: 'Dormant Staff Log', icon: '', routerLink: ['/admin/dormant-staff-log'],
                                    visible: this.menuGuardSrv.hideOrShow(['dormant staff log'])
                                },
                                {
                                    label: 'Alert Setup', icon: '', routerLink: ['/setup/alert-setup'],
                                    visible: this.menuGuardSrv.hideOrShow(['document upload setup'])
                                },
                                // {
                                //     label: 'Data Archive', icon: '', routerLink: ['/setup/data-archive'],
                                //     visible: this.menuGuardSrv.hideOrShow(['data archive'])
                                // },
                                // {
                                //     label: 'Manual Data Archive', icon: '', routerLink: ['/setup/manual-data-archive'],
                                //     visible: this.menuGuardSrv.hideOrShow(['manual data archive'])
                                // },
                                {
                                    label: 'Custom Batch Posting', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['custom batch posting']),
                                    items: [
                                        {
                                            label: 'Detail', icon: '', routerLink: ['/admin/batch-posting-detail'],
                                            visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                        },
                                        
                                        {
                                            label: 'Main', icon: '', routerLink: ['/admin/batch-posting-main'],
                                            visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                        },
                                        // {
                                        //     label: 'Refresh Staging Monitoring', icon: '', routerLink: ['/admin/refresh-staging-monitoring'],
                                        //     visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                        // },
                                        {
                                            label: 'Refresh Staging Monitoring', icon: '', routerLink: ['/admin/refresh-staging-monitoring'],
                                            visible: this.menuGuardSrv.hideOrShow(['custom batch posting'])
                                        },
                                        
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'User Admin', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'user group',
                                'group activity',
                                'staff registration',
                                'user registration',
                                'signature management',
                                'user account management',
                                'user-role setup',
                                'profile-settings',
                            ]),
                            items: [
                                {
                                    label: 'Groups', icon: '', routerLink: ['/admin/groups'],
                                    visible: this.menuGuardSrv.hideOrShow(['user group'])
                                },
                                {
                                    label: 'Group Activity', icon: '', routerLink: ['/admin/group-activity'],
                                    visible: this.menuGuardSrv.hideOrShow(['group activity'])
                                },
                                {
                                    label: 'Users', icon: '', routerLink: ['/admin/staff'],
                                    visible: this.menuGuardSrv.hideOrShow(['staff registration'])
                                },
    
                                // {
                                //     label: 'Users', icon: '', routerLink: ['/admin/users'],
                                //     visible: this.menuGuardSrv.hideOrShow(['user registration'])
                                // },
                                {
                                    label: 'User Role', icon: '', routerLink: ['/setup/staff-role'],
                                    visible: this.menuGuardSrv.hideOrShow(['user-role setup'])
                                },
    
                                {
                                    label: 'Credit Officer Risk Rating', icon: '', routerLink: ['/admin/officer-risk-rating'],
                                    visible: this.menuGuardSrv.hideOrShow(['user account management'])
                                },
    
                                // {
                                //     label: 'Signature Management', icon: '', routerLink: ['/admin/staff/signature-management'],
                                //     visible: this.menuGuardSrv.hideOrShow(['signature management'])
                                // },
                                {
                                    label: 'User Account Management', icon: '', routerLink: ['/admin/useradministration'],
                                    visible: this.menuGuardSrv.hideOrShow(['user account management'])
                                },
                                // {
                                //     label: 'Staff/Supervisor Reporting', icon: '', routerLink: ['/setup/staff-supervisor-reporting'],
                                //     visible: this.menuGuardSrv.hideOrShow(['staff registration'])
                                // },
                                {
                                    label: 'Profile Settings', icon: '', routerLink: ['/admin/profile-settings'],
                                    visible: this.menuGuardSrv.hideOrShow(['profile-settings'])
                                },
                                
                                // {
                                //     label: 'Staff/User Admin', icon: '',
                                //     visible: this.menuGuardSrv.hideOrShow([
                                //         'user group',
                                //         'group activity',
                                //         'staff registration',
                                //         'user registration',
                                //         'signature management',
                                //         'user account management',
                                //         'user-role setup',
                                //     ]),
                                //     items: [
    
                                //     ]
                                // },
                            ]
                        },
                        {
                            label: 'Credit Admin', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'collateral type setup',
                                'collateral sub-type setup',
                                'accredited consultants',
                                'approved employers setup',
                                'approved fts markets setup',
                                'limit maintenance',
                                'email alert setup',
                                'document repository setup',
                                'checklist definition setup',
                                'default conditions setup',
                                'transaction dynamics setup',
                                'compliance timeline setup',
                                'covenant types setup',
                                'prudential guidelines setup',
                                'fs caption-group',
                                'fs caption',
                                'fs ratio-caption',
                                'fs ratio-detail',
                                'call limit setup',
                                'job request setup',
                                'group relationship type',
                                'customer group',
                                'group caption-detail',
                                'approval group',
                                'approval level',
                                'approval workflow',
                                'approval relief',
                                'company setup',
                                'region setup',
                                'branch setup',
                                'department setup',
                                'unit setup',
                                'state setup',
                                'city setup',
                                'job hub management',
                                'retail collection cron job',

                               
                            ]),
                            items: [
                                {
                                    label: 'Credit', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'collateral type setup',
                                        'collateral sub-type setup',
                                        'accredited consultants',
                                        'approved employers setup',
                                        'approved fts markets setup',
                                        'limit maintenance',
                                        'email alert setup',
                                        'document repository setup',
                                        'checklist definition setup',
                                        'default conditions setup',
                                        'transaction dynamics setup',
                                        'compliance timeline setup',
                                        'covenant types setup',
                                        'prudential guidelines setup',
                                        'fs caption-group',
                                        'fs caption',
                                        'fs ratio-caption',
                                        'fs ratio-detail',
                                        'call limit setup',
                                        'job request setup',
                                        'document upload-setup',
                                        'authoried signatories',
                                        'insurance setup',
                                        'job hub management',
                                        'approval setup',
                                        'retail collection cron job',
                                        'down payment setup',
                                        'housing expense setup',
    
                                    ]),
                                    items: [
                                        {
                                            label: 'Collateral', icon: '',
                                            visible: this.menuGuardSrv.hideOrShow(['collateral type setup', 'collateral sub-type setup']),
                                            items: [
                                                {
                                                    label: 'Types', icon: '', routerLink: ['/setup/collateral/collateral-type'],
                                                    visible: this.menuGuardSrv.hideOrShow(['collateral type setup'])
                                                },
                                                {
                                                    label: 'Sub-Types', icon: '', routerLink: ['/setup/collateral/collateral-sub-type'],
                                                    visible: this.menuGuardSrv.hideOrShow(['collateral sub-type setup'])
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Accredited Consultants', icon: '', routerLink: ['/setup/accredited-solicitors'],
                                            visible: this.menuGuardSrv.hideOrShow(['accredited consultants'])
                                        },
                                        
                                        {
                                            label: 'Accredited Principals', icon: '', routerLink: ['/setup/accredited-principals'],
                                            visible: this.menuGuardSrv.hideOrShow(['accredited consultants'])
                                        },
                                        {
                                            label: 'Approved Employers', icon: '', routerLink: ['/setup/setup/employer-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['approved employers setup'])
                                        },
                                        {
                                            label: 'Approved FTS Markets', icon: '', routerLink: ['/setup/credit/approved-market'],
                                            visible: this.menuGuardSrv.hideOrShow(['approved fts markets setup'])
                                        },
                                        {
                                            label: 'Limit Maintenance', icon: '', routerLink: ['/setup/limitmaintenance'],
                                            visible: this.menuGuardSrv.hideOrShow(['limit maintenance'])
                                        },
                                        {
                                            label: 'Email Alert', icon: '', routerLink: ['/setup/alertMessages'],
                                            visible: this.menuGuardSrv.hideOrShow(['email alert setup'])
                                        },
                                        // {
                                        //     label: 'Document Repository', icon: '', routerLink: ['/setup/document/document-template'],
                                        //     visible: this.menuGuardSrv.hideOrShow(['document repository setup'])
                                        // },
                                        {
                                            label: 'Document Template', icon: '', routerLink: ['/setup/document/document-template-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['document template setup'])
                                        },
                                        {
                                            label: 'Digital Stamp Setup', icon: '', routerLink: ['/setup/digital-stamp/setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['document upload setup'])
                                        },

                                        {
                                            label: 'Document Upload Setup', icon: '', routerLink: ['/setup/document/upload-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['document upload setup'])
                                        },
                                        {
                                            label: 'Stamp Duty Condition Setup', icon: '', routerLink: ['/setup/stamp-duty-condition'],
                                            visible: this.menuGuardSrv.hideOrShow(['fee and charge setup'])
                                        },
                                        {
                                            label: 'Reference Document', icon: '', routerLink: ['/setup/reference-document'],
                                            visible: this.menuGuardSrv.hideOrShow(['document template setup'])
                                        },
                                        {
                                            label: 'Checklist Definition', icon: '', routerLink: ['/setup/credit/checklist-definition'],
                                            visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                        },
                                        {
                                            label: 'ESG Checklist Definition', icon: '', routerLink: ['/setup/credit/esg-checklist-definition'],
                                            visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                        },
                                        {
                                            label: 'Green Loan Identifier Definition', icon: '', routerLink: ['/setup/credit/green-rating-definition'],
                                            visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                        },
                                        {
                                            label: 'RAC', icon: '', routerLink: ['/setup/credit/rac'],
                                            visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                        },
                                        {
                                            label: 'Project Criteria', icon: '', routerLink: ['/setup/credit/contractor-criteria-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                        },
                                        {
                                            label: 'IBL Checklist', icon: '', routerLink: ['/setup/credit/ibl-checklist-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['checklist definition setup'])
                                        },
                                        {
                                            label: 'Recovery Collection Setup', icon: '', routerLink: ['/setup/credit/collections-retail-cron-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['retail collection cron job'])
                                        },
                                        {
                                            label: 'Compliance Timeline', icon: '', routerLink: ['/setup/credit/compliance-timeline'],
                                            visible: this.menuGuardSrv.hideOrShow(['compliance timeline setup'])
                                        },
                                        {
                                            label: 'Default Conditions', icon: '', routerLink: ['/setup/credit/condition-precedent'],
                                            visible: this.menuGuardSrv.hideOrShow(['default conditions setup'])
                                        },
                                        {
                                            label: 'Default Transaction Dynamics', icon: '', routerLink: ['/setup/credit/transaction-dynamics'],
                                            visible: this.menuGuardSrv.hideOrShow(['transaction dynamics setup'])
                                        },
                                        {
                                            label: 'Covenant Types', icon: '', routerLink: ['/setup/credit/covenant-type'],
                                            visible: this.menuGuardSrv.hideOrShow(['covenant types setup'])
                                        },
                                        {
                                            label: 'Prudential Guidelines', icon: '', routerLink: ['/setup/credit/prudential-guideline-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['prudential guidelines setup'])
                                        },
                                        {
                                            label: 'Authorised-Signatories', icon: '', routerLink: ['/setup/signatory/signatory-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['Authorised Signatories'])
                                        },
                                        {
                                            label: 'Insurance Setup', icon: '', routerLink: ['/setup/insurance-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['insurance setup'])
                                        },
                                        {
                                            label: 'Approval Setup', icon: '', routerLink: ['/setup/approval-setup'],
                                            visible: this.menuGuardSrv.hideOrShow(['approval setup'])
                                        },

                                                                                                                      {
                                            label: 'Down Payment', icon: '', routerLink: ['/setup/down-payment-setup'],
                                            //visible: this.menuGuardSrv.hideOrShow(['down payment setup'])
                                        },

                                        {
                                            label: 'Housing Expense And Debit Ratio', icon: '', routerLink: ['/setup/house-expense-debit-ratio-setup'],
                                            //visible: this.menuGuardSrv.hideOrShow(['housing expense setup'])
                                        },
                                        {
                                            label: 'FS Caption', icon: '',
                                            visible: this.menuGuardSrv.hideOrShow([
                                                'fs caption-group',
                                                'fs caption',
                                                'fs ratio-caption',
                                                'fs ratio-detail',
                                            ]),
                                            items: [
                                                {
                                                    label: 'FS Caption-Group', icon: '',
                                                    routerLink: ['/setup/credit/customer-fscaption-group'],
                                                    visible: this.menuGuardSrv.hideOrShow(['fs caption-group'])
                                                },
                                                {
                                                    label: 'FS Caption', icon: '',
                                                    routerLink: ['/setup/credit/customer-fscaption'],
                                                    visible: this.menuGuardSrv.hideOrShow(['fs caption'])
                                                },
                                                // {
                                                //     label: 'FS Ratio-Caption', icon: '',
                                                //     routerLink: ['/setup/credit/customer-fsratio-caption'],
                                                //     visible: this.menuGuardSrv.hideOrShow(['fs ratio-caption'])
                                                // },
                                                {
                                                    label: 'FS Derived Detail', icon: '',
                                                    routerLink: ['/setup/credit/customer-fsratio-detail'],
                                                    visible: this.menuGuardSrv.hideOrShow(['fs ratio-detail'])
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Call Limit', icon: '',
                                            routerLink: ['/setup/credit/call-limit'],
                                            visible: this.menuGuardSrv.hideOrShow(['call limit setup'])
                                        },
                                        {
                                            label: 'Job Request Feedback', icon: '',
                                            routerLink: ['/setup/credit/job-request-feedback'],
                                            visible: this.menuGuardSrv.hideOrShow(['job request setup'])
                                        },
                                        {
                                            label: 'Job Type Admin', icon: '',
                                            routerLink: ['/setup/credit/job-type-admin'],
                                            visible: this.menuGuardSrv.hideOrShow(['job request setup'])
                                        },
    
                                        {
                                            label: 'Job Hub Management', icon: '',
                                            routerLink: ['/setup/credit/job-hub-staff'],
                                            visible: this.menuGuardSrv.hideOrShow(['job hub management'])
                                        },
                                        {
                                            label: 'Regulatory', icon: '',
                                            visible: this.menuGuardSrv.hideOrShow(['collateral type setup', 'collateral sub-type setup']),
                                            items: [
                                                {
                                                    label: 'Regulatory Setup', icon: '', routerLink: ['/setup/regulatory/regulatory-setup'],
                                                    visible: this.menuGuardSrv.hideOrShow(['collateral type setup'])
                                                },
    
                                            ],
                                        },
                                    ]
                                },
                                {
                                    label: 'Customer', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'group relationship type',
                                        'customer group',
                                        'group caption-detail',

                                    ]),
                                    items: [
                                        {
                                            label: 'Group Relationship Type', icon: '', routerLink: ['/customer/customer-relationship-type'],
                                            visible: this.menuGuardSrv.hideOrShow(['group relationship type'])
                                        },
                                        {
                                            label: 'Customer Group', icon: '', routerLink: ['/customer/customer-group'],
                                            visible: this.menuGuardSrv.hideOrShow(['customer group'])
                                        },
                                        // {
                                        //     label: 'Caption-Detail (Group)', icon: '',
                                        //     routerLink: ['/setup/credit/customer-group-fscaption-detail'],
                                        //     visible: this.menuGuardSrv.hideOrShow(['group caption-detail'])
                                        // },
                                    ]
                                },
                                {
                                    label: 'Approval', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'approval group',
                                        'approval level',
                                        'approval workflow',
                                        'approval relief',
                                       
                                    ]),
                                    items: [
                                        {
                                            label: 'Group', icon: '', routerLink: ['/setup/approval-group'],
                                            visible: this.menuGuardSrv.hideOrShow(['approval group'])
                                        },
                                        {
                                            label: 'Level', icon: '', routerLink: ['/setup/approval-level'],
                                            visible: this.menuGuardSrv.hideOrShow(['approval level'])
                                        },
                                        {
                                            label: 'Workflow', icon: '', routerLink: ['/setup/approval-workflow'],
                                            visible: this.menuGuardSrv.hideOrShow(['approval workflow'])
                                        },
                                        {
                                            label: 'Relief', icon: '', routerLink: ['/setup/approval-relief'],
                                            visible: this.menuGuardSrv.hideOrShow(['approval relief'])
                                        },
                                        {
                                            label: 'Rule', icon: '', routerLink: ['/setup/approval-level-rule'],
                                            visible: this.menuGuardSrv.hideOrShow(['approval level'])
                                        },
                                        {
                                            label: 'Workflow Change', icon: '', routerLink:['/setup/approval-workflowchange'],
                                            visible:this.menuGuardSrv.hideOrShow(['approval workflow'])
                                        },
                                        {
                                            label: 'Operational Flow Page', icon: '', routerLink:['/setup/operational-flowpage'],
                                            visible:this.menuGuardSrv.hideOrShow(['operational flowpage'])
                                        },
    
                                    ]
                                },
                                {
                                    label: 'Location', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'company setup',
                                        'region setup',
                                        'branch setup',
                                        'department setup',
                                        'unit setup',
                                        'state setup',
                                        'city setup',
                                    ]),
                                    items: [
                                        {
                                            label: 'Company', icon: '', routerLink: ['/setup/company'],
                                            visible: this.menuGuardSrv.hideOrShow(['company setup'])
                                        },
                                        {
                                            label: 'Region', icon: '', routerLink: ['/setup/region'],
                                            visible: this.menuGuardSrv.hideOrShow(['region setup'])
                                        },
                                        {
                                            label: 'Branch', icon: '', routerLink: ['/setup/branch'],
                                            visible: this.menuGuardSrv.hideOrShow(['branch setup'])
                                        },
                                        {
                                            label: 'Department', icon: '', routerLink: ['/setup/department'],
                                            visible: this.menuGuardSrv.hideOrShow(['department setup'])
                                        },
  

                                        {
                                            label: 'Unit', icon: '', routerLink: ['/setup/units'],
                                            visible: this.menuGuardSrv.hideOrShow(['unit setup'])
                                        },
                                        {
                                            label: 'Local Govt', icon: '', routerLink: ['/setup/local-govt'],
                                            visible: this.menuGuardSrv.hideOrShow(['state setup'])
                                        },
                                        {
                                            label: 'State', icon: '', routerLink: ['/setup/state'],
                                            visible: this.menuGuardSrv.hideOrShow(['state setup'])
                                        },
                                        {
                                            label: 'City', icon: '', routerLink: ['/setup/cities'],
                                            visible: this.menuGuardSrv.hideOrShow(['city setup'])
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            label: 'FINCON Admin', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'tax setup',
                                'fee and charge setup',
                                'product process setup',
                                'product class setup',
                                'product group setup',
                                'product type setup',
                                'product definition setup',
                                'product maintenance setup',
                                'document mapping setup',
                                'ledger account type',
                                'chart of account'
                            ]),
                            items: [
    
                                {
                                    label: 'Fee and Charge Setup', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['tax setup', 'fee and charge setup']),
                                    items: [
                                        // {
                                        //     label: 'Tax', icon: '', routerLink: ['/setup/charge/tax'],
                                        //     visible: this.menuGuardSrv.hideOrShow(['tax setup'])
                                        // },
                                        {
                                            label: 'Fees/Charges', icon: '', routerLink: ['/setup/charge/charge'],
                                            visible: this.menuGuardSrv.hideOrShow(['fee and charge setup'])
                                        },
    
                                    ]
                                },
                                {
                                    label: 'Product', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'product process setup',
                                        'product class setup',
                                        'product group setup',
                                        'product type setup',
                                        'product definition setup',
                                        'product maintenance setup',
                                        'document definition setup',
                                        'document mapping setup'
    
                                    ]),
                                    items: [
                                        {
                                            label: 'Process', icon: '', routerLink: ['/setup/product/product-process'],
                                            visible: this.menuGuardSrv.hideOrShow(['product process setup'])
                                        },
                                        {
                                            label: 'Class', icon: '', routerLink: ['/setup/product/product-class'],
                                            visible: this.menuGuardSrv.hideOrShow(['product class setup'])
                                        },
                                        {
                                            label: 'Group', icon: '', routerLink: ['/setup/product/product-group'],
                                            visible: this.menuGuardSrv.hideOrShow(['product group setup'])
                                        },
                                        {
                                            label: 'Type', icon: '', routerLink: ['/setup/product/product-type'],
                                            visible: this.menuGuardSrv.hideOrShow(['product type setup'])
                                        },
                                        {
                                            label: 'Definition', icon: '', routerLink: ['/setup/product/product-definition'],
                                            visible: this.menuGuardSrv.hideOrShow(['product definition setup'])
                                        },
                                        // {
                                        //     label: 'Document Definition', icon: '', routerLink: ['/setup/product/document-definition'],
                                        //     visible: this.menuGuardSrv.hideOrShow(['document definition setup'])
                                        // },
                                        {
                                            label: 'Product Document Mapping', icon: '', routerLink: ['/setup/product/document-mapping'],
                                            visible: this.menuGuardSrv.hideOrShow(['document mapping setup'])
                                        },
                                        {
                                            label: 'Maintenance', icon: '', routerLink: ['/setup/product/product-maintenance'],
                                            visible: this.menuGuardSrv.hideOrShow(['product maintenance setup'])
                                        },
                                        {
                                            label: 'Price Index', icon: '', routerLink: ['/setup/product/product-price-index'],
                                            visible: this.menuGuardSrv.hideOrShow(['product definition setup'])
                                        }
                                    ]
                                },
    
                                {
                                    label: 'Finance', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['ledger account type', 'chart of account']),
                                    items: [
                                        {
                                            label: 'Ledger Account Type', icon: '', routerLink: ['/setup/finance/ledger'],
                                            visible: this.menuGuardSrv.hideOrShow(['ledger account type'])
                                        },
                                        {
                                            label: 'Chart of Account', icon: '', routerLink: ['/setup/finance/account-chart'],
                                            visible: this.menuGuardSrv.hideOrShow(['chart of account'])
                                        },
                                        {
                                            label: 'Custom Chart of Account', icon: '', routerLink: ['/setup/finance/custom-account-chart'],
                                            visible: this.menuGuardSrv.hideOrShow(['chart of account'])
                                        },
                                    ]
                                },
                            ]
                        },
                        // {
                        //     label: 'Bulk Disbursement', icon: '', routerLink: ['/admin/bulk-disbursement'],
                        //     visible: this.menuGuardSrv.hideOrShow(['bulk disbursement'])
                        // },
    
                       
    
                    ]
                },
                {
                    label: 'Power BI', icon: 'link', routerLink: ['/credit/loan-management/external-link-directive'],
                    visible: this.menuGuardSrv.hideOrShow(['external link'])
                },
    
                // {
                //     label: 'Setup', icon: 'build',
                //     visible: this.menuGuardSrv.hideOrShow([
                //         'collateral type setup',
                //         'collateral sub-type setup',
                //         'accredited consultants',
                //         'approved employers setup',
                //         'approved fts markets setup',
                //         'limit maintenance',
                //         'email alert setup',
                //         'document repository setup',
                //         'checklist definition setup',
                //         'default conditions setup',
                //         'transaction dynamics setup',
                //         'compliance timeline setup',
                //         'covenant types setup',
                //         'prudential guidelines setup',
                //         'fs caption-group',
                //         'fs caption',
                //         'group caption-detail',
                //         'fs ratio-caption',
                //         'fs ratio-detail',
                //         'call limit setup',
                //         'job request setup',
                //         'product process setup',
                //         'product class setup',
                //         'product group setup',
                //         'product type setup',
                //         'product definition setup',
                //         'product maintenance setup',
                //         'group relationship type',
                //         'customer group',
                //         'company setup',
                //         'region setup',
                //         'branch setup',
                //         'department setup',
                //         'unit setup',
                //         'state setup',
                //         'city setup',
                //         'approval group',
                //         'approval level',
                //         'approval workflow',
                //         'approval relief',
                //     ]),
                //     items: [
    
    
                //         //
                //         //     label: 'Risk', icon: '',
                //         //     visible: this.menuGuardSrv.hideOrShow(['risk index', 'risk scoring']),
                //         //     items: [
                //         //         {
                //         //             label: 'Index', icon: '', routerLink: ['/setup/risk/risk-index'],
                //         //             visible: this.menuGuardSrv.hideOrShow(['risk index'])
                //         //         },
                //         //         {
                //         //             label: 'Scoring', icon: '', routerLink: ['/setup/risk/risk-scoring'],
                //         //             visible: this.menuGuardSrv.hideOrShow(['risk scoring'])
                //         //         },
                //         //     ]
                //         // },
                //     ]
                // },
                {
                    label: 'Customer Management', icon: 'account_box',
                    visible: this.menuGuardSrv.hideOrShow([
                        'customer profile',
                        'casa search',
                        'customer caption detail',
                        'view financial statement',
                        'group caption-detail'
                    ]),
                    items: [
                        {
                            label: 'Customer Profile', icon: '', routerLink: ['/customer/customer-information'],
                            visible: this.menuGuardSrv.hideOrShow(['customer profile'])
                        },
                        {
                            //label: 'Update Prospect Information', icon: '', routerLink: ['/customer/prospect-customer'],
                            label: 'Convert Prospect To Customer', icon: '', routerLink: ['/customer/prospect-customer'],
                            visible: this.menuGuardSrv.hideOrShow(['customer profile'])
                        },
                        // {
                        //     label: 'CASA Search', icon: '', routerLink: ['/customer/casa'],
                        //     visible: this.menuGuardSrv.hideOrShow(['casa search'])
                        // },
                        {
                            label: 'Financial Caption (Customer)', icon: '', routerLink: ['/setup/credit/customer-fscaption-detail'],
                            visible: this.menuGuardSrv.hideOrShow(['customer caption detail'])
                        },
                        {
                            label: 'Caption-Detail (Group)', icon: '',
                            routerLink: ['/setup/credit/customer-group-fscaption-detail'],
                            visible: this.menuGuardSrv.hideOrShow(['group caption-detail'])
                        },
                        {
                            label: 'View Financial Statement', icon: '', routerLink: ['/setup/credit/view-financial-statement'],
                            visible: this.menuGuardSrv.hideOrShow(['view financial statement'])
                        },
                    ]
                },
                {
                    label: 'Approvals', icon: 'check_circle',
                    visible: this.authService.verifyCorr() && this.menuGuardSrv.hideOrShow([
                        // 'approval trail',
                        'customer profile approval',
                        'user setup approval',
                        'user-role setup approval',
                        'product setup approval',
                        'chart of account setup approval',
                        'customer group setup approval',
                        'aps approval',
                        'loan disbursment',
                        'booking verifier',
                        'loan recovery payment',
                        'drawdown approval',
                        'checklist deferral approval',
                        'concession approval',
                        'pen approval',
                        'override approval',
                        'reasigned accounts approval',
                        'credit operations approval',
                        'credit operation approval - commercial paper',
                        'collateral approval',
                        'collateral policy approval',
                        'collateral assignment approval',
                        'collateral release approval',
                        'Lc Issuance Approval',
                        'Release Of Shipping Documents Approval',
                        'Lc Ussance Approval',
                        'Lc Cancellation Approval',
                        'Lc Enhancement Approval',
                        'Lc Extension Approval',
                        'Lc Ussance Extension Approval',
                        'ATC Lodgement Approval',
                        'ATC Release Approval',
                        'Project Site Report Approval',
                        'Letter Generation Request Approval',
                        'security release approval',
                        'collateral valuation approval',
                        'security-release-approval',
                        'call-memo approval',
                        // 'deferred document approval'
                    ]),
                    items: [
                        // {
                        //     label: 'Approval Trail', icon: '', routerLink: ['/admin/audit-trail'],
                        //     visible: this.menuGuardSrv.hideOrShow(['approval trail'])
                        // },
                        {
                            label: 'Customer Profile', icon: '', routerLink: ['/approvals/admin/customer'],
                            visible: this.menuGuardSrv.hideOrShow(['customer profile approval'])
                        },
                        {
                            label: 'Related Employer', icon: '', routerLink: ['/approvals/admin/related-employer'],
                            visible: this.menuGuardSrv.hideOrShow(['related employer approval'])
                        },
                        {
                            label: 'Setup', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'user setup approval',
                                'user-role setup approval',
                                'product setup approval',
                                'chart of account setup approval',
                                'customer group setup approval'
                            ]),
                            items: [
                                {
                                    label: 'User', icon: '', routerLink: ['/approvals/admin/staff'],
                                    visible: this.menuGuardSrv.hideOrShow(['user setup approval'])
                                },
                                {
                                    label: 'User Delete', icon: '', routerLink: ['/approvals/admin/staff-delete'],
                                    visible: this.menuGuardSrv.hideOrShow(['user setup approval'])
                                },
                                {
                                    label: 'User Account Status', icon: '', routerLink: ['/approvals/admin/user-account-status'],
                                    visible: this.menuGuardSrv.hideOrShow(['user setup approval'])
                                },
    
                                {
                                    label: 'User Role', icon: '', routerLink: ['/approvals/admin/staff-role'],
                                    visible: this.menuGuardSrv.hideOrShow(['user-role setup approval'])
                                },
                                {
                                    label: 'Fee/Charge', icon: '', routerLink: ['/approvals/admin/fee-charge'],
                                    visible: this.menuGuardSrv.hideOrShow(['user-role setup approval'])
                                },
                                {
                                    label: 'Product', icon: '', routerLink: ['/approvals/admin/product'],
                                    visible: this.menuGuardSrv.hideOrShow(['product setup approval'])
                                },
                                {
                                    label: 'Chart of Account', icon: '', routerLink: ['/approvals/admin/chart-of-account'],
                                    visible: this.menuGuardSrv.hideOrShow(['chart of account setup approval'])
                                },
                                {
                                    label: 'Customer Groups', icon: '', routerLink: ['/approvals/admin/customer-group'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
    
                                {
                                    label: 'Customer Group Mapping', icon: '', routerLink: ['/approvals/admin/customer-group-mapping'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
                                {
                                    label: 'Workflow Group Approval', icon: '', routerLink: ['/approvals/approval-workflow-group'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
                                {
                                    label: 'Workflow Level Approval', icon: '', routerLink: ['/approvals/approval-workflow-level'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
                                {
                                    label: 'Workflow Level Staff', icon: '', routerLink: ['/approvals/approval-level-staff'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
                                {
                                    label: 'Staff Relief Approval', icon: '', routerLink: ['/approvals/staff-relief-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
    
                            ]
                        },
                        {
                            label: 'Credit', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'aps approval',
                                'loan disbursment',
                                'booking verifier',
                                'loan recovery payment',
                                'drawdown approval',
                                'checklist deferral approval',
                                'concession approval',
                                'pen approval',
                                'override approval',
                                'reasigned accounts approval',
                                'credit operations approval',
                                'credit operation approval - commercial paper',
                                'Lc Issuance Approval',
                                'Release Of Shipping Documents Approval',
                                'Lc Ussance Approval',
                                'Lc Cancellation Approval',
                                'Lc Enhancement Approval',
                                'Lc Extension Approval',
                                'Lc Ussance Extension Approval',
                                'Original Document Approval',
                                'ATC Lodgement Approval',
                                'ATC Release Approval',
                                'Project Site Report Approval',
                                'Letter Generation Request Approval',
                                'security release approval',
                                'call memo approval',
                                'deferred document approval',
                                'deferral extension approval',
                                'bulk liquidation approval',
                                'Modify Facility',
                                'credit documentation approval'
                                
                            ]),
                            items: [
                                {
                                    label: 'APS', icon: '', routerLink: ['/approvals/credit/advance-payment-sum-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['aps approval'])
                                },
                                {
                                    label: 'Booking Verification', icon: '', routerLink: ['/approvals/credit/loan-booking-verification'],
                                    visible: this.menuGuardSrv.hideOrShow(['booking verifier'])
                                },
                                {
                                    label: 'Loan Recovery Payment', icon: '', routerLink: ['/credit/loan-management/loan-recovery-repayment-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan recovery payment'])
                                },
                                {
                                    label: 'Disbursement', icon: '', routerLink: ['/approvals/credit/loan-disbursement'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan disbursment'])
                                }, 
                                {
                                    label: 'Multiple Disbursement ', icon: '', routerLink: ['/approvals/credit/bulk-loan-disbursement-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan disbursment'])
                                }, 
                                {
                                    label: 'Contingents Release Approval', icon: '', routerLink: ['/approvals/credit/loan-booking'],
                                    visible: this.menuGuardSrv.hideOrShow(['bonds and guarantee','bonds and guarantee approver'])
                                },
                                {
                                    label: 'Drawdown Approval', icon: '', routerLink: ['/approvals/credit/tranche-booking'],
                                    visible: this.menuGuardSrv.hideOrShow(['drawdown approval'])
                                },
                               
                                {
                                    label: 'Adhoc Approval', icon: '', routerLink: ['/approvals/credit/adhoc-approvals'],
                                    visible: this.menuGuardSrv.hideOrShow(['Adhoc Approval'])
                                },
                                {
                                    label: 'Exceptional Loan', icon: '', routerLink: ['/approvals/credit/exceptional-loan-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['exceptional loan approval'])
                                },
                                {
                                    label: 'Exceptional Loan Search', icon: '', routerLink: ['/approvals/credit/exceptional-loan-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['exceptional loan approval'])
                                },
    
                                {
                                    label: 'Letter Of Credit Approvals', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['Lc Issuance Approval', 'Release Of Shipping Documents Approval',
                                                                        'Lc Extension Approval','Lc Ussance Extension Approval',
                                                                        'Lc Ussance Approval','Lc Cancellation Approval','Lc Enhancement Approval']),
                                    items: [
                                        {
                                            label: 'LC Issuance Approval', icon: '', routerLink: ['/credit/lc/issuance-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Issuance Approval'])
                                        },
                                        {
                                            label: 'Release Of Shipping Documents Approval', icon: '', routerLink: ['/credit/lc/release-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Release Of Shipping Documents Approval'])
                                        },
                                        {
                                            label: 'LC Usance Approval', icon: '', routerLink: ['/credit/lc/ussance-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Ussance Approval'])
                                        },
                                        {
                                            label: 'Lc Cancellation Approval', icon: '', routerLink: ['/credit/lc/cancelation-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Cancellation Approval'])
                                        },
                                        {
                                            label: 'Lc Enhancement Approval', icon: '', routerLink: ['/credit/lc/enhancement-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Enhancement Approval'])
                                        },
                                        {
                                            label: 'Lc Issuance Extension Approval', icon: '', routerLink: ['/credit/lc/extension-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Extension Approval'])
                                        },
                                        {
                                            label: 'Lc Ussance Extension Approval', icon: '', routerLink: ['/credit/lc/ussance-extension-approval'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Ussance Extension Approval'])
                                        }
                                    ]
                                },
                                {
                                    label: 'Letter Generation Request Approval', icon: '', routerLink: ['/approvals/letter-generation-request-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['Letter Generation Request Approval'])
                                },
                                {
                                    label: 'Deferral/Waiver Approvals', icon: '', routerLink: ['/approvals/credit/checklist-deferral-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['checklist deferral approval'])
                                },
                                {
                                    label: 'Fee/Rate Concession', icon: '', routerLink: ['/approvals/credit/fee-concession-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['concession approval'])
                                },
                                //                             {
                                // // tslint:disable-next-line: max-line-length
                                //                                 label: 'Preliminary Evaluation Note', icon: '', routerLink: ['/approvals/credit/preliminary-evaluation-note'],
                                //                                 visible: this.menuGuardSrv.hideOrShow(['pen approval'])
                                //                             },
                                {
                                    label: 'Override', icon: '', routerLink: ['/approvals/credit/override-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['override approval'])
                                },
                                {
                                    label: 'Reasigned Accounts', icon: '', routerLink: ['/approvals/credit/reasign-account'],
                                    visible: this.menuGuardSrv.hideOrShow(['reasigned accounts approval'])
                                },
                                {
                                    label: 'Credit Operations', icon: '', routerLink: ['/approvals/credit/loan-restructuring'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit operations approval'])
                                },
                                {
                                    label: 'Line Operations', icon: '', routerLink: ['/approvals/credit/line-operation-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit operations approval'])
                                },
                                {
                                    label: 'Commercial Loan Operations', icon: '', routerLink: ['/approvals/credit/commercial-loan-operations-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit operation approval - commercial paper'])
                                },
                                {
                                    label: 'Written-off Accounts / Black-Book', icon: '', routerLink: ['/approvals/credit/camsol-blackbook'],
                                    visible: this.menuGuardSrv.hideOrShow(['risk assessment'])
                                },
                                {
                                    label: 'Bulk Loan Prepayment', icon: '', routerLink: ['/approvals/bulk-prepayment-loan-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk liquidation approval'])
                                },
                                {
                                    label: 'Release Lien Approval', icon: '', routerLink: ['/approvals/lien-removal-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['lien removal approval'])
                                },
                                {
                                    label: 'Bulk Recovery Assignment', icon: '', routerLink: ['/approvals/bulk-recovery-assignment-to-agen-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk recovery assignment to agent approval'])
                                },
                                {
                                    label: 'Bulk Retail Recovery Assignment', icon: '', routerLink: ['/approvals/bulk-retail-recovery-assignment-to-agen-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk retail recovery assignment to agent approval'])
                                },
                                {
                                    label: 'Bulk Recovery Unassignment', icon: '', routerLink: ['/approvals/bulk-recovery-unassignment-from-agent'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk recovery unassignment from agent approval'])
                                },
                                {
                                    label: 'Retail Recovery Unassignment', icon: '', routerLink: ['/approvals/bulk-retail-recovery-unassignment-from-agent'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk retail recovery unassignment from agent approval'])
                                },
                                {
                                    label: 'Recovery Reporting', icon: '', routerLink: ['/approvals/bulk-recovery-reporting-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk recovery assignment to agent approval'])
                                },
                                {
                                    label: 'Recovery Commission', icon: '', routerLink: ['/approvals/bulk-recovery-commission-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk recovery assignment to agent approval'])
                                },
                                {
                                    label: 'Loan Application Cancellation', icon: '', routerLink: ['/approvals/loan-application-cancellation'],
                                    visible: this.menuGuardSrv.hideOrShow(['aps approval'])
                                },
                                {
                                    label: 'Review Application Cancellation', icon: '', routerLink: ['/approvals/lms-loan-application-cancellation'],
                                    visible: this.menuGuardSrv.hideOrShow(['aps approval'])
                                },
    
                                {
                                    label: 'Accredited Solicitors Approval', icon: '', routerLink: ['/approvals/accredited-solicitors-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['customer group setup approval'])
                                },
                                {
                                    label: 'Manual Fee Approval', icon: '', routerLink: ['/approvals/credit/take-fee-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['manual fee approval'])
                                },
                                {
                                    label: 'Global Interest Rate Change Approval', icon: '', routerLink: ['/approvals/credit/global-interest-rate-change-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['global interest rate change approval'])
                                },
                                {
                                    label: 'Original Document Approval', icon: '', routerLink: ['/approvals/credit/original-document-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['Original Document Approval'])
                                },
                                {
                                    label: 'ATC Lodgement Approval', icon: '', routerLink: ['/approvals/credit/atc-lodgement-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['ATC Lodgement Approval'])
                                },
                                {
                                    label: 'ATC Release Approval', icon: '', routerLink: ['/approvals/credit/app-atc-release-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['ATC Release Approval'])
                                },
                                {
                                    label: 'Project Site Report Approval', icon: '', routerLink: ['/approvals/project-site-report-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['Project Site Report Approval'])
                                },
                                
                               
                                {
                                    label: 'Security Release Approval', icon: '', routerLink: ['/approvals/security-release-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['security release approval'])
                                },
                                {
                                    label: 'Cash Security Release', icon: '', routerLink: ['/approvals/cash-security-release-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['security release approval'])
                                },
                                {
                                    label: 'Call Memo Approval', icon: '', routerLink: ['/approvals/call-memo-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['call memo approval'])
                                },
                                {
                                    label: 'Deferred Document Approval', icon: '', routerLink: ['/approvals/deferral-document-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['deferred document approval'])
                                },
                                {
                                    label: 'Deferral Extension Approval', icon: '', routerLink: ['/approvals/deferral-extension-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['deferral extension approval'])
                                },
                                {
                                    label: 'Facility Modification Approval', icon: '', routerLink: ['/approvals/credit/modify-facility-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['Modify Facility'])
                                },
                                {
                                    label: 'LMS Facility Modification Approval', icon: '', routerLink: ['/approvals/credit/modify-lms-facility-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['Modify Facility'])
                                },
                                {
                                    label: 'Documentation Filling Approval', icon: '', routerLink: ['/approvals/credit/credit-documentation-filling-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit documentation approval'])
                                }
                            ]
                        },
                        {
                            label: 'Collateral', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'collateral approval',
                                'collateral policy approval',
                                'collateral assignment approval',
                                'collateral release approval',
                                'collateral swap approval',
                                'insurance bulk upload approval'
                            ]),
                            items: [
                                {
                                    label: 'Collateral Management', icon: '', routerLink: ['/approvals/credit/collateral-management-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral approval'])
                                },
                                {
                                    label: 'Collateral Insurance Policy', icon: '', routerLink: ['/approvals/credit/collateral-item-policy-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral policy approval'])
                                },
                                {
                                    label: 'Collateral Assignment', icon: '', routerLink: ['/approvals/credit/collateral-assignment-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral assignment approval'])
                                },
                                {
                                    label: 'Collateral Swap', icon: '', routerLink: ['/approvals/collateral-swap-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral swap approval'])
                                },
                                {
                                    label: 'Collateral Release', icon: '', routerLink: ['/approvals/credit/collateral-release-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral release approval'])
                                },
                                {
                                    label: 'Collateral Info Release', icon: '', routerLink: ['/approvals/credit/collateral-information-release-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral release approval'])
                                },
                                {
                                    label: 'Collateral Valuation Approval', icon: '', routerLink: ['/approvals/collateral-valuation-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral valuation approval'])
                                },
                                {
                                    label: 'Bulk Insurance Upload Approval', icon: '', routerLink: ['/approvals/credit/insurance-bulk-upload-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['insurance bulk upload approval'])
                                },
                            ]
                        },
    
                    ]
                },
    
                {
                    label: 'Job Request', icon: 'account_box',
                    visible: this.menuGuardSrv.hideOrShow([
                        'job request status',
    
                    ]),
                    items: [
                        {
                            label: 'Job Request Status', icon: '', routerLink: ['/credit/credit-job-request'],
                            visible: this.menuGuardSrv.hideOrShow(['job request status'])
                        },
                        {
                            label: 'Facility Job Request', icon: '', routerLink: ['/credit/facility-job-request'],
                            visible: this.menuGuardSrv.hideOrShow(['confirm collateral search'])
                        },
                        {
                            label: 'Confirm Collateral Search', icon: '', routerLink: ['/credit/legal-job-request-confirmation'],
                            visible: this.menuGuardSrv.hideOrShow(['confirm collateral search'])
                        },
                    ]
                },
    
                {
                    label: 'Credit', icon: 'account_balance_wallet',
                    visible: this.authService.verifyCorr() && this.menuGuardSrv.hideOrShow([
                        //'repayment schedule simulation',
                        'schedule simulation',
                        'start credit application',
                        'credit applications',
                        'credit application status',
                        'contingent application search',
                        'bonds and guarantee',
                        'rejected applications',
                        'loan fee concessions',
                        'deferral management',
                        'consumer protection',
                        'lien management',
                        'credit documentation',
                        //'preliminary evaluation notes',
                        'application route',
                        'credit appraisal',
                        'committee secretariat',
                        'generate offer letter',
                        'review offer letter',
                        'availment',
                        'booking request',
                        'booking',
                        //'job request status',
                        'confirm collateral search',
                        'override request',
                        'lms application',
                        'lms appraisal',
                        'lms generate offer letter',
                        'lms availment',
                        'loan operations',
                        'overdraft operations',
                        'recovery operations',
                        'contingent operations',
                        'loan operations',
                        'loan operations',
                        'recovery payment plan',
                        'prepayment',
                        'aps request',
                        'reassign account',
                        'collateral information',
                        'collateral assignment',
                        ' covenant maintenance',
                        'risk assessment',
                        'facility detail summary',
                        'credit classification',
                        'fee charge change',
                        'maturity instruction',
                        'commercial loan rollover',
                        'commercial loan tenor extension',
                        'commercial loan sub-allocation',
                        'commercial loan rate review',
                        'commercial loan prepayment',
                        //'availmant route',
                        'risk assessment',
                        //'deferral management',
                        'Original Document',
                        'original document search',
                        'security release',
                        'security release search',
                        'Letter Generation Request',
                        'Letter Generation Completed',
                        //'letter generation search',
                        'document search',
                        'crms-user',
                        'Modify Facility',
                        'Reassign Loan',
                        'appraisal pool',
                        'disbursed loans'
    
                    ]),
                    items: [
                        {
                            label: 'Credit Origination', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                //'repayment schedule simulation',
                                'start credit application',
                                'credit applications',
                                'credit application status',
                                'drawdown application status',
                                'bonds and guarantee',
                                'rejected applications',
                                'loan fee concessions',
                                //'deferral management',
                                //'preliminary evaluation notes',
                                'application route',
                                'credit appraisal',
                                'committee secretariat',
                                'generate offer letter',
                                'review offer letter',
                                'availment',
                                'booking request',
                                'booking',
                                //'call memo',
                                //'job request status',
                                'confirm collateral search',
                                'override request',
                                //'availmant route',
                                //'term sheet',
                                'Release Of Shipping Documents',
                                'Lc Issuance',
                                'Lc Ussance',
                                'Letter Generation Request',
                                'Letter Generation Completed',
                                //'letter generation search',
                                'security release',
                                'security release search',
                                 'document search',
                                 'crms-user',
                                 'Modify Facility',
                                 'Reassign Loan',
                                 'appraisal pool',
                                 'credit documentation los',
                                 'disbursed loans',

    
                            ]),
                            items: [
                                // {
                                //     label: 'MAP', icon: '', routerLink: ['/credit/loan/map'],
                                //     visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                                // },
                                {
                                    label: 'Document Search', icon: '', routerLink: ['/credit/loan/document-Search'],
                                    visible: this.menuGuardSrv.hideOrShow(['document search'])
                                },
    
                                {
                                    label: 'ATC Lodgement', icon: '', routerLink: ['/credit/loan/atc-lodgment'],
                                    visible: this.menuGuardSrv.hideOrShow(['ATC Lodgement'])
                                },
                                // {
                                //     label: 'Loan Refinancing', icon: '', routerLink: ['/credit/loan/loan-refinancing'],
                                //     visible: this.menuGuardSrv.hideOrShow(['ATC Lodgement'])
                                // },
                                {
                                    label: 'ATC Release', icon: '', routerLink: ['/credit/loan/atc-release'],
                                    visible: this.menuGuardSrv.hideOrShow(['ATC Release'])
                                },
                                {
                                    label: 'Disbursed Loans', icon: '', routerLink: ['/credit/loan/disbursed-loans'],
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'loan disbursment',
                                        'booking request',
                                        'booking',
                                        'disbursed loans'
                                    ])
                                },
                                {
                                    label: 'Modify Facility', icon: '', routerLink: ['/credit/loan/modify-facility'],
                                    visible: this.menuGuardSrv.hideOrShow(['Modify Facility','Reassign Loan'])
                                },
                                {
                                    label: 'Loan Fee Schedule', icon: '', routerLink: ['/credit/loan/loan-fee-schedule'],
                                    visible: this.menuGuardSrv.hideOrShow([
                                        // 'start credit application',
                                        // 'credit applications',
                                        // 'credit appraisal',
                                        // 'booking request',
                                        // 'booking',
                                        // 'schedule simulation',
                                        // 'loan disbursment',
                                        // 'project-site-report',
                                        'loan fee schedule'
                                    ])
                                },
                                // {
                                //     label: 'Repayment Schedule Simulation', icon: '', routerLink: ['/credit/loan/schedule'],
                                //     visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                                // },
                                {
                                    label: 'View Product Checklist', icon: '', routerLink: ['/credit/loan/checklist-simulation'],
                                    visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                                },
                                {
                                    label: 'Letter Of Credit', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['Lc Issuance', 'Release Of Shipping Documents', 'Lc Ussance',
                                        'Lc Issuance Approval',
                                        'Release Of Shipping Documents Approval',
                                        'Lc Ussance Approval',
                                    ]),
                                    items: [
                                        {
                                            label: 'LC Search', icon: '', routerLink: ['/credit/lc/search'],
                                            visible: this.menuGuardSrv.hideOrShow([
                                                'Release Of Shipping Documents',
                                                'Lc Issuance',
                                                'Lc Ussance',
                                                'Lc Issuance Approval',
                                                'Release Of Shipping Documents Approval',
                                                'Lc Ussance Approval',
                                            ])
                                        },
                                        {
                                            label: 'LC Issuance', icon: '', routerLink: ['/credit/lc/issuance'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Issuance'])
                                        },
                                        {
                                            label: 'Release Of Shipping Document', icon: '', routerLink: ['/credit/lc/release-shipping-documents'],
                                            visible: this.menuGuardSrv.hideOrShow(['Release Of Shipping Documents'])
                                        },
                                        {
                                            label: 'LC Ussance', icon: '', routerLink: ['/credit/lc/ussance'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Ussance'])
                                        }
                                    ]
                                },
                                {
                                    label: 'Letter Generation Request', icon: '', routerLink: ['/credit/letter-generation-request'],
                                    visible: this.menuGuardSrv.hideOrShow(['Letter Generation Request'])
                                },
                                {
                                    label: 'Letter Generation Search', icon: '', routerLink: ['/setup/letter-generation-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['Letter Generation Completed',
                                                                            'Letter Generation Request',
                                                                            'Letter Generation Request Approval'])
                                },
                                {
                                    label: 'Letter Generation Completed', icon: '', routerLink: ['/credit/letter-generation-completed'],
                                    visible: this.menuGuardSrv.hideOrShow(['Letter Generation Completed',
                                                                            'Letter Generation Request',
                                                                            'Letter Generation Request Approval'])
                                },
                                {
                                    label: 'Start Credit Application', icon: '', routerLink: ['/credit/loan/application/start'],
                                    visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                                },
                                {
                                    label: 'Credit Applications', icon: '', routerLink: ['/credit/loan/loan-application-list'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit applications'])
                                },
                                {
                                    label: 'Credit Application Status', icon: '', routerLink: ['/credit/loan/application-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'Post-Approval Documentation', icon: '', routerLink: ['/credit/loan/continuous-documentation'],
                                    visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                                },
                                {
                                    label: 'Credit Bureau Status', icon: '', routerLink: ['/credit/loan/customer/credit-bureau-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                                },
    
    
                                // {
                                //     label: 'DrawDown Application Status', icon: '', routerLink: ['/credit/loan/drawdown-search'],
                                //     visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                // },
                                // {
                                //     label: 'Bonds and Guarantee', icon: '', routerLink: ['/credit/loan/bonds-and-guarantee'],
                                //     visible: this.menuGuardSrv.hideOrShow(['bonds and guarantee'])
                                // },
                                {
                                    label: 'Rejected Applications', icon: '', routerLink: ['/credit/loan/rejected-application'],
                                    visible: this.menuGuardSrv.hideOrShow(['rejected applications'])
                                },
                                {
                                    label: 'Loan Fee Concessions', icon: '', routerLink: ['/credit/loan/application/fee-concession'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan fee concessions'])
                                },
    
                                // {
                                //     label: 'Routing', icon: '',
                                //     visible: this.menuGuardSrv.hideOrShow([
                                //         'application route',
                                //         'availment route',
                                //     ]),
                                //     items: [
                                // {
                                //     label: 'Preliminary Evaluation Notes', icon: '', routerLink: ['/credit/loan/preliminary-evaluation/view'],
                                //     visible: this.menuGuardSrv.hideOrShow(['preliminary evaluation notes'])
                                // },
                                // {
                                //     label: 'Routing', icon: '',
                                //     visible: this.menuGuardSrv.hideOrShow([
                                //         'application route',
                                //         'availment route',
                                //     ]),
                                //     items: [
                                {
                                    label: 'Application Route', icon: '', routerLink: ['/credit/appraisal/sla-monitoring'],
                                    visible: this.menuGuardSrv.hideOrShow(['application route'])
                                },
                                // {
                                //     label: 'Availment Route', icon: '', routerLink: ['/credit/appraisal/availment-route'],
                                //     visible: this.menuGuardSrv.hideOrShow(['availment route'])
                                // },
                                //     ]
                                // },
                                {
                                    label: 'Term Sheet', icon: '', routerLink: ['/credit/term-sheet'],
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'start credit application',
                                    ])
                                },
                                // {
                                //     label: 'Appraisal Pool', icon: '', routerLink: ['/credit/appraisal/appraisal-pool'],
                                //     visible: this.menuGuardSrv.hideOrShow(['credit appraisal'])
                                // },
                                {
                                    label: 'Credit Appraisal', icon: '', routerLink: ['/credit/appraisal/credit-appraisal'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit appraisal'])
                                },
                                {
                                    label: 'Committee Secretariat', icon: '', routerLink: ['/credit/loan/secretariat'],
                                    visible: this.menuGuardSrv.hideOrShow(['committee secretariat'])
                                },
                                {
                                    label: 'Generate Offer Letter', icon: '', routerLink: ['/credit/loan/offer-letter'],
                                    visible: this.menuGuardSrv.hideOrShow(['generate offer letter'])
                                },
                                {
                                    label: 'Review Offer Letter', icon: '', routerLink: ['/credit/loan/offer-letter-review'],
                                    visible: this.menuGuardSrv.hideOrShow(['review offer letter'])
                                },
                                {
                                    label: 'Availment', icon: '', routerLink: ['/credit/loan/availment'],
                                    visible: this.menuGuardSrv.hideOrShow(['availment'])
                                },
                                {
                                    label: 'DrawDown Request', icon: '', routerLink: ['/credit/loan/booking/initiate-booking'],
                                    visible: this.menuGuardSrv.hideOrShow(['booking request'])
                                },
                                // {
                                //     label: 'Bulk Disbursement Request', icon: '', routerLink: ['/credit/loan/booking/multiple-disbursement'],
                                //     visible: this.menuGuardSrv.hideOrShow(['booking request'])
                                // },
                                {
                                    label: 'Bulk Insurance Upload', icon: '', routerLink: ['/credit/insurance-upload'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk insurance upload'])
                                },
                                {
                                    label: 'Rejected Bulk Insurance Upload', icon: '', routerLink: ['/credit/rejected-insurance-upload'],
                                    visible: this.menuGuardSrv.hideOrShow(['rejected bulk insurance upload'])
                                },
                                {
                                    label: 'Manual Fee', icon: '', routerLink: ['/credit/loan-management/take-fee'],
                                    visible: this.menuGuardSrv.hideOrShow(['manual fee'])
                                },
                                {
                                    label: 'Capture CRMS Code', icon: '', routerLink: ['/credit/loan/loan-crms-update'],
                                    visible: this.menuGuardSrv.hideOrShow(['crms-user'])
                                },
                                {
                                    label: 'Booking', icon: '', routerLink: ['/credit/loan/booking'],
                                    visible: this.menuGuardSrv.hideOrShow(['booking'])
                                },
                                {
                                    label: 'Contingents Release', icon: '', routerLink: ['/credit/loan/contingent'],
                                    visible: this.menuGuardSrv.hideOrShow(['bonds and guarantee'])
                                },
    
                                {
                                    label: 'FX Account Setup', icon: '', routerLink: ['/setup/charge/fx-account-creation'],
                                    visible: this.menuGuardSrv.hideOrShow(['booking'])
                                },
    
    
                                {
                                    label: 'Confirm Collateral Search', icon: '', routerLink: ['/credit/legal-job-request-confirmation'],
                                    visible: this.menuGuardSrv.hideOrShow(['confirm collateral search'])
                                },
    
                                {
                                    label: 'Override Request', icon: '', routerLink: ['/credit/loan/override'],
                                    visible: this.menuGuardSrv.hideOrShow(['override request'])
                                },
    
                                {
                                    label: 'Completed Loan Confirmation', icon: '', routerLink: ['/credit/loan/completed-loan-confirmation'],
                                    visible: this.menuGuardSrv.hideOrShow(['override request'])
                                },
    
                                {
                                    label: 'Project Site Report', icon: '', routerLink: ['/credit/project-site-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['Project Site Report'])
                                },
                                {
                                    label: 'Approved Project Site Report', icon: '', routerLink: ['/credit/project-site-report-account-officer'],
                                    visible: this.menuGuardSrv.hideOrShow(['approved project site report'])
                                },
                                {
                                    label: 'Credit Documentation', icon: '', routerLink: ['/credit/loan/application/credit-documentation-los'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit documentation los'])
                                },
                                {
                                    label: 'Completed Credit Documentation', icon: '', routerLink: ['/credit/loan/application/los-completed-credit-documentation'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit documentation los'])
                                },
                            ]
                        },
                        {
                            label: 'Credit Management', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'lms application',
                                'lms appraisal',
                                'lms generate offer letter',
                                'lms availment',
                                'loan operations',
                                'Bulk Loan Prepayment Reversal',
                                'Bulk Loan Prepayment',
                                'Loan Prepayment Reversal',
                                'overdraft operations',
                                'recovery operations',
                                'contingent operations',
                                'loan operations',
                                'loan operations',
                                'recovery payment plan',
                                'manual fee',
                                'prepayment',
                                'aps request',
                                'application route',
                                'reassign account',
                                'collateral information',
                                'collateral assignment',
                                ' covenant maintenance',
                                'risk assessment',
                                'facility detail summary',
                                'credit classification',
                                'fee charge change',
                                'maturity instruction',
                                'commercial loan rollover',
                                'commercial loan tenor extension',
                                'commercial loan sub-allocation',
                                'commercial loan rate review',
                                'commercial loan prepayment',
                                'committee secretariat',
                                'schedule simulation',
                                //'availmant route',
                                'collateral insurance request',
                                'Lc Cancellation',
                                'Lc Cancellation Approval',
                                'Lc Enhancement',
                                'Lc Enhancement Approval',
                                'Lc Extension',
                                'Lc Extension Approval',
                                'Lc Ussance Extension',
                                'Lc Ussance Extension Approval',
                                'credit documentation lms',
                                'modify lms application',
                                'credit documentation',
                                
                            ]),
                            items: [
                                {
                                    label: 'Facility Detail Summary', icon: '', routerLink: ['/credit/loan/facility-detail-summary'],
                                    visible: this.menuGuardSrv.hideOrShow(['facility detail summary'])
                                },
                                {
                                    label: 'Letter Of Credit', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['Lc Cancellation',
                                                                            'Lc Enhancement',
                                                                            'Lc Enhancement Approval',
                                                                            'Lc Extension',
                                                                            'Lc Extension Approval',
                                                                            'Lc Cancellation Approval',
                                                                            'Lc Ussance Extension',
                                                                            'Lc Ussance Extension Approval',
                                    ]),
                                    items: [
                                        {
                                            label: 'LC LMS Search', icon: '', routerLink: ['/credit/lc/search/lms'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Cancellation',
                                                                                'Lc Enhancement',
                                                                                'Lc Enhancement Approval',
                                                                                'Lc Extension',
                                                                                'Lc Extension Approval',
                                                                                'Lc Cancellation Approval',
                                                                                'Lc Ussance Extension',
                                                                                'Lc Ussance Extension Approval',
                                                                                ])
                                        },
                                        {
                                            label: 'LC Cancellation', icon: '', routerLink: ['/credit/lc/cancelation'],
                                            visible: this.menuGuardSrv.hideOrShow([
                                                'Lc Cancellation',
                                            ])
                                        },
                                        {
                                            label: 'LC Enhancement', icon: '', routerLink: ['/credit/lc/enhancement'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Enhancement'])
                                        },
                                        {
                                            label: 'LC Issuance Extension', icon: '', routerLink: ['/credit/lc/extension'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Extension'])
                                        },
                                        {
                                            label: 'LC Ussance Extension', icon: '', routerLink: ['/credit/lc/ussance-extension'],
                                            visible: this.menuGuardSrv.hideOrShow(['Lc Ussance Extension'])
                                        }
                                    ]
                                },
                                {
                                    label: 'Application', icon: '', routerLink: ['/credit/loan-review-approval/application'],
                                    visible: this.menuGuardSrv.hideOrShow(['lms application'])
                                },
                                {
                                    label: 'Appraisal', icon: '', routerLink: ['/credit/loan-review-approval/appraisal'],
                                    visible: this.menuGuardSrv.hideOrShow(['lms appraisal'])
                                },
                                
                                {
                                    label: 'Routing', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'application route',
                                        'availment route',
                                        'operation route',
                                    ]),
                                    items: [
                                        {
                                            label: 'Application Route', icon: '', routerLink: ['/credit/appraisal/sla-monitoring'],
                                            visible: this.menuGuardSrv.hideOrShow(['application route'])
                                        },
                                        {
                                            label: 'Operation Route', icon: '', routerLink: ['/credit/appraisal/operation-route'],
                                            visible: this.menuGuardSrv.hideOrShow(['operation route'])
                                        },
                                        {
                                            label: 'Availment Route', icon: '', routerLink: ['/credit/appraisal/availment-route'],
                                            visible: this.menuGuardSrv.hideOrShow(['availment route'])
                                        },
                                    ]
                                },
                                {
                                    label: 'Loan Refinancing', icon: '', routerLink: ['/credit/loan-management/loan-refinancing2'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'Obligor UUS Checklist', icon: '', routerLink: ['/credit/loan/underwriting-obligor'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'PMB Refinanced Approval', icon: '', routerLink: ['/credit/loan/pmb-refinanced-loan-approval'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                // {
                                //     label: 'Pending Refinancing', icon: '', routerLink: ['/credit/loan/pending-refinancing'],
                                //     visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                // },
                                {
                                    label: 'Lender Review Panel', icon: '', routerLink: ['/credit/loan/refinancing-loan-review'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'Final Loan Approval', icon: '', routerLink: ['/credit/loan/lender-risk-assessment'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'Refinance Tranch Loan', icon: '', routerLink: ['/credit/loan-management/refinance-loan-disbursement'],
                                    visible: this.menuGuardSrv.hideOrShow(['nmrc Restructuring'])
                                },
                                {
                                    label: 'Loan Restructuring', icon: '', routerLink: ['/credit/loan-management/nmrc-loan-restructuring'],
                                    visible: this.menuGuardSrv.hideOrShow(['nmrc Restructuring'])
                                },

                                // {
                                //     label: 'NMRC Loan Booking', icon: '', routerLink: ['/credit/loan-management/nmrc-loan-booking'],
                                //     visible: this.menuGuardSrv.hideOrShow(['nmrc loan booking'])
                                // },

                                // {
                                //     label: 'NMRC Loan Disbursement', icon: '', routerLink: ['/credit/loan-management/nmrc-loan-disbursement'],
                                //     visible: this.menuGuardSrv.hideOrShow(['nmrc loan booking'])
                                // },

                                {
                                    label: 'Application Review Search', icon: '', routerLink: ['/credit/loan/loan-review-application-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'Contingent Application Search', icon: '', routerLink: ['/credit/loan/loan-review-contingent-application-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['contingent application search'])
                                },
                                {
                                    label: 'Application Review Rejected', icon: '', routerLink: ['/credit/loan/loan-review-application-rejected'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit application status'])
                                },
                                {
                                    label: 'Committee Secretariat', icon: '', routerLink: ['/credit/loan/secretariat'],
                                    visible: this.menuGuardSrv.hideOrShow(['committee secretariat'])
                                },
                                {
                                    label: 'Generate Offer Letter', icon: '', routerLink: ['/credit/loan-review-approval/offer-letter'],
                                    visible: this.menuGuardSrv.hideOrShow(['lms generate offer letter'])
                                },
                                {
                                    label: 'Availment', icon: '', routerLink: ['/credit/loan-review-approval/availment'],
                                    visible: this.menuGuardSrv.hideOrShow(['lms availment'])
                                },
                                {
                                    label: 'Capture CRMS Code', icon: '', routerLink: ['/credit/loan-review-approval/lms-crms-update'],
                                    visible: this.menuGuardSrv.hideOrShow(['crms-user'])
                                },
                                {
                                    label: 'Line Operations', icon: '', routerLink: ['/credit/loan-management/facility-line-operations'],
                                    visible: this.menuGuardSrv.hideOrShow(['facility-line-operations'])
                                },
                                {
                                    label: 'Bulk Loan Prepayment Reversal', icon: '', routerLink: ['/credit/loan-management/bulk-loanprepaymentreversal'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                                },
                                {
                                    label: 'Bulk Loan Prepayment', icon: '', routerLink: ['/credit/loan-management/bulk-prepayment-loan'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                                },
                                {
                                    label: 'Loan Prepayment Reversal', icon: '', routerLink: ['/credit/loan-management/loan-prepayment-reversals'],
                                    visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                                },
                                {
                                    label: 'Term Loan Operations', icon: '', routerLink: ['/credit/loan-management/loan-review-operation'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan operations'])
                                },
                                {
                                    label: 'Commercial Loan Operations', icon: '', routerLink: ['/credit/loan-management/commercial-loan-operations'],
                                    visible: this.menuGuardSrv.hideOrShow(['commercial loan operations'])
                                },
                                // {
                                //     label: 'FX Revolving Loan Operations', icon: '', routerLink: ['/credit/loan-management/fx-revolving-loan-operations'],
                                //     visible: this.menuGuardSrv.hideOrShow(['fx revolving loan operations'])
                                // },
                                {
                                    label: 'Overdraft Operations', icon: '', routerLink: ['/credit/loan-management/overdraft-operations'],
                                    visible: this.menuGuardSrv.hideOrShow(['overdraft operations'])
                                },
                                // {
                                //     label: 'Recovery Operations', icon: '', routerLink: ['/credit/loan-management/remedial-opreation'],
                                //     visible: this.menuGuardSrv.hideOrShow(['recovery operations'])
                                // },
                                {
                                    label: 'Loan Recovery Payment', icon: '', routerLink: ['/credit/loan-management/app-loan-recovery-payment'],
                                    visible: this.menuGuardSrv.hideOrShow(['aps request'])
                                },
                                {
                                    label: 'Recovery', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'recovery operations',
                                    ]),
                                    
                                    items: [
                                        {
                                            label: 'Recovery Agencies', icon: '', routerLink: ['/credit/loan-management/accredited-consultant-list'],
                                            visible: this.menuGuardSrv.hideOrShow(['recovery operations'])
                                        },
                                        {
                                            label: 'My Assigned Recoveries', icon: '', routerLink: ['/credit/loan-management/recovery-assignment-list-internal-agents'],
                                            visible: this.menuGuardSrv.hideOrShow(['internal assigned recoveries'])
                                        },
                                        {
                                            label: 'Remedial Collections', icon: '',
                                            visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial']),
                                            items: [
                                                
                                                {
                                                    label: 'Recovery Assignment', icon: '', routerLink: ['/credit/loan-management/assign-loan-to-agent'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                                },
                                                {
                                                    label: 'Assigned List', icon: '', routerLink: ['/credit/loan-management/list-of-assigned-remedial-loans'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                                },
                                                {
                                                    label: 'Capture Recoveries', icon: '', routerLink: ['/credit/loan-management/capture-liquidation-receipt'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                                },
                                                {
                                                    label: 'Recovery Reporting', icon: '', routerLink: ['/credit/loan-management/recovery-reporting'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                                },
                                                {
                                                    label: 'Recovery Commission', icon: '', routerLink: ['/credit/loan-management/recovery-commission'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                                },
                                                {
                                                    label: 'List Of written Loan', icon: '', routerLink: ['/credit/loan-management/write-off-loans'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations remedial'])
                                                },
                                            ],
                                            
                                        },
                                        {
                                            label: 'Retail Collections', icon: '',
                                            visible: this.menuGuardSrv.hideOrShow(['recovery operations retail']),
                                            items: [
                                                {
                                                    label: 'Recovery Assignment', icon: '', routerLink: ['/credit/loan-management/assign-loan-to-agent-retail'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                                },
                                                {
                                                    label: 'Assigned List', icon: '', routerLink: ['/credit/loan-management/list-of-assigned-retail-loans'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                                },
                                                {
                                                    label: 'Recovery Reporting', icon: '', routerLink: ['/credit/loan-management/recovery-reporting-retail'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                                },
                                                {
                                                    label: 'Report Collection Internal', icon: '', routerLink: ['/credit/loan-management/recovery-report-collection'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                                },
                                                {
                                                    label: 'Commission Internal', icon: '', routerLink: ['/credit/loan-management/recovery-commission-internal'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                                },
                                                {
                                                    label: 'Commission External', icon: '', routerLink: ['/credit/loan-management/recovery-commission-retail'],
                                                    visible: this.menuGuardSrv.hideOrShow(['recovery operations retail'])
                                                },
                                                
                                            ],
                                            
                                        },
                                        
                                    ],
                                    
                                },
                                {
                                    label: 'Contingent Liability', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow([
                                        'contingent operations',
                                    ]),
                                    items: [
                                        // {
                                        //     label: 'Contingent Appraisal Operations', icon: '', routerLink: ['/credit/loan-management/contingent-operations'],
                                        //     visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                        // },
                                        {
                                            label: 'Contingent Operations', icon: '', routerLink: ['/credit/loan-management/contingent-liability-terminate-rebook'],
                                            visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                        },
                                        {
                                            label: 'Expired Contingents', icon: '', routerLink: ['/credit/loan-management/contingent-termination'],
                                            visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                        },
                                        {
                                            label: 'Cancel In-Active Contingents', icon: '', routerLink: ['/credit/loan-management/cancel-contingent-liability'],
                                            visible: this.menuGuardSrv.hideOrShow(['contingent operations'])
                                        },
                                    ]
                                },
                                {
                                    label: 'Manual Fee', icon: '', routerLink: ['/credit/loan-management/take-fee'],
                                    visible: this.menuGuardSrv.hideOrShow(['manual fee'])
                                },
                                {
                                    label: 'Global Interest Rate Change', icon: '', routerLink: ['/credit/loan-management/global-interest-rate-change'],
                                    visible: this.menuGuardSrv.hideOrShow(['global interest rate change'])
                                },
                                // {
                                //     label: 'Bulk Liquidation', icon: '', routerLink: ['/credit/loan-management/bulk-loanprepaymentreversal'],
                                //     visible: this.menuGuardSrv.hideOrShow(['bulk liquidation'])
                                // },
                                // {
                                //     label: 'Recovery Payment Plan', icon: '', routerLink: ['/credit/loan-management/LoanRecoveryPaymentPlan'],
                                //     visible: this.menuGuardSrv.hideOrShow(['recovery payment plan'])
                                // },
                                {
                                    label: 'Prepayment', icon: '', routerLink: ['/credit/loan-management/loan-prepayment'],
                                    visible: this.menuGuardSrv.hideOrShow(['prepayment'])
                                },
                                {
                                    label: 'Loan Termination', icon: '', routerLink: ['/credit/loan-management/loan-termination'],
                                    visible: this.menuGuardSrv.hideOrShow(['termination'])
                                },
                                // {
                                //     label: 'CP/FX Loan Prepayment', icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-prepayment'],
                                //     visible: this.menuGuardSrv.hideOrShow(['commercial loan prepayment'])
                                // },
                                {
                                    label: 'Loan Fee Adjustment', icon: '', routerLink: ['/credit/loan-management/loan-fee-adjustment'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan operations'])
                                },
                                {
                                    label: 'Loan Classification', icon: '', routerLink: ['/credit/loan-management/loan-performance'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan operations'])
                                },
                                {
                                    label: 'APS Request', icon: '', routerLink: ['/credit/loan/contingent-usage-list'],
                                    visible: this.menuGuardSrv.hideOrShow(['aps request'])
                                },
                                {
                                    label: 'Reassign Account', icon: '', routerLink: ['/credit/loan/reassign-account'],
                                    visible: this.menuGuardSrv.hideOrShow(['reassign account'])
                                },
                                
    
                                {
                                    label: ' Covenant Maintenance', icon: '', routerLink: ['/credit/loan-covenant/covenant-detail'],
                                    visible: this.menuGuardSrv.hideOrShow([' covenant maintenance'])
                                },
                                {
                                    label: 'Risk Assessment', icon: '', routerLink: ['/credit/risk/risk-assessment'],
                                    visible: this.menuGuardSrv.hideOrShow(['risk assessment'])
                                },
                                {
                                    label: 'Facility Line Information', icon: '', routerLink: ['/credit/loan/facility-details/tranche-facility-utilization'],
                                    visible: this.menuGuardSrv.hideOrShow(['booking request'])
                                }, {
                                    label: 'Completed Loan Confirmation', icon: '', routerLink: ['/credit/loan/completed-loan-confirmation'],
                                    visible: this.menuGuardSrv.hideOrShow(['override request'])
                                },
    
    
                                {
                                    label: 'Full And Final Complete Write-off', icon: '', routerLink: ['/credit/loan/full-and-final-status-change'],
                                    visible: this.menuGuardSrv.hideOrShow(['full and final writeoff'])
                                },
                                {
                                    label: 'Credit Documentation', icon: '',
                                    visible: this.menuGuardSrv.hideOrShow(['credit documentation lms','credit documentation']),
                                        items: [
                                            {
                                                label: 'Credits', icon: '', routerLink: ['/credit/loan/application/credit-documentation'],
                                                visible: this.menuGuardSrv.hideOrShow(['credit documentation lms'])
                                            },
                                            {
                                                label: 'Completed Credit Documentation', icon: '', routerLink: ['/credit/loan/application/lms-completed-credit-documentation'],
                                                visible: this.menuGuardSrv.hideOrShow(['credit documentation lms'])
                                            },
                                            {
                                                label: 'Related Processes Documentation', icon: '', routerLink: ['/credit/loan/application/related-documentation'],
                                                visible: this.menuGuardSrv.hideOrShow(['credit documentation'])
                                            }
                                        ]
                                },
                                {
                                    label: 'Modify Facility', icon: '', routerLink: ['/credit/loan/application/modify-lms-application'],
                                    visible: this.menuGuardSrv.hideOrShow(['modify lms application'])
                                },
                                
    
                                // {
                                //     label: 'Commercial Loans', icon: '',
                                //     visible: this.menuGuardSrv.hideOrShow([
                                //         'maturity instruction',
                                //         'commercial loan rollover',
                                //         'commercial loan tenor extension',
                                //         'commercial loan sub-allocation',
                                //         'commercial loan rate review',
                                //         'commercial loan prepayment',
                                //     ]),
                                //     items: [
                                //         {
                                //             label: 'Maturity Instruction', icon: '', routerLink: ['/credit/loan-management/commercial-loans/maturity-instruction'],
                                //             visible: this.menuGuardSrv.hideOrShow(['maturity instruction'])
                                //         },
                                //         {
                                //             label: 'Rollover', icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-rollover'],
                                //             visible: this.menuGuardSrv.hideOrShow(['commercial loan rollover'])
                                //         },
                                //         {
                                //             label: 'Tenor Extension', icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-tenor-extension'],
                                //             visible: this.menuGuardSrv.hideOrShow(['commercial loan tenor extension'])
                                //         },
                                //         {
                                //             label: 'Rate Review', icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-interest-rate-review'],
                                //             visible: this.menuGuardSrv.hideOrShow(['commercial loan rate review'])
                                //         },
                                //         {
                                //             label: 'Sub-Allocation', icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-sub-allocation'],
                                //             visible: this.menuGuardSrv.hideOrShow(['commercial loan sub-allocation'])
                                //         },
                                //         {
                                //             label: 'Loan Prepayment', icon: '', routerLink: ['/credit/loan-management/commercial-loans/cp-prepayment'],
                                //             visible: this.menuGuardSrv.hideOrShow(['commercial loan prepayment'])
                                //         },
                                //     ]
                                // },
                                // {
                                //     label: 'Credit Classification', icon: '', routerLink: ['#'],
                                //     visible: this.menuGuardSrv.hideOrShow(['credit classification'])
                                // },
                                // {
                                //     label: 'Fee Charge Change', icon: '', routerLink: ['#'],
                                //     visible: this.menuGuardSrv.hideOrShow(['fee charge change'])
                                // },
                            ]
                        },
                        {
                            label: 'Collateral', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'collateral information',
                                'collateral assignment',
                                'collateral insurance request',
                                'collateral policy approval',
                                'collateral swap',
                                'collateral swap approval'
                            ]),
                            items: [
                                {
                                    label: 'Collateral Information', icon: '', routerLink: ['/credit/collateral/collateral-information'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral information'])
                                },
                                {
                                    label: 'Collateral Swap', icon: '', routerLink: ['/credit/collateral/collateral-swap'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral swap'])
                                },
                                {
                                    label: 'Collateral Swap Search', icon: '', routerLink: ['/credit/collateral/collateral-swap-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral swap', 'collateral swap approval'])
                                },
                                {
                                    label: 'Collateral Information Release', icon: '', routerLink: ['/credit/collateral/collateral-information-release'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral information'])
                                },
                                {
                                    label: 'Collateral Release Job Request', icon: '', routerLink: ['/credit/collateral/collateral-release-awaiting-job-request'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral information'])
                                },
                                {
                                    label: 'Collateral Release', icon: '', routerLink: ['/credit/collateral/collateral-assignment'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral assignment'])
                                },
                                {
                                    label: 'Collateral Valuation', icon: '', routerLink: ['/credit/loan/collateral-valuation'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral valuation'])
                                },
                                {
                                    label: 'Collateral Valuation Search', icon: '', routerLink: ['/credit/loan/collateral-valuation-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral valuation search'])
                                },
                                {
                                    label: 'Collateral Insurance Request', icon: '', routerLink: ['/credit/loan/collateral-insurance-request'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral insurance request'])
                                },
                                {
                                    label: 'Collateral Insurance Search', icon: '', routerLink: ['/credit/loan/collateral-insurance-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral insurance request',
                                                                            'collateral policy approval'])
                                },
                            ]
                        },
                        {
                            label: 'Original Document Submission', icon: '', routerLink: ['/credit/loan/original-document-submission'],
                            visible: this.menuGuardSrv.hideOrShow(['Original Document'])
                        },
                        {
                            label: 'Original Document Search', icon: '', routerLink: ['/credit/original-document-submission-search'],
                            visible: this.menuGuardSrv.hideOrShow(['original document search'])
                        },
                        {
                            label: 'Stamp Duty Closure', icon: '', routerLink: ['/credit/loan/stamp-duty-closure'],
                            visible: this.menuGuardSrv.hideOrShow(['stamp duty closure'])
                        },
                        {
                            label: 'Security Release', icon: '', routerLink: ['/credit/loan/security-release'],
                            visible: this.menuGuardSrv.hideOrShow(['security release'])
                        },
                        {
                            label: 'Cash Security Release', icon: '', routerLink: ['/credit/loan/cash-security-release'],
                            visible: this.menuGuardSrv.hideOrShow(['security release'])
                        },
                        {
                            label: 'Security Release Search', icon: '', routerLink: ['/credit/security-release-search'],
                            visible: this.menuGuardSrv.hideOrShow(['security release search'])
                        },
                        {
                            label: 'Cash Security Release Search', icon: '', routerLink: ['/credit/cash-security-release-search'],
                            visible: this.menuGuardSrv.hideOrShow(['security release search'])
                        },
                        {
                            label: 'Written-off Accounts/Black-Book', icon: '', routerLink: ['/credit/risk/loan-camsol'],
                            visible: this.menuGuardSrv.hideOrShow(['risk assessment'])
                        },
                        {
                            label: 'Deferral Management', icon: '', routerLink: ['/credit/loan/application/deferral-management'],
                            visible: this.menuGuardSrv.hideOrShow(['deferral management'])
                        },
                        {
                            label: 'Consumer Protection', icon: '', routerLink: ['/credit/loan/application/consumer-protection'],
                            visible: this.menuGuardSrv.hideOrShow(['consumer protection'])
                        },
                        {
                            label: 'Related Employer', icon: '', routerLink: ['/credit/loan/application/related-employer'],
                            visible: this.menuGuardSrv.hideOrShow(['related employer'])
                        },
                        {
                            label: 'Lien Management', icon: '',
                            visible: this.menuGuardSrv.hideOrShow([
                                'lien management',
                            ]),
                            items: [
                                {
                                    label: 'Add Lien', icon: '', routerLink: ['/credit/loan/application/lien-customer-account'],
                                    visible: this.menuGuardSrv.hideOrShow(['lien management'])
                                },
                                {
                                    label: 'Release Lien', icon: '', routerLink: ['/credit/loan-management/unfreeze-overdraft-lien'],
                                    visible: this.menuGuardSrv.hideOrShow(['lien management'])
                                },
                                {
                                    label: 'Lien Search', icon: '', routerLink: ['/credit/loan/application/lien-search'],
                                    visible: this.menuGuardSrv.hideOrShow(['lien management'])
                                },
                            ]
                        },
                        {
                            label: 'Financial Statement Upload', icon: '', routerLink: ['/credit/loan/application/fs-caption-upload'],
                            visible: this.menuGuardSrv.hideOrShow(['fs caption upload'])
                        },
                        
                        {
                            label: 'Repayment Schedule Simulation', icon: '', routerLink: ['/credit/loan/schedule'],
                            visible: this.menuGuardSrv.hideOrShow(['schedule simulation'])
                        },
                    ]
                },
                {
                    label: 'Call Memo', icon: 'assignment', routerLink: ['/credit/loan/call-memo'],
                    visible: this.menuGuardSrv.hideOrShow(['call memo'])
                },
                {
                    label: 'Reports', icon: 'timeline',
                    visible: this.menuGuardSrv.hideOrShow([
                        'repayment schedule',
                        'disbursement',
                        'disbursal credit turnover',
                        'statement',
                        'anniversary',
                        'waivers',
                        'deferred',
                        'waived',
                        'deferrals',
                        'deferrals for mcc',
                        'scheduled fcy credit',
                        'collateral report',
                        'workflow definition report',
                        'workflow sla report',
                        'posted transaction report',
                        'branch npl limit report',
                        'sectorial limit report',
                        'collateral revaluation report',
                        'covenant report',
                        'npl report',
                        'expired overdraft report',
                        'reports',
                        'insider related loans',
                       
                    ]),
                    items: [
                        {
                            label: 'Credit Monitoring', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                'credit monitoring report'
                            ]),
                            items: [
                                {
                                    label: 'Credit Monitoring Report', icon: '', routerLink: ['/admin/credit-monitoring-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit monitoring report'])
                                },
                                
                            ]
                        },
    
                        {
                            label: 'Audit Trail', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                'audit trail report'
                            ]),
                            items: [
                                {
                                    label: 'System Audit Trail', icon: '', routerLink: ['/report/admin/audit-trail-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                },
                                {
                                    label: 'Logging Status', icon: '', routerLink: ['/report/admin/logging-status'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                },
                                {
                                    label: 'Staff Privilege Change', icon: '', routerLink: ['/report/staff/staff-privilege-change'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                },
                                {
                                    label: 'User Group Change', icon: '', routerLink: ['/report/staff/user-group-change-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                },
                                {
                                    label: 'Profile Activity', icon: '', routerLink: ['/report/staff/profile-activity-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                },
                                {
                                    label: 'Staff Role Profile Group', icon: '', routerLink: ['/report/staff/staff-role-profile-group-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                },
                                {
                                    label: 'Staff Role Profile Activity', icon: '', routerLink: ['/report/staff/staff-role-profile-activity-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['audit trail report'])
                                }
                                
                            ]
                        },
                        {
                            label: 'Credit', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                'repayment schedule',
                                'disbursement',
                                'statement',
                                'anniversary',
                                'waivers',
                                'deferred',
                                'waived',
                                'deferrals',
                                'deferrals for mcc',
                                'scheduled fcy credit',
                                'collateral report',
                                'report',
                                
                            ]),
                             items: [
                        //         {
                        //             label: 'Repayment Schedule', icon: '', routerLink: ['/report/loan-details/loan-schedule'],
                        //             visible: this.menuGuardSrv.hideOrShow(['repayment schedule'])
                        //         },
                                {
                                    label: 'Disbursement', icon: '', routerLink: ['/report/loan-details/loan-disburstment'],
                                    visible: this.menuGuardSrv.hideOrShow(['disbursement'])
                                },
    
                                {
                                    label: 'Running Facilities', icon: '', routerLink: ['/report/loan-details/running-facilities'],
                                    visible: this.menuGuardSrv.hideOrShow(['running facilities'])
                                },
    
                        //         {
                        //             label: 'Middle Office', icon: '', routerLink: ['/report/loan-details/middle-office-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['middle office report'])
                        //         },
                                {
                                    label: 'Collateral Valuation', icon: '', routerLink: ['/report/loan-details/collateral-valuation-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral valuation report'])
                                },
                                {
                                    label: 'Credit Schedule', icon: '', routerLink: ['/report/loan-details/credit-schedule-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['credit schedule report'])
                                },
    
                                {
                                    label: 'In Active Contigent Liability', icon: '', routerLink: ['/report/loan-details/in-active-contigent-liability-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['inActive Contigent Liability'])
                                },
                                    {
                                        label: 'Loan Statement', icon: '', routerLink: ['/report/loan/loan-statement'],
                                        visible: this.menuGuardSrv.hideOrShow(['statement'])
                                    },
                                {
                                    label: 'Loan status Report',
                                    icon: '',
                                    routerLink: ['/report/loan-status-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['loan status report'])
                                },
                                {
                                    label: 'Credit Turnover', icon: '', routerLink: ['/report/loan/disbursal-credit-turnover'],
                                    visible: this.menuGuardSrv.hideOrShow(['statement'])
                                },
                                    {
                                        label: 'Anniversary', icon: '', routerLink: ['/report/loan/loan-LoanAnniversery'],
                                        visible: this.menuGuardSrv.hideOrShow(['anniversary'])
                                    },
                                {
                                    label: 'Waivers', icon: '', routerLink: ['/report/loan/loan-document-waived'],
                                    visible: this.menuGuardSrv.hideOrShow(['waived'])
                                },
                                {
                                    label: 'Deferals', icon: '', routerLink: ['/report/loan/loan-document-deferred'],
                                    visible: this.menuGuardSrv.hideOrShow(['deferred'])
                                },
                        //         //  {
                        //         // label: 'Deferrals', icon: '', routerLink: ['/report/loan/loan-deferral'],
                        //         //visible: this.menuGuardSrv.hideOrShow(['deferrals'])
                        //         //},
                        //         {
                        //             label: 'Deferrals For MCC', icon: '', routerLink: ['/report/loan/loan-deferral-mcc'],
                        //             visible: this.menuGuardSrv.hideOrShow(['deferrals for mcc'])
                        //         },
                                {
                                    label: 'Scheduled FCY Credit', icon: '', routerLink: ['/report/loan/loan-fcyscheuled'],
                                    visible: this.menuGuardSrv.hideOrShow(['scheduled fcy credit'])
                                },
                                {
                                    label: 'Collateral', icon: '', routerLink: ['/report/loan/collateral-estimated'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                },
    
                                {
                                    label: 'Booking Report', icon: '', routerLink: ['/report/loan/loan-booking-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                },
                                {
                                    label: 'Submission of Original Documents', icon: '', routerLink: ['/report/loan/submission-of-original-documents-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                },
                        //         {
                        //             label: 'Form300b-Facilities', icon: '', routerLink: ['/report/loan/form300b-facility-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Submission of Original Document', icon: '', routerLink: ['/report/loan/original-document-submission'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Assets Report', icon: '', routerLink: ['/report/risk-assets-report/risk-assets-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Contigent Report', icon: '', routerLink: ['/report/contigent-report/contigent-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                                // {
                                //     label: 'Expired Facility report', icon: '', routerLink: ['/report/expired-Facility-report/expired-Facility-report'],
                                //     visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                // },
                        //         {
                        //             label: 'Large Exposure report', icon: '', routerLink: ['/report/large-exposure-report/large-exposure-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Overline Report', icon: '', routerLink: ['/report/overline-report/overline-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                                {
                                    label: 'Extension Report', icon: '', routerLink: ['/report/extension-report/extension-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                },
                                {
                                    label: 'Employer Related Report', icon: '', routerLink: ['/report/employer-related'],
                                    visible: this.menuGuardSrv.hideOrShow(['report'])
                                },
                                {
                                    label: 'Stamp Duty Report', icon: '', routerLink: ['/report/stamp-duty'],
                                    visible: this.menuGuardSrv.hideOrShow(['report'])
                                },
                        //         {
                        //             label: 'Maturity Report', icon: '', routerLink: ['/report/maturity-report/maturity-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Unpaid Obligation Report', icon: '', routerLink: ['/report/unpaid-obligation-report/unpaid-obligation-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset Team Report', icon: '', routerLink: ['/report/risk-asset-team-report/risk-asset-team-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset Main Report', icon: '', routerLink: ['/report/risk-asset-main-report/risk-asset-main-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset Main Report_1', icon: '', routerLink: ['/report/risk-asset-main1-report/risk-asset-main1-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset By Variance Report', icon: '', routerLink: ['/report/risk-asset-by-variance-report/risk-asset-by-variance-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset Distribution By Sector Report', icon: '', routerLink: ['/report/risk-asset-distribution-by-sector-report/risk-asset-distribution-by-sector-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset By IFRS Classification Report', icon: '', routerLink: ['/report/risk-asset-by-ifrs-classification-report/risk-asset-by-ifrs-classification-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'IFRS Classification Team Report', icon: '', routerLink: ['/report/ifrs-classification-team-report/ifrs-classification-team-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Cbn Npl Team Report', icon: '', routerLink: ['/report/cbn-npl-team-report/cbn-npl-team-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                                
                        //         {
                        //             label: 'Contigent Liability Report Main', icon: '', routerLink: ['/report/contigent-liabilty-report-main-report/contigent-liabilty-report-main-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Contigent Liability Report', icon: '', routerLink: ['/report/contigent-liabilty/contigent-liabilty'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         }, 
                                
                        //         {
                        //             label: 'Contigent Liability Report Main1 Report', icon: '', routerLink: ['/report/contigent-liabilty-report-main1/contigent-liabilty-report-main1'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Copy Of Risk Asset Main', icon: '', routerLink: ['/report/copy-of-risk-asset-main-report/copy-of-risk-asset-main-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Copy Of Risk Asset By IFRS Classification', icon: '', routerLink: ['/report/copy-of-risk-asset-by-ifrs-classification/copy-of-risk-asset-by-ifrs-classification'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                                
                        //         {
                        //             label: 'Risk Asset Combined Report', icon: '', routerLink: ['/report/risk-asset-combined-report/risk-asset-combined-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset Calc Combined Report Team', icon: '', routerLink: ['/report/calc-combine/calc-combine'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
    
                        //         {
                        //             label: 'Risk Asset Calc Combined Report', icon: '', routerLink: ['/report/risk-calc-combine/risk-calc-combine'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset By Npl Classification', icon: '', routerLink: ['/report/risk-asset-by-cbn-classification-report/risk-asset-by-cbn-classification-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
                        //         {
                        //             label: 'Risk Asset Contigent Report Main', icon: '', routerLink: ['/report/risk-asset-contigent-report-main/risk-asset-contigent-report-main'],
                        //             visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                        //         },
    
                               
                             ]
                         },
                        {
                            label: 'Approval Workflow', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                'workflow definition report',
                                 'workflow sla report',
                            ]),
                            items: [
                                {
                                    label: 'Workflow Definition', icon: '', routerLink: ['/report/Workflow/definition'],
                                    visible: this.menuGuardSrv.hideOrShow(['workflow definition report'])
                                },
                                // {
                                //     label: 'Workflow SLA', icon: '', routerLink: ['/report/loan-workflow/application-sla'],
                                //     visible: this.menuGuardSrv.hideOrShow(['workflow sla report'])
                                // },
                                // {
                                //     label: 'SLA Monitoring', icon: '', routerLink: ['/report/loan-workflow/sla-monitoring'],
                                //     visible: this.menuGuardSrv.hideOrShow(['workflow sla report'])
                                // },
                                {
                                    label: 'Approval Monitoring', icon: '', routerLink: ['/report/approval-monitoring'],
                                    visible: this.menuGuardSrv.hideOrShow(['workflow sla report'])
                                }
                            ]
                        },
                        {
                            label: 'LOS CRMS Regulatory', icon: '', routerLink: ['/credit/newloan/crms'],
                            visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                        },
                        
                        {
                            label: 'LMS CRMS Regulatory', icon: '', routerLink: ['/credit/newloan/lms-crms'],
                            visible: this.menuGuardSrv.hideOrShow(['start credit application'])
                        },
                        {
                            label: 'Posted Transaction', icon: '', routerLink: ['/report/finance/posted-transaction'],
                            visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                        },
                        {
                            label: 'Daily Interest Accrual', icon: '', routerLink: ['/report/finance/daily-interest-accrual'],
                            visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                        },
                        {
                            label: 'Loan Repayment', icon: '', routerLink: ['/report/finance/loan-repayment'],
                            visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                        },
                        {
                            label: 'Custom Facility Repayment', icon: '', routerLink: ['/report/finance/custom-factility-repayment'],
                            visible: this.menuGuardSrv.hideOrShow(['posted transaction report'])
                        },
                        {
                            label: 'Insurance Policy Report', icon: '', routerLink: ['/report/collateral-reports/insurance-policy-report'],
                            visible: this.menuGuardSrv.hideOrShow(['insurance policy report'])
                        },
                        {
                            label: 'Monitoring', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                // 'branch npl limit report',
                                // 'sectorial limit report',
                                // 'collateral revaluation report',
                                // 'covenant report',
                                'npl report',
                                // 'expired overdraft report',
                                'reports',
                            ]),
                            items: [
                                // {
                                //     label: 'Branch NPL', icon: '', routerLink: ['/report/loan-Limit-monitoring/branch-limit'],
                                //     visible: this.menuGuardSrv.hideOrShow(['branch npl limit report'])
                                // },
                                {
                                    label: 'Credit Analyst Report', icon: '', routerLink: ['/report/analyst-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['analyst report'])
                                },
                                {
                                    label: 'Job request Report', icon: '', routerLink: ['/report/job-request-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['job request report'])
                                },    
                                {
                                    label: 'Sector Limit', icon: '', routerLink: ['/report/loan-Limit-monitoring/sectorial-limit'],
                                    visible: this.menuGuardSrv.hideOrShow(['sectorial limit report'])
                                },
                                {
                                    label: 'Collateral Revaluation', icon: '',
                                    routerLink: ['/report/loan-monitoring/collateral-property-revaluation'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral revaluation report'])
                                },
                                {
                                    label: 'Covenants', icon: '', routerLink: ['/report/loan-monitoring/almost-due-covenants'],
                                    visible: this.menuGuardSrv.hideOrShow(['covenant report'])
                                },
                                {
                                    label: 'NPL', icon: '', routerLink: ['/report/loan-monitoring/non-performing-loans'],
                                    visible: this.menuGuardSrv.hideOrShow(['npl report'])
                                },
                                {
                                    label: 'Expired Overdraft', icon: '',
                                    routerLink: ['/report/loan-monitoring/expired-overdraft-loans'],
                                    visible: this.menuGuardSrv.hideOrShow(['expired overdraft report'])
                                },
                                {
                                    label: 'Corporate Loans Report',
                                    icon: '',
                                    routerLink: ['/report/corporate-loans-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['corporate loans report'])
                                },
                                    {
                                        label: 'Insider Related Loans', icon: '',
                                        routerLink: ['/report/loan-monitoring/insider-related-loans'],
                                        visible: this.menuGuardSrv.hideOrShow(['insider related loans'])
                                    },
                                // {
                                //     label: 'Expired FTS', icon: '',
                                //     routerLink: ['/report/loan/expired-stakeholder-with-pnd'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
                                {
                                    label: 'Credit Bureau', icon: '',
                                    routerLink: ['/report/loan-monitoring/credit-bureau'],
                                    visible: this.menuGuardSrv.hideOrShow(['Credit Bureau report'])
                                },
                                //         {
                                //             label: 'Bonds & Guarantee', icon: '',
                                //             routerLink: ['/report/loan/bond-and-guarantee'],
                                //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                                //         },
    
                                {
                                        label: 'Bonds & Guarantee', icon: '',
                                        routerLink: ['/report/loan/bond-and-guarantee-report'],
                                        visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Contingents Report', icon: '',
                                    routerLink: ['/report/loan/contingents-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Collateral Due For Visitation', icon: '',
                                    routerLink: ['/report/loan/collateral-visitation'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Expired Collateral Insurance', icon: '',
                                    routerLink: ['/report/loan/insurance-expiration'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Turnover Covenant', icon: '',
                                    routerLink: ['/report/loan/turnover-covenant'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                        //         {
                        //             label: 'Self Liquidating Loan', icon: '',
                        //             routerLink: ['/report/loan/expired-self-liquidating-loans'],
                        //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                        //         },
                                {
                                    label: 'Blacklist', icon: '',
                                    routerLink: ['/report/loan/blacklist'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Lien', icon: '',
                                    routerLink: ['/report/loan/lien'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Stalled Perfection For Collaterals', icon: '',
                                    routerLink: ['/report/loan/stalled-perfection-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Collateral Perfection Yet to Commence', icon: '',
                                    routerLink: ['/report/loan/collateral-perfection-yettocommence'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Collateral Perfection', icon: '',
                                    routerLink: ['/report/loan/collateral-perfection'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral perfection report'])
                                },
                                {
                                    label: 'Disbursed Facility Collateral', icon: '',
                                    routerLink: ['/report/loan/disbursed-facility-collateral-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['disbursed facility collateral report'])
                                },
                                {
                                    label: 'Collateral Register', icon: '',
                                    routerLink: ['/report/loan/collateral-register'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral register report'])
                                },
                                {
                                    label: 'Collateral Adequacy', icon: '',
                                    routerLink: ['/report/loan/collateral-adequacy'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral adequacy report'])
                                },
                        //         {
                        //             label: 'All Commercial Loan Report', icon: '',
                        //             routerLink: ['/report/loan/all-comercial-loan-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                        //         },
                                {
                                    label: 'Loan Classification Report', icon: '',
                                    routerLink: ['/report/loan/loan-classification-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'DBN Data Report', icon: '',
                                    routerLink: ['/report/loan/dbn-data-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Insurance Spool Report', icon: '',
                                    routerLink: ['/report/loan/insurance-spool-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Trial Balance Report', icon: '',
                                    routerLink: ['/report/loan/trial-balance-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
    
                                {
                                    label: 'Interest Income Report', icon: '',
                                    routerLink: ['/report/loan/interest-income'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Age Analysis Report', icon: '',
                                    routerLink: ['/report/loan/age-analysis-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
    
                                {
                                    label: 'Runining Loan Report', icon: '',
                                    routerLink: ['/report/loan/runining-loan-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
    
                                // {
                                //     label: 'Impaired WatchList Report', icon: '',
                                //     routerLink: ['/report/loan/impaired-watch-list-report'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
                                {
                                    label: 'Insurance Report', icon: '',
                                    routerLink: ['/report/loan/insurance-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                // {
                                //     label: 'Excess Report', icon: '',
                                //     routerLink: ['/report/loan/excess-report'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
                                {
                                    label: 'Unutilized Facility Report', icon: '',
                                    routerLink: ['/report/loan/unutilized-facility-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
    
                        //         {
                        //             label: 'Expired Report', icon: '',
                        //             routerLink: ['/report/loan/expired-report'],
                        //             visible: this.menuGuardSrv.hideOrShow(['reports'])
                        //         },
                                // {
                                //     label: 'Sanction Limit Report', icon: '',
                                //     routerLink: ['/report/loan/sanction-limit-report'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
    
                                {
                                    label: 'Unearned and Receivable Interest Report', icon: '',
                                    routerLink: ['/report/loan/unearned-interest-Report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                // {
                                //     label: 'CashBacked Facility For OD And Loans Report', icon: '',
                                //     routerLink: ['/report/loan/cashbacked-Report'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
    
                                // {
                                //     label: 'CashBack Bond Guarantee', icon: '',
                                //     routerLink: ['/report/loan/cashbacked-bond-guarantee'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
                                {
                                    label: 'Weekly Recovery Report FINCON', icon: '',
                                    routerLink: ['/report/loan/weeklyrecovery-Reportfor-FINCON'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Cash Collaterized Credits', icon: '',
                                    routerLink: ['/report/loan/cash-collaterized-credits'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Security Release Report', icon: '',
                                    routerLink: ['/report/security-release-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['security release report'])
                                },
    
                            ]
                        },
    
                        {
                            label: 'Remedial Asset Reports', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                'reports'
                            ]),
                            items: [
                                {
                                    label: 'Out Of Court Settlement', icon: '', routerLink: ['/report/out-of-court-settlement/out-of-court-settlement'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Collateral Sales', icon: '', routerLink: ['/report/collateral-sales/collateral-sales'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Recovery Agent Update', icon: '', routerLink: ['/report/recovery-agent-update/recovery-agent-update'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Recovery Commission', icon: '', routerLink: ['/report/recovery-commission/recovery-commission'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Recovery Agent Performance', icon: '', routerLink: ['/report/recovery-agent-performance/recovery-agent-performance'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Litigation Recoveries', icon: '', routerLink: ['/report/litigation-recoveries/litigation-recoveries'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Revalidation Of Full & Final Settlement', icon: '', routerLink: ['/report/revalidation-of-full-and-final-settlement/revalidation-of-full-and-final-settlement'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Idle Assets Sales', icon: '', routerLink: ['/report/idle-assets-sales/idle-assets-sales'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Full & Final Settlement & Waivers', icon: '', routerLink: ['/report/full-and-final-settlement-and-waivers/full-and-final-settlement-and-waivers'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                }
                            ]
                        },
    
                        {
                            label: 'Retail Collection Reports', icon: '',
                            visible: this.menuGuardSrv.hideOrShow(['reports']),
                            items: [
                                // {
                                //     label: 'Delinquent Accounts', icon: '', routerLink: ['/report/recovery-delinquent-accounts/recovery-delinquent-accounts'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
                                {
                                    label: 'Delinquent Accounts', icon: '', routerLink: ['/report/all-delinquent-accounts/all-delinquent-accounts'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
    
                                // {
                                //     label: 'Payday Loan Allocation', icon: '', routerLink: ['/report/payday-loan-allocation/payday-loan-allocation'],
                                //     visible: this.menuGuardSrv.hideOrShow(['reports'])
                                // },
                                 {
                                    label: 'Payday Loan Allocation', icon: '', routerLink: ['/report/all-delinquent-digital-accounts/all-delinquent-digital-accounts'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Computation External Agents', icon: '', routerLink: ['/report/computation-for-external-agents/computation-for-external-agents'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Computation Internal Agents', icon: '', routerLink: ['/report/computation-for-internal-agents/computation-for-internal-agents'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                                {
                                    label: 'Recovery Collections Report', icon: '', routerLink: ['/report/recovery-collections-report/recovery-collections-report'],
                                    visible: this.menuGuardSrv.hideOrShow(['reports'])
                                },
                            ],
                        },
    
                        {
                            label: 'Collateral Reports', icon: '', visible: this.menuGuardSrv.hideOrShow([
                                'reports'
                            ]),
                            items: [
                                {
                                    label: 'Fixed Deposit', icon: '', routerLink: ['/report/loan/fixed-deposit-collateral'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                },
                                {
                                    label: 'Valid Collaterals', icon: '', routerLink: ['/report/loan/valid-collateral'],
                                    visible: this.menuGuardSrv.hideOrShow(['collateral report'])
                                },
                            ]
                        },
                        
    
                    ]
                }
    
            ];
    
        }
    
        changeTheme(theme) {
            const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
            const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
            themeLink.href = 'assets/theme/theme-' + theme + '.css';
            layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
        }
    }
    
    @Component({
        selector: '[app-submenu]',
        template: `
            <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
                <li [ngClass]="{'active-menuitem': isActive(i)}" *ngIf="child.visible === false ? false : true">
                    <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="!child.routerLink" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                        <i class="material-icons">{{child.icon}}</i>
                        <span>{{child.label}}</span>
                        <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
                    </a>
    
                    <a (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="child.routerLink"
                        [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                        <i class="material-icons">{{child.icon}}</i>
                        <span>{{child.label}}</span>
                        <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
                    </a>
                    <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'" [visible]="isActive(i)" [reset]="reset"></ul>
                </li>
            </ng-template>
        `,
        animations: [
            trigger('children', [
                state('hidden', style({
                    height: '0px'
                })),
                state('visible', style({
                    height: '*'
                })),
                transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
                transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
            ])
        ]
    })
    
    export class AppSubMenuComponent {
    
        @Input() item: MenuItem;
    
        @Input() root: boolean;
    
        @Input() visible: boolean;
    
        _reset: boolean;
    
        activeIndex: number;
    
        constructor(@Inject(forwardRef(() => MainLayoutComponent)) public app: MainLayoutComponent,
            public router: Router, public location: Location) { }
    
        itemClick(event: Event, item: MenuItem, index: number) {
            // avoid processing disabled items
            if (item.disabled) {
                event.preventDefault();
                return true;
            }
    
            // activate current item and deactivate active sibling if any
            this.activeIndex = (this.activeIndex === index) ? null : index;
    
            // execute command
            /*    if (item.command) {
                   if (!item.eventEmitter) {
                       item.eventEmitter = new EventEmitter();
                       item.eventEmitter.subscribe(item.command);
                   }
       
                   item.eventEmitter.emit({
                       originalEvent: event,
                       item: item
                   });
               } */
    
            // prevent hash change
            if (item.items || (!item.url && !item.routerLink)) {
                event.preventDefault();
            }
    
            // hide menu
            if (!item.items) {
                if (this.app.isHorizontal()) {
                    this.app.resetMenu = true;
                } else {
                    this.app.resetMenu = false;
                }
                this.app.overlayMenuActive = false;
                this.app.staticMenuMobileActive = false;
            }
        }
        isActive(index: number): boolean {
            return this.activeIndex === index;
        }
    
        @Input() get reset(): boolean {
            return this._reset;
        }
    
        set reset(val: boolean) {
            this._reset = val;
    
            if (this._reset && this.app.isHorizontal()) {
                this.activeIndex = null;
            }
        }
    }
    
    /*
    {
        label: '_LABEL_', icon: '', routerLink: ['#'],
        visible: this.menuGuardSrv.hideOrShow(['_ACTIVITY_'])
    },*/