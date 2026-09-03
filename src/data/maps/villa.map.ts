import type { MapDefinition } from '../../types/board'

const villa: MapDefinition = {
  id: 'villa',
  name: 'Villa',
  defaultFloor: '2F',

  floors: {
    '2F': {
      image: '/maps/villa/2f.webp',
    },

    '1F': {
      image: '/maps/villa/1f.webp',
    },

    'B1': {
      image: '/maps/villa/b1.webp',
    },
  },
}

export default villa


