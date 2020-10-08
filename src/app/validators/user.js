const { isAdmin } = require('../../lib/utils')

const User = require('../models/User')
const Recipe = require('../models/Recipe')

const LoadUserService = require('../services/LoadUserService')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if(body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function create (req, res, next) {
    try {
        const { userId } = req.session
        const userValidation = await isAdmin(userId)

        if (userValidation == false) {
            const { page, limit } = req.query

            const usersFormated = await LoadUserService.loadPaginate({ page, limit }, 'usersPaginate')
            const { users, pagination } = usersFormated

            return res.render('user/list', { 
                users,
                pagination,
                error: 'Somente administradores podem cadastrar usuários!'
            })
        }

        next()
    } catch(error) {
        console.error(error)
    }
}

async function edit (req, res, next) {
    try {
        const { userId } = req.session
        const userValidation = await isAdmin(userId)

        if (userValidation == false) {
            const { page, limit } = req.query

            const usersFormated = await LoadUserService.loadPaginate({ page, limit }, 'usersPaginate')
            const { users, pagination } = usersFormated

            return res.render('user/list', { 
                users,
                pagination,
                error: 'Seu perfil não pode editar usuários. Para editar sua conta, acesse o menu "Minha Conta"'
            })
        }

        next()
    } catch(error) {
        console.error(error)
    }
}

async function show (req, res, next) {
    // Abaixo pegamos o userId direto do session, por isso não o declaramos anteriormente
    const { userId: id } = req.session

    const user = await User.findOne({ where: { id } })

    if (!user) return res.render("user/register", {
        error: "Usuário não encontrado!"
    })

    req.user = user

    next()
}

async function post (req, res, next) {
    //Check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render("user/register", fillAllFields)
    }

    //Check if user exists [email]
    let { email } = req.body

    const user = await User.findOne({ where: { email } })

    if ( user ) {
        return res.render('user/register', {
            user: req.body,
            error: "Email já cadastrado."
        })
    }

    next()
}

async function put (req, res, next) {
    try{
        const { id } = req.body
        const { userId } = req.session
        
        const userValidation = await isAdmin(userId)
        console.log(userValidation)

        // Check if has all fields
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields) {
            return res.render('user/index', fillAllFields)
        }

        if (userValidation == false) {            
            const users = await User.findAll()

            return res.render('user/list', { 
                users,
                error: 'Edição de usuários apenas para ADMIN. Para atualizar seu perfil, acesse o menu MINHA CONTA.'
            })
        }

        const user = await User.find(id)

        // console.log(user)
        req.user = user

        next()
    } catch(error) {
        console.error(error)
    }
}

async function remove (req, res, next) {
    try {
        const { userId } = req.session
        const { id } = req.body
        const userValidation = await isAdmin(userId)

        const { page, limit } = req.query

        const usersFormated = await LoadUserService.loadPaginate({ page, limit }, 'usersPaginate')
        const { users, pagination } = usersFormated

        if (userValidation == false) {
            
            return res.render('user/list', { 
                users,
                pagination,
                error: 'Apenas ADMINISTRADORES podem DELETAR.'
            })
        }
        
        if (userId == id) {

            return res.render('user/list', { 
                users,
                pagination,
                error: 'Você não pode deletar sua própria.'
            })
        }

        const userRecipes = await Recipe.findAll({ where: { user_id: id } })
        
        if (userRecipes != "") {
            return res.render('user/list', { 
                users,
                pagination,
                error: 'Este usuário possui receita(s) cadastrada(s) e não pode ser deletado.'
            })
        }

        next()
    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    create,
    edit,
    post,
    show,
    put,
    remove
}