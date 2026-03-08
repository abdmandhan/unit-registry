import { prisma } from "../../utils/db";
import { validate } from "~~/shared/types/dashboard/funds";

export default defineEventHandler(async (event) => {
    try {
        const { page = 1, page_size = 10, sort_by = "id", sort_order = "desc" } = validate(getQuery(event));

        const funds = await prisma.funds.findMany({
            skip: (page - 1) * page_size,
            take: page_size,
            orderBy: {
                [sort_by]: sort_order,
            },
        });

        const total = await prisma.funds.count();

        return {
            funds,
            total,
        };
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})