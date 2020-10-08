const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async guestHome (req, res) {
        try {
            const recipes = await LoadRecipeService.load('mostAccessedRecipes')
            
            return res.render('guest/index', { recipes })
        } catch(error) {
            console.error(error)
        }
    }
}