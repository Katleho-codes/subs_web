import currencies from "./currencies";

export const getCurrencySymbol = (currencyCode: string | string[]) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return currency ? currency.symbol_native : "Unknown Currency";
};
