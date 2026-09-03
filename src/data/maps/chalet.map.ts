import type { MapDefinition } from '../../types/board'

const chalet: MapDefinition = {
  id: 'chalet',
  name: 'Chalet',
  defaultFloor: '2F',

  floors: {
    '2F': {
      image: '/maps/chalet/2f.webp',
    },

    '1F': {
      image: '/maps/chalet/1f.webp',
    },

    'B1': {
      image: '/maps/chalet/b1.webp',
    },
  },
}

export default chalet


