/* global describe, it, expect, beforeEach, afterEach */

import {mount, createLocalVue} from '@vue/test-utils';
import BasicComponent from '../../src/BasicComponent';
import MyComponent from '@example/MyComponent.vue';
import {MyModel} from '@example/model/MyModel';
import store from '@example/store';
import Vuex from 'vuex';

const basicComponent = new BasicComponent(new MyModel);
const localVue = createLocalVue();
localVue.use(Vuex);

describe('BasicComponent', () => {

    it('basicComponentHasExpectedComputed', () => {
        expect(typeof basicComponent.computed.id).toBe('object');
        expect(typeof basicComponent.computed.live).toBe('object');
        expect(typeof basicComponent.computed.category).toBe('object');
        expect(typeof basicComponent.computed.type).toBe('object');
    });

    it('myComponentHasExpectedComputed', () => {
        let comp = mount(MyComponent, {store,localVue,attachToDocument: true});
        expect(comp.vm.$store.state.MyModel.id).toBe(undefined);
        expect(comp.vm.$store.state.MyModel.live).toBe(false);
        expect(comp.vm.$store.state.MyModel.category).toBe(undefined);
        expect(comp.vm.$store.state.MyModel.type).toBe('gtld');
        //expect(typeof basicComponent.computed.id.get()).toBe('object');
    });
});
