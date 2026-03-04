import { prisma } from '~~/server/utils/db';
import { baseProcedure, createTRPCRouter } from '../init'
import { z } from 'zod'

export const appRouter = createTRPCRouter({
    hello: baseProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
    investors: baseProcedure.input(
        z.object({
            page: z.number().optional(),
            page_size: z.number().optional(),
        }),
    ).query(async (opts) => {
        const { page = 1, page_size = 10 } = opts.input;
        const skip = (page - 1) * page_size;
        const items = await prisma.investors.findMany({
            skip,
            take: page_size,
        });
        const total = await prisma.investors.count();
        return {
            items,
            total,
        };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;