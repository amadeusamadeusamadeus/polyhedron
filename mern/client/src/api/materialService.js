// src/api/materialService.js
const BASE_URL = "http://localhost:5050";

export const ensureMaterialInDb = async (material) => {
    try {
        const response = await fetch(`${BASE_URL}/materials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uuid: material.uuid,
                name: material.userData?.name || "Placeholder Material",
                priceModifier: 0, // Set a default placeholder value; adjust if needed
                icon: material.userData?.icon || ""
            })
        });
        if (!response.ok) {
            throw new Error("Failed to create material");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error ensuring material in DB:", error);
        return null;
    }
};
