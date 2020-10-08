const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeRelation = require('../models/RecipeRelation')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async guestIndex (req, res) {
        try {
            let { page, limit } = req.query

            const recipes = await LoadRecipeService.loadPaginate({ page, limit }, 'recipesPaginate')

            const { recipesPaginated, pagination } = recipes

            return res.render('recipes/guest/index', { recipes: recipesPaginated, pagination })
        } catch(error) {
            console.error(error)
        }
    },
    async guestShowRecipe (req, res) {
        try {
            const { id } = req            
            
            const recipe = await LoadRecipeService.load('recipe', {
                where: { id }
            })

            return res.render('recipes/guest/recipeDetail', { recipe })
        } catch(error) {
            console.error(error)
        }        
    },
    async adminRecipesList (req, res) {
        try {
            let { page, limit } = req.query

            const recipes = await LoadRecipeService.loadPaginate({ page, limit }, 'recipesPaginate')
            
            if (recipes == "") return res.render('recipes/admin/index', { recipes })

            const { recipesPaginated, pagination } = recipes

            return res.render('recipes/admin/index', { recipes: recipesPaginated, pagination })            
                     
        } catch(error) {
            console.error(error)
        }
    },
    async adminRecipeShow (req, res) {
        try {
            const { id } = req

            const recipe = await LoadRecipeService.load('recipe', {
                where: { id }
            })

            return res.render('recipes/admin/recipeDetails', { recipe })
        } catch(error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            const { id } = req

            const recipe = await LoadRecipeService.load('recipe', {
                where: { id }
            })

            const chefs = await Chef.findAll()
            
            return res.render('recipes/admin/edit', { recipe, chefs })

        } catch(error) {
            console.error(error)
        }
    },
    async create (req, res) {

        const chefs = await Chef.findAll()
        
        if(!chefs) return res.send('Please, you need to register one chef at least!')

        return res.render('recipes/admin/create', { chefs })
    },
    async post (req, res) {
        try {
            const { title, chef_id, ingredients, preparation, information } = req.body
            const { userId } = req.session

            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: file.path
            }))

            const fileResults = await Promise.all(filesPromise)
                        
            let recipe = await Recipe.create({
                title,
                chef_id,
                user_id: userId,
                ingredients,
                preparation,
                information
            })

            const id = recipe

            recipe = Recipe.findOne({ where: { id } })
            
            let filesObj = []
            
            fileResults.map(file => filesObj.push({
                file_id: file,
                recipe_id: id
            }))

            const recipePromise = filesObj.map(recipeRelation => RecipeRelation.create(recipeRelation))
            await Promise.all(recipePromise)
            
            return res.redirect(`/admin/recipes/registered/${id}`)
        } catch(error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {

            const { id, title, chef_id, ingredients, preparation, information } = req.body
            const { userId } = req.session

            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: file.path
            }))

            const fileResults = await Promise.all(filesPromise)

            await Recipe.update(id, {
                title,
                chef_id,
                user_id: userId,
                ingredients,
                preparation,
                information
            })

            let filesObj = []

            fileResults.map(file => filesObj.push({
                file_id: file,
                recipe_id: id
            }))

            const recipePromise = filesObj.map(recipeRelation => RecipeRelation.create(recipeRelation))
            await Promise.all(recipePromise)

            // Deleting images that were removed during the PUT
            if (req.body.removed_files) {

                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const relations = removedFiles.map(id => RecipeRelation.findOne({where: { file_id: id }}))
                let relationsResults = await Promise.all(relations)
                
                let relationsObj = []
                
                relationsResults.map (id => relationsObj.push (id.file_id))
                
                // Removendo a relação de recipe_files e files
                relationsResults.map(relation => RecipeRelation.delete(relation.id))
                relationsObj.map(id => File.delete(id))    
            }
            
            return res.redirect(`/recipes/registered/${id}`)

        } catch(error) {
            console.error(error)
        }
    },
    async delete (req, res) {
        try {
            const { id } = req.body

            // Find all recipe images
            const files = await Recipe.files(id)

            // Delete the middle table rows(recipe_files)
            const relations = await RecipeRelation.findAll({ where: { recipe_id: id } })
            relations.map(relation => RecipeRelation.delete(relation.id))

            // Delete rows of table files and rund fs.unlinkSync
            files.map(file => {
                try {
                    File.delete(file.id)
                    unlinkSync(file.path) 
                } catch(error) {
                    console.error(error)
                }
            })

            // Delete Recipe
            await Recipe.delete(id)

            return res.redirect('/admin/recipes/registered')

        } catch(error) {
            console.error(error)
        }
    }
}