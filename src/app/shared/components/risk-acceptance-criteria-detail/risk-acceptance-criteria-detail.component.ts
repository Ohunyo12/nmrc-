import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { RiskAcceptanceCriteriaService } from 'app/shared/services/risk-acceptance-criteria.service';

@Component({
  selector: 'risk-acceptance-criteria-detail',
  templateUrl: './risk-acceptance-criteria-detail.component.html',
  //styleUrls: ['./risk-acceptance-criteria-detail.component.scss']
})
export class RiskAcceptanceCriteriaDetailComponent implements OnInit {
  // ------------------- declarations -----------------

  @Input() operationId: number; // REQUIRED
  @Input() targetId: number; // REQUIRED for updates & readonly

  @Input() approvalLevelId: number;

  @Input() targetReferenceNumber: any;

  @Input() roleId: number;

  @Input() loanApplicationId;

  @Input() customerId;

  @Input() readonly: boolean = false;
  @Input() checklistStatus: number = 0;

  @Input() panel: boolean = false;
  @Input() label: string = '';

  @Input() racCategoryTypeId: any;

  @Output() formOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() formOutputReadOnly: EventEmitter<any> = new EventEmitter<any>();

  @Input() set productId(value: number) { if (value > 0) this.getRiskAcceptanceCriteria(value); }

  @Input() set getFormOutput(value) {
    if (value > 0) {
      if (this.racForm == null) {
        this.formOutput.emit({
          operationId: this.operationId,
          targetId: this.targetId,
          checklistStatus: this.checklistStatus,
          productId: this.selectedProductId,
        });
        return;
      }
      let form = this.racForm.value;
      this.formOutput.emit({
        form: Object.keys(form).map(key => { return { criteriaId: key, value: form[key] } }),
        operationId: this.operationId,
        targetId: this.targetId,
        checklistStatus: this.checklistStatus,
        productId: this.selectedProductId,
      });
    }
  }

  @Input() set getFormOutputReadOnly(value) {
    if (value > 0) {
      if (this.racFormReadOnly == null) {
        this.formOutputReadOnly.emit({
          operationId: this.operationId,
          targetId: this.targetId,
          checklistStatus: this.checklistStatus,
          productId: this.selectedProductId,
        });
        return;
      }
      let form2 = this.racFormReadOnly.value;
      this.formOutputReadOnly.emit({
        form2: Object.keys(form2).map(key => { return { criteriaId: key, value: form2[key] } }),
        operationId: this.operationId,
        targetId: this.targetId,
        checklistStatus: this.checklistStatus,
        productId: this.selectedProductId,
      });
    }
  }


  selectedProductId: number = null;

  riskAcceptanceCriterias: any[] = [];
  displayRiskAcceptanceCriteriaForm: boolean = false;

  racForm: FormGroup;
  racFormReadOnly: FormGroup;
  categoriesCount: number = 0;

  // input types 1. text, 2. numeric, 3.select, 4. radio

  fakerac = {
    count: 2,//[{ criteriaId: 2, staffId: 2, remark: '' }],
    categories: [
      {
        name: 'PRICIPAL RAC',
        rows: [ //criterias
          {
            id: 13,//criteriaId
            criteria: 'Overall Debt Service Ratio',
            required: '33.33% of basic monthly income',
            hasException: true,
            label: '',
            name: 'overall debt service',
            value: '',
            type: 'text',
            typeId: 1,
            optionId: null,
            options: null,
            status: 2,
            fileUpload: false,
          },
          {
            id: 34,
            criteria: 'Overall Debt Service Ratio',
            required: '33.33% of basic monthly income',
            label: '',
            hasException: false,
            name: 'basic monthly income',
            value: '',
            typeId: 2,
            type: 'text',
            optionId: null,
            options: null,
            status: 3,
            fileUpload: true,
          },
        ]
      },
      {
        name: 'OBLIGOR RAC',
        rows: [
          {
            id: 64,
            criteria: 'Line ED’s approval ',
            required: 'yes',
            label: '',
            hasException: false,
            name: 'lineapproval',
            value: '',
            typeId: 3,
            type: 'select',
            optionId: 1,
            options: [
              { key: 1, label: 'Yes' },
              { key: 2, label: 'No' },
            ],
            status: 3,
            fileUpload: true,
          },

          {
            id: 76,
            criteria: 'Line ED’s approval ',
            required: 'yes',
            label: '',
            hasException: false,
            name: 'line-approval-radio',
            value: '',
            typeId: 4,
            type: 'radio',
            optionId: 1,
            options: [
              { key: 1, label: 'Yes' },
              { key: 2, label: 'No' },
            ],
            status: 3,
            fileUpload: true,
          },
        ]
      }
    ], // CATEGORIES

  };

