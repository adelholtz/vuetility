<template>
<v-layout row wrap>
    <v-switch label="Live" v-model="live"></v-switch>
    <v-text-field label="Type" v-model="type"></v-text-field>
    <v-select :items="categories" label="Category" v-model="category"></v-select>
</v-layout>
</template>

<script>
import BasicComponent from '@src/BasicComponent';
import {MyModel} from '@example/model/MyModel';
import store from '@example/store';

export default {
    name: 'component-name',
    store,
    mixins: [
        new BasicComponent(new MyModel())
    ],
    data() {
        return {
            // this could also be defined in MyModel
            categories: [
                'category1',
                'category2'
            ]
        };
    }
};
</script>
