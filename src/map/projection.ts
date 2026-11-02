import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import landJson from 'world-atlas/land-110m.json';
import type { GeometryObject, Topology } from 'topojson-specification';

export const VIEW_W = 1000;
export const VIEW_H = 520;
const topology = landJson as unknown as Topology<{ land: GeometryObject }>;
export const projection = geoNaturalEarth1().fitSize([VIEW_W, VIEW_H], { type: 'Sphere' });
const path = geoPath(projection);
export const LAND_PATH = path(feature(topology, topology.objects.land)) ?? '';
export const GRID_PATH = path(geoGraticule10()) ?? '';

export function project(lon: number, lat: number): [number, number] {
  const point = projection([lon, lat]);
  return point ?? [VIEW_W / 2, VIEW_H / 2];
}
