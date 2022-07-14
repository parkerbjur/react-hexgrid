import HexType from "./models/Hex"
import { HexUtils } from "./HexUtils"
/** This class contains static methods for generating Hex coordinates
 * for specifically-shaped grids, such as rectangle, hexagon, and more. */
export class GridGenerator {
  /** This method is used to dynamically choose a type of grid to
   * generate.
   */
  static getGenerator(name: PropertyKey): GridGenerator | null {
    if (GridGenerator.hasOwnProperty(name)) return GridGenerator[name]
    return null
  }
  /** May not be working. There are no tests for it. */
  static ring(center: HexType, mapRadius: number): HexType[] {
    let hexas: HexType[] = []
    let hex = HexUtils.add(
      center,
      HexUtils.multiply(HexUtils.direction(4), mapRadius),
    )
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < mapRadius; j++) {
        hexas.push(hex)
        hex: HexType = HexUtils.neighbor(hex, i)
      }
    }
    return hexas
  }
  /** May not be working. There are no tests for it. */
  static spiral(center: HexType, mapRadius: number): HexType[] {
    let results = [center]
    for (let k = 1; k <= mapRadius; k++) {
      const temp = GridGenerator.ring(center, k)
      results = results.concat(temp)
    }
    return results
  }
  /** Returns an array of Hex coordinates needed to create a
   * parallelogram grid */
  static parallelogram(
    q1: number,
    q2: number,
    r1: number,
    r2: number,
  ): HexType[] {
    let hexas: HexType[] = []
    for (let q = q1; q <= q2; q++) {
      for (let r = r1; r <= r2; r++) {
        hexas.push({ q: q, r: r, s: -q - r })
      }
    }
    return hexas
  }
  /** Returns an array of Hex coordinates needed to create a
   * triangle grid
   */
  static triangle(mapSize: number): HexType[] {
    let hexas: HexType[] = []
    for (let q = 0; q <= mapSize; q++) {
      for (let r = 0; r <= mapSize - q; r++) {
        hexas.push({ q: q, r: r, s: -q - r })
      }
    }
    return hexas
  }
  /** Returns an array of Hex coordinates needed to create a
   * Hexagon grid */
  static hexagon(mapRadius: number): HexType[] {
    let hexas: HexType[] = []
    for (let q = -mapRadius; q <= mapRadius; q++) {
      let r1 = Math.max(-mapRadius, -q - mapRadius)
      let r2 = Math.min(mapRadius, -q + mapRadius)
      for (let r = r1; r <= r2; r++) {
        hexas.push({ q: q, r: r, s: -q - r })
      }
    }
    return hexas
  }
  /** Returns an array of Hex coordinates needed to create
   * a diagonal rectangle grid */
  static rectangle(mapWidth: number, mapHeight: number): HexType[] {
    let hexas: HexType[] = []
    for (let r = 0; r < mapHeight; r++) {
      let offset = Math.floor(r / 2) // or r>>1
      for (let q = -offset; q < mapWidth - offset; q++) {
        hexas.push({ q: q, r: r, s: -q - r })
      }
    }
    return hexas
  }
  /** Returns an array of Hex coordinates needed to create a vertical
   * and horizontal rectangle.
   */
  static orientedRectangle(mapWidth: number, mapHeight: number): HexType[] {
    let hexas: HexType[] = []
    for (let q = 0; q < mapWidth; q++) {
      let offset = Math.floor(q / 2) // or q>>1
      for (let r = -offset; r < mapHeight - offset; r++) {
        hexas.push({ q: q, r: r, s: -q - r })
      }
    }
    return hexas
  }
}

export default GridGenerator
