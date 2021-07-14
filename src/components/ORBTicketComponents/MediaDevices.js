import React, {useEffect, useState} from "react";
import "../../assets/css/media.css";
import swal from "sweetalert";

function MediaDevices(props) {
  console.log("props... ", props);
  const [selectedAudio, setSelectedAudio] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");

  const setSelectedDevice = () => {
    console.log(
      "set selected device mtd called... ",
      selectedAudio,
      selectedVideo
    );
    if (selectedVideo !== "" && selectedAudio !== "") {
      props.setSelectedAudioDevice(selectedAudio);
      props.setSelectedVideoDevice(selectedVideo);

      props.closeMediaDeviceModal();
      props.callGoToLive(selectedAudio, selectedVideo);
    } else {
      swal("Info", "Please select the audio and camera device!", "info");
    }
  };

  return (
    <div style={{background: "black"}} className="container">
      <div className="d-flex media_div">
        <div>
          <h4>Select the Audio devices:</h4>
          {props.attachedAudioDevices.length
            ? props.attachedAudioDevices.map(device => {
                return (
                  <div>
                    <input
                      type="radio"
                      name="audioDevice"
                      value={device.deviceId}
                      onChange={e => setSelectedAudio(e.target.value)}
                    />
                    {device.label}
                  </div>
                );
              })
            : null}
        </div>

        <div>
          <h4>Select the Camera devices:</h4>
          {props.attachedVideoDevices.length
            ? props.attachedVideoDevices.map(device => {
                return (
                  <div>
                    <input
                      type="radio"
                      name="cameraDevice"
                      value={device.deviceId}
                      onChange={e => setSelectedVideo(e.target.value)}
                    />
                    {device.label}
                  </div>
                );
              })
            : null}
        </div>
        <div className="mt-2">
          <button
            className="btn"
            style={{color: "white", border: "solid 1px white"}}
            onClick={setSelectedDevice}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaDevices;
