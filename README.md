# Vuetility

1. [Todo](#todo)
2. [Prerequsisits](#rerequsisits)
3. [Latest version](#version)
4. [Installation](#installation)
5. [Introduction](#introduction)


## TODO <a href="#" name="todo"></a>
* finish refactor

## Prerequsisits <a href="#" name="rerequsisits"></a>

* Vue [vuejs.org]
* Vuex [vuex.vuejs.org]
* ...and a basic understanding of how both of these work (together)

## Latest version <a href="#" name="version"></a>

0.4.0
* complete rewrite of the core concept!
* vuetility is now a Vue Plugin
* code is more lean and adaptable for future changes
* this version is **not compatible** with earlier versions and if you want to upgrade you will have to do a rewrite of your component structure by following the [Usage](#usage) instructions below


## Installation <a href="#" name="rerequsisits"></a>

```
npm install @adelholtz/Vuetility

yarn add @adelholtz/Vuetility

```


## Introduction <a href="#" name="introduction"></a>

Contains basic logic for generic (Vuex)store and (Vue)component usage, by auto-generating (Vue)computed properties and (Vuex)state variables from provided models.

__The model can/must also contain:__
* a renderer per property.
* default values
* exact type definitions (String, Boolean etc.)

__Project Goals:__
* no need to write any computed properties for your models properties in your custom component
* no need to write code in your store that handles the update/setting process of model data
* support of multiple models per store/component

Documentation: [https://adelholtz.github.io/vuetility/](https://adelholtz.github.io/vuetility/)


Please let me know if the usage instructions and example are unclear in any way and should be improved!
