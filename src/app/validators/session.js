const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {    
    try {
        const { email, password } = req.body

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { email } })

        if (!user) return res.render('session/login', {
            user: req.body,
            error: 'Usuário não cadastrado!'
        })

        // Verifica se a senha confere
        const passed = await compare(password, user.password)

        if (!passed) return res.render('session/login', {
            user: req.body,
            error: 'Senha incorreta, tente novamente!'
        })

        req.user = user

        next()

    } catch(error) {
        console.error(error)
    }
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if(!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user

        next()
    } catch(error) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    
    const { email, password, passwordRepeat, token } = req.body
        
    try {
        
        const user = await User.findOne({ where: { email } })

        // Verifica se usuário existe
        if (!user) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Usuário não cadastrado'
        })

        // Verifica se a senha e repetição conferem
        if (password != passwordRepeat) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Senha e repetição de senha não conferem'
        })

        // Verifica se o token confere
        if (user.reset_token != token) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token inválido! Solicite nova alteração de senha.'
        })

        // Verifica se token não expirou
        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token expirado! Por favor, solicite nova recuperação de senha.'
        })

        req.user = user
        next()
        
    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    login,
    forgot,
    reset
}