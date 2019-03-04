/*  global _, axios */
const state = {
    response: {},
    error: {},
};
const getters = {
    hasError(state){
        return !_.isEmpty(state.error);
    }
};
const mutations = {
    setResponse(state, response) {
        state.response = response;
    },
    setError(state, error) {
        state.error = error;
    }
};
const actions = {
    /**
	 * @param  Vuex context
	 */
    getInfo(context, config){
        axios({
            method: 'GET',
            url: url
        })
            .then(function(response) {
                context.state.response = _.get(response,'data.data', {});
                _.each(context.state.response, function(value, key){
                    context.commit('updateObject', {
                        state: 'ModelA',
                        key: key,
                        value: value
                    });
                });
            })
            .catch(function(error) {
                let errorMsg = _.get(error, 'response.data.error', 'No data found');

                context.commit('setError', {
                    'message': errorMsg
                });
            })
            .then(function() {
            });

    }
};

export default{
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
