const { setPagination } = require('../../lib/utils')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

async function getChef(chefId) {
    let chef = await Chef.find(chefId)
    return chef.name
}

async function getImages(recipeId) {
    let files = await Recipe.files(recipeId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function format(recipe) {
    const files = await getImages(recipe.id)
    recipe.img = files[0].src
    recipe.chef_name = await getChef(recipe.chef_id)
    recipe.src = files

    return recipe
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
    async recipe() {
        try {
            const recipe = await Recipe.findOne(this.filter)
            return format(recipe)
        } catch(error) {
            console.error(error)
        }
    },
    async recipes() {
        try {
            const recipes = await Recipe.findAll(this.filter)
            const recipesPromise = recipes.map(format)
            return Promise.all(recipesPromise)
        } catch(error) {
            console.error(error)
        }
    },
    async mostAccessedRecipes() {
        try {
            const recipes = await Recipe.mostAccessed(this.filter)
            const recipesPromise = recipes.map(format)
            return Promise.all(recipesPromise)
        } catch(error) {
            console.error(error)
        }
    },
    async recipesPaginate() {
        try {
            const paramsAdjusted = setPagination(this.params, 6)

            const { page, limit, offset } = paramsAdjusted
            const filter = this.filter

            const recipes = await Recipe.paginate({ limit, offset, filter })
            const recipesPromise = recipes.map(format)
            
            const recipesPaginated = await Promise.all(recipesPromise)

            const pagination = {
                total: Math.ceil( recipesPaginated[0].total / limit ),
                page
            }

            return {
                recipesPaginated,
                pagination
            }

        } catch(error) {
            console.error(error)
        }
    }
}

module.exports = LoadService