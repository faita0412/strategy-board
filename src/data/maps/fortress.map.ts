import type { MapDefinition } from '../../types/board'

const fortress: MapDefinition = {
  id: 'fortress',
  name: 'Fortress',
  defaultFloor: '2F',

  floors: {
    '2F': {
      image: '/maps/fortress/2f.webp',
    },

    '1F': {
      image: '/maps/fortress/1f.webp',
    },
  },
}

export default fortress


