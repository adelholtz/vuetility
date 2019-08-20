# Namespaced stores
You can find an example implementation here: [Vuetility example implementation](https://github.com/adelholtz/vuetility/tree/master/example)

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

We have to tell Vue itself that it should use **vuetility**.
This is not needed for the Vuex part but for you to be able to directly grab state variables from the store
you need to register Vuetility as a plugin with Vue.

So once again **Vuetility is a Vue Plugin and must be registered accordingly**:
```javascript
import {VuetilityComponent} from '@adelholtz/vuetility';
Vue.use(VuetilityComponent);
```

## Creating a Vuetility store

When setting up a namespaced VueX Store you would do something like this:

```javascript
// see also https://vuex.vuejs.org/guide/modules.html for more information
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    a: StoreModuleA,
    b: StoreModuleB
  }
});

export default  {
    name: 'my-vue-component'
    store,
    data(){ return {} }
}
```
Or in other words you would create your Vuex store and then use it in your components.

When using vuetility you do it like this:

```javascript
import {Vuetility} from '@adelholtz/vuetility';

Vue.use(Vuex);

const store = new Vuetility([
    {StoreModuleA, ModelA},
    {StoreModuleB, ModelB},
    {StoreModuleC, ModelA, ModelB},
    {StoreModuleD},
]);

export default  {
    name: 'my-vue-component'
    store,
    data(){ return {} }
}
```
So its basically the same setup process as for Vuex with a little twist as you should see at a glance.
What this setup basically does is, telling *Vuetility* which module should use which models. Vuetility stores
can work with as many models as you would like them to.


Creating a store in the above mentioned fashion will leave you with a state store structure like this:

* state
    * 'StoreModuleA'
        * 'ModelA'


In-depth analysis of the first array entry:
* StoreModuleA
    * the actual store module
    * this has **always** to be the first entity given in a description object
* ModelA
    * the model you want to connect to the store given as first parameter
    * please note, that the number of models you can pass is not limited in any way, this also means that you do not need to pass in a model at all if you don't want to or don't need to, or you could pass multiple models at once

<hr>

Or if you prefer a more real life store structure example:

```javascript
const vuetility = new Vuetility([
    {AccountStatistics, AccountStatisticsModel},
    {AlexaSiteInfo, AlexaSiteInfoModel},
    {DomainMetInformation}
]);
```

<img src="https://raw.githubusercontent.com/adelholtz/vuetility/master/docs/img/state_structure.png" width="400">
<hr>


## Initialize Vuetility

This step is just neede if you want to use vuetiliies functionality to give you direct access to your state variables.

This provides you with automatically generated computed properties in your respective components.

In the component you want to make use of this feature you
have to call the **init** method of **$vuetility** before the actual component gets created.

This basically means you have to call in the **beforeCreate** method of your Vue Component like this:
```javascript
export default {
    beforeCreate() {
        this.$vuetility().init(['StoreModuleA']);
    },
    data(){
        return {}
    }
}
```
The init method only accepts an array of **store/module names**!
This means you have to pass in the **exact name** of a **store/module** you want to use.
In the first step we defined:
```javascript
{StoreModuleA, ModelA},
{StoreModuleB, ModelB},
```
StoreModuleA and StoreModuleB are the **exact names** you are supposed to pass the init method through the config array. Like so:
```javascript
this.$vuetility().init(['StoreModuleA']);
// or if you want to use both
this.$vuetility().init(['StoreModuleA','StoreModuleB']);
```

<hr>

**Attention:**
Find instructions for Version 0.3.3 and earlier here:
[README_deprecated.md](https://github.com/adelholtz/vuetility/blob/master/README_deprecated.md)

Version 0.3.4 is broken and should not be used!
