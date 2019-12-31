let canvasRecorder;

function startRecording(startSecond, frameRate) {
  if (!startSecond | !frameRate) {
    return null;
  } else {
    addStopRecordingButton();
  }
  const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  sleep(startSecond).then(() => {
    console.log("start recording");
    canvasRecorder = new CCapture({
      format: "webm",
      framerate: frameRate,
      verbose: true
    });
    canvasRecorder.start();
  });
}

function stopRecording() {
  stopButton.onclick = e => {
    canvasRecorder.stop();
    canvasRecorder.save();
    canvasRecorder = null;
  };
  // remove button after click, it requires multiple clicks
  // document.getElementsByClassName("stopButton")[0].removeChild(stopButton);
}

function getParamFromUrl(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get(paramName);
  return paramValue;
}

function globRequire() {
  require("./projects/*.js", { glob: true });
}

function appendSketch(sketchName) {
  require(`./projects/${sketchName}.js`);
}

function addStopRecordingButton() {
  window.onload = function() {
    stopButton = document.createElement("button");
    stopButton.textContent = "Stop Recording";
    stopButton.onclick = stopRecording;
    document.getElementsByClassName("buttons")[0].appendChild(stopButton);
  };
}

globRequire;
appendSketch(getParamFromUrl("sketch"));
startRecording(getParamFromUrl("start-second"), getParamFromUrl("frame-rate"));
