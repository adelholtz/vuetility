/* global _ */

import VuetilitySingleCore from './VuetilitySingleCore.js';
import VuetilityModuleCore from './VuetilityModuleCore.js';

export default {

    install(Vue) {
        let typeSecurityLevel = this.typeSecurityLevel !== undefined ? this.typeSecurityLevel : 'enforce';
        Vue.prototype.$vuetility = function () {
            if (_.isEmpty(_.get(this.$store, '_modules.root._children', {}))) {
                return new VuetilitySingleCore(this, typeSecurityLevel);
            }
            return new VuetilityModuleCore(this, typeSecurityLevel);
        };
    }

};
