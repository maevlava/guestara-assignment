import {prisma} from "../../../shared/db/prisma";
import {Prisma} from "@prisma/client";

export const CategoryService = {
    async create(data: Prisma.CategoryCreateInput) {
        return prisma.category.create({data})
    },

    async getAll() {
        return prisma.category.findMany({orderBy: {createdAt: 'desc'}})
    },

    async getById(id: string) {
        return prisma.category.findUnique({where: {id}})
    },

    async getByName(name: string) {
        return prisma.category.findFirst({where: {name}})
    },

    async edit(id: string, data: Prisma.CategoryUpdateInput) {
        return prisma.category.update({where: {id}, data})
    }
}