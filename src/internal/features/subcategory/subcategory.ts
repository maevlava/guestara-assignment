import {prisma} from "../../../shared/db/prisma"
import {Prisma} from "@prisma/client"

export const SubCategoryService = {
    async create(data: Prisma.SubCategoryCreateInput) {
        return prisma.subCategory.create({data})
    },

    async getAll() {
        return prisma.subCategory.findMany({orderBy: {createdAt: 'desc'}})
    },

    async getById(id: string) {
        return prisma.subCategory.findUnique({where: {id}})
    },

    async getByCategory(categoryId: string) {
        return prisma.subCategory.findMany({where: {categoryId}})
    },

    async edit(id: string, data: Prisma.SubCategoryUpdateInput) {
        return prisma.subCategory.update({where: {id}, data})
    }

}