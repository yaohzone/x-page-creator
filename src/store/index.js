import Vue from 'vue';
import Vuex, { Store } from "vuex";
import pageEditor from './page-editor.js';

Vue.use(Vuex);

const store = new Store({
    state: {
        user: {}
    },

    getters: {

    },

    mutations: {

    },

    actions: {

    },

    modules: {
        pageEditor
    },

    plugins: [],

    strict: process.env.NODE_ENV !== "production"
});


export default store;
