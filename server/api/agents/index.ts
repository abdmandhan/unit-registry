import { prisma } from "../../utils/db";
import { validate } from "~~/shared/types/pagination";

export default defineEventHandler(async (event) => {
    try {
        const { page = 1, page_size = 10, sort_by = "id", sort_order = "desc" } = await getValidatedQuery(event, validate);

        const total = await prisma.agents.count();
        const agents = await prisma.agents.findMany({
            take: page_size,
            skip: (page - 1) * page_size,
            orderBy: { [sort_by]: sort_order },
            include: {
                agent_level: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return { items: agents, total: Number(total) };
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})