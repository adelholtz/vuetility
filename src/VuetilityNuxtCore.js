import _ from "lodash";
import VuetilityCore from "./VuetilityCore.js";

export default class VuetilityNuxtCore extends VuetilityCore {
    constructor(componentScope, typeSecurityLevel) {
        super(componentScope, typeSecurityLevel);
    }

    init() {
        let computed = {};
        _.each(this.componentScope.$store.state, (moduleState, moduleName) => {
            if (typeof moduleState !== "object") {
                return;
            }
            if (_.isEmpty(moduleState.models)) {
                return;
            }

            _.each(moduleState.models, modelName => {
                let modelProperties = moduleState[modelName + "Definition"];

                if (_.isEmpty(modelProperties)) {
                    return;
                }

                computed = this.computed(
                    modelProperties,
                    modelName,
                    moduleName
                );
                if (this.componentScope.$options.computed === undefined) {
                    this.componentScope.$options.computed = {};
                }

                _.merge(computed, this.componentScope.$options.computed);
                this.componentScope.$options.computed = computed;
            });
        });

        return this;
    }
}
