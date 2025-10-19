import {Request, Response, Router} from "express"
import {CategoryService} from "./category";
import {sendAPIError, sendAPIData} from "../../../shared/common/response";

const CategoryError = {
    NOT_FOUND: {status: 404, message: 'Category not found'},
    CREATE_FAILED: {status: 400, message: 'Failed to create category'},
    UPDATE_FAILED: {status: 400, message: 'Failed to update category'},
    GET_FAILED: {status: 500, message: 'Failed to get category'},
    INVALID_ID: {status: 400, message: 'Invalid category id'},
    INVALID_NAME: {status: 400, message: 'Invalid category name'}
}

const registerRoutes = (router: Router) => {
    router.post('/categories', createCategory)
    router.get('/categories', getAllCategories)
    router.get('/categories/search', getCategoryByName)
    router.get('/categories/:id', getCategoryById)
    router.put('/categories/:id', editCategory)
}

const createCategory = async (req: Request, res: Response) => {
    let category: any
    try {
        category = await CategoryService.create(req.body)
    } catch (e) {
        sendAPIError(res, CategoryError.CREATE_FAILED)
    }
    return sendAPIData(res, category)
}

const getAllCategories = async (req: Request, res: Response) => {
    let categories: any
    try {
        categories = await CategoryService.getAll()
    } catch (e) {
        sendAPIError(res, CategoryError.GET_FAILED)
    }
    return sendAPIData(res, categories)
}

const getCategoryById = async (req: Request, res: Response) => {
    let category: any
    try {
        const id = req.params.id
        if (!id) {
            return sendAPIError(res, CategoryError.INVALID_ID)
        }

        category = await CategoryService.getById(id)
        if (!category) {
            return sendAPIError(res, CategoryError.NOT_FOUND)
        }

    } catch (e) {
        return sendAPIError(res, CategoryError.GET_FAILED)
    }
    return sendAPIData(res, category)
}

const getCategoryByName = async (req: Request, res: Response) => {
    let category: any
    try {
        const {name} = req.query
        if (!name || typeof name !== 'string') {
            return sendAPIError(res, CategoryError.INVALID_NAME)
        }

        category = await CategoryService.getByName(name)
        if (!category) {
            return sendAPIError(res, CategoryError.NOT_FOUND)
        }

    } catch (e) {
        return sendAPIError(res, CategoryError.GET_FAILED)
    }
    return sendAPIData(res, category)
}

const editCategory = async (req: Request, res: Response) => {
    let category: any

    try {
        const id = req.params.id
        if (!id) {
            res.status(400).json({error: 'Category id is required'})
            return
        }

        category = await CategoryService.edit(id, req.body)
        if (!category) {
            return sendAPIError(res, CategoryError.NOT_FOUND)
        }

    } catch (e) {
        return sendAPIError(res, CategoryError.UPDATE_FAILED)
    }

    return sendAPIData(res, category)
}

export const CategoryHandler = {
    registerRoutes,
}