const User = require('../app/models/User')

module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    async isAdmin(userId) {
        
        const user = await User.find(userId)
        
        if(user.is_admin == true) {
            return true
        }
        
        return false
    },
    findElement(array, value, countName) {
        for (let check = 0; check < array.length; check++) {
            if (value == array[check].name) {
                countName--
                continue
            }
        }
    },
    setPagination(params, defaultLimit) {
        let { page, limit } = params
    
        page = page || 1
        limit = limit || defaultLimit
        let offset = limit * (page - 1)
    
        const paramsFormated = {
            page,
            limit,
            offset
        }
        return paramsFormated
    }
}