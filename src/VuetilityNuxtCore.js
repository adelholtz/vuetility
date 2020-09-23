import _ from 'lodash'
import VuetilityCore from './VuetilityCore.js'

export default class VuetilityNuxtCore extends VuetilityCore {
    constructor(componentScope, typeSecurityLevel) {
        super(componentScope, typeSecurityLevel)
    }

    init(models = false) {
        let computed = {}
        _.each(this.componentScope.$store.state, (moduleState, moduleName) => {
            let isPresent = false
            let modelsAsComputed = 'all'

            // special handling for Models that should be used as computed
            // this.$vuetility.init(['Module, ExclusiveModel'])
            // exclusivemodels will be the only models used to generate computed variables
            if (models) {
                models.forEach(model => {
                    if (isPresent) {
                        return
                    }
                    let regex = new RegExp('^(' + moduleName + ')(,)?(.*)?')
                    let matches = model.match(regex)

                    if (matches !== null) {
                        if (matches[3] && typeof matches[3] === 'string')
                            modelsAsComputed = matches[3].split(',')
                        isPresent = true
                    }
                })
            }

            if (typeof moduleState !== 'object' || !isPresent) {
                return
            }
            if (_.isEmpty(moduleState.models)) {
                return
            }

            _.each(moduleState.models, modelName => {
                if (
                    modelsAsComputed !== 'all' &&
                    !modelsAsComputed.includes(modelName)
                ) {
                    return
                }
                let modelProperties = moduleState[modelName + 'Definition']

                if (_.isEmpty(modelProperties)) {
                    return
                }

                computed = this.computed(
                    modelProperties,
                    modelName,
                    moduleName,
                    moduleState.uniqueModels &&
                        moduleState.uniqueModels.includes(modelName)
                )

                if (this.componentScope.$options.computed === undefined) {
                    this.componentScope.$options.computed = {}
                }

                _.merge(computed, this.componentScope.$options.computed)

                this.componentScope.$options.computed = computed
            })
        })

        return this
    }
}
