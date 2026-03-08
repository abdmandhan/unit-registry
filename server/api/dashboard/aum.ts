import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
    try {
        const funds = await prisma.funds.findMany({
            select: {
                id: true,
                name: true,
            }
        })

        return funds;
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})