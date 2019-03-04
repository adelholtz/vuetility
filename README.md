# Vuetility

1. [Todo](#todo)
2. [Prerequsisits](#rerequsisits)
3. [Latest version](#version)
4. [Installation](#installation)
5. [Introduction](#introduction)
6. [Usage](#usage)
7. [Updating state variables](#updating)


## TODO <a href="#" name="todo"></a>
* finish refactor

## Prerequsisits <a href="#" name="rerequsisits"></a>

* Vue [vuejs.org]
* Vuex [vuex.vuejs.org]
* ...and a basic understanding of how both of these work (together)

## Latest version <a href="#" name="version"></a>

0.4.0
* complete rewrite of the core concept!
* vuetility is now a Vue Plugin
* code is more lean and adaptable for future changes
* this version is **not compatible** with earlier versions and if you want to upgrade you will have to do a rewrite of your component structure by following the [Usage](#usage) instructions below


## Installation <a href="#" name="rerequsisits"></a>

```
npm install @adelholtz/Vuetility

yarn add @adelholtz/Vuetility

```


## Introduction <a href="#" name="introduction"></a>

Contains basic logic for generic (Vuex)store and (Vue)component usage, by auto-generating (Vue)computed properties and (Vuex)state variables from provided models.

__The model can/must also contain:__
* a renderer per property.
* default values
* exact type definitions (String, Boolean etc.)

__Project Goals:__
* no need to write any computed properties for your models properties in your custom component
* no need to write code in your store that handles the update/setting process of model data
* support of multiple models per store/component

Please let me know if the usage instructions and example are unclear in any way and should be improved!

## Example of a model

```
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
Available types:
* String
* Number
* JSON
* Array

Avalailable options for a model property:
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

Example:
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
## Usage <a href="#" name="usage"></a>
Find an example implementation in the **example** folder.

Vuetility is consisting of two parts:
* a VueX part which enhances the VueX base and ass state variables to your stores
* a Vue Component part wich enables you to grab the value of state variables from your stores through computed variables

So how do we set it up?

Actually its not much work. Lets go through a basic setup example!

First of all, when setting up a namespaced VueX Store would do something like this:

```
// see also https://vuex.vuejs.org/guide/modules.html for more information
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    a: StoreModuleA,
    b: StoreModuleB
  }
});
```
When using vuetility this gets replaced with:

```
import {Vuetility} from '@adelholtz/vuetility';

Vue.use(Vuex);

const vuetility = new Vuetility([
    {StoreModuleA, ModelA},
    {StoreModuleB, ModelB},
    {StoreModuleC, ModelA, ModelB},
    {StoreModuleD},
]);
```
This will leave you with a state store structure like:
* state
    * 'StoreModuleA'
        * 'ModelA'

![alt text](https://raw.githubusercontent.com/adelholtz/vuetility/master/docs/img/state_structure.png "Example Structure")

Indepth analysis of the first array entry:
* StoreModuleA
    * the actual store module
    * this has **always** to be the first entity given in a description object
* ModelA
    * the model you want to connect to the store given as first parameter
    * please note, that the number of models you can pass is not limited in any way, this also means that you do not need to pass in a model at all if you don't want to or don't need to, or you could pass multiple models at once

Next we have to tell Vue itself that it should use **vuetility**.

Vuetility is a Vue Plugin and must be registered accordingly:
```
import {VuetilityComponent} from '@adelholtz/vuetility';
Vue.use(VuetilityComponent);
```

**And the last step:**

In the component you want to use automatically generated computed properties you
have to call the **init** method of **$vuetility** before the actual component gets created.
This basically means you have to call in the **beforeCreate** method of your Vue Component:
```
export default {
    beforeCreate() {
        this.$vuetility().init(['StoreModuleA']);
    },
    data(){
        return {}
    }
}
```
The init method only accepts and array of **store/module names**!
This means you have to pass in the **exact name** of a **store/module** you want to use.
In the first stept we defined:
```
{StoreModuleA, ModelA},
{StoreModuleB, ModelB},
```
StoreModuleA and StoreModuleB are the **exact names** you are supposed to pass the init method through the config array. Like so:
```
this.$vuetility().init(['StoreModuleA']);
// or if you want to use both
this.$vuetility().init(['StoreModuleA','StoreModuleB']);
```

Find instructions for Version 0.3.3 and below here: README_deprecated.md
Version 0.3.4 is broken and should not be used!


## Updating state variables <a href="#" name="updating"></a>
```
context.commit('updateObject', {
    state: 'ModelA',
    key: propertyNameOfModelA,
    value: value
});
```
