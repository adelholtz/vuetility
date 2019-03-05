/* global _ */

import VuetilityCore from './VuetilityCore.js';
import VuetilityModuleCore from './VuetilityModuleCore.js';

export default {

    install(Vue){
        let typeSecurityLevel = this.typeSecurityLevel !== undefined?this.typeSecurityLevel:'enforce';
        Vue.prototype.$vuetility = function(){
            if(this.$store._modules === undefined){
                return new VuetilityCore(this);
            }
            return new VuetilityModuleCore(this, typeSecurityLevel);
        };
    }

};
