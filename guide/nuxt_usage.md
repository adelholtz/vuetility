# Nuxt Usage

## Setup

### Create a plugin and register it in nuxt.config

```javascript
//plugins/Vuetility.js
import { VuetilityComponent } from "@adelholtz/vuetility";
import Vue from "vue";
VuetilityComponent.nuxt = true;
Vue.use(VuetilityComponent);

export default ({ app }, inject) => {
    let v = new Vue({
        store: app.store
    });
    // Set the function directly on the context.app object
    app.$vuetility = VuetilityComponent.nuxtInstall(v);
};
```
```javascript
// nuxt.config
{
   plugins: ['~/plugins/Vuetility']
}
```

### Create a Vuex Store

Create a store as you normally would in nuxt in the 'store' directory. But add
the special Vuetility configuration on top like this:

```javascript
// store/ExampleStore.js

import { LoginModel } from "~/models/LoginModel.js";
import { Vuetility } from "@adelholtz/vuetility";

const store = new Vuetility({
    nuxt: true,
    models: { LoginModel }
});

const state = () =>
    _.merge(store.state, {
        data: {}
    });
const mutations = _.merge(store.mutations, {
    customMutation(){}
});

const getters = {};

const actions = {
    csutomAction(){}
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
```
## Initialize in Components

If you call this.$vuetility().init() all Models from all stores will be loaded into the component.
To load only certain store Modules and corresponding models call them explicitly by name: this.$vuetility().init(["NameOfFile"])

```javascript
// load everything
export default {
    beforeCreate() {
        this.$vuetility().init();
    }
}

// only load models defined in store/ExampleStore.js
export default {
    beforeCreate() {
        this.$vuetility().init(["ExampleStore"]);
    }
}
```


