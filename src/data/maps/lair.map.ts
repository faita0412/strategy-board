import type { MapDefinition } from '../../types/board'

const lair: MapDefinition = {
  id: 'lair',
  name: 'Lair',
  defaultFloor: '2F',

  floors: {
    '2F': {
      image: '/maps/lair/2f.webp',
    },

    '1F': {
      image: '/maps/lair/1f.webp',
    },

    'B1': {
      image: '/maps/lair/b1.webp',
    },
  },
}

export default lair


