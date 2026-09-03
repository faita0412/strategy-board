import clubhouse from './clubhouse.map'
import bank from './bank.map'
import border from './border.map'
import cafe from './cafe.map'
import chalet from './chalet.map'
import fortress from './fortress.map'
import lair from './lair.map'
import nighthaven_labs from './nighthaven_labs.map'
import villa from './villa.map'

export const MAPS = {
  clubhouse,
  bank,
  border,
  cafe,
  chalet,
  fortress,
  lair,
  nighthaven_labs,
  villa,
}

export type MapId = keyof typeof MAPS