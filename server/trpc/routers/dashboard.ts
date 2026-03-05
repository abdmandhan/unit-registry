import { baseProcedure, createTRPCRouter } from "../init";
import { prisma } from "~~/server/utils/db";

export const dashboardRouter = createTRPCRouter({
    // Latest AUM and month-over-month change
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
            where: {
                date: {
                    lt: aum.date,
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        if (!lastMonthAum) {
            return {
                aum: Number(aum.aum_value),
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

    // get monthly revenue 
    getRevenueSeries: baseProcedure.query(async () => {
        const rows = await prisma.$queryRaw<
            { month: Date; management_fee: unknown }[]
        >`
        SELECT
          date_trunc('month', date) AS month,
          AVG(management_fee) AS management_fee
        FROM aum_daily
        WHERE date >= '2025-01-01'
        GROUP BY month
        ORDER BY month ASC
    `;

        return rows.map((row) => ({
            date: row.month,
            management_fee: Number(row.management_fee ?? 0),
        }));
    }),
    getTopFundsByAum: baseProcedure.query(async () => {
        const rows = await prisma.$queryRaw<
            { fund_id: number; name: string; code: string; aum_value: number }[]
        >`
        SELECT fund_id, f.name, f.code, SUM(aum_value) AS aum_value
        FROM aum_investor_daily
        JOIN funds f ON aum_investor_daily.fund_id = f.id
        WHERE date = (SELECT MAX(date) FROM aum_investor_daily)
        GROUP BY fund_id, f.name, f.code
        ORDER BY aum_value DESC
        LIMIT 5
    `;

        return rows.map((row) => ({
            fund_id: row.fund_id,
            name: row.name,
            code: row.code,
            aum_value: Number(row.aum_value ?? 0),
        }));
    }),

    // Time-series for AUM line chart, grouped by month
    getAumSeries: baseProcedure.query(async () => {
        const rows = await prisma.$queryRaw<
            { month: Date; aum_value: unknown }[]
        >`
            SELECT
              date_trunc('month', date) AS month,
              AVG(aum_value) AS aum_value
            FROM aum_daily
            WHERE date >= '2025-01-01'
            GROUP BY month
            ORDER BY month ASC
        `;

        return rows.map((row) => ({
            date: row.month,
            aum_value: Number(row.aum_value ?? 0),
        }));
    }),

    // Investor type breakdown for donut chart
    getInvestorTypeBreakdown: baseProcedure.query(async () => {
        const [individual, corporate] = await Promise.all([
            prisma.investors.count({ where: { investor_type_id: "I" } }),
            prisma.investors.count({ where: { investor_type_id: "C" } }),
        ]);

        return {
            individual,
            corporate,
        };
    }),
});