import TypeSecurity from './TypeSecurity.js';
import _ from "lodash";

export default class Vuetilitycore {
    constructor(componentScope, typeSecurityLevel) {
        this.componentScope = componentScope;
        this.typeSecurityLevel(typeSecurityLevel);
    }

    typeSecurityLevel(level) {
        console.log(level);
        TypeSecurity.setTypeSecurityLevel(level);
    }

    /**
     * Iterate through all model properties and
     * create computed 'variables' for every single one
     *
     * @param  Object model
     * @param String modelName
     * @param nameSpace
     * @return Object
     */
    computed(modelProperties, modelName, nameSpace = null) {
        let computed = {};
        _.each(
            modelProperties,
            function (modelProperty, key) {
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
                        key,
                        modelName,
                        modelProperty,
                        nameSpace
                    ),
                    value: basicComponent.propertyValue(
                        key,
                        modelName,
                        modelProperty,
                        nameSpace
                    )
                };
            },
            set(newValue) {
                basicComponent.computedSetter(basicComponent, newValue, key, modelName, modelProperty, nameSpace);
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
                    key,
                    modelName,
                    modelProperty,
                    nameSpace
                );
            },
            set(newValue) {
                basicComponent.computedSetter(basicComponent, newValue, key, modelName, modelProperty, nameSpace);
            }
        };
    }

    computedSetter(basicComponent, newValue, key, modelName, modelProperty, nameSpace) {
        if (newValue === null) {
            return;
        }

        let checkedValue = TypeSecurity.checkValueTypeSecurity(
            key,
            modelName,
            modelProperty,
            newValue
        );



        basicComponent.componentScope.$store.commit(this.mutationName(nameSpace), {
            model: modelName,
            key,
            data: checkedValue
        });
    }

    mutationName(nameSpace) {
        let mutation = 'vuet-updateStateByModel';
        if (nameSpace !== null) {
            mutation = nameSpace + '/vuet-updateStateByModel';
        }

        return mutation;
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
    propertyValue(key, modelName, modelProperty, nameSpace) {
        let propertyValue;
        let propertyPath = ['state', modelName, key].join('.');
        if (!_.isEmpty(nameSpace)) {
            propertyPath = ['state', nameSpace, modelName, key].join('.');
        }

        propertyValue = _.get(
            this.componentScope.$store,
            propertyPath,
            false
        );

        if (propertyValue === false) {
            if (modelProperty.defaultValue !== undefined) {
                this.componentScope.$store.commit(this.mutationName(nameSpace), {
                    model: modelName,
                    key: key,
                    data: modelProperty.defaultValue
                });
                propertyValue = modelProperty.defaultValue;

            } else {
                if (modelProperty.type === JSON) {
                    propertyValue = {};
                } else {
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

}