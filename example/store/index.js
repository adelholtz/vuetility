/*  global _ */
import BasicStore from '@src/BasicStore';
import {MyModel} from '@example/model/MyModel.js';
const basicStore = new BasicStore(new MyModel());

const mutationTypes = {};
const actionTypes = {};
const state = {};
const getters = {};
const mutations = {};
const actions = {};

export default _.merge({
    mutationTypes,
    actionTypes,
    state,
    getters,
    mutations,
    actions
}, basicStore);
