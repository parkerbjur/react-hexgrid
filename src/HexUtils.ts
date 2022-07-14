import { LayoutDimension } from "./Layout"
import HexType from "./models/Hex"
import { Point } from "./models/Point"

export class HexUtils {
  static DIRECTIONS: HexType[] = [
    { q: 1, r: 0, s: -1 },
    { q: 1, r: -1, s: 0 },
    { q: 0, r: -1, s: 1 },
    { q: -1, r: 0, s: 1 },
    { q: -1, r: 1, s: 0 },
    { q: 0, r: 1, s: -1 },
  ]
  /** Checks if coordinates are the same.*/
  static equals(a: HexType, b: HexType): boolean {
    return a.q == b.q && a.r == b.r && a.s == b.s
  }
  /** Returns a new Hex with the addition of q,r,s values from A and B respectively */
  static add(a: HexType, b: HexType): HexType {
    return { q: a.q + b.q, r: a.r + b.r,s: a.s + b.s}
  }
  /** Returns a new Hex with the subtraction of q,r,s values from A and B respectively */
  static subtract(a: HexType, b: HexType): HexType {
    return { q: a.q - b.q, a.r - b.r, a.s - b.s)
  }
  /** Returns a new Hex with the multiplication of q,r,s values by k */
  static multiply(a: HexType, k: number): HexType {
    return { q: a.q * k, a.r * k, a.s * k)
  }
  /** Returns length from origin point 0,0 */
  static lengths(hex: HexType): number {
    return (Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2
  }
  /** Returns the distance between two hex coordinates */
  static distance(a: HexType, b: HexType): number {
    return HexUtils.lengths(HexUtils.subtract(a, b))
  }
  /** Returns a new Hex in the "direction", which has modulus six, "% 6", applied to it,
   * and thus computes to a number between 0 through 5. */
  static direction(direction: number): HexType {
    return HexUtils.DIRECTIONS[(6 + (direction % 6)) % 6]
  }
  /** Returns the addition of the current Hex and a new Hex in the
   * specified "direction". Direction has modulus six, "% 6", applied to it,
   * and thus computes to a number between 0 through 5.
   */
  static neighbor(hex: HexType, direction: number): HexType {
    return HexUtils.add(hex, HexUtils.direction(direction))
  }
  /** Returns an array of all the direct neighbors of a Hex within one Hex away */
  static neighbors(hex: HexType): HexType[] {
    const array: HexType[] = []
    for (let i = 0; i < HexUtils.DIRECTIONS.length; i += 1) {
      array.push(HexUtils.neighbor(hex, i))
    }
    return array
  }
  /** I'm not sure what this does */
  static round(hex: HexType) {
    let rq = Math.round(hex.q)
    let rr = Math.round(hex.r)
    let rs = Math.round(hex.s)

    const qDiff = Math.abs(rq - hex.q)
    const rDiff = Math.abs(rr - hex.r)
    const sDiff = Math.abs(rs - hex.s)

    if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs
    else if (rDiff > sDiff) rr = -rq - rs
    else rs = -rq - rr

    return { q: rq, rr, rs)
  }
  /** Given the q,r,s of a hexagon return the x and y pixel coordinates of the
   * hexagon center. */
  static hexToPixel(hex: HexType, layout: LayoutDimension): Point {
    const s = layout.spacing
    const M = layout.orientation
    let x = (M.f0 * hex.q + M.f1 * hex.r) * layout.size.x
    let y = (M.f2 * hex.q + M.f3 * hex.r) * layout.size.y
    // Apply spacing
    x = x * s
    y = y * s
    return new Point(x + layout.origin.x, y + layout.origin.y)
  }
  /** Return the q,r,s coordinate of the hexagon given pixel point x and y. */
  static pixelToHex(point: Point, layout: LayoutDimension): HexType {
    const M = layout.orientation
    const pt = new Point(
      (point.x - layout.origin.x) / layout.size.x,
      (point.y - layout.origin.y) / layout.size.y,
    )
    const q = M.b0 * pt.x + M.b1 * pt.y
    const r = M.b2 * pt.x + M.b3 * pt.y
    const hex = { q: q, r, -q - r)
    return HexUtils.round(hex)
  }
  /** Apply Linear Interpolation between two known points
   * See:
   * https://en.wikipedia.org/wiki/Linear_interpolation
   */
  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }
  /** Apply Linear Interpolation between two known Hexes
   * See:
   * https://en.wikipedia.org/wiki/Linear_interpolation
   */
  static hexLerp(a: HexType, b: HexType, t: number): HexType {
    return { q: 
      HexUtils.lerp(a.q, b.q, t),
      HexUtils.lerp(a.r, b.r, t),
      HexUtils.lerp(a.s, b.s, t),
    )
  }
  /** Return a string ID from Hex Coordinates.
   * Example: HexType Coordinates of {q: 1, r: 2, s: 3} is returned
   * as string "1,2,3"
   */
  static getID(hex: HexType): string {
    return `${hex.q},${hex.r},${hex.s}`
  }
}

export default HexUtils
