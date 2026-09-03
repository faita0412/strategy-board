import { OPERATORS } from './operators'

import type {
  OperatorGadgetDefinition,
} from '../types/board'

export const OPERATOR_GADGETS: OperatorGadgetDefinition[] =
  OPERATORS.map((operator) => {
    const fileName =
      operator.image
        .split('/')
        .pop()

    return {
      id: operator.id,

      name: `${operator.name} Gadget`,

      operatorId:
        operator.id,

      image:
        `/icons/operator-gadgets/${operator.side}/${fileName}`,
    }
  })