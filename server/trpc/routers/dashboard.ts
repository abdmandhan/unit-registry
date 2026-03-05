import { baseProcedure, createTRPCRouter } from "../init";


export const dashboardRouter = createTRPCRouter({
    getAum: baseProcedure.query(async () => {
        const aum = await prisma.aum_daily.findFirst({
            orderBy: {
                date: "desc",
            },
        });

        if (!aum) {
            return {
                aum: 0,
                aumDiff: 0,
                aumDiffPercentage: 0,
            };
        }

        const lastMonthAum = await prisma.aum_daily.findFirst({
            orderBy: {
                date: "desc",
            },
        });

        if (!lastMonthAum) {
            return {
                aum: 0,
                aumDiff: 0,
                aumDiffPercentage: 0,
            };
        }

        const aumDiff = Number(aum.aum_value) - Number(lastMonthAum.aum_value);
        const aumDiffPercentage = (aumDiff / Number(lastMonthAum.aum_value)) * 100;

        return {
            aum: Number(aum.aum_value),
            aumDiff,
            aumDiffPercentage,
        };
    }),
});