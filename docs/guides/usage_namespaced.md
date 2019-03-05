---
navigation: 4
---

## Usage (namespaced)
You can find an example implementation here: [Vuetility example implementation](https://github.com/adelholtz/vuetility/tree/master/example)

Vuetility is consisting of two parts:
* a VueX part which enhances the VueX base and add state variables to your store/s
* a Vue Component part which enables you to grab the value of state variables from your stores through computed variables

**So how do we set it up?**

Actually its not much work. Lets go through a basic setup example!

First of all, when setting up a namespaced VueX Store you would do something like this:

```javascript
// see also https://vuex.vuejs.org/guide/modules.html for more information
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    a: StoreModuleA,
    b: StoreModuleB
  }
});
```
When using vuetility this gets replaced with:

```javascript
import {Vuetility} from '@adelholtz/vuetility';

Vue.use(Vuex);

const vuetility = new Vuetility([
    {StoreModuleA, ModelA},
    {StoreModuleB, ModelB},
    {StoreModuleC, ModelA, ModelB},
    {StoreModuleD},
]);
```

This will leave you with a state store structure like:

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

Next we have to tell Vue itself that it should use **vuetility**.

Vuetility is a Vue Plugin and must be registered accordingly:
```javascript
import {VuetilityComponent} from '@adelholtz/vuetility';
Vue.use(VuetilityComponent);
```

**And the last step:**

In the component you want to use automatically generated computed properties you
have to call the **init** method of **$vuetility** before the actual component gets created.
This basically means you have to call in the **beforeCreate** method of your Vue Component:
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
The init method only accepts and array of **store/module names**!
This means you have to pass in the **exact name** of a **store/module** you want to use.
In the first stept we defined:
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
Find instructions for Version 0.3.3 and below here: README_deprecated.md
Version 0.3.4 is broken and should not be used!
