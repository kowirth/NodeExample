import './config'
import application from './App'
import * as http from 'http'

const PORT = process.env.APP_PORT || 8080
const HOST = process.env.APP_HOST || 'localhost'

const server = http.createServer(application.instance)

server.listen(PORT, () => {
  console.log(`Server running ${HOST}:${PORT}`)
})
