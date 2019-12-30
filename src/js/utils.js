let canvasRecorder;

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

sleep(500).then(() => {
  console.log("start");
  canvasRecorder = new CCapture({
    format: "webm",
    framerate: 30,
    verbose: true
  });
  canvasRecorder.start();
});

function stopRecording() {
  stopButton.onclick = e => {
    canvasRecorder.stop();
    canvasRecorder.save();
    canvasRecorder = null;
  };
  // document.getElementsByClassName("stopButton")[0].removeChild(stopButton);
}
