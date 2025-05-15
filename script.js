let shoppingItems = JSON.parse(window.localStorage.getItem("shoppingItems")) || []

document.getElementById("budget").addEventListener("input", totalCost)

function totalCost() {
    let totalCost = 0
    for (let index = 0; index < shoppingItems.length; index++) {
        let shoppingItem = shoppingItems[index]
        let price = shoppingItem.price
        totalCost += price
    }

    let budget = document.getElementById("budget").value

    if (totalCost < budget) {
        document.getElementById("totalCost").textContent = `${totalCost.toFixed(2)} zł`
        document.getElementById("totalCost").style.color = "green"
    } else {
        document.getElementById("totalCost").textContent = `${totalCost.toFixed(2)} zł (budget exceeded by ${(totalCost - budget).toFixed(2)} zł!)`
        document.getElementById("totalCost").style.color = "red"
    }

}

function createRows() {
    const tableBody = document.getElementById("tableBody")

    tableBody.innerHTML = ""

    let shoppingItems = JSON.parse(window.localStorage.getItem("shoppingItems"))
    if (!shoppingItems) {
        return
    } 

    for (let index = 0; index < shoppingItems.length; index++) {
        const row = document.createElement("tr")
        let shoppingItem = shoppingItems[index]

        row.id = index
        row.innerHTML = `<td>${shoppingItem.description}</td>
                        <td>${shoppingItem.store}</td>
                        <td>${shoppingItem.price.toFixed(2)} zł</td>
                        <td>${shoppingItem.category}</td>
                        <td><a href=${shoppingItem.website} target="_blank">&#128279;</a></td>
                        <td><button onclick='document.getElementById("preview").src = "${shoppingItem.previewImage}"' style="background: none; border: none; cursor: pointer;">&#128269;</button></td>
                        <td>${shoppingItem.importance}</td>
                        <td><button onclick="populateForm(${index})">Edit</button></td>
                        <td><button onclick="deleteRow(${index})">&times;</button></td>
                        `
        tableBody.appendChild(row)
    }

    totalCost()
}

function addShoppingItem() {
    let shoppingItem = {}

    shoppingItem.description = document.getElementById("description-add").value
    shoppingItem.store = document.getElementById("store-add").value
    shoppingItem.price = Number(document.getElementById("price-add").value)
    shoppingItem.category = document.getElementById("category-add").value
    shoppingItem.website = document.getElementById("website-add").value
    shoppingItem.previewImage = document.getElementById("previewImage-add").value
    shoppingItem.importance = document.getElementById("importance-add").value

    shoppingItems.push(shoppingItem)
    window.localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    createRows() // Refresh the table

    document.getElementById("description-add").value = null
    document.getElementById("store-add").value = "Select Store"
    document.getElementById("price-add").value = null
    document.getElementById("category-add").value = "Select Category"
    document.getElementById("website-add").value = null
    document.getElementById("previewImage-add").value = null
    document.getElementById("importance-add").value = "Select Importance"
} 

function clearStorage() {
    window.localStorage.clear()
    shoppingItems = []
    createRows()
}

function deleteRow(index) {
    shoppingItems.splice(index, 1)
    window.localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    createRows() 
}

function populateForm(index) {
    let shoppingItem = shoppingItems[index]

    document.getElementById("modal-edit-item").style.display = "flex"

    document.getElementById("description-edit").value = shoppingItem.description
    document.getElementById("store-edit").value = shoppingItem.store
    document.getElementById("price-edit").value = shoppingItem.price
    document.getElementById("category-edit").value = shoppingItem.category
    document.getElementById("website-edit").value = shoppingItem.website
    document.getElementById("previewImage-edit").value = shoppingItem.previewImage
    document.getElementById("importance-edit").value = shoppingItem.importance

    const button = document.getElementById("button-edit")
    button.addEventListener("click", function (e) {editRow(e, index)})
}

function editRow(e, index) {
    let shoppingItem = {}

    shoppingItem.description = document.getElementById("description-edit").value
    shoppingItem.store = document.getElementById("store-edit").value
    shoppingItem.price = Number(document.getElementById("price-edit").value)
    shoppingItem.category = document.getElementById("category-edit").value
    shoppingItem.website = document.getElementById("website-edit").value
    shoppingItem.previewImage = document.getElementById("previewImage-edit").value
    shoppingItem.importance = document.getElementById("importance-edit").value

    shoppingItems.splice(index, 1, shoppingItem) // Delete and insert at the same index
    window.localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    createRows() 
}

function sortDown(property, isText=true) {
    if (isText) {
        shoppingItems.sort((a, b) => a[property].localeCompare(b[property]))
    } else {
        shoppingItems.sort((a, b) => a[property] - b[property])
    }
    
    window.localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    createRows() 
}

function sortUp(property, isText=true) {
    if (isText) {
        shoppingItems.sort((a, b) => b[property].localeCompare(a[property]))
    } else {
        shoppingItems.sort((a, b) => b[property] - a[property])
    }

    shoppingItems.sort((a, b) => b[property] - a[property])
    window.localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    createRows() 
}
