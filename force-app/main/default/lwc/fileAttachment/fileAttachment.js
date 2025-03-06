import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getFiles from '@salesforce/apex/FileAttachmentController.getFiles';
import getFieldVisibility from '@salesforce/apex/FileAttachmentController.getFieldVisibility';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'File Name', fieldName: 'Title', type: 'text' },
    { label: 'Preview', type: 'button', typeAttributes: { label: 'Preview', name: 'preview', variant: 'brand' } }
];

export default class FileAttachment extends NavigationMixin(LightningElement) {
    @api recordId; // Property for record ID
    @api filterCriteriaJSON; // Criteria for showing the upload button
    @track files; // Track files data
    @track showUploadButton = false; // Track visibility of upload button
    columns = columns; // Define columns for the datatable

    connectedCallback() {
        this.checkUploadVisibility();
    }

    // Wire method to get files related to the record
    @wire(getFiles, { recordId: '$recordId' })
    wiredFiles(result) {
        this.wiredFilesResult = result;
        const { data, error } = result;
        if (data) {
            console.log('Files fetched: ', data);
            this.files = data.map(file => ({
                Id: file.ContentDocumentId,
                Title: file.ContentDocument.Title,
                contentDocumentId: file.ContentDocumentId,
                versionId: file.ContentDocument.LatestPublishedVersionId,
                fileExtension: file.ContentDocument.FileExtension
            }));
            console.log('Processed files: ', this.files);
        } else if (error) {
            this.files = undefined;
            console.error('Error fetching files: ', error);
        }
    }

    // Method to check visibility of the upload button based on criteria
    checkUploadVisibility() {
        getFieldVisibility({ recordId: this.recordId, filterCriteriaJSON: this.filterCriteriaJSON })
            .then(result => {
                this.showUploadButton = result;
            })
            .catch(error => {
                this.showUploadButton = false;
                console.error('Error checking upload button visibility: ', error);
            });
    }

    // Handle row action for preview button
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'preview') {
            this.previewFile(row.contentDocumentId);
        }
    }

    // Navigate to the file preview page
    previewFile(contentDocumentId) {
        console.log('Preview file contentDocumentId: ', contentDocumentId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: contentDocumentId,
                actionName: 'view'
            }
        });
    }

    // Handle file upload
    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: `${uploadedFiles.length} file(s) uploaded successfully.`,
            variant: 'success',
        });
        this.dispatchEvent(toastEvent);
        // Refresh the file list after upload
        return refreshApex(this.wiredFilesResult);
    }
}