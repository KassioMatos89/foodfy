const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

const User = require('../models/User')

const LoadUserService = require('../services/LoadUserService')

const createUserEmail = (user, passwordForEmail) => `
<h2>Seja bem vindo ao Foodfy!</h2>
<p>Seu usuário foi cadastrado com sucesso, segue abaixo seus dados de acesso.</p>
<p><strong>Usuário:</strong> ${user.email}</p>
<p><strong>Senha: </strong>${passwordForEmail}</p>
<p>
    Acesse já! <a href="localhost:3000/users/login"><strong>Foodfy</strong></a>
</p>
<p><br/><br/></p>
<p>Atenciosamente, Equipe Foodfy</p>
`

module.exports = {
    registerForm (req, res) {
        return res.render('user/register')
    },
    async post (req, res) {
        try {
            let { name, email, isAdm } = req.body
            const params = {}

            let password = crypto.randomBytes(3).toString("hex")
            const passwordForEmail = password
            password = await hash(password, 8)

            const userId = await User.create({
                name,
                email,
                password,
                is_admin: isAdm || false
            })

            // Caso o usuário tenha sido criado, vamos enviar a senha do mesmo para o email cadastrado
            if(userId) {
                try {

                    const user = await User.find(userId)
                    user.password = passwordForEmail

                    await mailer.sendMail({
                        to: user.email,
                        from: 'no-reply@foodfy.com.br',
                        subject: 'Foodfy - Usuário cadastrado com sucesso!',
                        html: createUserEmail(user, passwordForEmail)
                    })
                } catch(error) {
                    console.error(error)
                }
            }

            const usersFormated = await LoadUserService.loadPaginate(params, 'usersPaginate')
            const { users, pagination } = usersFormated

            return res.render('user/list', {
                users,
                pagination,
                success: "Usuário cadastrado com sucesso!"
            })

        }catch(error) {
            console.error(error)
            return res.render("user/register", {
                user: req.body,
                error: "Algum erro aconteceu!"
            })
        }
    },
    async list (req, res) {
        try {
            let { page, limit } = req.query

            const usersFormated = await LoadUserService.loadPaginate({ page, limit }, 'usersPaginate')
            const { users, pagination } = usersFormated

            return res.render('user/list', { users, pagination })

        } catch(error) {
            console.error(error)
        }
    },
    async editForm (req, res) {

        const { id } = req.params
        
        const user = await User.findOne({ where: { id } })

        return res.render('user/edit', { user })
    },
    async put (req, res) {
        try {
            let { user } = req
            const { name, email, isAdm } = req.body
            const params = {}

            user = await User.update(user.id, {
                name,
                email,
                is_admin: isAdm || false
            })

            const usersFormated = await LoadUserService.loadPaginate(params, 'usersPaginate')
            const { users, pagination } = usersFormated

            return res.render('user/list', {
                users,
                pagination,
                success: "Usuário atualizado com sucesso!"
            })

        } catch(error) {
            console.error(error)
        }
    },
    async delete (req, res) {
        try {
            const { id } = req.body
            const params = {}

            await User.delete(id)

            let { page, limit } = req.query

            const usersFormated = await LoadUserService.loadPaginate({ page, limit }, 'usersPaginate')
            const { users, pagination } = usersFormated

            return res.render('user/list', {
                users,
                pagination,
                success: "Conta deletada com sucesso!"
            })
        } catch(error) {
            console.error(error)
        }
    }
}