const Base = require('./Base')

const db = require('../../config/db')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async paginate(params) {
        const { page, limit, offset, filter } = params
            
        let query = "",
            totalQuery = `(
                SELECT count(*) FROM ${this.table} WHERE 1 = 1
            ) AS total`
    
        query = `
            SELECT ${this.table}.*,
                    ${totalQuery}
            FROM ${this.table}
        `

        if (filter) {

            totalQuery = `(
                SELECT count(*) FROM ${this.table} WHERE recipes.title ilike '%${filter}%'
            ) AS total`

            query = `
                SELECT ${this.table}.*,
                        ${totalQuery}
                FROM ${this.table}
            `

            query += `
                WHERE
                recipes.title ilike '%${filter}%'
            `
        }

        if(params) {
            query += ` 
            ORDER BY id ASC 
            LIMIT ${limit} OFFSET ${offset}
            `
        }
        
        const results = await db.query(query)
        return results.rows
    }
}