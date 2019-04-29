---
navigation: 7
---

## Updating state variables

After setting up your project following the instructions provided in
* [How to setup a model](/guides/model.html).
*  [Integration with namespaced stores](/guides/usage_without_namespace.html).

The last step needed is to actually write your data into your state variables inside your store.

Vuetility provides two convicience mutation methods for this:

* vuet-updateModel
    * updates the (whole of a) given Model with provided data
* vuet-updateStateByModel
    * updates specific given states/variables inside provided model


A very basic example:

```javascript
context.commit('vuet-updateStateByModel', {
    model: 'ModelA', // the name of the model you want to update
    key: propertyNameOfModelA, // the key inside the model you want to update
    data: data // the data you want to set for the key inside the model
});
```
or
```javascript
context.commit('vuet-updateStateByModel', {
    model: 'ModelA', // the name of the model you want to update
    data: data // the data you want to update the model with
});
```

ATTENTION:
the **_key_** parameter is optional and does not need to be provided **but** if you do not provide a
specific key be sure that the provided data resembles the data-structure of the model.

**Example:**
```javascript
//model structure of 'ModelA'
{
    'data-a': {},
    'data-b': 'foo'
    'data-c': 0
}

// update 'data-b' for 'ModelA'
context.commit('vuet-updateStateByModel', {
    model: 'ModelA',
    key: 'data-b'
    data: 'bar'
});

// can also be done like this
//
// using this method you can update multiple key inside a model at once without the need to override
// the complete model
context.commit('vuet-updateStateByModel', {
    model: 'ModelA',
    data: {
        'data-b': 'bar'
    }
});

```

The **vuet-*** mutation methods will ensure that all state variables stay reactive, so its highly recommended
to use them although you could use other(custom) means of setting your state variables.

### Example implementation/usage of **vuet-***

An example implementation can also be found in the repository at: [Vuetility example implementation](https://github.com/adelholtz/vuetility/tree/master/example)

Basic Data Model used in this example:
```javascript
export class DataModel {
    model() {
        return {
            'data_a': {
                type: String
            },
            'data_b': {
                type: String
            }
        };
    }
}
```

The response object (as you get it back from axios or any other ajax client of your choice).
The data we are after here can be found under **data.data**
```json
    config: {adapter: ƒ, transformRequest: {…}, transformResponse: {…}, timeout: 0, xsrfCookieName: "XSRF-TOKEN", …}
    data:
        data: {
            data_a: "foo",
            data_b: "bar"
        }
        messages: [{…}]
        object: {type: "SUCCESS", value: "", summary: ""}
    headers: {pragma: "no-cache", date: "Thu, 25 Apr 2019 08:44:49 GMT", last-modified: "Thursday, 25-Apr-2019 08:44:49 GMT", server: "nginx/1.12.2", host: "localhost", …}
    request: XMLHttpRequest {onreadystatechange: ƒ, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}
    status: 200
    statusText: "OK"
    __proto__: Object
```

Implementation of **vuet-updateStateByModel** in your store:
```javascript
// actions inside your store
const actions = {
        /**
    	 * @param  Vuex context
    	 * @param  JSON config {
    	 * }
    	 */
        getData(context) {
            axios.get(url)
                .then(function(response) {
                    let data = _.get(response, 'data.data', {});

                    context.commit('vuet-updateStateByModel', {
                        model: 'DataModel'
                        data: data
                    });
                })
                .catch(function(error) {

                })
        }
}

```
