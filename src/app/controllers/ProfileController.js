const { put } = require("../validators/user")
const User = require("../models/User")

module.exports = {
    index(req, res) {
        try {
            const { user } = req

            return res.render('user/index', { user })
        } catch(error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {

            const { user } = req
            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render('user/index', {
                user: req.body,
                success: 'Conta atualizada com sucesso!'
            })

        } catch(error) {
            console.error(error)
            return res.render('user/index', {
                error: 'Algum erro aconteceu!'
            })
        }
    }
}