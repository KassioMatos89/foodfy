const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async guestChefs (req, res) {
        try {
            let { page, limit } = req.query
            
            const chefs = await LoadChefService.loadPaginate({ page, limit }, 'chefsPaginate')

            const { chefsPaginated, pagination } = chefs
            
            return res.render('chefs/guest/chefs', { chefs: chefsPaginated, pagination })
        } catch(error) {
            console.error(error)
        }
    },
    async guestShowChef(req, res) {
        try {
            const { id } = req.params
            
            const chef = await LoadChefService.load('chef', {
                where: { id }
            })

            const recipes = await LoadRecipeService.load('recipes', {
                where: { chef_id: id }
            })

            return res.render('chefs/guest/chefDetail', { chef, recipes })
        } catch(error) {
            console.error(error)
        }
    },
    create(req, res) {
        return res.render('chefs/admin/create')
    },
    async post(req, res) {
        try {
            const { name } = req.body
            
            const file = await File.create({
                name: req.files[0].filename,
                path: req.files[0].path
            })

            const chef = await Chef.create({
                name,
                file_id: file
            })

            return res.redirect(`/admin/chefs/registered/${chef}`)
        } catch(error) {
            console.error(error)
        }        
    },
    async adminChefShow(req, res) {
        try {
            // Validar se chef existe
            const { id } = req.params
            
            const chef = await LoadChefService.load('chef', {
                where: { id }
            })
            
            const recipes = await LoadRecipeService.load('recipes', {
                where: { chef_id: id }
            })

            return res.render('chefs/admin/chefDetail', { chef, recipes })
        } catch(error) {
            console.error(error)
        }
    },
    async adminIndex(req, res) {
        try{
            let { page, limit } = req.query

            const chefs = await LoadChefService.loadPaginate({ page, limit }, 'chefsPaginate')

            const { chefsPaginated, pagination } = chefs

            return res.render('chefs/admin/chefs', { chefs: chefsPaginated, pagination })
        } catch(error) {
            console.error(error)
        }
    },
    async edit (req, res) {
        try {
            
            const { id } = req.params
            const chef = await LoadChefService.load('chef', {
                where: { id }
            })
            
            return res.render('chefs/admin/edit', { chef })
        } catch(error) {
            console.error(error)
        }
    },
    async put (req, res) {
        try {
            const { id, name } = req.body

            if (req.files.length != 0) {
                const file = await File.create({
                    name: req.files[0].filename,
                    path: req.files[0].path
                })

                await Chef.update(id, {
                    file_id: file
                })
    
            } else {
                await Chef.update(id, {
                    name
                })
            }

            if (req.body.removed_files) {
                const { removed_files } = req.body
                removedFiles = removed_files.substr(0, (removed_files.length - 1))
                removedFiles = parseInt(removedFiles)                
                
                const oldFile = await File.findOne({ where: { id: removedFiles }})
                
                try {
                    await File.delete(removedFiles)
                    unlinkSync(oldFile.path)

                } catch(error) {
                    console.error(error)
                }
                
            }
  
            return res.redirect(`/admin/chefs/registered/${id}`)           
        } catch(error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            const { id, file_id } = req.body
            
            const file = await File.findOne({ where: { id: file_id }})

            try {
                await Chef.delete(id)

                await File.delete(file_id)
                unlinkSync(file.path)
            } catch(error) {
                console.error(error)
            }

            return res.redirect('/admin/chefs/registered')

        } catch(error) {
            console.error(error)
        }
    }
}