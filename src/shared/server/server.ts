import express, {type Express, Router} from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import {CategoryHandler} from "../../internal/features/category/handler";
import {SubCategoryHandler} from "../../internal/features/subcategory/handler";
import {ItemHandler} from "../../internal/features/item/handler";

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

// Handlers
CategoryHandler.registerRoutes(router)
SubCategoryHandler.registerRoutes(router)
ItemHandler.registerRoutes(router)

export {server, router}