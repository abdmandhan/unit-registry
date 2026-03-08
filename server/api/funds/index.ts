import { prisma } from "../../utils/db";
import { validate } from "~~/shared/types/pagination";
import { toNum } from "~~/app/utils";

function isFundColumn(sortBy: string): sortBy is "code" | "name" | "created_at" {
    return ["code", "name", "created_at"].includes(sortBy)
}

export default defineEventHandler(async (event) => {
    try {
        const { page = 1, page_size = 10, sort_by = "id", sort_order = "desc" } = await getValidatedQuery(event, validate);

        const total = await prisma.funds.count()

        if (sort_by === "total_units" || sort_by === "aum") {
            // Sort by NAV-derived fields: fetch all funds with latest nav, sort in memory, then paginate
            const allFunds = await prisma.funds.findMany({
                include: {
                    fund_navs: {
                        orderBy: { date: "desc" },
                        take: 1,
                        select: { outstanding_unit: true, nav: true, date: true },
                    },
                },
            })
            const withMeta = allFunds.map((f) => {
                const latest = f.fund_navs?.[0]
                const total_units = latest ? toNum(latest.outstanding_unit) : 0
                const aum = latest ? toNum(latest.nav) : 0
                const { fund_navs, ...fund } = f
                return {
                    ...fund,
                    total_units,
                    aum,
                    _latest_nav_date: latest?.date ?? null,
                }
            })
            withMeta.sort((a, b) => {
                const aVal = sort_by === "total_units" ? a.total_units : a.aum
                const bVal = sort_by === "total_units" ? b.total_units : b.aum
                return sort_order === "asc" ? aVal - bVal : bVal - aVal
            })
            const funds = withMeta.slice((page - 1) * page_size, (page - 1) * page_size + page_size).map(({ _latest_nav_date, ...f }) => f)
            return { funds, total }
        }

        // Sort by direct fund column
        const sort = isFundColumn(sort_by) ? sort_by : "code"
        const fundsRaw = await prisma.funds.findMany({
            skip: (page - 1) * page_size,
            take: page_size,
            orderBy: { [sort_by]: sort_order },
            include: {
                fund_navs: {
                    orderBy: { date: "desc" },
                    take: 1,
                    select: { outstanding_unit: true, nav: true },
                },
            },
        })
        const funds = fundsRaw.map((f) => {
            const latest = f.fund_navs?.[0]
            const total_units = latest ? toNum(latest.outstanding_unit) : 0
            const aum = latest ? toNum(latest.nav) : 0
            const { fund_navs, ...fund } = f
            return { ...fund, total_units, aum }
        })
        return { funds, total }
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})