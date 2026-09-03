import type { MapDefinition } from '../../types/board'

const cafe: MapDefinition = {
  id: 'cafe',
  name: 'Cafe',
  defaultFloor: '3F',

  floors: {
    '3F': {
      image: '/maps/cafe/3f.webp',
    },

    '2F': {
      image: '/maps/cafe/2f.webp',
    },

    '1F': {
      image: '/maps/cafe/1f.webp',
    },
  },
}

export default cafe


