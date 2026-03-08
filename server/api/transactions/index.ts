import { prisma } from "../../utils/db";
import { validate } from "~~/shared/types/pagination";


export default defineEventHandler(async (event) => {
    try {
        const { page = 1, page_size = 10, sort_by = "id", sort_order = "desc" } = await getValidatedQuery(event, validate);

        const total = await prisma.transactions.count();
        const transactions = await prisma.transactions.findMany({
            take: page_size,
            skip: (page - 1) * page_size,
            orderBy: { [sort_by]: sort_order },
            include: {
                investor: {
                    select: {
                        id: true,
                        full_name: true,
                    },
                },
                fund: {
                    select: {
                        id: true,
                        code: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                transaction_banks: {
                    select: {
                        id: true,
                        bank_id: true,
                    },
                },
            },
        });
        return {
            transactions,
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