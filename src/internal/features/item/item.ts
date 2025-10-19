import {prisma} from "../../../shared/db/prisma"
import {Prisma} from "@prisma/client"

export const ItemService = {
    async create(data: Prisma.ItemCreateInput) {

    const base = data.baseAmount ?? 0;
    const discount = data.discount ?? 0;
    data.totalAmount = base - discount;

    return prisma.item.create({ data });
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

    if (data.baseAmount !== undefined || data.discount !== undefined) {
      const base = Number(data.baseAmount ?? 0);
      const discount = Number(data.discount ?? 0);
      data.totalAmount = { set: base - discount };
    }

    return prisma.item.update({ where: { id }, data });
  },
}