/* global _ */

import Vuex from "vuex";
import Vue from "vue";
import BasicStore from "./BasicStore.js";
import BasicModel from "./BasicModel.js";
import _ from "lodash";
Vue.use(Vuex);

export default class Vuetility {
  /**
   * @param Object/Array structure
   * @return Vuex
   */
  constructor(structure) {
    if (!_.isArray(structure)) {
      return this.createSingleStore(structure);
    }

    return this.createModuleStore(structure);
  }

  /**
   *
   * @param Object structure
   * @return Vuex
   */
  createModuleStore(structure) {
    let storeModules = {};

    structure.map(entity => {
      let storeModuleName = null;
      let storeModule = null;
      let basicStore = {};
      // entities are either whole stores or models
      // first entity always is expected to be a store
      // all other entities are models
      for (let name in entity) {
        if (storeModule !== null) {
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

    _.merge(structure, {
      getters: {
        getDataByModel: state => modelName => {
          return modelName;
        }
      }
    });

    return new Vuex.Store({ modules: storeModules });
  }

  /**
   *
   * @param Array singleStore
   * @return Vuex
   */
  createSingleStore(singleStore) {
    let store = {
      state: {
        models: []
      }
    };
    for (let modelName in singleStore.models) {
      let modelEntity = new singleStore.models[modelName]();
      _.merge(modelEntity, new BasicModel({}));
      // // add state variables and other basic stuff
      let basicStore = new BasicStore(modelEntity, modelName);
      store.state.models.push(modelName);
      store = _.merge(store, basicStore);
    }
    store = _.merge(store, singleStore);

    if (singleStore.nuxt) {
      return store;
    }
    return new Vuex.Store(store);
  }
}
