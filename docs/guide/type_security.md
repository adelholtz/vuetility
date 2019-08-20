# Type Security

As you can see in the basic [Example of a model](/guide/model.html) i provided in this documenation you are supposed to provide a **type** for every property of your model.

## Variable types
* String
* Number
* JSON
* Array

Vuetility ensures that the provided value for a state variable matches with the type set for this variable through the **type** parameter before the corresponding state variable is actually updated.

## Security levels
* enforce
    * throw an Exception and halt execution
* log
    * simply log the error but allow writing of the value into the store
* off
    * don't log and accept every type of value thrown at a state variable

You can set the type security level either per component and/or globally.
Component type security level will always override the global security level.

Default global setting for type security is: **enforce**!

## Component security level

**Component type security level will always override the global security level.**
```javascript
beforeCreate() {
    this.$vuetility().init(['ModelA', 'ModelB']).typeSecurityLevel('enforce');
}};
```

## Global security level
```javascript
import {VuetilityComponent} from '@adelholtz/vuetility';
VuetilityComponent.typeSecurityLevel = 'off';
Vue.use(VuetilityComponent);
```

## Example log output
Example output in the console for security level: **enforce**
```javascript
Value type discrepancy detected:
Model: ModelA
Key: parameters
Expected Type: function Array() { [native code] }
Actual Type: function Object() { [native code] }
```
