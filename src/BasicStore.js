/* global _ */

export default class BasicStore{

    /**
     *
     * @param Array/Object modelObjects Object or Array of objects
     * @return Object
     */
    constructor(modelObjects, nameSpace = false){
        let state = {};

        state = this.state(modelObjects.basicModel(), nameSpace);

        this.mutationTypes = {
            UPDATE_STATE_BY_MODEL: 'vuet-updateStateByModel',
            UPDATE_OBJECT_DEPRECATED: 'updateObject',
            UPDATE_STATE_VARIABLE: 'vuet-updateModel'
        };

        return {
            mutationTypes: this.mutationTypes,
            state,
            mutations: this.mutations()
        };
    }

    update(state, updateProperties){
        // block null updates
        if(updateProperties.data === null){
            return;
        }

        if(updateProperties.key){
            state[updateProperties.model] = Object.assign({}, state[updateProperties.model], {
                [updateProperties.key]: updateProperties.data
            });

            return;
        }
        _.each(updateProperties.data, (value, key) => {
            state[updateProperties.model] = Object.assign({}, state[updateProperties.model], {
                [key]: value
            });
        });
    }

    /**
     * mutations needed to work in tandem with basicComponent
     * to enable reactivity
     *
     * @return Vuex.mutations
     */
    mutations() {
        let basicStore = this;

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
             * @deprecated use vuet-updateStateByModel instead!
             */
            [this.mutationTypes.UPDATE_OBJECT_DEPRECATED](state, updateProperties) {
                if(updateProperties.value === null){
                    return;
                }
                basicStore.update(state, {
                    model: updateProperties.state,
                    key: updateProperties.key,
                    data: updateProperties.value
                });
            },
            /**
             * [updateStateByModel description]
             * @param  Vuex.sate state
             * @param  JSON updateProperties
             * {
             *  model: '', // the model to update
             *  key: 'updateKey' // obligatory key; if given the key will be update in model
             *  data: mixed // if no key is given; data has to be JSON and has to resemble the model you want to update
             * }
             */
            [this.mutationTypes.UPDATE_STATE_BY_MODEL](state, updateProperties) {
                basicStore.update(state, updateProperties);
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
