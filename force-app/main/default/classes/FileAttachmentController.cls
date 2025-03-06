public with sharing class FileAttachmentController {
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getFiles(Id recordId) {
        System.debug('Fetching files for recordId: ' + recordId);
        return [
            SELECT ContentDocumentId, ContentDocument.Title, ContentDocument.LatestPublishedVersionId, ContentDocument.FileExtension
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Boolean getFieldVisibility(Id recordId, String filterCriteriaJSON) {
        System.debug('Record ID: ' + recordId);
        System.debug('Filter Criteria JSON: ' + filterCriteriaJSON);

        if (String.isEmpty(recordId) || String.isEmpty(filterCriteriaJSON)) {
            System.debug('Missing required parameters.');
            return false;
        }

        Map<String, Object> filterCriteria = (Map<String, Object>) JSON.deserializeUntyped(filterCriteriaJSON);
        System.debug('Parsed Filter Criteria: ' + filterCriteria);

        String baseQuery = 'SELECT Id FROM ' + recordId.getSObjectType() + ' WHERE Id = :recordId';
        String whereClause = buildWhereClause(filterCriteria);

        String finalQuery = baseQuery + whereClause;
        System.debug('Final Query: ' + finalQuery);

        List<SObject> records = Database.query(finalQuery);
        System.debug('Query Result: ' + records);

        return !records.isEmpty();
    }

    private static String buildWhereClause(Map<String, Object> criteria) {
        List<String> conditions = new List<String>();

        for (String key : criteria.keySet()) {
            if (key == 'AND' || key == 'OR') {
                List<Object> subCriteria = (List<Object>) criteria.get(key);
                List<String> subConditions = new List<String>();

                for (Object subCriterion : subCriteria) {
                    subConditions.add(buildWhereClause((Map<String, Object>) subCriterion));
                }

                conditions.add('(' + String.join(subConditions, ' ' + key + ' ') + ')');
            } else {
                String value = (String) criteria.get(key);
                conditions.add(key + ' = \'' + String.escapeSingleQuotes(value) + '\'');
            }
        }

        String whereClause = ' AND ' + String.join(conditions, ' AND ');
        System.debug('Built Where Clause: ' + whereClause);
        return whereClause;
    }
}