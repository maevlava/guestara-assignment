import { Router, Request, Response } from "express";
import {sendAPIData, sendAPIError} from "../../../shared/common/response";
import {ItemService} from "./item";

const ItemError = {
    NOT_FOUND: { status: 404, message: "Item not found" },
    CREATE_FAILED: { status: 400, message: "Failed to create item" },
    UPDATE_FAILED: { status: 400, message: "Failed to update item" },
    GET_FAILED: { status: 500, message: "Failed to get items" },
    INVALID_ID: { status: 400, message: "Invalid item id" },
    INVALID_CATEGORY_ID: {status: 400, message: "Invalid category id"},
    INVALID_SUBCATEGORY_ID: {status: 400, message: "Invalid subcategory id"},
    INVALID_NAME: {status: 400, message: 'Invalid category name'},
    INVALID_NOT_UNDER_CATEGORY_OR_SUBCATEGORY: {
        status: 400,
        message: "Item must belong to either a category or a subcategory"
    },
    INVALID_UNDER_BOTH_CATEGORY_AND_SUBCATEGORY: {
        status: 400,
        message: "Item cannot belong to both category and subcategory"
    }
}

const registerRoutes = (router: Router) => {
    router.post("/items", createItem)
    router.get("/items", getAllItems)
    router.get("/items/search", getItemsByName)
    router.get("/items/:id", getItemById)
    router.get("/categories/:categoryId/items", getAllItemsByCategory)
    router.get("/subcategories/:subCategoryId/items", getAllItemsBySubCategoryId)
    router.put("/items/:id", editItem)
}

const createItem = async (req: Request, res: Response) => {
    let item: any
    try {

        // Application level to implement logic belongs to category or subcategory
        // cuz prisma doesnt support conditional requirements
        const validation = isUnderCategoryOrSubCategory(req.body)
        if (!validation.isValid) {
            return sendAPIError(res, validation.error!)
        }

        item = await ItemService.create(req.body)
    } catch {
        return sendAPIError(res, ItemError.CREATE_FAILED)
    }
    return sendAPIData(res, item)
}

const getAllItems = async (req: Request, res: Response) => {
    let items: any
    try {
        items = await ItemService.getAll()
    } catch {
        return sendAPIError(res, ItemError.GET_FAILED)
    }
    return sendAPIData(res, items)
}

const getItemById = async (req: Request, res: Response) => {
    let item: any
    try {
        const { id } = req.params
        if (!id) {
            return sendAPIError(res, ItemError.INVALID_ID)
        }

        item = await ItemService.getById(id)
        if (!item) {
            return sendAPIError(res, ItemError.NOT_FOUND)
        }

    } catch {
        return sendAPIError(res, ItemError.GET_FAILED)
    }
    return sendAPIData(res, item)
}

const getAllItemsByCategory = async (req: Request, res: Response) => {
    let items: any
    try {
        const { categoryId } = req.params
        if (!categoryId) {
            return sendAPIError(res, ItemError.INVALID_CATEGORY_ID)
        }

        items = await ItemService.getByCategory(categoryId)
        if (!items) {
            return sendAPIError(res, ItemError.NOT_FOUND)
        }
    } catch {
        return sendAPIError(res, ItemError.GET_FAILED)
    }
    return sendAPIData(res, items)
}

const getAllItemsBySubCategoryId = async (req: Request, res: Response) => {
    let items: any
    try {
        const { subCategoryId } = req.params
        if (!subCategoryId) {
            return sendAPIError(res, ItemError.INVALID_SUBCATEGORY_ID)
        }

        items = await ItemService.getBySubCategory(subCategoryId)
        if (!items) {
            return sendAPIError(res, ItemError.NOT_FOUND)
        }

    } catch {
        return sendAPIError(res, ItemError.GET_FAILED)
    }

    return sendAPIData(res, items)
}

const getItemsByName = async (req: Request, res: Response) => {
    let items: any
    try {
        const {name} = req.query
        if (!name || typeof name !== 'string') {
            return sendAPIError(res, ItemError.INVALID_NAME)
        }

        items = await ItemService.getByName(name)
        if (!items) {
            return sendAPIError(res, ItemError.NOT_FOUND)
        }

    } catch {
        return sendAPIError(res, ItemError.GET_FAILED)
    }

    return sendAPIData(res, items)
}

const editItem = async (req: Request, res: Response) => {
    let item: any
    try {
        const { id } = req.params
        if (!id) {
            return sendAPIError(res, ItemError.INVALID_ID)
        }
        item = await ItemService.edit(id, req.body)
        if (!item) {
            return sendAPIError(res, ItemError.NOT_FOUND)
        }

    } catch {
        return sendAPIError(res, ItemError.UPDATE_FAILED)
    }

    return sendAPIData(res, item)
}

const isUnderCategoryOrSubCategory = (reqBody: any) => {
    const { category, subCategory, categoryId, subCategoryId } = reqBody
    const hasCategory = !!(categoryId || category)
    const hasSubCategory = !!(subCategoryId || subCategory)

    if (!hasCategory && !hasSubCategory) {
        return {
            isValid: false,
            error: ItemError.INVALID_NOT_UNDER_CATEGORY_OR_SUBCATEGORY
        }
    }

    if (hasCategory && hasSubCategory) {
        return {
            isValid: false,
            error: ItemError.INVALID_UNDER_BOTH_CATEGORY_AND_SUBCATEGORY
        }
    }

    return { isValid: true }
}

export const ItemHandler = { registerRoutes }
