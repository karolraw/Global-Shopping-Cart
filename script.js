let shoppingItems = JSON.parse(window.localStorage.getItem("shoppingItems")) || []

let budget = JSON.parse(window.localStorage.getItem("budget")) || 0
document.getElementById("budget").value = budget

document.getElementById("budget").addEventListener("input", totalCost)

document.getElementById("website-add").addEventListener("input", validateURL)

document.getElementById("price-add").addEventListener("input", validatePrice)

document.getElementById("previewImage-add").addEventListener("input", validateImageURL)


function totalCost() {
    let totalCost = 0
    for (let index = 0; index < shoppingItems.length; index++) {
        let shoppingItem = shoppingItems[index]
        let price = shoppingItem.price
        totalCost += price
    }

    let budget = document.getElementById("budget").value
    window.localStorage.setItem("budget", JSON.stringify(budget))
        
    document.getElementById("totalCost").textContent = `${totalCost.toFixed(2)} zł`
    document.getElementById("savings").textContent = `${(budget - totalCost).toFixed(2)} zł`

    if (totalCost < budget) {
        document.getElementById("savings").style.color = "green"
    } else {
        document.getElementById("savings").style.color = "red"
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
                        <td><img src="${shoppingItem.previewImage}" alt="Add Image"></td>
                        <td>${shoppingItem.importance}</td>
                        <td><button onclick="populateForm(${index})">Edit</button></td>
                        <td><button onclick="deleteRow(${index})">&times;</button></td>
                        `
        tableBody.appendChild(row)
    }

    totalCost()
    makeCharts("category", "pie-category", "legends-category")
    makeCharts("importance", "pie-importance", "legends-importance")
}

function addShoppingItem() {
    const website = document.getElementById("website-add")
    const store = document.getElementById("store-add")
    const description = document.getElementById("description-add")
    const price = document.getElementById("price-add")
    const category = document.getElementById("category-add")
    const previewImage = document.getElementById("previewImage-add")
    const importance = document.getElementById("importance-add")

    const checkbox = document.getElementById("previewImage-add-checkbox")

    if (website.style.color === "red" || price.style.color === "red" || (previewImage.style.color === "red" && !checkbox.checked)) {
        alert("Please correct inputs before adding an item.")
        return
    }

    if (!website.value || !store.value || !description.value || !price.value || category.value === "Select Category" || (!previewImage.value && !checkbox.checked) || importance.value === "Select Importance") {
        alert("Please fill in all fields before adding an item.")
        return
    }

    let shoppingItem = {
        website: website.value,
        store: store.value,
        description: description.value,
        price: Number(price.value),
        category: category.value,
        previewImage: previewImage.value,
        importance: importance.value
    }

    shoppingItems.push(shoppingItem)
    window.localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    createRows() // Refresh the table

    collapseForm()
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

function resetForm() {
    document.getElementById("website-add").value = null
    document.getElementById("website-add").style.color = "black"
    document.getElementById("store-add").value = null
    document.getElementById("description-add").value = null
    document.getElementById("price-add").value = null
    document.getElementById("price-add").style.color = "black"
    document.getElementById("category-add").value = "Select Category"
    document.getElementById("previewImage-add").value = null
    document.getElementById("previewImage-add").style.color = "black"
    document.getElementById("importance-add").value = "Select Importance"

    document.getElementById("website-add-error").textContent = ""
    document.getElementById("price-add-error").textContent = ""
    document.getElementById("previewImage-add-error").textContent = ""

    document.getElementById("previewImage-add-checkbox").checked = false
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

function makeCharts(itemProp, pieChartId, legendsId) {
    
    const totalCost = shoppingItems.reduce((acc, item) => acc + item.price, 0)
    const rawSumByCategory = shoppingItems.reduce((acc, item) => {
        acc[item[itemProp]] = (acc[item[itemProp]] || 0) + item.price
        return acc
    }, {})

    const sumByCategory = {}
    Object.keys(rawSumByCategory).forEach(category => {
        sumByCategory[category] = (rawSumByCategory[category]/totalCost) * 100
    })

    const pieChart = document.getElementById(pieChartId)
    const colorList = ["red", "green", "blue", "purple", "yellow", "pink", "orange"]

    let start = 0
    let i = 0
    const gradientParts = []

    for (const [category, percent] of Object.entries(sumByCategory)) {
        end = start + percent
        color = colorList[i % colorList.length]
        gradientParts.push(`${color} ${start}% ${end}%`)
        start = end
        i++
    }

    pieChart.style.backgroundImage = `
        radial-gradient(lightcyan 0 30%, transparent 30% 60%, lightcyan 60% 100%),
        conic-gradient(from -45deg, ${gradientParts.join(", ")})
        `

    const legends = document.getElementById(legendsId)
    legends.innerHTML = ""

    let j=0
    for (const [category, percent] of Object.entries(sumByCategory)) {
        const total = rawSumByCategory[category]
        const span = document.createElement("span")
        span.classList.add(colorList[j % colorList.length]) 
        span.textContent = `${category}: ${total.toFixed(2)} zł (${percent.toFixed(2)}%)`
        legends.appendChild(span)
        j++
    }
}

function validatePrice() {
    const price = document.getElementById("price-add")
    const valid = /^\d{0,5}(\.\d{0,2})?$/.test(price.value)
    
    if (valid) {
        price.style.color = "black"
        document.getElementById("price-add-error").textContent = ""
    } else {
        price.style.color = "red"
        document.getElementById("price-add-error").textContent = "!"
        document.getElementById("price-add-error").style.color = "red"
        document.getElementById("price-add-error").style.fontWeight = "bold"

    }
}

function validateURL() {
    const url = document.getElementById("website-add")
    const valid = url.value.startsWith("http://") || url.value.startsWith("https://")
    
    if (!url.value) {
        url.style.color = "black"
        document.getElementById("website-add-error").textContent = ""
    } else if (valid) {
        url.style.color = "black"
        document.getElementById("website-add-error").textContent = ""
        getStoreName()
    } else {
        url.style.color = "red"
        document.getElementById("website-add-error").textContent = "!"
        document.getElementById("website-add-error").style.color = "red"
        document.getElementById("website-add-error").style.fontWeight = "bold"  
    }
}

function getStoreName() {
    const url = new URL(document.getElementById("website-add").value)
    const hostname = url.hostname
    const store = document.getElementById("store-add")
    
    shoppingItems.forEach(obj => {
        if (new URL(obj.website).hostname === hostname) {
            store.value = obj.store
        }
    })
}

function collapseForm() {
    resetForm()
    document.getElementById("modal-add-item").style.display = "none"
}

function validateImageURL() {
    const url = document.getElementById("previewImage-add")
    const valid = url.value.startsWith("http://") || url.value.startsWith("https://")

    if (valid || !url.value) {
        url.style.color = "black"
        document.getElementById("previewImage-add-error").textContent = ""
    } else {
        url.style.color = "red"
        document.getElementById("previewImage-add-error").textContent = "!"
        document.getElementById("previewImage-add-error").style.color = "red"
        document.getElementById("previewImage-add-error").style.fontWeight = "bold"  
    }
}
