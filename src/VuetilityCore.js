import TypeSecurity from './TypeSecurity.js';

export default class VuetilityCore {

    constructor(componentScope){
        this.componentScope = componentScope;
    }

    init(modules = false){
        let computed = {};
        if(!modules){
            return;
        }
        modules.forEach((module) => {
            let storeModule = this.componentScope.$store._modules.root._children[module];
            if(storeModule !== undefined){
                if(storeModule._rawModule.storeModels !== undefined){
                    storeModule._rawModule.storeModels.forEach((storeModel) => {
                        let modelProperties = this.componentScope.$store.state[module][storeModel+'Definition'];
                        computed = this.computed(modelProperties, storeModel, module);
                    });
                }
            }

            if(this.componentScope.$options.computed === undefined){
                this.componentScope.$options.computed = {};
            }
            _.merge(this.componentScope.$options.computed, computed);
        });
    }

    /**
     * Iterate through all model properties and
     * create computed 'variables' for every single one
     *
     * @param  Object model
     * @return Object
     */
    computed(modelProperties, modelName, nameSpace = false) {
        let computed = {};
        _.each(
            modelProperties,
            function(modelProperty, key) {
                let type = _.get(modelProperty, 'computedType', 'default');
                computed[key] = this[type + 'Computed'].call(
                    this,
                    key,
                    modelName,
                    modelProperty,
                    nameSpace
                );
            }.bind(this)
        );

        return computed;
    }

    /**
     * commit new value to corresponding store (namespaced or plain)
     *
     * @param  BasicComponent basicComponent [operational scope]
     * @param  JSON updateObject
     *      structure: {
     *          state: modelName,
     *          key: key,
     *          value: checkedValue
     *        }
     */
    commitToStore(basicComponent, updateObject, context, nameSpace){
        context = context || this._self;
        if(!_.isEmpty(nameSpace)){
            basicComponent.store(context).commit(nameSpace+'/updateObject', updateObject);
        }else{
            basicComponent.store(context).mutations.updateObject(updateObject);
        }
    }

    /**
     * Basic computed for select fields;
     * get() returns JSON instead of a single value
     *
     * @param  String key
     * @param  String modelName
     * @param  Object modelProperty
     * @return Object
     */
    selectComputed(key, modelName, modelProperty, nameSpace) {
        let basicComponent = this;
        return {
            get() {
                return {
                    text: basicComponent.propertyValue(
                        this,
                        key,
                        modelName,
                        modelProperty,
                        nameSpace
                    ),
                    value: basicComponent.propertyValue(
                        this,
                        key,
                        modelName,
                        modelProperty,
                        nameSpace
                    )
                };
            },
            set(newValue) {
                if (newValue === null) {
                    return;
                }

                let checkedValue = TypeSecurity.checkValueTypeSecurity(
                    key,
                    modelName,
                    modelProperty,
                    newValue
                );

                basicComponent.commitToStore(basicComponent,{
                    state: modelName,
                    key: key,
                    value: checkedValue,
                    nameSpace
                }, this._self);
            }
        };
    }

    /**
     * Very basic computed for default values like String, Number ect.
     * get() returns single value
     *
     * @param  String key
     * @param  String modelName
     * @param  Object modelProperty
     * @return Object
     */
    defaultComputed(key, modelName, modelProperty, nameSpace) {
        let basicComponent = this;
        return {
            get() {
                return basicComponent.propertyValue(
                    this,
                    key,
                    modelName,
                    modelProperty,
                    nameSpace
                );
            },
            set(newValue) {
                if (newValue === null) {
                    return;
                }

                let checkedValue = TypeSecurity.checkValueTypeSecurity(
                    key,
                    modelName,
                    modelProperty,
                    newValue
                );

                basicComponent.commitToStore(basicComponent,{
                    state: modelName,
                    key: key,
                    value: checkedValue,
                    nameSpace
                }, this._self);
            }
        };
    }

    /**
     * Get correctly rendered propertyValue;
     * get default value if propertyValue is empty and
     * a default value has been set
     *
     * @param  VueComponent context
     * @param  string key
     * @param  string modelName
     * @param  Object modelProperty
     * @return string
     */
    propertyValue(context, key, modelName, modelProperty, nameSpace) {
        let propertyValue;
        if(!_.isEmpty(nameSpace)){
            propertyValue = _.get(
                this.store(context).state[nameSpace][modelName],
                key,
                false
            );
        }else{
            propertyValue = _.get(
                this.store(context).state[modelName],
                key,
                false
            );
        }

        if(propertyValue === false){
            if(modelProperty.defaultValue !== undefined){
                this.commitToStore(this, {
                    state: modelName,
                    key: key,
                    value: modelProperty.defaultValue
                }, context);
                propertyValue = modelProperty.defaultValue;

            }else{
                if(modelProperty.type === JSON){
                    propertyValue = {};
                }else{
                    propertyValue = modelProperty.type();
                }
            }
        }

        TypeSecurity.checkValueTypeSecurity(
            key,
            modelName,
            modelProperty,
            propertyValue
        );

        if (typeof modelProperty.renderer === 'function') {
            propertyValue = modelProperty.renderer(propertyValue);
        }

        return propertyValue;
    }

    /**
     * Get Vue Component store
     * @param  VueComponent context
     * @return Vuex
     */
    store(context) {
        if (!_.isEmpty(context.$store)) {
            return context.$store;
        } else if (!_.isEmpty(context.$storeWrapper)) {
            return context.$storeWrapper;
        }

        throw 'BasicComponent Error: Could not find a valid store!';
    }

}
