import { Prisma, PrismaClient } from "~~/prisma/generated/client";
import { validate } from "~~/shared/types/pagination";
import { formatCurrency, toNum } from "~~/app/utils";

type LatestAumRow = { investor_id: string; aum_value: unknown };

async function computeAumByInvestor(
    prisma: PrismaClient,
    investorIds: string[]
): Promise<Record<string, number>> {
    const aumByInvestor: Record<string, number> = {};
    if (investorIds.length === 0) return aumByInvestor;

    // Use precomputed daily AUM snapshot instead of recomputing
    // from holdings + NAV on every request.
    const rows = await prisma.$queryRaw<LatestAumRow[]>`
    SELECT investor_id, SUM(aum_value) AS aum_value
    FROM aum_investor_daily
    WHERE investor_id IN (${Prisma.join(investorIds)})
      AND date = (SELECT MAX(date) FROM aum_investor_daily)
    GROUP BY investor_id
  `;

    for (const row of rows) {
        aumByInvestor[row.investor_id] = toNum(row.aum_value);
    }

    return aumByInvestor;
}


export default defineEventHandler(async (event) => {
    try {
        const { page = 1, page_size = 10, sort_by = "id", sort_order = "desc", filters } = await getValidatedQuery(event, validate);

        let where: Prisma.investorsWhereInput = {};

        if (filters && filters.length > 0) {
            for (const filter of filters) {
                if (filter.value) {
                    where.OR = [];
                    where.OR.push({ [filter.key]: { contains: filter.value, mode: "insensitive" } });
                }
            }
        }

        const total = await prisma.investors.count({ where });

        let items: Awaited<ReturnType<typeof prisma.investors.findMany>>;

        if (sort_by === "aum") {
            const allIds = await prisma.investors.findMany({ where, select: { id: true } });
            const investorIds = allIds.map((i) => i.id);
            const aumByInvestor = await computeAumByInvestor(prisma, investorIds);
            const sortedIds = [...investorIds].sort((a, b) => {
                const aumA = aumByInvestor[a] ?? 0;
                const aumB = aumByInvestor[b] ?? 0;
                if (sort_order === "desc") return aumB - aumA;
                return aumA - aumB;
            });
            const pageIds = sortedIds.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
            const rows = await prisma.investors.findMany({
                where: { id: { in: pageIds } },
            });
            const orderMap = new Map(pageIds.map((id, i) => [id, i]));
            items = rows.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
        } else {
            items = await prisma.investors.findMany({
                take: page_size,
                skip: (page - 1) * page_size,
                orderBy: { [sort_by]: sort_order },
                where,
            });
        }

        const investorIds = items.map((i) => i.id);
        const aumByInvestor =
            investorIds.length > 0 ? await computeAumByInvestor(prisma, investorIds) : {};

        return {
            items: items.map((row) => ({
                id: row.id,
                full_name: row.full_name,
                email: row.email ?? undefined,
                phone_number: row.phone_number ?? undefined,
                investor_type_id: row.investor_type_id,
                sid: row.sid,
                aum: formatCurrency(aumByInvestor[row.id] ?? 0),
            })),
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