  rac: any = null;

  // ---------------------- init ----------------------

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private racService: RiskAcceptanceCriteriaService,
  ) { }

  ngOnInit() {
    this.clearControls();
    //this.getRiskAcceptanceCriterias();
    //this.initializeDynamicForm();
  }

  getCriteriaComments() {
    // this._SERVICE_INJECTION_.getCriteriaComments().subscribe((response: any) => {
    //     this.CriteriaComments = response.result;
    // });
  }

  saveCriteriaComment(form) {

    let body = {
      comment: form.value.comment,
    };
    //s this.loadingService.show();
  }

  criteriaComments: any[] = [];
  criteriaCommentForm: FormGroup;
  displayCriteriaCommentForm: boolean = false;
  displayCriteriaUploadsForm: boolean = false;

  showComments(id) {
    this.displayCriteriaCommentForm = true;
  }

  // test() {
  //     console.log('form ---> ', this.racForm);
  //     Object.keys(this.racForm.value).map(x => { this.racForm.value[x] });

  // }

  showUploads(id) {
    this.displayCriteriaUploadsForm = true;
  }

  initializeDynamicForm() {
    if (this.rac == null) return;
    this.categoriesCount = this.rac.count;
    let formControls = {};
    for (let c of this.rac.categories) {
      for (let f of c.rows) {
        formControls[f.id] = f.hasException ? new FormControl(f.value) : new FormControl(f.value, Validators.required);
      }
    }
    this.racForm = this.fb.group(formControls);
    this.racFormReadOnly = this.fb.group(formControls);
  }

  // ------------------- api-calls --------------------


  getRiskAcceptanceCriteria(productId) {
    this.selectedProductId = productId;
    if (this.targetId == null) {
      let data = {
        productId: productId,
        racCategoryTypeId: this.racCategoryTypeId,
        loanApplicationId: this.loanApplicationId
      }
      this.racService.getSavedRiskAcceptanceCriteria(data).subscribe((response: any) => {
        // response.result = this.fakerac; // fake mocking
        this.rac = response.result;
        this.initializeDynamicForm();
      });
    } else {
      this.racService.getRiskAcceptanceCriteriaUpdate(productId, this.targetId).subscribe((response: any) => {
        this.rac = response.result;
        this.initializeDynamicForm();
      });
    }
  }

  // deleteRiskAcceptanceCriteria(row) {
  //     this.racService.deleteRiskAcceptanceCriteria(row.riskAcceptanceCriteriaId).subscribe((response: any) => {
  //         if (response.result == true) this.reloadGrid();
  //     });
  // }

  // reloadGrid() {
  //     this.displayRiskAcceptanceCriteriaForm = false;
  //     this.getRiskAcceptanceCriterias(this.productId);
  // }

  // ---------------------- form ----------------------

  clearControls() {

    this.criteriaCommentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }


  // ---------------------- message ----------------------

  show: boolean = false; message: any; title: any; cssClass: any;

  finishGood() { this.loadingService.hide(); }

  hideMessage(event) { this.show = false; }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }
}
