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
                    _.merge(computed, this.computed(preparedModel.model, preparedModel.nameSpace));
                }.bind(this)
            );
        } else {
            let preparedModel = this.prepare(modelObjects);
            computed = this.computed(preparedModel.model, preparedModel.nameSpace);
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
    computed(model, nameSpace) {
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
                    modelProperty,
                    nameSpace
                );
            }.bind(this)
        );

        return computed;
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

                if(nameSpace !== null){
                    basicComponent.store(this._self).commit(nameSpace+'/updateObject',{
                        state: modelName,
                        key: key,
                        value: checkedValue
                    });
                }else{
                    basicComponent.store(this._self).mutations.updateObject({
                        state: modelName,
                        key: key,
                        value: checkedValue
                    });
                }
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

                let checkedValue = basicComponent.checkValueTypeSecurity(
                    key,
                    modelName,
                    modelProperty,
                    newValue
                );

                if(nameSpace !== null){
                    basicComponent.store(this._self).commit(nameSpace+'/updateObject',{
                        state: modelName,
                        key: key,
                        value: checkedValue
                    });
                }else{
                    basicComponent.store(this._self).mutations.updateObject({
                        state: modelName,
                        key: key,
                        value: checkedValue
                    });
                }

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
        let basicComponent = this;
        let propertyValue;
        if(nameSpace !== null){
            propertyValue = _.get(
                basicComponent.store(context).state[nameSpace][modelName],
                key,
                false
            );
        }else{
            propertyValue = _.get(
                basicComponent.store(context).state[modelName],
                key,
                false
            );
        }
        if(propertyValue === false){
            propertyValue = (
                modelProperty.defaultValue !== undefined
                    ? basicComponent.setDefaultValue(modelName, key, modelProperty.defaultValue, context, nameSpace)
                    : ''
            );
        }
        if (typeof modelProperty.renderer === 'function') {
            propertyValue = modelProperty.renderer(propertyValue);
        }

        return propertyValue;
    }

    setDefaultValue(modelName, key, defaultValue, context, nameSpace){
        if(nameSpace !== null){
            this.store(this._self).commit(nameSpace+'/updateObject',{
                state: modelName,
                key: key,
                value: defaultValue
            });
        }else{
            this.store(context).mutations.updateObject({
                state: modelName,
                key: key,
                value: defaultValue
            });
        }
    }

    /**
     * Get Vue Component store
     * @param  VueComponent context
     * @return Vuex
     */
    store(context) {
        if (context.$store !== undefined) {
            return context.$store;
        } else if (context.$storeWrapper !== undefined) {
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
        let expectedInstance = new modelProperty.type();
        let typesAreMatching = false;

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
