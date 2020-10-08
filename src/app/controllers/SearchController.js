const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit, filter } = req.query
            
            page = page || 1
            limit = limit || 6
            let offset = limit * ( page -1 )

            const params = {
                limit,
                offset,
                filter
            }

            const recipes = await LoadRecipeService.loadPaginate(params, 'recipesPaginate')

            if (recipes.length < 1) {                
                return res.render('recipes/search/index', {
                    error: 'Nenhum resultado encontrado!'
                })
            }
                         
            const pagination = {
                total: Math.ceil( recipes[0].total / limit ),
                page
            }

            return res.render ("recipes/search/index", { recipes, filter, pagination })

        } catch(error) {
            console.error(error)
        }
    }
}