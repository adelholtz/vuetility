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
        })
        this.typeSecurityLevel(this.securityLevel)
        return this
    }
}
