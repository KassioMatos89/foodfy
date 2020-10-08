const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const ChefValidator = require('../app/validators/chef')

const ChefController = require('../app/controllers/ChefController')

// CHEF ADMIN ROUTES
routes.get('/registered', onlyUsers, ChefController.adminIndex)
routes.get('/create', onlyUsers, ChefValidator.create, ChefController.create)
routes.get('/registered/:id', onlyUsers, ChefController.adminChefShow)
routes.get('/registered/:id/edit', onlyUsers, ChefValidator.edit, ChefController.edit)

routes.post('/create', onlyUsers, multer.array('profile_photo', 1), ChefValidator.post, ChefController.post)
routes.put('/', onlyUsers, multer.array('profile_photo', 1), ChefValidator.put, ChefController.put)
routes.delete('/', onlyUsers, ChefController.delete)

// CHEF GUEST ROUTES
routes.get('/', ChefController.guestChefs)
routes.get('/:id', ChefController.guestShowChef)



module.exports = routes