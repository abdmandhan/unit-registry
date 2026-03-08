import { prisma } from "../../utils/db";
import { validate } from "~~/shared/types/pagination";

export default defineEventHandler(async (event) => {
    try {
        const { page = 1, page_size = 10, sort_by = "date", sort_order = "desc" } = await getValidatedQuery(event, validate);

        const total = await prisma.fund_navs.count();
        const navs = await prisma.fund_navs.findMany({
            take: page_size,
            skip: (page - 1) * page_size,
            orderBy: { [sort_by]: sort_order },
            include: {
                fund: {
                    select: {
                        id: true,
                        code: true,
                    },
                },
            },
        });

        return { items: navs, total: Number(total) };
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})