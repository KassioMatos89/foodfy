const { isAdmin } = require('../../lib/utils')

const Chef = require('../models/Chef')

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

async function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if(body[key] == "" && key != "removed_files") {
            const chefs = await Chef.findAll()
            return {
                chef: body,
                chefs,
                error: 'Por favor, preencha todos os campos!'
            }
        }
    }
}

async function create(req, res, next) {
    try {
        const { userId } = req.session
        const userValidation = await isAdmin(userId)
        
        if (userValidation == false) {
            // const chefs = await LoadChefService.load('chefs')
            let { page, limit } = req.query
            
            const chefs = await LoadChefService.loadPaginate({ page, limit }, 'chefsPaginate')

            const { chefsPaginated, pagination } = chefs

            return res.render('chefs/admin/chefs', { 
                chefs: chefsPaginated,
                pagination,
                error: 'Somente administradores podem cadastrar chefs!'
            })    
        }
        next()
    } catch(error) {
        console.error(error)
    }
}

async function post (req, res, next) {
    try {
        const fillAllFields = await checkAllFields(req.body)
        if (fillAllFields) {
            return res.render('chefs/create', fillAllFields)
        }

        if ( !req.files || req.files.length == 0)
            return res.render('chefs/admin/create', {
                chefs: req.body,
                error: 'Por favor, envie uma imagem'
            })

        next()
    } catch(error) {
        console.error(error)
    }
}

async function edit (req, res, next) {
    try {
        const { id } = req.params
        const { userId } = req.session
        const userValidation = await isAdmin(userId)
        
        if (userValidation == false) {            
            const chef = await LoadChefService.load('chef', {
                where: { id }
            })

            const recipes = await LoadRecipeService.load('recipes', {
                where: { chef_id: id }
            })

            return res.render('chefs/admin/chefDetail', { 
                chef,
                recipes,
                error: 'Somente administradores podem editar chefs!'
            })    
        }        

        const chef = await Chef.find(id)

        if (!chef) return res.send('Chef not found')

        next()
    } catch(error) {
        console.error(error)
    }
}

async function put (req, res, next) {
    try {
        const { file_id, removed_files } = req.body
        const fillAllFields = await checkAllFields(req.body)
        if (fillAllFields) {
            return res.render('chefs/admin/edit', fillAllFields)
        }

        if ( (!req.files || req.files.length == 0) && removed_files != "")
            return res.render('chefs/admin/edit', {
                chef: req.body,
                error: 'Por favor, envie uma imagem'
            })

        next()
    } catch(error) {
        console.error(error)
    }
}

async function remove (req, res, next) {
    try {

        const { userId } = req.session
        const userValidation = await isAdmin(userId)
        
        if (userValidation == false) {            
            const chef = await LoadChefService.load('chef', {
                where: { id }
            })

            const recipes = await LoadRecipeService.load('recipes', {
                where: { chef_id: id }
            })

            return res.render('chefs/admin/chefDetail', { 
                chef,
                recipes,
                error: 'Somente administradores podem editar chefs!'
            })    
        }
        next()
    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    create,
    post,
    edit,
    put,
    remove
}