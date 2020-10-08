const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/admin/profile')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },
    async forgot(req, res) {
        
        const user = req.user

        try {
            // Geração de token para usuário alterar a senha
            const token = crypto.randomBytes(20).toString("hex")

            // Lógica para expiração do token
            let now = new Date()
            now = now.setHours(now.getHours + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // Enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Esqueceu a senha?</h2>
                <p>Não se preocupe, clique no link abaixo para definir uma nova senha!</p>
                <p>
                    <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">RECUPERAR SENHA</a>
                </p>
                `
            })

            // Avisar o usuário que enviamos o email
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            })

        } catch(error) {
            console.error(error)
            return res.render("session/forgot-password", {
                error: "Erro inesperado, tente novamente!!!"
            })
        }
    },
    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            // Cria um novo hash de senha
            const newPassword = await hash(password, 8)

            // Atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            // Avisa o usuário que ele tem uma nova senha
            return res.render('session/login', {
                user: req.body,
                success: "Senha alterada com sucesso! Faça seu login."
            })

        } catch(error) {
            console.error(error)
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente!'
            })
        }
    }
}