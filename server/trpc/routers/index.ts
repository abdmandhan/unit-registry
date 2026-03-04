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
    investors: baseProcedure.query(async () => {
        return await prisma.investors.findMany({ take: 10 });
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;