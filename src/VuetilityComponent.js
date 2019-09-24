/* global _ */

import VuetilitySingleCore from "./VuetilitySingleCore.js";
import VuetilityModuleCore from "./VuetilityModuleCore.js";
import VuetilityNuxtCore from "./VuetilityNuxtCore.js";
import _ from "lodash";

export default {
	install(Vue) {
		let isNuxt = this.nuxt;

		let typeSecurityLevel = this.typeSecurityLevel !== undefined ? this.typeSecurityLevel : "enforce";
		Vue.prototype.$vuetility = function() {
			if (isNuxt) {
				return new VuetilityNuxtCore(this, typeSecurityLevel);
			}
			if (_.isEmpty(_.get(this.$store, "_modules.root._children", {}))) {
				return new VuetilitySingleCore(this, typeSecurityLevel);
			}
			return new VuetilityModuleCore(this, typeSecurityLevel);
		};
	},
	nuxtInstall(Vue) {
		let typeSecurityLevel = this.typeSecurityLevel !== undefined ? this.typeSecurityLevel : "enforce";
		return function() {
			return new VuetilityNuxtCore(Vue, typeSecurityLevel);
		};
	}
};
