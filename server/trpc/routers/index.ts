import { baseProcedure, createTRPCRouter } from '../init'
import { z } from 'zod'
import { investorRouter } from './investor';

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
    investor: investorRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;