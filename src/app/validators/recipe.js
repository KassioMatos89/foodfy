const { isAdmin } = require('../../lib/utils')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

const LoadRecipeService = require('../services/LoadRecipeService')

async function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if(body[key] == "" && key != "removed_files") {
            const chefs = await Chef.findAll()
            return {
                recipe: body,
                chefs,
                error: 'Por favor, preencha todos os campos!'
            }
        }
    }
}

async function post (req, res, next) {
    try {
        const fillAllFields = await checkAllFields(req.body)
        if (fillAllFields) {
            return res.render('recipes/admin/create', fillAllFields)
        }

        const chefs = await Chef.findAll()

        if ( !req.files || req.files.length == 0)
            return res.render('recipes/admin/create', {
                recipe: req.body,
                chefs,
                error: 'Por favor, envie pelo menos uma imagem'
            })

        next()
    } catch(error) {
        console.error(error)
    }
}
async function show (req, res, next) {
    try {
    
        const { id } = req.params
        let recipe = await Recipe.findOne( { where: { id } })

        if (!recipe) return res.send("Recipe not found!")

        req.id = id        
        next()
    } catch(error) {
        console.error(error)
    }
}
async function adminRecipeShow (req, res, next) {
    try {
        const { id } = req.params
        let recipe = await Recipe.findOne({ where: { id } })

        if (!recipe) return res.send('Recipe not found!')

        req.id = id
        next()
    } catch(error) {
        console.error(error)
    }
}
async function edit (req, res, next) {
    const { id } = req.params
    const { userId } = req.session
    const userValidation = await isAdmin(userId)
    
    const recipe = await Recipe.findOne({ where: { id } })
    if (!recipe) return res.render('recipes/admin/index', {
        error: 'Receita não encontrada!'
    })

    if (userValidation == false && recipe.user_id != userId) {
        const recipes = await LoadRecipeService.load('recipes')

        return res.render('recipes/admin/index', {
            recipes,
            error: 'Apenas administradores ou quem cadastrou pode editar a receita.'
        })
    }

    req.id = id
    next()
}
async function put (req, res, next) {
    try {
        
        const fillAllFields = await checkAllFields(req.body)
        if (fillAllFields) {
            return res.render('recipes/edit', fillAllFields)
        }

        const chefs = await Chef.findAll()

        // if (!req.files || req.files.length == 0)
        //     return res.render('recipes/edit', {
        //         error: 'Por favor, envio pelo menos uma imagem'
        //     })

        next()
    } catch(error) {

    }
}

module.exports = {
    post,
    show,
    adminRecipeShow,
    edit,
    put
}