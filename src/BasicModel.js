/* global _ */
export default class BasicModel {
    /**
     *
     * @param {Object} [config={}]
     * {
     *      whiteList: [
     *          modelPropertyA,
     *          modelPropertyB,
     *      ],
     *      blackList: [
     *          modelPropertyC,
     *          modelPropertyD,
     *      ],
     * }
     */
    constructor(config = {}) {
        let whiteList = null
        let blackList = null

        if (config.whiteList !== undefined) {
            if (
                Array.isArray(config.whiteList) &&
                !_.isEmpty(config.whiteList)
            ) {
                whiteList = config.whiteList
            }
        }
        if (config.blackList !== undefined) {
            if (
                Array.isArray(config.blackList) &&
                !_.isEmpty(config.blackList)
            ) {
                blackList = config.blackList
            }
        }

        return {
            whiteList,
            blackList,
            basicModel: this.basicModel,
        }
    }

    basicModel() {
        let model = this.model()
        let blackListFilteredModel = {}
        let whiteListFilteredModel = {}

        if (this.blackList !== null || this.whiteList !== null) {
            if (this.blackList !== null) {
                blackListFilteredModel = _.omit(model, this.blackList)
                if (this.whiteList === null) {
                    return blackListFilteredModel
                }
            }
            if (this.whiteList !== null) {
                whiteListFilteredModel = _.pick(model, this.whiteList)
                if (this.blackList === null) {
                    return whiteListFilteredModel
                }
            }
            return _.merge(blackListFilteredModel, whiteListFilteredModel)
        }

        return model
    }
}
