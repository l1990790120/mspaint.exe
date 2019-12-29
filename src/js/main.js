let FRAMERATE;

function getSketchName() {
  const urlParams = new URLSearchParams(window.location.search);
  const sketchName = urlParams.get("sketch");
  return sketchName;
}

function appendSketch(sketchName) {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `../js/projects/${sketchName}.js`;
  document.head.appendChild(script);
}

function addStopRecordingButton() {
  window.onload = function() {
    stopButton = document.createElement("button");
    stopButton.textContent = "Stop Recording";
    document.getElementsByClassName("stopButton")[0].appendChild(stopButton);
    stopButton.onclick = stopRecording;
  };
}

appendSketch(getSketchName());
addStopRecordingButton();
