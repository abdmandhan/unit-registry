import { z } from "zod";

export const schema = z.object({
    page: z.coerce.number(),
    page_size: z.coerce.number(),
    sort_by: z.string(),
    sort_order: z.string(),
}).strict();

export type DashboardFunds = z.infer<typeof schema>;

export const validate = (data: unknown): DashboardFunds => {
    return schema.parse(data);
};