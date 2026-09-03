import {
  Image as KonvaImage,
  Text,
} from 'react-konva'

import useImage from 'use-image'

type MapBackgroundProps = {
  imagePath: string
}

const BOARD_WIDTH = 1350
const BOARD_HEIGHT = 900

function MapBackground({
  imagePath,
}: MapBackgroundProps) {
  const [image] =
    useImage(imagePath)

  if (!image) {
    return (
      <Text
        text="MAP IMAGE NOT FOUND"
        x={0}
        y={
          BOARD_HEIGHT / 2 - 20
        }
        width={
          BOARD_WIDTH
        }
        align="center"
        fill="#39414b"
        fontSize={26}
        fontStyle="bold"
        listening={false}
      />
    )
  }

  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={
        BOARD_WIDTH
      }
      height={
        BOARD_HEIGHT
      }
      listening={false}
    />
  )
}

export default MapBackground