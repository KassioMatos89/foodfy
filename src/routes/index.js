const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const HomeController = require('../app/controllers/HomeController')

const users = require('./users')
const admin = require('./admin')
const recipes = require('./recipe')
const chefs = require('./chef')

routes.get('/', HomeController.guestHome)

routes.use('/users', users)
routes.use('/admin', admin)
routes.use('/recipes', recipes)
routes.use('/chefs', chefs)

// Alias
routes.get('/accounts', function(req, res) {
    return res.redirect("/users/login")
})

module.exports = routes