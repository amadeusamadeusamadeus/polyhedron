// src/api/fetch.jsx
const BASE_URL = "http://localhost:5050";

export const getShapes = async () => {
    const response = await fetch(`${BASE_URL}/shapes`);
    if (!response.ok) {
        throw new Error("Failed to fetch shapes");
    }
    return await response.json();
};

export const getMaterials = async () => {
    const response = await fetch(`${BASE_URL}/materials`);
    if (!response.ok) {
        throw new Error("Failed to fetch materials");
    }
    return await response.json();
};

export const getPrice = async (shapeId, materialId) => {
    const response = await fetch(
        `${BASE_URL}/price?shapeId=${shapeId}&materialId=${materialId}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch price");
    }
    return await response.json();
};
