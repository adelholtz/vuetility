/* global _ */

import VuetilityCore from './VuetilityCore.js';

export default {

    install(Vue){
        Vue.prototype.$vuetility = function(){
            if(this.$store._modules === undefined){
                return new VuetilityCore(this);
            }
            return new VuetilityModuleCore(this);
        };
    }

};
