import { useEffect, useRef } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handPose from "@tensorflow-models/handpose"
// import * as handPoseDetection from "@tensorflow-models/hand-pose-detection"
import Webcam from "react-webcam"
import { drawHand } from "./util"

function App() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const runHandpose = async () => {
    await tf.ready()
    // const model = await handPose
    // const detectorConfig: handPose.MediaPipeHandsTfjsModelConfig = {
    //   runtime: "tfjs",
    //   modelType: "full",
    // }
    const net = await handPose.load()
    // const drawableNet = await handPose.load()
    console.log("Handpose model loaded.")
    //  Loop and detect hands
    setInterval(() => {
      detect(net)
    }, 10)
  }

  const detect = async (
    net: handPose.HandPose
    // drawableNet?: handPose.HandPose
  ) => {
    // check data is available
    if (webcamRef.current === null) return
    if (webcamRef.current.video === null) return
    if (typeof webcamRef.current === "undefined") return
    if (webcamRef.current.video.readyState !== 4) return

    // Get Video Properties
    const video = webcamRef.current.video
    const videoWidth = webcamRef.current.video.videoWidth
    const videoHeight = webcamRef.current.video.videoHeight

    // Set video width
    webcamRef.current.video.width = videoWidth
    webcamRef.current.video.height = videoHeight

    // Set canvas height and width
    if (canvasRef.current === null) return
    const canvas = canvasRef.current
    canvas.width = videoWidth
    canvas.height = videoHeight

    // Make Detections
    const hand = await net.estimateHands(video)

    // get annotations
    // const annotations = await drawableNet.estimateHands(video)

    // Draw mesh
    const ctx = canvas.getContext("2d")
    if (ctx === null) return
    drawHand(hand, ctx)

    // log hand data message
    if (hand.length > 0) {
      console.log(hand)
    }
  }

  useEffect(() => {
    runHandpose()
  })
  return (
    <>
      <div className='relative flex items-center h-screen justify-center'>
        <Webcam ref={webcamRef} className='absolute w-[640] h-[480]' />
        <canvas ref={canvasRef} className='absolute w-[640] h-[480]'></canvas>
      </div>
    </>
  )
}

export default App
