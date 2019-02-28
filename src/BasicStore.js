/* global _ */

export default class BasicStore{

    /**
     *
     * @param Array/Object modelObjects Object or Array of objects
     * @return Object
     */
    constructor(modelObjects){
        let state = {};
        if(_.isArray(modelObjects)){
            _.each(modelObjects, function(modelObject){
                _.merge(state, this.state(modelObject.basicModel(), modelObject.name()));
            }.bind(this));
        }else{
            state = this.state(modelObjects.basicModel(), modelObjects.name());
        }

        this.mutationTypes = {
            UPDATE_OBJECT: 'updateObject',
            UPDATE_STATE_VARIABLE: 'updateStateVariable'
        };

        return {
            mutationTypes: this.mutationTypes,
            state,
            mutations: this.mutations()
        };
    }

    /**
     * mutations needed to work in tandem with basicComponent
     * to enable reactivity
     *
     * @return Vuex.mutations
     */
    mutations() {
        return {
            /**
             * [updateObject description]
             * @param  Vuex.sate state
             * @param  JSON updateProperties
             * {
             *  state: 'stateKey', // the actual state JSON variable to be modified
             *  key: 'updateKey' // key from the JSON state variable to be modified
             *  value: 'updateValue'
             * }
             */
            [this.mutationTypes.UPDATE_OBJECT](state, updateProperties) {
                // block null updates
                if(updateProperties.value === null){
                    return;
                }
                state[updateProperties.state] = Object.assign({}, state[updateProperties.state], {
                    [updateProperties.key]: updateProperties.value
                });
            },
            /**
             * [updateObject description]
             * @param  Vuex.sate state
             * @param  JSON updateProperties
             * {
             *  state: 'stateKey', // the actual state JSON variable to be modified
             *  value: 'updateValue'
             * }
             */
            [this.mutationTypes.UPDATE_STATE_VARIABLE](state, updateProperties) {
                state[updateProperties.state] = updateProperties.value;
            }
        };
    }

    /**
     * generate state variables
     *
     * @param  Object model
     * @param  String modelName
     * @return Vuex.state
     */
    state(model, modelName){
        let state = {};
        state[modelName] = {};
        state[modelName+'Definition'] = model;
        _.each(model, function(definition, key){
            let value = undefined;
            if(definition.type === JSON){
                value = {};
            }
            if(definition.defaultValue !== undefined){
                value = definition.defaultValue;
            }
            state[modelName][key] = value;
        });
        return state;
    }
}
