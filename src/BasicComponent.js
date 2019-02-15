/* global _ */

export default class BasicComponent {
    /**
     * Returns basic VueComponent structure
     * {
     *      computed: {}
     * }
     *
     * @param Array/Object modelObjects // can either be an array of objects or a single object
     * @param string typeSecurityLevel // can be log or off
     * @return Object
     */
    constructor(modelObjects, typeSecurityLevel = null) {
        this.setTypeSecurityLevel(typeSecurityLevel);

        let computed = {};

        if (_.isArray(modelObjects)) {
            _.each(
                modelObjects,
                function(modelObject) {
                    let preparedModel = this.prepare(modelObject);
                    this.nameSpace = preparedModel.nameSpace;
                    _.merge(computed, this.computed(preparedModel.model));
                }.bind(this)
            );
        } else {
            let preparedModel = this.prepare(modelObjects);
            this.nameSpace = preparedModel.nameSpace;
            computed = this.computed(preparedModel.model);
        }

        return {
            computed
        };
    }

    prepare(modelObjects){
        let model, nameSpace;
        if(typeof modelObjects.model !== 'function'){
            model = modelObjects.model;
        }else{
            model = modelObjects;
        }
        if(modelObjects.nameSpace){
            nameSpace = modelObjects.nameSpace;
        }

        return {
            model, nameSpace
        };
    }

    setTypeSecurityLevel(typeSecurityLevel) {
        this.logTypeSecurityError = false;
        this.enforceTypeSecurity = true;
        if (typeSecurityLevel === 'log') {
            this.logTypeSecurityError = true;
            this.enforceTypeSecurity = false;
        }
        if (typeSecurityLevel === 'off') {
            this.logTypeSecurityError = false;
            this.enforceTypeSecurity = false;
        }
    }

    /**
     * Iterate through all model properties and
     * create computed 'variables' for every single one
     *
     * @param  Object model
     * @return Object
     */
    computed(model) {
        let modelName = model.name();
        let modelProperties = model.basicModel();
        let computed = {};
        _.each(
            modelProperties,
            function(modelProperty, key) {
                let type = _.get(modelProperty, 'computedType', 'default');
                computed[key] = eval('this.' + type + 'Computed').call(
                    this,
                    key,
                    modelName,
                    modelProperty
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
    commitToStore(basicComponent, updateObject, context){
        context = context || this._self;
        if(!_.isEmpty(basicComponent.nameSpace)){
            basicComponent.store(context).commit(basicComponent.nameSpace+'/updateObject', updateObject);
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
    selectComputed(key, modelName, modelProperty) {
        let basicComponent = this;
        return {
            get() {
                return {
                    text: basicComponent.propertyValue(
                        this,
                        key,
                        modelName,
                        modelProperty
                    ),
                    value: basicComponent.propertyValue(
                        this,
                        key,
                        modelName,
                        modelProperty
                    )
                };
            },
            set(newValue) {
                if (newValue === null) {
                    return;
                }

                let checkedValue = basicComponent.checkValueTypeSecurity(
                    key,
                    modelName,
                    modelProperty,
                    newValue
                );

                basicComponent.commitToStore(basicComponent,{
                    state: modelName,
                    key: key,
                    value: checkedValue
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
    defaultComputed(key, modelName, modelProperty) {
        let basicComponent = this;
        return {
            get() {
                return basicComponent.propertyValue(
                    this,
                    key,
                    modelName,
                    modelProperty
                );
            },
            set(newValue) {
                if (newValue === null) {
                    return;
                }
                let checkedValue = basicComponent.checkValueTypeSecurity(
                    key,
                    modelName,
                    modelProperty,
                    newValue
                );

                basicComponent.commitToStore(basicComponent,{
                    state: modelName,
                    key: key,
                    value: checkedValue
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
    propertyValue(context, key, modelName, modelProperty) {
        let propertyValue;
        if(!_.isEmpty(this.nameSpace)){
            propertyValue = _.get(
                this.store(context).state[this.nameSpace][modelName],
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

        this.checkValueTypeSecurity(
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

    /**
     * Check if the actual type of value is matching the expected type of value
     *
     * @param  string key
     * @param  string modelName
     * @param  Object modelProperty
     * @param  string value
     * @returns Number/String/Boolean
     * @throws Error Message
     */
    checkValueTypeSecurity(key, modelName, modelProperty, value) {
        let expectedInstance;
        if(modelProperty.type === JSON){
            expectedInstance = JSON;
        }else{
            expectedInstance = new modelProperty.type();
        }

        let typesAreMatching = false;

        if(expectedInstance instanceof Object){
            typesAreMatching = _.isObject(value);
        }

        if (expectedInstance instanceof Number) {
            typesAreMatching = _.isNumber(value);
            if (!typesAreMatching) {
                if(value.match(/^\d+\.\d+$/) !== null){
                    value = Number.parseFloat(value);
                }else{
                    value = Number.parseInt(value);
                }
                typesAreMatching = _.isNumber(value);
            }
        }
        if (expectedInstance instanceof String) {
            typesAreMatching = _.isString(value);
        }
        if (expectedInstance instanceof String) {
            typesAreMatching = _.isString(value);
        }
        if (expectedInstance instanceof Boolean) {
            typesAreMatching = _.isBoolean(value);
            if (!typesAreMatching) {
                if(value==='true'){
                    value = true;
                }else if(value==='false'){
                    value = false;
                }else if(value === 0){
                    value = false;
                }else if(value === 1){
                    value = true;
                }
            }
        }

        if (!typesAreMatching) {
            let errorMessage =
                '\nValue type discrepancy detected:\n' +
                'Model: ' +
                modelName +
                '\n' +
                'Key: ' +
                key +
                '\n' +
                'Expected Type: ' +
                modelProperty.type +
                '\n' +
                'Actual Type: ' +
                this.getActualTypeOfValue(value);

            if (this.enforceTypeSecurity) {
                throw errorMessage;
            } else if (this.logTypeSecurityError) {
                console.log(errorMessage);
            }
        }
        return value;
    }

    /**
     * [getActualTypoOfValue description]
     * @param  string value
     * @return string/String/Number/Object ...
     */
    getActualTypeOfValue(value) {
        try {
            return eval(
                (typeof value).charAt(0).toUpperCase() + (typeof value).slice(1)
            );
        } catch (Exception) {
            return typeof value;
        }
    }
}
