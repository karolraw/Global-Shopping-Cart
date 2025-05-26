const http = require("http")
const fs = require("fs")
const path = require("path")
const port = 3000

const server = http.createServer((request, response) => {
    let file = request.url === "/" ? "index.html": request.url
    let filePath = path.join(__dirname, file)
    let ext = path.extname(file)

    let types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript"
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            response.writeHead(404)
            response.end("File not found")
        } else {
            response.writeHead(200, {"Content-Type": types[ext] || "text/plain"})
            response.end(data)
        }
    })
})

server.listen(port, error => {
    if (error) {
        console.log("Something went wrong", error)
    } else {
        console.log("Server is listening on port " + port + ".")
    }
})


