/* global _ */
export default class TypeSecurity{

    static setTypeSecurityLevel(typeSecurityLevel) {
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
     * Check if the actual type of value is matching the expected type of value
     *
     * @param  string key
     * @param  string modelName
     * @param  Object modelProperty
     * @param  string value
     * @returns Number/String/Boolean
     * @throws Error Message
     */
    static checkValueTypeSecurity(key, modelName, modelProperty, value) {

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
        if (expectedInstance instanceof Array) {
            typesAreMatching = _.isArray(value);
        }
        if (expectedInstance instanceof Boolean) {
            typesAreMatching = _.isBoolean(value);
            if (!typesAreMatching) {
                if(value==='true'){
                    value = true;
                    typesAreMatching = true;
                }else if(value==='false'){
                    value = false;
                    typesAreMatching = true;
                }else if(value === 0){
                    value = false;
                    typesAreMatching = true;
                }else if(value === 1){
                    value = true;
                    typesAreMatching = true;
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
                TypeSecurity.getActualTypeOfValue(value, modelProperty.type);

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
    static getActualTypeOfValue(value) {
        try {
            if(_.isBoolean(value)){
                return Boolean;
            }
            if(_.isString(value)){
                return String;
            }
            if(_.isArray(value)){
                return Array;
            }
            if(value === {}){
                return JSON;
            }
            if(_.isObject(value)){
                return Object;
            }
            if(_.isNumber(value)){
                return Number;
            }

        } catch (Exception) {
            return typeof value;
        }
    }
}
