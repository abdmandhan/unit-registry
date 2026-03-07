import { baseProcedure, createTRPCRouter } from "../init"
import { z } from "zod"
import { prisma } from "~~/server/utils/db"


export const transactionsRouter = createTRPCRouter({
    list: baseProcedure.input(
        z.object({
            page: z.number().optional(),
            page_size: z.number().optional(),
            sort_by: z.string().optional(),
            sort_order: z.string().optional(),
        }),
    )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1;
            const limit = input?.page_size ?? 10;
            const skip = (page - 1) * limit;
            const sort = input?.sort_by ?? "transaction_date";
            const sort_order = input?.sort_order ?? "desc";

            const total = await prisma.transactions.count();
            const transactions = await prisma.transactions.findMany({
                skip,
                take: limit,
                orderBy: { [sort]: sort_order },
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
        }),
});