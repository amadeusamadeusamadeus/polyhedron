// src/api/materialService.js
const BASE_URL = "http://localhost:5050";

const getMaterialNameFromIcon = (iconUrl) => {
    if (!iconUrl) return "";
    // Get the file name from the URL
    const fileName = iconUrl.split("/").pop() || "";
    // Remove the extension (e.g., .png)
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    // Remove trailing parts starting with '_polished'
    // (adjust the split if your naming convention changes)
    return fileNameWithoutExt.split("_polished")[0];
};

export const ensureMaterialInDb = async (material) => {
    try {
        const response = await fetch(`${BASE_URL}/materials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uuid: material.uuid,
                // Use material.userData?.name if provided; otherwise derive it from the icon
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
