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

        const funds = await prisma.$queryRawUnsafe<{
            id: number
            name: string
            code: string
            fund_category_id: string
            outstanding_unit: number
            nav: number
        }[]>(`
            SELECT f.id,f.name,f.code,f.fund_category_id,fn.outstanding_unit,fn.nav
            FROM funds as f
            LEFT JOIN fund_navs as fn ON fn.fund_id = f.id
            AND fn.date = (SELECT MAX(date) FROM fund_navs WHERE fund_id = f.id)
            WHERE nav is not null
            ORDER BY ${sort_by} ${sort_order}
            LIMIT ${page_size} OFFSET ${(page - 1) * page_size}
            `)

        // if (sort_by === "total_units" || sort_by === "aum") {
        //     const orderDirection = sort_order === "asc" ? "ASC" : "DESC"
        //     const sortColumn = sort_by === "total_units" ? "total_units" : "aum"

        //     const offset = (page - 1) * page_size

        //     const funds = await prisma.$queryRaw<Array<{
        //         id: number
        //         code: string
        //         name: string
        //         created_at: Date
        //         total_units: unknown
        //         aum: unknown
        //     }>>`
        //         WITH latest_navs AS (
        //             SELECT
        //                 fund_id,
        //                 outstanding_unit,
        //                 nav,
        //                 date,
        //                 ROW_NUMBER() OVER (PARTITION BY fund_id ORDER BY date DESC) AS rn
        //             FROM fund_navs
        //         )
        //         SELECT
        //             f.id,
        //             f.code,
        //             f.name,
        //             f.created_at,
        //             COALESCE(ln.outstanding_unit, 0) AS total_units,
        //             COALESCE(ln.nav, 0) AS aum
        //         FROM funds f
        //         LEFT JOIN latest_navs ln
        //             ON ln.fund_id = f.id
        //             AND ln.rn = 1
        //         ORDER BY ${sortColumn} ${orderDirection}
        //         LIMIT ${page_size} OFFSET ${offset}
        //     `

        //     const normalizedFunds = funds.map((f) => ({
        //         ...f,
        //         total_units: f.total_units != null ? toNum(f.total_units) : 0,
        //         aum: f.aum != null ? toNum(f.aum) : 0,
        //     }))

        //     return { funds: normalizedFunds, total }
        // }

        // // Sort by direct fund column
        // const sort = isFundColumn(sort_by) ? sort_by : "code"
        // const fundsRaw = await prisma.funds.findMany({
        //     skip: (page - 1) * page_size,
        //     take: page_size,
        //     orderBy: { [sort]: sort_order },
        //     include: {
        //         fund_navs: {
        //             orderBy: { date: "desc" },
        //             take: 1,
        //             select: { outstanding_unit: true, nav: true },
        //         },
        //     },
        // })
        // const funds = fundsRaw.map((f) => {
        //     const latest = f.fund_navs?.[0]
        //     const total_units = latest ? toNum(latest.outstanding_unit) : 0
        //     const aum = latest ? toNum(latest.nav) : 0
        //     const { fund_navs, ...fund } = f
        //     return { ...fund, total_units, aum }
        // })
        return { funds, total }
    } catch (error) {
        console.error('error', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})