# Vuetility

1. [Todo](#todo)
2. [Prerequsisits](#rerequsisits)
3. [Latest version](#version)
4. [Installation](#installation)
5. [Introduction](#introduction)
6. [Usage](#usage)


## TODO <a href="#" name="todo"></a>
* finish refactor

## Prerequsisits <a href="#" name="rerequsisits"></a>

* Vue [vuejs.org]
* Vuex [vuex.vuejs.org]
* ...and a basic understanding of how both of these work (together)

## Latest version <a href="#" name="version"></a>

**Attention:**
If you are interested in using this package i recommend waiting for Version 0.4.0.
With the release of 0.3.0 i began to rewrite core components which will have an impact on how to use and implement the package in your projects.
On top of this the readme and examples are no longer up to date.

0.3.4
* about 60% done with the overhaul

0.3.0
* beginning a structural refactoring process

0.2.0
* added JSON as type for model properties
* slightly refactored BasicComponent structure
* fixed a bug that could lead to unintended side effects when type checking
* if defaultValue in model properties is undefined it will now always be set to
reflect the actual type of said property
    * Example:
    ```
    //default value will be new String()  
    'x': {
        type: String,
        computedType: 'default'
    }
    //default value will be {}     
    'y': {
        type: JSON
    }    
    ```

0.1.0:
* added support for namespaced stores
* added documentation for namespaced stores

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

## Usage <a href="#" name="usage"></a>

coming with the release of 0.4.0!

Find instructions for Version 0.3.4 and below here: README_deprecated.md
