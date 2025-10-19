import {Router, Request, Response} from "express";
import {SubCategoryService} from "./subcategory";
import {sendAPIData, sendAPIError} from "../../../shared/common/response";

const SubCategoryError = {
    NOT_FOUND: {status: 404, message: "SubCategory not found"},
    CREATE_FAILED: {status: 400, message: "Failed to create subcategory"},
    UPDATE_FAILED: {status: 400, message: "Failed to update subcategory"},
    GET_FAILED: {status: 500, message: "Failed to get subcategory"},
    INVALID_ID: {status: 400, message: "Invalid subcategory id"},
    INVALID_CATEGORY_ID: {status: 400, message: "Invalid category id"},
}

const registerRoutes = (router: Router) => {
    router.post("/subcategories", createSubCategory)
    router.get("/subcategories", getAllSubCategories)
    router.get("/categories/:categoryId/subcategories", getAllSubCategoriesByCategoryId)
    router.get("/subcategories/:id", getSubCategoryById)
    router.put("/subcategories/:id", editSubCategory)
}
const createSubCategory = async (req: Request, res: Response) => {
    let subCategory: any
    try {
        subCategory = await SubCategoryService.create(req.body)
    } catch (e) {
        return sendAPIError(res, SubCategoryError.CREATE_FAILED)
    }
    return sendAPIData(res, subCategory)
}

const getAllSubCategories = async (req: Request, res: Response) => {
    let subcategories: any
    try {
        subcategories = await SubCategoryService.getAll()
    } catch (e) {
        return sendAPIError(res, SubCategoryError.GET_FAILED)
    }
    return sendAPIData(res, subcategories)
}

const getAllSubCategoriesByCategoryId = async (req: Request, res: Response) => {
    let subcategories: any
    try {
        const {categoryId} = req.params
        if (!categoryId) {
            return sendAPIError(res, SubCategoryError.INVALID_CATEGORY_ID)
        }

        subcategories = await SubCategoryService.getByCategory(categoryId)
        if (!subcategories) {
            return sendAPIError(res, SubCategoryError.NOT_FOUND)
        }

    } catch (e) {
        return sendAPIError(res, SubCategoryError.GET_FAILED)
    }
    return sendAPIData(res, subcategories)
}

const getSubCategoryById = async (req: Request, res: Response) => {
    let subcategory: any
    try {
        const {id} = req.params
        if (!id) {
            return sendAPIError(res, SubCategoryError.INVALID_ID)
        }

        subcategory = await SubCategoryService.getById(id)
        if (!subcategory) {
            return sendAPIError(res, SubCategoryError.NOT_FOUND)
        }

    } catch (e) {
        return sendAPIError(res, SubCategoryError.GET_FAILED)
    }

    return sendAPIData(res, subcategory)
}

const editSubCategory = async (req: Request, res: Response) => {
    let subcategory: any
    try {
        const {id} = req.params
        if (!id) {
            return sendAPIError(res, SubCategoryError.INVALID_ID)
        }

        subcategory = await SubCategoryService.edit(id, req.body)
        if (!subcategory) {
            return sendAPIError(res, SubCategoryError.NOT_FOUND)
        }

    } catch (e) {
        return sendAPIError(res, SubCategoryError.UPDATE_FAILED)
    }
    return sendAPIData(res, subcategory)
}

export const SubCategoryHandler = {
    registerRoutes,
}