import {prisma} from "../../../shared/db/prisma"
import {Prisma} from "@prisma/client"

export const ItemService = {
    async create(data: Prisma.ItemCreateInput) {
        return prisma.item.create({data})
    },

    async getAll() {
        return prisma.item.findMany({orderBy: {createdAt: 'desc'}})
    },

    async getById(id: string) {
        return prisma.item.findUnique({where: {id}})
    },

    async getByName(name: string) {
        return prisma.item.findMany({where: {name}})
    },

    async getByCategory(categoryId: string) {
        return prisma.item.findMany({where: {categoryId}})
    },

    async getBySubCategory(subCategoryId: string) {
        return prisma.item.findMany({where: {subCategoryId}})
    },

    async edit(id: string, data: Prisma.ItemUpdateInput) {
        return prisma.item.update({where: {id}, data})
    }
}