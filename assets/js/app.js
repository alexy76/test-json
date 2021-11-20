// Chargement du fichier movies.json dans le LocalStorage (stockage du fichier .json dans l'environnement du navigateur)
const getJsonStringify = async () => {
    const response = await fetch("assets/json/movies.json")
    response.ok ? localStorage.setItem("wik", JSON.stringify(await response.json())) : alert('Impossible de charger le fichier movies.json')
}
// SI le fichier n'a pas été stocké dans le navigateur ALORS on fait appel à la fonction pour le charger et on reload la page
if (localStorage.getItem("wik") === null) {
    getJsonStringify()
    location.reload()
}



// **************DEBUT SCRIPT*****************//
const btnPagination = document.getElementById("btnPagination")
let arrayBtnDelete
let myObjJson = JSON.parse(localStorage.getItem("wik"))  //    <----- on récupère le fichier .json depuis le local storage


// Affichage des Cards APRES le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    addBtnPagination(myObjJson.results.length)
    generateCards(myObjJson, 0, 7)
})

// Nouvelle requête en fonction du choix de la pagination
btnPagination.addEventListener("click", (e) => {
    if (e.target.nodeName == "BUTTON") {
        btnPagination.innerHTML = ""
        movies.innerHTML = ""
        addBtnPagination(myObjJson.results.length)
        minMax = e.target.dataset.interval.split(",")  //  <-- on récupère le dataset des balises HTML qui ont été générées pour obtenir le Min et le Max pour obtenir l'interval des élements qui seront affiché
        generateCards(myObjJson, minMax[0], minMax[1])
    }
})

// Recherche de nouveau film dans la modale ! (en cours de conception)
document.getElementById("displayAddMovie").addEventListener("click", () => {
    fetch(`https://imdb-api.com/en/API/SearchMovie/k_4tz89vls/${document.getElementById("valueMovie").value}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("valueMovie").value = ""
            document.getElementById("displaySearchMovie").innerHTML = ""
            data.results.forEach(element => {
                 document.getElementById("displaySearchMovie").innerHTML += `<img src="${element.image}" alt="${element.title}" data-id="${element.id}" width="100%">`
            })
        })
        .catch(err => {
            console.error(err);
        });
})


function addBtnPagination(nbElement) {
    eltPerPage = 8
    nbPage = Math.ceil(nbElement / eltPerPage)
    let arrayIntervalBtn = []
    for (i = 0; i < nbPage; i++) {
        if (i == 0) {
            arrayIntervalBtn.push([i, eltPerPage - 1])
        } else if (nbPage > 0 && i < nbPage - 1) {
            arrayIntervalBtn.push([eltPerPage, (eltPerPage + 8) - 1])
            eltPerPage += 8
        } else {
            arrayIntervalBtn.push([eltPerPage, nbElement - 1])
        }
    }
    for (i = 0; i < nbPage; i++) {
        document.getElementById("btnPagination").innerHTML += `<button class="btn btn-warning me-2" type="button" data-interval="${arrayIntervalBtn[i][0]},${arrayIntervalBtn[i][1]}">${i+1}</button>`
    }
}

function generateCards(myObj, min, max) {

    myObj.results.forEach((element, index) => {

        if (index >= min && index <= max) {
            let note = ''
            let varTmp = Math.floor(element.vote_average / 2)
            for (i = 0; i <= varTmp; i++) {
                note += `<i class="fas fa-star"></i>`
            }
            if (varTmp < 5) {
                for (i = 0; i < 4 - varTmp; i++) {
                    note += `<i class="far fa-star"></i>`
                }
            }
            movies.innerHTML += `
        
            <div class="card mb-3 col-lg-3 p-2" style="max-width: 300px;">
            <div class="row g-0">
                <div class="col-md-4">
                <img src="${element.poster_path}" class="img-fluid rounded" alt="${element.original_title}">
                </div>
                <div class="col-md-8">
                <div class="card-body position-relative px-2 py-0">
                    <h5 class="card-title text-truncate mt-lg-0 mt-2">${element.original_title}</h5>
                    <p class="card-text overflow-auto pe-3 text-align-justify" style="font-size: 0.8rem; max-height: 90px; height: 100px">${element.overview}</p>
                    <p class="position-absolute bottom-1 start-50 translate-middle-x card-text"><small class="text-muted">${note}</small></p>
                </div>
                </div>
                <button class="btn btn-dark mt-5" type="button">Regarder le film</button>
                <button id ="${element.id}" class="delete btn btn-warning mt-2" type="button" data-index="${index}">Supprimer</button>
            </div>
            </div>
        
            `
        }
    })

    arrayBtnDelete = Array.from(document.getElementsByClassName("delete"))

    arrayBtnDelete.forEach((element, index) => {

        element.addEventListener("click", () => {


            getMyNewObj()
            console.log(myObjJson)

            myObjJson.results.forEach((value, index) => {
                if (index == element.dataset.index) {
                    console.log(index)
                    myObjJson.results.splice(index, 1)
                    setMyNewObj()
                    location.reload()
                }
            })
            console.log(myObjJson)
        })
    })
}

function getMyNewObj() {
    return myObjJson = JSON.parse(localStorage.getItem("wik"))
}

function setMyNewObj() {
    localStorage.setItem("wik", JSON.stringify(myObjJson))
    getMyNewObj()
}


// Bouton permettant de recharger le fichier .json d'origine 
reload.addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})