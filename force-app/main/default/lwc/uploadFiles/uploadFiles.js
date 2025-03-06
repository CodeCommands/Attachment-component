import { LightningElement, api, wire } from 'lwc';
import getFieldVisibility from '@salesforce/apex/FieldController.getFieldVisibility';

export default class UploadFiles extends LightningElement {
    @api recordId;
    @api filterCriteriaJSON; // Property for the filter criteria in JSON format
    isVisible = false;

    @wire(getFieldVisibility, { recordId: '$recordId', filterCriteriaJSON: '$filterCriteriaJSON' })
    wiredFieldVisibility({ error, data }) {
        console.log('Record ID: ', this.recordId);
        console.log('Filter Criteria JSON: ', this.filterCriteriaJSON);

        if (data) {
            this.isVisible = data;
            console.log('Visibility determined: ', this.isVisible);
        } else if (error) {
            console.error('Error determining visibility: ', error);
        }
    }
}