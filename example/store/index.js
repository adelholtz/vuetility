import Vue from 'vue';
import Vuex from 'vuex';
import {ModelA} from '@example/model/ModelA.js';
import StoreModuleA from '@example/store/modules/StoreModuleA.js';
import Vuetility from '@src/vuetility.js';

Vue.use(Vuex);

const vuetility = new Vuetility([
    {StoreModuleA, ModelA}
]);

export default vuetility;
