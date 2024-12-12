import http from 'http'
import {v4} from 'uuid'

// setup do server
const porta = 3000

const grades = [ ]

const servidor = http.createServer((req, res) => {

    //funçoes do backend

    const {method, url } = req
    let body = ' '

    req.on('data', chunk =>{
        body += chunk.toString()
    })

    req.on('end', () =>{
        const id = url.split('/') [2]

        //get
        if(url === '/grades' && method === 'GET'){
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(grades))
        } 

        //post
        else if(url === '/grades' && method === 'POST'){
            const {studantName, subject, grade} = JSON.parse(body)
            const newGrade = {id: v4(), studantName, subject, grade}
            grades.push(newGrade)
            res.writeHead(201, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(newGrade))
        }

        // put
        else if(url.startsWith ('/grades/') && method === 'PUT'){
                const {studantName, subject, grade} = JSON.parse(body)
                const gradesToUpdate = grades.find((g) => g.id === id)

                if(gradesToUpdate) {

                    gradesToUpdate.studantName = studantName
                    gradesToUpdate.subject = subject
                    gradesToUpdate.grade = grade
                    res.writeHead(200, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify(gradesToUpdate))
                } else{
                    res.writeHead(404, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify({message: 'grade not found'}))
                }
        } 
        
        // delete
        else if(url.startsWith ('/grades/') && method === 'DELETE'){
            const index = grades.findIndex((g) => g.id === id)
            if(index !== -1) {
                grades.splice(index, 1)
                res.writeHead(204)
                res.end()
            }  else {
                res.writeHead(404, {'Content-Type': 'application/json'})
                res.end(JSON.stringify({message: 'grade not found'}))
            }
        }
        
        // erro
        else {
            res.writeHead(404, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({message: 'Route not found'}))
        }
    
    })

})

servidor.listen(porta, () =>{
    console.log(`Servidor rodando na porta ${porta}`)
})




