import type { MapDefinition } from '../../types/board'

const nighthaven_labs: MapDefinition = {
  id: 'nighthaven_labs',
  name: 'Nighthaven Labs',
  defaultFloor: '2F',

  floors: {
    '2F': {
      image: '/maps/nighthaven_labs/2f.webp',
    },

    '1F': {
      image: '/maps/nighthaven_labs/1f.webp',
    },

    'B1': {
      image: '/maps/nighthaven_labs/b1.webp',
    },
  },
}

export default nighthaven_labs


