let canvasRecorder;

canvasRecorder = new CCapture({
  format: "webm",
  framerate: FRAMERATE
});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

sleep(100).then(() => {
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
