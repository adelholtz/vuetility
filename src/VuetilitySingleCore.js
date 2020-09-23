/* global _ */
import VuetilityCore from './VuetilityCore.js'

export default class VuetilitySingleCore extends VuetilityCore {
    constructor(componentScope, typeSecurityLevel) {
        super(componentScope, typeSecurityLevel)
    }

    init() {
        let computed = {}
        this.componentScope.$store.state.models.map(modelName => {
            let modelProperties = this.componentScope.$store.state[
                modelName + 'Definition'
            ]
            computed = this.computed(modelProperties, modelName)

            if (this.componentScope.$options.computed === undefined) {
                this.componentScope.$options.computed = {}
            }
            _.merge(computed, this.componentScope.$options.computed)
            this.componentScope.$options.computed = computed
        })

        return this
    }
}
