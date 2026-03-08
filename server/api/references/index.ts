import { Prisma } from "~~/prisma/generated/client";
import { prisma } from "../../utils/db";
import { validate } from "~~/shared/types/pagination";


export default defineEventHandler(async (event) => {
    try {
        const { filters = [], page = 1, page_size = 10, sort_by = "id", sort_order = "desc" } = await getValidatedQuery(event, validate);

        let where: Prisma.referencesWhereInput = {};

        if (filters && filters.length > 0) {
            for (const filter of filters) {
                if (filter.value) {
                    where.OR = [];
                    where.OR.push({ [filter.key]: { contains: filter.value, mode: "insensitive" } });
                }
            }
        }

        const total = await prisma.references.count({ where });
        const references = await prisma.references.findMany({
            take: page_size,
            skip: (page - 1) * page_size,
            orderBy: { [sort_by]: sort_order },
            where,
        });

        return { items: references, total: Number(total) };
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})