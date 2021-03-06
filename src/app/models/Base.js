const db = require('../../config/db')

function find(filters, table) {
    let query = `SELECT * FROM ${table}`

    if(filters) {
        Object.keys(filters).map(key => {
            //WHERE | OR | AND
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            })
        })
    }

    return db.query(query)
}

const Base = {
    init({ table }) {
        if (!table) throw new Error('Invalid Params')

        this.table = table

        return this
    },
    async find(id) {
        const results = await find({ where: { id } }, this.table)
        return results.rows[0]
    },
    async findOne(filters) {
        const results = await find(filters, this.table)
        return results.rows[0]
    },
    async findAll(filters) {
        const results = await find(filters, this.table)
        return results.rows
    },
    async create(fields) {
        try {
            let keys = [],
            values = []

            Object.keys(fields).map(key => {
                keys.push(key)
                if (key == 'ingredients' || key == 'preparation') {
                    values.push(`'{${fields[key]}}'`)
                } else {
                    values.push(`'${fields[key]}'`)
                }
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id`

            const results = await db.query(query)
            return results.rows[0].id

        } catch(error) {
            console.error(error)
        }
    },
    update(id, fields) {
        try {

            let update = []

            Object.keys(fields).map(key => {
                
                if (key == 'ingredients' || key == 'preparation') {
                    const line = `${key} = '{${fields[key]}}'`
                    update.push(line)
                } else {
                    const line = `${key} = '${fields[key]}'`
                    update.push(line)
                }
            })

            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}`

            return db.query(query)

        } catch(error) {
            console.error(error)
        }
    },
    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
    },
    async paginate(params) {
        const { limit, offset, filter } = params
            
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

module.exports = Base