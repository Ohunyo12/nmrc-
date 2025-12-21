export class CustomFieldBase {

    dataDetails: string;
    controlKey: string;
    labelName: string;
    required: boolean;
    itemOrder: number;
    controlType: string;
    customFieldId: number;

    constructor(obj?: any) {
        this.dataDetails = obj && obj.dataDetails || null;
        this.controlKey = obj && obj.controlKey || null;
        this.labelName = obj && obj.labelName || null;
        this.required = obj && obj.required || null;
        this.itemOrder = obj && obj.itemOrder || null;
        this.controlType = obj && obj.controlType || null;
        this.customFieldId = obj && obj.customFieldId || null;

    }

}