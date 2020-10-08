const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const UserController = require('../app/controllers/UserController')

const { onlyUsers } = require('../app/middlewares/session')

const UserValidator = require('../app/validators/user')
const ProfileValidator = require('../app/validators/profile')

const recipes = require('./recipe')
const chefs = require('./chef')
const users = require('./users')

routes.use('/recipes', recipes)
routes.use('/chefs', chefs)
routes.use('/users', users)

// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, ProfileValidator.show, ProfileController.index)
routes.put('/profile', onlyUsers, ProfileValidator.put, ProfileController.put)

module.exports = routes