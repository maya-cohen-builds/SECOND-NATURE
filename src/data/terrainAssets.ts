/**
 * ============================================================
 * TERRAIN ASSET REGISTRY — Supported Games Section
 * ============================================================
 * DO NOT REPLACE ASSETS. Only change if the prompt explicitly requests it.
 *
 * Each key maps to a single, fixed asset file. No inline image URLs
 * anywhere else. If an asset import is missing, the UI will show a
 * loud "Missing asset" placeholder instead of silently substituting.
 * ============================================================
 */

import terrainMountain from '@/assets/terrain-mountain.png';
import terrainForest from '@/assets/terrain-forest.png';
import terrainCastle from '@/assets/terrain-castle.png';
import terrainAction from '@/assets/terrain-action.png';
import terrainStrategy from '@/assets/terrain-strategy.png';

export type TerrainKey = 'laneControl' | 'phaseMastery' | 'siteExecutes' | 'heroSynergy' | 'mapControl';

/**
 * DO NOT REPLACE ASSETS. Only change if the prompt explicitly requests it.
 */
export const terrainAssets: Record<TerrainKey, string> = {
  laneControl: terrainMountain,
  phaseMastery: terrainForest,
  siteExecutes: terrainCastle,
  heroSynergy: terrainAction,
  mapControl: terrainStrategy,
};

// Dev-only: log resolved asset URLs on import
if (import.meta.env.DEV) {
  console.log(
    '%c[Terrain Assets] Resolved bindings:',
    'color: #F26A21; font-weight: bold;',
    Object.entries(terrainAssets).reduce((acc, [key, url]) => {
      acc[key] = url;
      return acc;
    }, {} as Record<string, string>)
  );
}
