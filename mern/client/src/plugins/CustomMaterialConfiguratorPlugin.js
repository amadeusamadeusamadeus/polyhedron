
import { MaterialConfiguratorPlugin } from "webgi";

export class CustomMaterialConfiguratorPlugin extends MaterialConfiguratorPlugin {
    // This must be exactly "MaterialConfiguratorPlugin" for WebGi to recognize it.
    static PluginType = "MaterialConfiguratorPlugin";

    constructor() {
        super();
        // A callback you can assign from your React component to listen for variation changes.
        this.onVariationChange = null;
    }

    // This function is automatically called when an object is loaded with material variations.
    async _refreshUi() {
        const refreshed = await super._refreshUi();
        if (!refreshed) return false; // No changes detected.

        // Loop over each variation.
        for (const variation of this.variations) {
            console.log("Variation title:", variation.title);

            variation.materials.forEach(material => {
                let image;
                if (!variation.preview.startsWith("generate:")) {
                    // Use the provided preview or fallback to a default color.
                    const pp = material[variation.preview] || "#ff00ff";
                    image = pp.image || pp;
                } else {
                    // Generate a small snapshot of the material preview based on some shape.
                    const shape = variation.preview.split(":")[1];
                    image = this._previewGenerator.generate(material, shape);
                }
                // Callback to apply the variation when clicked.
                const onClick = () => {
                    this.applyVariation(variation, material.uuid);
                };
                // Log the UI data for this material variation.
                console.log(this.variations)
                console.log({
                    uid: material.uuid,
                    color: material.color,
                    material: material,
                    image,
                    onClick
                });
            }
        );

        }
        return true;
    }

    // Override applyVariation so that after applying, we fire a callback.
    applyVariation(variation, matUuidOrIndex) {
        console.log(matUuidOrIndex)
        const result = super.applyVariation(variation, matUuidOrIndex);
        // Force the viewer to update.
        if (this.viewer) {
            this.viewer.setDirty();
        }
        if (this.onVariationChange) {
            this.onVariationChange(this.getSelectedVariation());
        }
        return result;
    }
}
