import { Material } from "three";

export interface MaterialProvider {
    getMaterial(texturedef: string): Promise<Material>
}

