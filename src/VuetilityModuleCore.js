/* global _ */
import VuetilityCore from './VuetilityCore.js'

export default class VuetilityModuleCore extends VuetilityCore {
    constructor(componentScope, typeSecurityLevel) {
        super(componentScope, typeSecurityLevel)
    }

    init(modules = false) {
        let computed = {}
        if (!modules) {
            return
        }
        modules.forEach(module => {
            let storeModule = this.componentScope.$store._modules.root
                ._children[module]
            if (storeModule !== undefined) {
                if (storeModule._rawModule.storeModels !== undefined) {
                    storeModule._rawModule.storeModels.forEach(storeModel => {
                        let modelProperties = this.componentScope.$store.state[
                            module
                        ][storeModel + 'Definition']
                        computed = this.computed(
                            modelProperties,
                            storeModel,
                            module
                        )
                    })
                }
            }

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
                        this.$store.commit(
                            module + '/vuet-updateStateByModel',
                            {
                                model: path[0],
                                data: Object.assign(this[path[0]], {
                                    [path[1]]: v.srcElement.value,
                                }),
                            }
                        )
                    },
                },
                this.componentScope.$options.methods
            )
        })
        this.typeSecurityLevel(this.securityLevel)
        return this
    }
}
