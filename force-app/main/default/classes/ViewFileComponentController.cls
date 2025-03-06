public with sharing class ViewFileComponentController {
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getFiles(Id recordId) {
        System.debug('Fetching files for recordId: ' + recordId);
        return [
            SELECT ContentDocumentId, ContentDocument.Title, ContentDocument.LatestPublishedVersionId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :recordId
        ];
    }
}