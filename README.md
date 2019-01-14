# Vuetility

## TODO
* get rid of the need for a constructor in the custom models
* tests
* improve readme
* add an example for namespaced vuex stores
* allow collection of models per store

## Prerequsisits

* Vue [vuejs.org]
* Vuex [vuex.vuejs.org]
* ...and a basic understanding of how both of these work (together)

## Introduction

Contains basic logic for generic (Vuex)store and (Vue)component usage, by auto-generating (Vue)computed properties and (Vuex)state variables from provided models.

__The model can/must also contain:__
* a renderer per property.
* default values
* exact type definitions (String, Boolean etc.)

__Project Goals:__
* no need to write any computed properties for your models properties in your custom component
* no need to write code in your store that handles the update/setting process of model data
* support of multiple models per store/component

## Usage

1. create  a Model; => see 'Model Structure' for more Information
2. create a VueComponent
3. connect the BasicComponent to your VueComponent via mixins
    * pass an instance of the model you created in step 1 to BasicComponent
    ```javascript
        mixins: [
            new BasicComponent(new YourModel())
        ]
        //alternativ
        mixins: [
            new BasicComponent([new YourModel(), new YourModel2()])
        ]
    ```
4. create a Vuex store
    * create a new instance of Basicstore and pass an instance of the model you created in step 1
    ```javascript
        const basicStore = new BasicStore(new YourModel());
    ```
    * merge the BasicStore into your Vuex store and export it like you normally would
    ```javascript
        export default _.merge({
        mutationTypes,
        actionTypes,
        state,
        getters,
        mutations,
        actions
        }, basicStore)
    ```

### Type Security
When instantiating your your mixin inside your custom component you can set the desired
'type security' level.
```javascript
mixins: [
    new BasicComponent(new YourModel(), typeSecurityLevel) // typeSecurityLevel is optional
],
```

By default 'type security' is set to 'enforce' which means you will get an error if you try to set
a modelProperty value to a type other than what you configured for this modelProperty.

Example error output:
```javascript
Value type discrepancy detected:
Model: YourModel
Key: id
Expected Type: function Number() { [native code] }
Actual Type: function String() { [native code] }
```

Available typeSecurityLevels:
* off: completey disable type security features (no log, no errors)
* log: only output errors into the console but ignore them otherwise

### Model white/blackList

Attention: whiteList > blackList (always!!)

* whiteList: explicitly only use properties defined in this list
* blackList: explicitly filter out properties defined in this list and use only the rest

whiteList and blackList can be passed at the same time.
```javascript
    // store
    const basicStore = new BasicStore(new YourModel({
        whiteList: ['propertyA', 'propertyB']
    }));

    const basicStore = new BasicStore(new YourModel({
        whiteList: ['propertyA', 'propertyB'],
        blackList: ['properyC']
    }));

    // component
    mixins: [
        new BasicComponent(new YourModel({
            whiteList: ['propertyA', 'propertyB'],
            blackList: ['properyC']
        }))
    ]
```

### Model structure

* type: String, Number, Object, JSON ect.
    * mandatory
* computedType
    * available types:
        * default: returns the plain value
        * select: returns {text: '', value''}
    * optional
    * if nothing is given 'default' will be taken
* defaultValue
    * optional
    * set to anything other than undefined if a property should have a default value  
    * value has to follow the type set through the 'type' option  
* renderer
    * optional
    * this is a function
    * used to render the value if it needs to be displayed/prepared in a certain way
    * for example: renderer(string){return string.toLowerCase();}

```javascript
export class MyModel{

    // this is mandatory for every model
    // because we can't rely on constructor.name in production mode
    name(){
        return 'MyModel';
    }

    constructor(config = {}){
        _.merge(this, new BasicModel(config));
    }

    model(){  
        return {
            'id': {
                type: Number,
                defaultValue: undefined
            },
            'adopt_expiration': {
                type: String,
                computedType: 'select'
                defaultValue: undefined
            },
            'auth_info_reg': {
                type: Number,
                computedType: 'default',
                defaultValue: undefined,
                renderer(value){
                    return value.toUpperCase();
                }
            },
        }
    }

}

```

### Basic store

To create a new instance of BasicStore, pass an instance of the model you want to use.
You can override stuff from the BasicStore in your local store.

Complete example implementation
```javascript
import {MyModel} from '@model/MyModel'; // model for the store and component
import {BasicStore} from 'adelholtz/vuetility';
const basicStore = new BasicStore(new MyModel());

export default _.merge({
    mutationTypes,
    actionTypes,
    state,
    getters,
    mutations,
    actions
}, basicStore);
```

### Basic Component

you can define as many computed and or methods ect as you like;
the BasicComponent will be merged into your component.
You can override stuff from the BasicComponent in your local component.

BasicComponent gives you a predefined method to update the model Data:  __mutations.updateObject__
* state
    * mandatory
    * this is basically the name of your model
* key
    * mandatory
    * the model property you want to update
* value
    * mandatory
    * the value you want to set for key
    ```javascript
        this.$store.mutations.updateObject({
            state: 'MyModel',
            key: key,
            value: value
        });
    ```

BasicComponent also comes with a predefined method to update the complete model: __mutation.updateStateVariable__
* state
    * mandatory
    * this is basically the name of your model
* value
    * mandatory
    * the value you want to set for key
    ```javascript
        this.$store.mutations.updateStateVariable({
            state: 'MyModel',
            value: value
        });
    ```

Complete example implementation

```javascript
import {MyModel} from '@model/MyModel';
import {BasicComponent} from '@adelholtz/vuetility';

export default {
    name: 'component Name',
    mixins: [
        new BasicComponent(new MyModel())
    ]
    methods: {
        update(){
            this.$store.mutations.updateObject({
                state: 'MyModel',
                key: key,
                value: value
            });
        }
    }
    // rest of the Vue Component

}
```
Attention: you do not need to include the update() method in your custom component, this is only meant as an example of how you could handle local updates of model data in your component if you absolutely have to.
