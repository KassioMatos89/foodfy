const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit, filter } = req.query

            const recipes = await LoadRecipeService.loadPaginate({ page, limit }, 'recipesPaginate', filter)

            const { recipesPaginated, pagination } = recipes

            return res.render ("recipes/search/index", { recipes: recipesPaginated, filter, pagination })

        } catch(error) {
            console.error(error)
        }
    }
}