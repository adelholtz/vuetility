import {ModelA} from '@example/model/ModelA.js';
import {StoreModuleA} from '@example/store/modules/StoreModuleA.js';
import {Vuetility} from '@adelholtz/vuetility';

Vue.use(Vuex);

const vuetility = new Vuetility([
    {StoreModuleA, ModelA}
]);
