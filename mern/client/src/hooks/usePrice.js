
import { useState, useEffect } from "react";
import { getPrice } from "../api/fetch.jsx";

export default function usePrice(shapeId, materialId) {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (shapeId && materialId) {
            setLoading(true);
            getPrice(shapeId, materialId)
                .then((data) => {
                    setPrice(data.price);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });
        }
    }, [shapeId, materialId]);

    return { price, loading, error };
}
