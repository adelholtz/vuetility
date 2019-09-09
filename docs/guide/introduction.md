---
navigation: 1
---

# Vuetility (README)

## Work in progress

This project is still work in progress and (can be) heavily subjected to core and implementation changes.
The Project is fairly stable as of Version **0.5.0** and shouldn't be changed to drastically anymore but
changes to mutations, mutation names and core implementations may still happen.

Refer to the [Latest Version](#version) section for more information on bigger or interesting changes, as i will always state them there.

Also refer to the [Todo](#todo) section to check on what is to come in the future or what changes are due to happen
to this project in the near future

## TODO <a href="#" name="todo"></a>
* core implementation for non namespaced stores (in progress)
* provide better examples and a better complete example implementation
* enhance documentation as a whole
* write/add missing tests
* support for swagger files *(wishfull thinking at this point but we may dream)*

## Prerequsisits <a href="#" name="rerequsisits"></a>

* Vue [vuejs.org]
* Vuex [vuex.vuejs.org]
* ...and a basic understanding of how both of these work (together)

## Latest version <a href="#" name="version"></a>

[![npm version](https://badge.fury.io/js/%40adelholtz%2Fvuetility.svg)](https://badge.fury.io/js/%40adelholtz%2Fvuetility)

0.5.0
* added a new model property: allowUndefined
    * allows values to explicitly be set to 'undefined' (this had been removed on 0.4.5)
* added basic structure for stores without modules
    * Attention: complete functionality still needs to be added

0.4.2
* rename externally available mutations to ensure uniqueness of methods
    * updateObject is now deprectad and should not be used anymore; instead use one of
        * vuet-updateStateByModel
        * vuet-updateModel
* add new mutation vuet-updateStateByModel
    * this is basically a more intelligent implementation of vuet-updateObject but provides a bit less freedom
    * see: [Updating state variables](/guide/updateing_state_vars.html)
* add new mutation vuet-updateModel
    * allows you to replace an entire given model
    * see: [Updating state variables](/guide/updateing_state_vars.html)
* reimplemented/fixed missing/broken tests

0.4.1
* add typescript module declaration
* add better Documentation
* reintroduce type security

0.4.0
* complete rewrite of the core concept!
* vuetility is now a Vue Plugin
* code is more lean and adaptable for future changes
* this version is **not compatible** with earlier versions and if you want to upgrade you will have to do a rewrite of your component structure by following the [Usage](#usage) instructions below

## Introduction <a href="#" name="introduction"></a>

Vuex is great but in my opinion its lacking something very basic.
In every Vue project i came across so far you have to write the same computed properties in different
components over and over again. Sure, you can streamline this by using various different approaches but the problem stays 
the same and you will have to overcome this in every new project thinking about the best way to organize things.
Thats why i came up with this little 'plugin', 'wrapper' 'addition' or whatever you'd like to call it.

This does not reinvent Vuex in any way, it does not temper with the core of Vuex or Vue!

I see Vuetility, Vuex and Vue like a Matryoshka, consisting of several layers which build upon each other
enhancing the layer beneath giving them access to more features and convenience functions.

What is Vuetility then in general?

Vuetility contains basic logic for generic (Vuex)store and (Vue)component usage, by auto-generating (Vue)computed properties and (Vuex)state variables from provided models.

It also gives you access to a set of predefined [mutations](/guide/updateing_state_vars.html) which you can use
with *every* state variable in your stores/modules.

__The model can/must also contain:__
* a renderer per property.
* default values
* exact type definitions (String, Boolean etc.)

__Project Goals:__
* no need to write any computed properties for your models properties in your custom component
* no need to write code in your store that handles the update/setting process of model data
* support of multiple models per store/component

Documentation: [https://adelholtz.github.io/vuetility/](https://adelholtz.github.io/vuetility/)


Please let me know if the usage instructions and examples are unclear in any way and should be improved!