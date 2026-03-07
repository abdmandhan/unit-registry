


export const formatCurrency = (amount: number, digits: number = 2) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        notation: 'compact',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(amount);
};


export const formatThousand = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};