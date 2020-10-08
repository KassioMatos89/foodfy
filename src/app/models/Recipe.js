const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async files(id) {
        const query = `
             SELECT files.id, files.name, files.path
             FROM ${this.table}
             JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
             JOIN files ON (recipe_files.file_id = files.id)
             WHERE recipes.id = $1`

         const values = [id]
        
        const results = await db.query(query, values)
        return results.rows
    },
    async mostAccessed() {
        const query = `
            SELECT * 
            FROM ${this.table}
            ORDER BY updated_at DESC
            LIMIT 6
        `

        const results = await db.query(query)
        return results.rows
    }
}