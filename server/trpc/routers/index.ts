import { baseProcedure, createTRPCRouter } from '../init'
import { z } from 'zod'
import { investorRouter } from './investor';

// IDOccupation?
// IDObjectives?
// IDReligi
// FundUnitAccount

// ---- reference names ----
// CorporateTotalLiabilities
// MaritalStatus
// CorporateAuthorizationType
// CustomerType
// DayPerYear
// IDSpouseOccupation
// DividendType
// CalculationFeeType
// CorporateTotalAsset
// MFType
// Nationality
// TujuanPenggunaanDana
// IDType
// Jabatan
// UnitAmountValidationMode
// ProductCategory
// Characteristic
// AgentType
// OwnershipStatusCode
// UnitRoundingMethod
// Sponsorship
// ProductStatus
// IDHobby
// TitleBeforeName
// InvestorType
// RedFeePeriodUnit
// SegmentCode
// SpousePosition
// Pendapatan/Bulan(I)
// Domisili
// SumberDanaCoorporate
// Job
// SumberPenghasilanUtama
// SumberDana
// IDSourceAdditionalIncome
// IDSpouseSourceAdditionalIncome
// RedTxFeeNett
// IDSpouseSourceOfMainIncome
// IDSpouseIncomeAdditional
// BentukBadanUsaha
// IDIncomeAdditional
// IDSourceOfMainIncome
// TujuanPembukaanRekening
// CompanyType
// CorporateAddressType
// Kota
// InvestmentHorizon
// SpouseLineOfBusinnes
// CategoryProdBankAccount
// InvestmentPurposes
// BidangUsahaPerusahaan
// Sex
// CorporateMailingAddress
// DomisiliInc
// Agama
// StatusKartu
// FeeSign
// SpouseRevenue
// CorporateTotalNetProfit
// FeeType
// ARIAFolder
// StatusPekerjaan
// StatusRekening
// SumberPenghasilanTambahan
// ManagementFee_Method
// Objective
// Negara
// MarketingType
// BidangUsaha
// IDExpensePerMonth
// Residensi
// StatusPerkawinan
// RelationFamily
// IDSpouseExpenseMonth
// DistanceToBranchCode
// StatusNasabah
// SellFeeCalc_Method
// CorporateOperatingIncome
// Kewarganegaraan
// DividendInvestment
// IDTypeCorporate
// DocumentType
// Pendapatan/Bulan(C)
// IndividualConfirmationAddress
// OmzetUsaha
// IDSpouseIncome
// JenisKartuIdentitas
// AddressType
// AmountRoundingMethod
// TitleAfterName
// Education
// StatusRumahTinggal

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
    references: baseProcedure.input(
        z.object({
            reference_name: z.string(),
        })).query(async ({ input }) => {
            const references = await prisma.references.findMany({
                where: { reference_name: input.reference_name },
                orderBy: { code: "asc" },
            });
            return references;
        }),

});

// export type definition of API
export type AppRouter = typeof appRouter;