import type { MapDefinition } from '../../types/board'

const bank: MapDefinition = {
  id: 'bank',
  name: 'Bank',
  defaultFloor: '2F',

  floors: {
    B1: {
      image: '/maps/bank/b1.webp',
    },

    '1F': {
      image: '/maps/bank/1f.webp',
    },

    '2F': {
      image: '/maps/bank/2f.webp',
    },
  },
}

export default bank


