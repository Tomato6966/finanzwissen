import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isMounted, setIsMounted] = useState(false);

    // Effect to read from localStorage only on the client side
    useEffect(() => {
        setIsMounted(true);
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.log(error);
        }
    }, [key]);

    // Effect to write to localStorage whenever storedValue changes
    useEffect(() => {
        if (isMounted) {
            try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.log(error);
            }
        }
    }, [key, storedValue, isMounted]);

    const setValue = (value: T) => {
        setStoredValue(value);
    };

    return [storedValue, setValue];
}
