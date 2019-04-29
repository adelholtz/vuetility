<template>
    <div>

    </div>
</template>

<script>
/* global _ */
import Vue from 'vue';
import store from '../store'

import VuetilityComponent from '@src/VuetilityComponent';
Vue.use(VuetilityComponent);

export default {
    name: 'my-component',
    store,
    beforeCreate() {
        this.$vuetility().init(['StoreModuleA']);
    },
    data() {
        return {

        };
    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }
};
</script>

<style lang="scss">

</style>
