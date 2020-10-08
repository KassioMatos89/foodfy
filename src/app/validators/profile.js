const { isAdmin } = require('../../lib/utils')

const User = require('../models/User')
const { compare } = require('bcryptjs')

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

async function put (req, res, next) {
    try{
        const { id, password } = req.body

        // Check if has all fields
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields) {
            return res.render('user/index', fillAllFields)
        }

        // Check if has password
        if (!password) return res.render('user/index', {
            user: req.body,
            error: 'Coloque sua senha para atualizar seu cadastro.'
        })

        // Password match
        const user = await User.findOne({ where: { id } })
        const passed = await compare(password, user.password)

        if (!passed) return res.render('user/index', {
            user: req.body,
            error: 'Senha incorreta'
        })

        req.user = user

        next()

    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    show,
    put,
}