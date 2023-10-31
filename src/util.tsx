import * as handpose from "@tensorflow-models/handpose"

// define label mapping
const labelMap: { [key: string]: { name: string; color: string } } = {
  1: { name: "Hello", color: "red" },
  2: { name: "Thank You", color: "yellow" },
  3: { name: "I Love You", color: "lime" },
  4: { name: "Nice to meet you", color: "blue" },
  5: { name: "Goodbye", color: "fuchsia" },
}

export const drawRect = (
  boxes: number[][],
  classes = [],
  scores = [],
  threshold = 0.5,
  imgWidth = 0,
  imgHeight = 0,
  ctx: CanvasRenderingContext2D | null = null
) => {
  if (ctx === null) return

  for (let i = 0; i <= boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      // Extract variables
      const [y, x, height, width] = boxes[i]
      const text = classes[i]

      // Set styling
      ctx.strokeStyle = labelMap[text]["color"]
      ctx.lineWidth = 10
      ctx.fillStyle = "white"
      ctx.font = "30px Arial"

      // DRAW!!
      ctx.beginPath()
      ctx.fillText(
        labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
        x * imgWidth,
        y * imgHeight - 10
      )
      ctx.rect(
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 2,
        (height * imgHeight) / 1.5
      )
      ctx.stroke()
    }
  }
}

export const drawHand = (
  predictions: handpose.AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D
) => {
  type FingerPoints = {
    [key: string]: number[]
  }

  // points for fingers
  const fingerPoints: FingerPoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  }

  predictions.forEach((prediction) => {
    const landmarks = prediction.landmarks

    // loop through fingers

    for (const finger in fingerPoints) {
      const points = fingerPoints[finger]
      for (let i = 0; i < points.length - 1; i++) {
        const firstPoint = landmarks[points[i]]
        const secondPoint = landmarks[points[i + 1]]

        ctx.beginPath()
        ctx.moveTo(firstPoint[0], firstPoint[1])
        ctx.lineTo(secondPoint[0], secondPoint[1])
        ctx.strokeStyle = "plum"
        ctx.lineWidth = 4
        ctx.stroke()
      }
    }

    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i][0]
      const y = landmarks[i][1]

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 3 * Math.PI)

      ctx.fillStyle = "aqua"
      ctx.fill()
    }
  })
}
