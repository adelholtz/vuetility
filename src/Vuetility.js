/* global _ */

import Vuex from 'vuex';
import Vue from 'vue';
import {BasicStore} from '@adelholtz/vuetility';
Vue.use(Vuex);

export default class Vuetility{

    constructor(structure){
        let storeModules = {};

        structure.map((entity) => {
            let storeModuleName = null;
            let storeModule = null;
            let basicStore = {};
            for(let name in entity){
                if(storeModule !== null){
                    storeModule.storeModels.push(name);
                    // merge all models
                    basicStore = new BasicStore(new entity[name](), name);
                    storeModule = _.merge(storeModule, basicStore);
                    continue;
                }

                storeModuleName = name;
                storeModule = entity[name];
                storeModule.storeModels = [];
            }

            storeModules[storeModuleName] = storeModule;
        });

        _.merge(structure,{
            getters: {

                getDataByModel: (state) => (modelName) => {

                    console.log(modelName,state, this);

                    return modelName;
                }

            }
        });

        return new Vuex.Store({modules:storeModules});
    }

}
