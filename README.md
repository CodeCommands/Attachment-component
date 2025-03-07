# On both component, "Upload Files" button will hide based on Filter criteria set on Component properties.
## Very useful on Experience site where out of the box Dynamic visbility is lacking.


## Attachment Component:

![image](https://github.com/user-attachments/assets/e04d9950-cc6e-4316-935a-5d6b6f89a752)


## Standalone Upload component:


![image](https://github.com/user-attachments/assets/6f552b13-c69c-4b4c-8a86-7f1b2d975bea)


## Component property example:


![image](https://github.com/user-attachments/assets/2a276514-392f-429c-8ad1-699a195f1262)



Contents

[Summary of JSON Examples for Component Visibility Based on Field’s Value 1](#_Toc172675985)

[1\. All Conditions Must Be True (AND) 1](#_Toc172675986)

[2\. At Least One Condition Must Be True (OR) 1](#_Toc172675987)

[3\. Combination of AND and OR 1](#_Toc172675988)

[4\. Nested Conditions 2](#_Toc172675989)

[5\. More Complex Combination 2](#_Toc172675990)

# Summary of JSON Examples for Component Visibility Based on Field’s Value

## All Conditions Must Be True (AND)

- - Status is New
    - Priority is High
    - Allow_Upload_\_c is true

{

"AND": \[

{ "Status": "New" },

{ "Priority": "High" },

{ "Allow_Upload_\_c": "true" }

\]

}

## At Least One Condition Must Be True (OR)

- - Status is New
    - Priority is High
    - Allow_Upload_\_c is true

{

"OR": \[

{ "Status": "New" },

{ "Priority": "High" },

{ "Allow_Upload_\_c": "true" }

\]

}

## Combination of AND and OR

- - Status is New
    - Priority is High OR Allow_Upload_\_c is true

{

"AND": \[

{ "Status": "New" },

{

"OR": \[

{ "Priority": "High" },

{ "Allow_Upload_\_c": "true" }

\]

}

\]

}

## Nested Conditions

- - (Status is New AND Priority is High) OR (Allow_Upload_\_c is true AND Type is Request)

{

"OR": \[

{

"AND": \[

{ "Status": "New" },

{ "Priority": "High" }

\]

},

{

"AND": \[

{ "Allow_Upload_\_c": "true" },

{ "Type": "Request" }

\]

}

\]

}

## More Complex Combination

- - Status is New
    - Priority is High OR (Allow_Upload_\_c is true AND Type is Request)

{

"OR": \[

{

"AND": \[

{ "Status": "New" },

{ "Priority": "High" }

\]

},

{

"AND": \[

{ "Allow_Upload_\_c": "true" },

{ "Type": "Request" }

\]

}

\]

}
