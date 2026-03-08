import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
    try {
        // only show the reference_name for filtering (unique)
        const references = await prisma.references.findMany({
            select: {
                reference_name: true,
            },
            distinct: ['reference_name'],
        });
        return references;
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})