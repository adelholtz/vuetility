/* global describe, it, expect, beforeEach, afterEach */

// ./node_modules/karma/bin/karma start tests/my.conf.js --single-run

import Vue from 'vue';
import {mount, createLocalVue} from '@vue/test-utils';
import MyComponent from '@example/component/MyComponent.vue';
import store from '@example/store';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('BasicComponent', () => {
    it('myComponentHasExpectedComputed', () => {
        let comp = mount(MyComponent, {store,localVue,attachToDocument: true});

        expect(comp.vm.$store.state.StoreModuleA.ModelA['data-a']).toBe('foo');
        expect(comp.vm.$store.state.StoreModuleA.ModelA['data-b']).toBe('bar');
        expect(typeof comp.vm.$store.state.StoreModuleA.ModelADefinition).toBe('object');
        expect(typeof comp.vm.$store.state.StoreModuleA.ModelADefinition['data-a'].type()).toBe('string');

        expect(comp.vm['data-a']).toBe('foo');

        comp.vm.$store.commit('StoreModuleA/vuet-updateStateByModel', {
            model: 'ModelA',
            data: {
                'data-a': 'foo-new',
                'data-b': 'bar-new'
            }
        });

        expect(comp.vm.$store.state.StoreModuleA.ModelA['data-a']).toBe('foo-new');
        expect(comp.vm.$store.state.StoreModuleA.ModelA['data-b']).toBe('bar-new');
        expect(comp.vm['data-a']).toBe('foo-new');
        expect(comp.vm['data-b']).toBe('bar-new');
    });
});
