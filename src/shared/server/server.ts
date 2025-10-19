import express, {type Express, Router} from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const server: Express = express()
const router = Router()

server.use(morgan('dev'))
server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use('/api', router)
router.get('/', (req, res) => {
    res.status(200)
    res.send('Hello world')
})

export {server, router}