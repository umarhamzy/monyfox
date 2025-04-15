import { z } from "zod";
export declare const DataSchema: z.ZodObject<{
    accounts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        isPersonalAsset: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        isPersonalAsset: boolean;
    }, {
        id: string;
        name: string;
        isPersonalAsset: boolean;
    }>, "many">;
    transactions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        transactionCategoryId: z.ZodNullable<z.ZodString>;
        transactionDate: z.ZodString;
        accountingDate: z.ZodString;
        from: z.ZodObject<{
            amount: z.ZodNumber;
            symbolId: z.ZodString;
            account: z.ZodUnion<[z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>, z.ZodObject<{
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
            }, {
                name: string;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        }, {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        }>;
        to: z.ZodObject<{
            amount: z.ZodNumber;
            symbolId: z.ZodString;
            account: z.ZodUnion<[z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>, z.ZodObject<{
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
            }, {
                name: string;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        }, {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        description: string;
        transactionCategoryId: string | null;
        transactionDate: string;
        accountingDate: string;
        from: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
        to: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
    }, {
        id: string;
        description: string;
        transactionCategoryId: string | null;
        transactionDate: string;
        accountingDate: string;
        from: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
        to: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
    }>, "many">;
    assetSymbols: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        displayName: z.ZodString;
        type: z.ZodUnion<[z.ZodLiteral<"fiat">, z.ZodLiteral<"stock">, z.ZodLiteral<"crypto">, z.ZodLiteral<"commodity">, z.ZodLiteral<"other">]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        code: string;
        type: "fiat" | "stock" | "crypto" | "commodity" | "other";
        displayName: string;
    }, {
        id: string;
        code: string;
        type: "fiat" | "stock" | "crypto" | "commodity" | "other";
        displayName: string;
    }>, "many">;
    assetSymbolExchanges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        fromAssetSymbolId: z.ZodString;
        toAssetSymbolId: z.ZodString;
        exchanger: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"frankfurter">;
            base: z.ZodString;
            target: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "frankfurter";
            base: string;
            target: string;
        }, {
            type: "frankfurter";
            base: string;
            target: string;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        fromAssetSymbolId: string;
        toAssetSymbolId: string;
        exchanger: {
            type: "frankfurter";
            base: string;
            target: string;
        };
    }, {
        id: string;
        fromAssetSymbolId: string;
        toAssetSymbolId: string;
        exchanger: {
            type: "frankfurter";
            base: string;
            target: string;
        };
    }>, "many">;
    lastUpdated: z.ZodString;
}, "strip", z.ZodTypeAny, {
    accounts: {
        id: string;
        name: string;
        isPersonalAsset: boolean;
    }[];
    transactions: {
        id: string;
        description: string;
        transactionCategoryId: string | null;
        transactionDate: string;
        accountingDate: string;
        from: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
        to: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
    }[];
    assetSymbols: {
        id: string;
        code: string;
        type: "fiat" | "stock" | "crypto" | "commodity" | "other";
        displayName: string;
    }[];
    assetSymbolExchanges: {
        id: string;
        fromAssetSymbolId: string;
        toAssetSymbolId: string;
        exchanger: {
            type: "frankfurter";
            base: string;
            target: string;
        };
    }[];
    lastUpdated: string;
}, {
    accounts: {
        id: string;
        name: string;
        isPersonalAsset: boolean;
    }[];
    transactions: {
        id: string;
        description: string;
        transactionCategoryId: string | null;
        transactionDate: string;
        accountingDate: string;
        from: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
        to: {
            amount: number;
            symbolId: string;
            account: {
                id: string;
            } | {
                name: string;
            };
        };
    }[];
    assetSymbols: {
        id: string;
        code: string;
        type: "fiat" | "stock" | "crypto" | "commodity" | "other";
        displayName: string;
    }[];
    assetSymbolExchanges: {
        id: string;
        fromAssetSymbolId: string;
        toAssetSymbolId: string;
        exchanger: {
            type: "frankfurter";
            base: string;
            target: string;
        };
    }[];
    lastUpdated: string;
}>;
export declare const RawDataSchema: z.ZodDiscriminatedUnion<"encrypted", [z.ZodObject<{
    encrypted: z.ZodLiteral<true>;
    data: z.ZodString;
}, "strip", z.ZodTypeAny, {
    encrypted: true;
    data: string;
}, {
    encrypted: true;
    data: string;
}>, z.ZodObject<{
    encrypted: z.ZodLiteral<false>;
    data: z.ZodObject<{
        accounts: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            isPersonalAsset: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            isPersonalAsset: boolean;
        }, {
            id: string;
            name: string;
            isPersonalAsset: boolean;
        }>, "many">;
        transactions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            transactionCategoryId: z.ZodNullable<z.ZodString>;
            transactionDate: z.ZodString;
            accountingDate: z.ZodString;
            from: z.ZodObject<{
                amount: z.ZodNumber;
                symbolId: z.ZodString;
                account: z.ZodUnion<[z.ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>, z.ZodObject<{
                    name: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                }, {
                    name: string;
                }>]>;
            }, "strip", z.ZodTypeAny, {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            }, {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            }>;
            to: z.ZodObject<{
                amount: z.ZodNumber;
                symbolId: z.ZodString;
                account: z.ZodUnion<[z.ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
                }>, z.ZodObject<{
                    name: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                }, {
                    name: string;
                }>]>;
            }, "strip", z.ZodTypeAny, {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            }, {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            }>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            description: string;
            transactionCategoryId: string | null;
            transactionDate: string;
            accountingDate: string;
            from: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
            to: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
        }, {
            id: string;
            description: string;
            transactionCategoryId: string | null;
            transactionDate: string;
            accountingDate: string;
            from: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
            to: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
        }>, "many">;
        assetSymbols: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            code: z.ZodString;
            displayName: z.ZodString;
            type: z.ZodUnion<[z.ZodLiteral<"fiat">, z.ZodLiteral<"stock">, z.ZodLiteral<"crypto">, z.ZodLiteral<"commodity">, z.ZodLiteral<"other">]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            code: string;
            type: "fiat" | "stock" | "crypto" | "commodity" | "other";
            displayName: string;
        }, {
            id: string;
            code: string;
            type: "fiat" | "stock" | "crypto" | "commodity" | "other";
            displayName: string;
        }>, "many">;
        assetSymbolExchanges: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            fromAssetSymbolId: z.ZodString;
            toAssetSymbolId: z.ZodString;
            exchanger: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                type: z.ZodLiteral<"frankfurter">;
                base: z.ZodString;
                target: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "frankfurter";
                base: string;
                target: string;
            }, {
                type: "frankfurter";
                base: string;
                target: string;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            fromAssetSymbolId: string;
            toAssetSymbolId: string;
            exchanger: {
                type: "frankfurter";
                base: string;
                target: string;
            };
        }, {
            id: string;
            fromAssetSymbolId: string;
            toAssetSymbolId: string;
            exchanger: {
                type: "frankfurter";
                base: string;
                target: string;
            };
        }>, "many">;
        lastUpdated: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        accounts: {
            id: string;
            name: string;
            isPersonalAsset: boolean;
        }[];
        transactions: {
            id: string;
            description: string;
            transactionCategoryId: string | null;
            transactionDate: string;
            accountingDate: string;
            from: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
            to: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
        }[];
        assetSymbols: {
            id: string;
            code: string;
            type: "fiat" | "stock" | "crypto" | "commodity" | "other";
            displayName: string;
        }[];
        assetSymbolExchanges: {
            id: string;
            fromAssetSymbolId: string;
            toAssetSymbolId: string;
            exchanger: {
                type: "frankfurter";
                base: string;
                target: string;
            };
        }[];
        lastUpdated: string;
    }, {
        accounts: {
            id: string;
            name: string;
            isPersonalAsset: boolean;
        }[];
        transactions: {
            id: string;
            description: string;
            transactionCategoryId: string | null;
            transactionDate: string;
            accountingDate: string;
            from: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
            to: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
        }[];
        assetSymbols: {
            id: string;
            code: string;
            type: "fiat" | "stock" | "crypto" | "commodity" | "other";
            displayName: string;
        }[];
        assetSymbolExchanges: {
            id: string;
            fromAssetSymbolId: string;
            toAssetSymbolId: string;
            exchanger: {
                type: "frankfurter";
                base: string;
                target: string;
            };
        }[];
        lastUpdated: string;
    }>;
}, "strip", z.ZodTypeAny, {
    encrypted: false;
    data: {
        accounts: {
            id: string;
            name: string;
            isPersonalAsset: boolean;
        }[];
        transactions: {
            id: string;
            description: string;
            transactionCategoryId: string | null;
            transactionDate: string;
            accountingDate: string;
            from: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
            to: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
        }[];
        assetSymbols: {
            id: string;
            code: string;
            type: "fiat" | "stock" | "crypto" | "commodity" | "other";
            displayName: string;
        }[];
        assetSymbolExchanges: {
            id: string;
            fromAssetSymbolId: string;
            toAssetSymbolId: string;
            exchanger: {
                type: "frankfurter";
                base: string;
                target: string;
            };
        }[];
        lastUpdated: string;
    };
}, {
    encrypted: false;
    data: {
        accounts: {
            id: string;
            name: string;
            isPersonalAsset: boolean;
        }[];
        transactions: {
            id: string;
            description: string;
            transactionCategoryId: string | null;
            transactionDate: string;
            accountingDate: string;
            from: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
            to: {
                amount: number;
                symbolId: string;
                account: {
                    id: string;
                } | {
                    name: string;
                };
            };
        }[];
        assetSymbols: {
            id: string;
            code: string;
            type: "fiat" | "stock" | "crypto" | "commodity" | "other";
            displayName: string;
        }[];
        assetSymbolExchanges: {
            id: string;
            fromAssetSymbolId: string;
            toAssetSymbolId: string;
            exchanger: {
                type: "frankfurter";
                base: string;
                target: string;
            };
        }[];
        lastUpdated: string;
    };
}>]>;
//# sourceMappingURL=data.d.ts.map