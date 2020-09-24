export default class BasicStore {
    /**
     *
     * @param Array/Object modelObjects Object or Array of objects
     * @return Object
     */
    constructor(modelObjects, nameSpace = false) {
        let state = {}

        state = this.state(modelObjects.basicModel(), nameSpace)

        this.mutationTypes = {
            UPDATE_STATE_BY_MODEL: 'vuet-updateStateByModel',
            UPDATE_OBJECT_DEPRECATED: 'updateObject',
            UPDATE_STATE_VARIABLE: 'vuet-updateModel',
            RESET_MODEL: 'vuet-resetModel',
        }

        let skeleton = {
            mutationTypes: this.mutationTypes,
            state,
            mutations: this.mutations(),
        }

        if (nameSpace) {
            skeleton['getters'] = this.getters(nameSpace)
        }

        return skeleton
    }

    update(state, updateProperties) {
        // block null updates
        if (updateProperties.data === null) {
            return
        }

        if (updateProperties.key) {
            state[updateProperties.model] = Object.assign(
                {},
                state[updateProperties.model],
                {
                    [updateProperties.key]: updateProperties.data,
                }
            )

            return
        }

        for (let [key, value] of Object.entries(updateProperties.data)) {
            state[updateProperties.model] = Object.assign(
                {},
                state[updateProperties.model],
                {
                    [key]: value,
                }
            )
        }
    }

    getters(nameSpace) {
        return {
            [nameSpace](state) {
                return state[nameSpace]
            },
        }
    }

    /**
     * mutations needed to work in tandem with basicComponent
     * to enable reactivity
     *
     * @return Vuex.mutations
     */
    mutations() {
        let basicStore = this

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
            [this.mutationTypes.UPDATE_OBJECT_DEPRECATED](
                state,
                updateProperties
            ) {
                if (updateProperties.value === null) {
                    return
                }
                basicStore.update(state, {
                    model: updateProperties.state,
                    key: updateProperties.key,
                    data: updateProperties.value,
                })
            },
            /**
             * @param  Vuex.sate state
             * @param  JSON updateProperties
             * {
             *  model: '', // the model to update
             *  key: 'updateKey' // obligatory key; if given the key will be update in model
             *  data: mixed // if no key is given; data has to be JSON and has to resemble the model you want to update
             * }
             */
            [this.mutationTypes.UPDATE_STATE_BY_MODEL](
                state,
                updateProperties
            ) {
                basicStore.update(state, updateProperties)
            },
            /**
             * @param  Vuex.sate state
             * @param  JSON updateProperties
             * {
             *  state: 'stateKey', // the actual state JSON variable to be modified
             *  value: 'updateValue'
             * }
             */
            [this.mutationTypes.UPDATE_STATE_VARIABLE](
                state,
                updateProperties
            ) {
                state[updateProperties.state] = updateProperties.value
            },
            /**
             * Resets a model to its initial/default values
             *
             * @param  Vuex.sate state
             * @param String modelName
             */
            [this.mutationTypes.RESET_MODEL](state, modelName) {
                let modelDefinition = state[modelName + 'Definition']

                for (let [key, value] of Object.entries(modelDefinition)) {
                    state[modelName][key] = value.defaultValue
                }
            },
        }
    }

    /**
     * generate state variables
     *
     * @param  Object model
     * @param  String modelName
     * @return Vuex.state
     */
    state(model, modelName) {
        let state = {}
        state[modelName] = {}
        state[modelName + 'Definition'] = model
        for (let [key, value] of Object.entries(model)) {
            let initialValue = undefined
            if (value.type === JSON) {
                initialValue = {}
            }
            if (value.defaultValue !== undefined) {
                initialValue = value.defaultValue
            }
            state[modelName][key] = initialValue
        }
        return state
    }
}
