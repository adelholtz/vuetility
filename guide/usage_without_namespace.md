# Single store

I will add an example implementation soon!

Vuetility is consisting of two parts:

* a VueX part which enhances the VueX base and add state variables to your store/s
* a Vue Component part which enables you to grab the value of state variables from your stores through computed variables

## Setup

To get *Vuetility* working you need:
* a correctly configured [model](/guide/model.html)
* to register the (Vuetility)plugin with vue
* creat ea (vuetiliy[vuex]) store
* to initialize the plugin in every component you want access to Model and Store data

## Register Vuetility

See [Register Vuetility](/guide/usage_namespaced.html#register-vuetility) under [Namespaced stores](/guide/usage_namespaced.html).
The registering is the same here.

## Creating a Vuetility Store

In addition to the usage with namespaced stores there is a simpler version if you just want to use a single store
without namespaces.

Like with namespaced stores vuetilities setup is basically the same as if you would create a new Vuex store.
The only difference lies in the *models* property which you can pass in and where you define the models oyu want to use.


```javascript
import {UserModel} from 'UserModel.js'
import {EstimationModel} from 'EstimationModel.js'

const store = new Vuetility({
    models: {UserModel, EstimationModel},
    state: {
        count: 0        
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    }
});

export default  {
    name: 'my-vue-component'
    store,
    data(){ return {} }
}
```

## Initialize Vuetility

Refer to [Initialize Vuetility](/guide/usage_namespaced.html#initialize-vuetility)
under [Namespaced stores](guide/usage_namespaced.html).
The initialize step is the same in both cases.
