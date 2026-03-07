import { baseProcedure, createTRPCRouter } from "../init"
import { z } from "zod"
import { prisma } from "~~/server/utils/db"

const SORTABLE_FUND_COLUMNS = ["code", "name", "created_at", "total_units", "aum"] as const
type SortableColumn = (typeof SORTABLE_FUND_COLUMNS)[number]

function isFundColumn(sortBy: string): sortBy is "code" | "name" | "created_at" {
    return ["code", "name", "created_at"].includes(sortBy)
}

function toNum(v: unknown): number {
    if (v == null) return 0
    if (typeof v === "number") return v
    if (typeof v === "string") return Number(v) || 0
    return Number((v as { toString?: () => string })?.toString?.()) || 0
}

export const fundsRouter = createTRPCRouter({
    list: baseProcedure.input(
        z.object({
            page: z.number().optional(),
            page_size: z.number().optional(),
            sort_by: z.string().optional(),
            sort_order: z.string().optional(),
        }),
    )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1
            const limit = input?.page_size ?? 10
            const skip = (page - 1) * limit
            const sortBy = (input?.sort_by ?? "code") as SortableColumn
            const sortOrder = input?.sort_order ?? "desc"
            const order = sortOrder === "asc" ? "asc" : "desc"

            const total = await prisma.funds.count()

            if (sortBy === "total_units" || sortBy === "aum") {
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
                    const aVal = sortBy === "total_units" ? a.total_units : a.aum
                    const bVal = sortBy === "total_units" ? b.total_units : b.aum
                    return order === "asc" ? aVal - bVal : bVal - aVal
                })
                const funds = withMeta.slice(skip, skip + limit).map(({ _latest_nav_date, ...f }) => f)
                return { funds, total }
            }

            // Sort by direct fund column
            const sort = isFundColumn(sortBy) ? sortBy : "code"
            const fundsRaw = await prisma.funds.findMany({
                skip,
                take: limit,
                orderBy: { [sort]: order },
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
        }),
})