# Example of a model

```javascript
export class LoginModel {
    model() {
        return {
            'username': {
                type: String
            },
            'password': {
                type: String
            }
        };
    }
}
```
## Variable types
* String
* Number
* JSON
* Array

## Properties
* type
    * mandatory
* defaultValue
    * the initial value to be set
    * optional
* computedType
    * 'default' or 'select'
        * default will give back a value as defined in **type**
        * select will give back a JSON Object like: {text: propertyValue, value: propertyValue}
    * optional
* renderer
    * function that gives you the possibility to perform custom operations on the value set for this property
    * optional

## Basic Example
```
'username': {
    type: String,
    defaultValue: 'n/a',
    computedType: 'default',
    renderer: function(value){
        return value.toUpperCase();
    }
},
```
