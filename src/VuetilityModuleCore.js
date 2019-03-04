/* global _ */
import TypeSecurity from './TypeSecurity.js';

export default class VuetilityModuleCore {

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
     * @param String modelName
     * @param nameSpace
     * @return Object
     */
    computed(modelProperties, modelName, nameSpace) {
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

    computedSetter(basicComponent, newValue, key, modelName, modelProperty, nameSpace){
        if (newValue === null) {
            return;
        }

        let checkedValue = TypeSecurity.checkValueTypeSecurity(
            key,
            modelName,
            modelProperty,
            newValue
        );

        basicComponent.componentScope.$store.commit(nameSpace+'/updateObject', {
            state: modelName,
            key: key,
            value: checkedValue,
            nameSpace
        });
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
        if(!_.isEmpty(nameSpace)){
            propertyValue = _.get(
                this.componentScope.$store.state[nameSpace][modelName],
                key,
                false
            );
        }else{
            propertyValue = _.get(
                this.componentScope.$store.state[modelName],
                key,
                false
            );
        }

        if(propertyValue === false){
            if(modelProperty.defaultValue !== undefined){
                this.componentScope.$store.commit(nameSpace+'/updateObject', {
                    state: modelName,
                    key: key,
                    value: modelProperty.defaultValue,
                    nameSpace
                });
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


}
