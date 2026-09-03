import type { MapDefinition } from '../../types/board'

const border: MapDefinition = {
  id: 'border',
  name: 'Border',
  defaultFloor: '2F',

  floors: {
    '2F': {
      image: '/maps/border/2f.webp',
    },

    '1F': {
      image: '/maps/border/1f.webp',
    },
  },
}

export default border


