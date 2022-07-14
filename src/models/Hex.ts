export interface HexCoordinates {
  q: number
  r: number
  s: number
}
type HexPropsType = {
  fill: string
  className: string
}
interface HexAttributes {
  blocked: boolean
  text: string
  image: string
  props: Partial<HexPropsType>
  state: any
  pattern: string
}
type HexType = HexCoordinates & Partial<HexAttributes>
export default HexType
