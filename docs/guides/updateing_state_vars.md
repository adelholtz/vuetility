---
navigation: 7
---

## Updating state variables

After setting up your project following the instructions provided in
* [How to setup a model](/guides/model.html).
*  [Integration with namespaced stores](/guides/usage_without_namespace.html).

The last step needed is to actually write your data into your state variables inside your store.

Vuetility provides a convicience mutation method for this called **updateObject**.

A very basic example:

```javascript
context.commit('updateObject', {
    state: 'ModelA',
    key: propertyNameOfModelA,
    value: value
});
```

The **updateObject** will ensure that all state variables stay reactive, so its highly recommended
to use it although you could use other(custom) means of setting your state variables.

### Example implementation/usage of **updateObject**

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

Implementation of **updateObject** in your store:
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
                    _.each(data, function(value, key) {
                        context.commit('updateObject', {
                            state: 'DataModel',
                            key: key, // in this case this is either data_a or data_b
                            value: value // in this case this is either foo or bar
                        });
                    });
                })
                .catch(function(error) {

                })
        }
}

```
