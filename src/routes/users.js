const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const { onlyUsers } = require('../app/middlewares/session')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

// login / logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers, UserController.list)
routes.get('/:id/edit', onlyUsers, UserValidator.edit, UserController.editForm)

// user register
routes.get('/register', onlyUsers, UserValidator.create, UserController.registerForm)
routes.post('/', onlyUsers, UserValidator.post, UserController.post)

routes.put('/', onlyUsers, UserValidator.put, UserController.put)
routes.delete('/', onlyUsers, UserValidator.remove, UserController.delete)

module.exports = routes