const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipeController = require('../app/controllers/RecipeController')
const SearchController = require('../app/controllers/SearchController')

const { onlyUsers } = require('../app/middlewares/session')

const RecipeValidator = require('../app/validators/recipe')

// SEARCH ROUTE
routes.get("/search", SearchController.index)

// Admin routes
routes.get('/registered', onlyUsers, RecipeController.adminRecipesList)
routes.get('/create', onlyUsers, RecipeController.create)
routes.get('/registered/:id', onlyUsers, RecipeValidator.adminRecipeShow, RecipeController.adminRecipeShow)
routes.get('/registered/:id/edit', onlyUsers, RecipeValidator.edit, RecipeController.edit)

routes.post('/create', onlyUsers, multer.array('photos_recipes', 5), RecipeValidator.post, RecipeController.post)
routes.put('/', onlyUsers, multer.array('photos_recipes', 5), RecipeValidator.put, RecipeController.put)
routes.delete('/', onlyUsers, RecipeController.delete)


// GUEST ROUTES
routes.get('/', RecipeController.guestIndex)
routes.get('/:id', RecipeValidator.show, RecipeController.guestShowRecipe)

module.exports = routes