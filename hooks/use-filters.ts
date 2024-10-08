import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import { useMemo, useState } from 'react';

interface PriceProps {
    priceFrom?: number;
    priceTo?: number;
}

interface QueryFilters extends PriceProps {
    pizzaTypes: string;
    sizes: string;
    ingredients: string;
}

export interface Filters {
    sizes: Set<string>;
    pizzaTypes: Set<string>;
    selectedIngredients: Set<string>;
    prices: PriceProps;
}

interface ReturnProps extends Filters {
    setPrices: (name: keyof PriceProps, value: number) => void;
    setPizzaTypes: (value: string) => void;
    setSizes: (value: string) => void;
    setSelectedIngredients: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

    // selected ingredients
    const [selectedIngredients, { toggle: toggleIngredients }] = useSet(
        new Set<string>(
            searchParams.get('ingredients')?.split(',') || []
        ),
    );

    // sizes
    const [sizes, { toggle: toggleSizes }] = useSet(
        new Set<string>(
            searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : []
        ),
    );

    // pizza types
    const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
        new Set<string>(
            searchParams.has('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : [],
        ),
    );

    // prices range
    const [prices, setPrices] = useState<PriceProps>({
        priceFrom: Number(searchParams.get('priceFrom')) || 0,
        priceTo: Number(searchParams.get('priceTo')) || 1000,
    });

    const updatePrice = (name: keyof PriceProps, value: number) => {
        setPrices((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return useMemo(
        () => ({
            sizes,
            pizzaTypes,
            selectedIngredients,
            prices,
            setPrices: updatePrice,
            setPizzaTypes: togglePizzaTypes,
            setSizes: toggleSizes,
            setSelectedIngredients: toggleIngredients,
        }),
        [sizes, pizzaTypes, selectedIngredients, prices, togglePizzaTypes, toggleSizes, toggleIngredients]
    );
};
