// src/api/materialService.js
const BASE_URL = "http://localhost:5050";

const getMaterialNameFromIcon = (iconUrl) => {
    if (!iconUrl) return "";

    const fileName = iconUrl.split("/").pop() || "";
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    return fileNameWithoutExt.split("_polished")[0];
};

export const ensureMaterialInDb = async (material) => {
    try {
        const response = await fetch(`${BASE_URL}/materials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uuid: material.uuid,
                name: material.userData?.name || getMaterialNameFromIcon(material.userData?.icon),
                priceModifier: 10,
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
