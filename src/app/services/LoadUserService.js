const { setPagination } = require('../../lib/utils')

const User = require('../models/User')

const LoadService = {
    loadPaginate(params, service) {
        this.params = params
        return this[service]()
    },
    async usersPaginate() {
        try {
            const paramsAdjusted = setPagination(this.params, 6)

            const { page, limit, offset } = paramsAdjusted

            const users = await User.paginate({ limit, offset })
            
            const pagination = {
                total: Math.ceil( users[0].total / limit),
                page
            }

            return {
                users,
                pagination
            }
        } catch(error) {
            console.error(error)
        }
    }
}

module.exports = LoadService