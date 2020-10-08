const { setPagination } = require('../../lib/utils')

const Chef = require('../models/Chef')
const File = require('../models/File')

async function getImages(fileId){

    let file = await File.findOne({ where: {id: fileId} })
    file = {
        ...file,
        src: `${file.path.replace("public", "")}`
    }

    return file
}

async function format(chef) {
    const files = await getImages(chef.file_id)
    chef.img = files.src
    
    return chef
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    loadPaginate(params, service, filter) {
        this.filter = filter
        this.params = params
        return this[service]()
    },
    async chef() {
        try {
            const chef = await Chef.findOne(this.filter)
            return format(chef)
        } catch(error) {
            console.error(error)
        }
    },
    async chefs() {
        try {
            const chefs = await Chef.findAll(this.filters)
            const chefsPromise = chefs.map(format)
            return Promise.all(chefsPromise)

        } catch(error) {
            console.error(error)
        }
    },
    async chefsPaginate() {
        try {
            const paramsAdjusted = setPagination(this.params, 8)

            const { page, limit, offset } = paramsAdjusted

            const chefs = await Chef.paginate({ limit, offset })
            const chefsPromise = chefs.map(format)

            const chefsPaginated = await Promise.all(chefsPromise)

            const pagination = {
                total: Math.ceil( chefsPaginated[0].total / limit ),
                page
            }

            return {
                chefsPaginated,
                pagination
            }

        } catch(error) {
            console.error(error)
        }
    }
}

module.exports = LoadService