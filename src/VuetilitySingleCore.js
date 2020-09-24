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

            this.componentScope.$options.methods = _.merge(
                {
                    updateState(v) {
                        let path = v.srcElement.attributes[
                            'vuet-path'
                        ].value.split('.')
                        this.$store.commit('vuet-updateStateByModel', {
                            model: path[0],
                            data: Object.assign(this[path[0]], {
                                [path[1]]: v.srcElement.value,
                            }),
                        })
                    },
                },
                this.componentScope.$options.methods
            )
        })

        return this
    }
}
