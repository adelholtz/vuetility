/* global _ */

import Vuex from 'vuex';
import Vue from 'vue';
import BasicStore from '@src/BasicStore.js';
import BasicModel from '@src/BasicModel.js';
import _ from 'lodash';
Vue.use(Vuex);

export default class Vuetility{

    constructor(structure){
        let storeModules = {};

        structure.map((entity) => {
            let storeModuleName = null;
            let storeModule = null;
            let basicStore = {};
            // entities are either whole stores or models
            // first entity always is expected to be a store
            // all other entities are models
            for(let name in entity){
                if(storeModule !== null){
                    storeModule.storeModels.push(name);
                    // generate new model instance
                    let modelEntity = new entity[name]();
                    _.merge(modelEntity, new BasicModel({}));
                    // add state variables and other basic stuff
                    basicStore = new BasicStore(modelEntity, name);
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
