const currentPage = location.pathname
const menuItems = document.querySelectorAll(".links a")

for (item of menuItems ) {
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

// Ask the user if really wants to delete
const formDelete = document.querySelector("#form-delete")
if (formDelete) {
    formDelete.addEventListener("submit", function(event) {
        const confirmation = confirm("Deseja Deletar?")
        if(!confirmation) {
            event.preventDefault()
        }
    })
}

// Hide/Show elements: ingredients, preparation and information.
const HideShowElement = {
    changeStatus(event) {
        const btn_event = event.target
        
        if(btn_event.innerHTML == "ESCONDER") {
            this.hide(event)
        } else {
            this.show(event)
        }
    },
    hide(event) {
        const divTitle = event.target.parentNode
        const divItem = divTitle.parentNode
        event.target.innerHTML = "MOSTRAR"
        
        divItem.querySelector('.hide-item').classList.remove('show')
        divItem.querySelector('.hide-item').classList.add('hide')
    },
    show(event) {
        const divTitle = event.target.parentNode
        const divItem = divTitle.parentNode
        event.target.innerHTML = "ESCONDER"
        
        divItem.querySelector('.hide-item').classList.remove('hide')
        divItem.querySelector('.hide-item').classList.add('show')
    }
}

const PhotosUpload = {
    input: "",
    preview_profile: document.querySelector('#photo-profile-preview'),
    preview_recipe: document.querySelector('#photos-recipe-preview'),
    profileUploadLimit: 1,
    recipeUploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview_profile.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    handleFileInputRecipe(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview_recipe.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { profileUploadLimit, recipeUploadLimit, input, preview_profile, preview_recipe } = PhotosUpload
        const { files: fileList } = input

        if (preview_profile) {

            if (fileList.length > profileUploadLimit ) {
                alert(`Envie no máximo ${profileUploadLimit} fotos`)
                event.preventDefault()
                return true
            }

            const photosDiv = []
            preview_profile.childNodes.forEach(item => {
                if (item.classList && item.classList.value == "photo")
                    photosDiv.push(item)
            })

            const totalPhotos = fileList.length + photosDiv.length
            if ( totalPhotos > profileUploadLimit) {
                alert("Você atingiu o limite máximo de fotos")
                event.preventDefault()
                return true
            }
        }

        if (preview_recipe) {

            if (fileList.length > recipeUploadLimit) {
                alert(`Envie no máximo ${recipeUploadLimit} fotos`)
                alert.preventDefault()
                return true
            }

            const photosDiv = []
            preview_recipe.childNodes.forEach(item => {
                if (item.classList && item.classList.value == "photo")
                    photosDiv.push(item)
            })

            const totalPhotos = fileList.length + photosDiv.length
            if ( totalPhotos > recipeUploadLimit) {
                alert("Você atingiu o limite máximo de fotos")
                event.preventDefault()
                return true
            }

        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "delete"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        
        if (PhotosUpload.preview_profile) {
            const photosArray = Array.from(PhotosUpload.preview_profile.children)

            const index = photosArray.indexOf(photoDiv)

            PhotosUpload.files.splice(index, 1)
            PhotosUpload.input.files = PhotosUpload.getAllFiles()

            photoDiv.remove()
        }

        if (PhotosUpload.preview_recipe) {
            const photosArray = Array.from(PhotosUpload.preview_recipe.children)

            const index = photosArray.indexOf(photoDiv)

            PhotosUpload.files.splice(index, 1)
            PhotosUpload.input.files = PhotosUpload.getAllFiles()

            photoDiv.remove()
        }
        
    },
    removeOldPhotos(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const AddItems = {
    addIngredient(event) {

        const ingredients = document.querySelector('#ingredients')
        const fieldContainer = document.querySelectorAll('.ingredient')

        const newField = fieldContainer[fieldContainer.length -1].cloneNode( true )

        if(newField.children[0].value == "") return false

        newField.children[0].value = ""
        ingredients.appendChild(newField)

    },
    addPreparation(event) {

        const preparations = document.querySelector('#preparations')
        const fieldContainer = document.querySelectorAll('.preparation')

        const newField = fieldContainer[fieldContainer.length -1].cloneNode( true )

        if(newField.children[0].value == "") return false

        newField.children[0].value = ""
        preparations.appendChild(newField)

    }
}

const ImageGallery = {

    hightlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        
        target.classList.add('active')

        ImageGallery.hightlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)
        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error)
            Validate.displayError(input, results.error)
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('messages')
        div.classList.add('input-field')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')
        if (errorDiv)
            errorDiv.remove()
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        
        if(!value.match(mailFormat))
            error = "Email inválido"

        return {
            error,
            value
        }
    },
    allFields(e) {
        const items = document.querySelectorAll(' .item input, .item select, .item textarea')

        for (item of items) {
            if (item.value == "") {
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.style.position = 'fixed'
                message.innerHTML = "Todos os campos são obrigatórios."
                document.querySelector('body').appendChild(message)
                e.preventDefault()
            }
        }

    }
}

// Paginação
function paginate(selectedPage, totalPages){

    let pages = [],
        oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++) {
        
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if ( firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage ) {
            if ( oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if ( oldPage && currentPage - oldPage == 2 ) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const filter = pagination.dataset.filter

    const pages = paginate(page, total)

    elements = ""

    for (let page of pages) {

        if ( String(page).includes("...") ) {
            elements += `<span>${page}</span>`
        } else {   
            if ( filter ) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}