import type { MapDefinition } from '../../types/board'

const clubhouse: MapDefinition = {
  id: 'clubhouse',
  name: 'Clubhouse',
  defaultFloor: '2F',

  floors: {
    B1: {
      image: '/maps/clubhouse/b1.webp',
    },

    '1F': {
      image: '/maps/clubhouse/1f.webp',
    },

    '2F': {
      image: '/maps/clubhouse/2f.webp',
    },
  },
}

export default clubhouse


