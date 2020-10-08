const faker = require('faker')
faker.locale= 'pt_BR'
const { hash } = require('bcryptjs')

const { chefsFiles, recipesFiles } = require('./object-data.json')
const { findElement } = require('./src/lib/utils')

const util = require('util');
const fs = require('fs');
const path = require('path');
const copyFilePromise = util.promisify(fs.copyFile);

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/File')
const Recipe = require('./src/app/models/Recipe')
const RecipeRelation = require('./src/app/models/RecipeRelation')

let usersIds = [],
    chefsIds = []
    
let totalUsers = 15,
    totalChefs = chefsFiles.length,
    totalRecipes = 10

/*
    * É feito a cópia do arquivo do diretório default para o diretório padrão de imagens,
    * desta forma, cada receita e imagem, terão seu próprio arquivo no projeto
    * não causando problema nas demais receitas caso uma imagem seja deletada.
    * Esta lógica foi criada para correção deste problema apenas para as receitas criadas a partir do seed.js.
*/
function copyFiles(srcDir, destDir, files, newName) {    
    return Promise.all(files.map(file => {  
        return copyFilePromise(path.join(srcDir, file), path.join(destDir, newName));
    }));
}

async function createUsers() {
    const users = []
    const password = await hash('1111', 8)

    for(var count = 0; count < totalUsers; count++) {
        if (count == 0) {
            users.push({
                name: 'Admin',
                email: 'admin@foodfy.com.br',
                password,
                is_admin: true
            })
        } else {
            users.push({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
                is_admin: faker.random.boolean()
            })
        }
    }
    const userPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(userPromise)
}

 async function createChefs() {
    const chefs = []

    for(var count = 0; count < totalChefs; count++) {        
        const archiveName = `${Date.now().toString()}-${chefsFiles[count].fileName}`
        
        chefs.push({
            name: chefsFiles[count].name,
            file_id: await File.create({
                name: archiveName,
                path: `public/images/${archiveName}`
            })
        })

        copyFiles(`${chefsFiles[count].path}`, `public/images/`, [`${chefsFiles[count].fileName}`], archiveName)
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)
}

async function createRecipes() {
    // Create Recipe
    let files = []

    for(var count = 0; count < totalRecipes; count++) {
        let items = Math.ceil(Math.random() * 5)

        let ingredientsArr = [],
            preparationArr = []

        for(let addItems = 0; addItems < items; addItems++) {
            ingredientsArr.push(faker.lorem.sentence())
            preparationArr.push(faker.lorem.sentence())
        }

        let recipe = {
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title(),
            ingredients: ingredientsArr,
            preparation: preparationArr,
            information: faker.lorem.paragraphs()
        }

        // Create recipe files
        files = []
        const totalFiles = Math.ceil(Math.random() * 5)

        for(var fileCount = 1; fileCount <= totalFiles; fileCount++) {
            const dataId = Math.floor(Math.random() * recipesFiles.length)            
            const archiveName = `${Date.now().toString()}-${recipesFiles[dataId].fileName}`

            // Valida se o arquivo a ser criado já existe no array, evitando problemas de imagem duplicada que no windows não permite.
            findElement(files, archiveName, fileCount)

            files.push({
                name: archiveName,
                path: `public/images/${archiveName}`
            })

            copyFiles(`${recipesFiles[dataId].path}`, `public/images/`, [`${recipesFiles[dataId].fileName}`], archiveName)
        }

        const filesPromise = files.map(file => File.create(file))
        filesIds = await Promise.all(filesPromise)

        const recipeId = await Recipe.create({
            ...recipe
        })

        // Create Recipe_relation Recipe x Files
        let recipeRelations = []

        for (var countFile = 0; countFile < totalFiles; countFile++) {
            recipeRelations.push({
                recipe_id: recipeId,
                file_id: filesIds[countFile]
            })
        }

        const recipesRelationsPromise = recipeRelations.map(relation => RecipeRelation.create(relation))
        await Promise.all(recipesRelationsPromise)
    }
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()