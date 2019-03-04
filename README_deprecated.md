
This readme covers all Version before 0.4.0!

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

### Type Security <a href="#" name="security"></a>
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

### Model white/blackList  <a href="#" name="whitelist"></a>

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

### Usage with namespaced store modules <a href="#" name="namespaced"></a>
```javascript
    mixins: [
        new BasicComponent({
            model: new YourModel(),
            nameSpace: 'NameSpace'
        })
    ]
    // multiple models
    mixins: [
        new BasicComponent([{
            model: new YourModel(),
            nameSpace: 'NameSpace'
        },{
            model: new YourModel2(),
            nameSpace: 'NameSpace2'
        }])
    ]
```

### Model structure <a href="#" name="model"></a>

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

### Basic store <a href="#" name="store"></a>

To create a new instance of BasicStore, pass an instance of the model you want to use.
You can override stuff from the BasicStore in your local store.

Complete example implementation
```javascript
import {MyModel} from '@model/MyModel'; // model for the store and component
import {BasicStore} from '@adelholtz/vuetility';
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

### Basic Component <a href="#" name="store"></a>

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
