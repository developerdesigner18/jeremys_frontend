import React, {useEffect, useState} from "react";
import "../../assets/css/screenshot.css";
import {useDispatch, useSelector} from "react-redux";
import {storeScreenShot} from "../../actions/orbActions";

function ScreenShotUpload(props) {
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState("");

  const dispatch = useDispatch();
  const orbState = useSelector(state => state.ORB);

  const onImageChange = e => {
    let reader = new FileReader();
    console.log("event... ", e);
    reader.onload = event => {
      setShowImage(event.target.result);
      setImage(e.target.files[0]);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const uploadImage = async () => {
    let fd = new FormData();
    fd.append("id", localStorage.getItem("id"));
    fd.append("image", image);
    await dispatch(storeScreenShot(fd));
  };

  //   useEffect(() => {
  //     if (orbState) {
  //       if (orbState.storedValue) {
  //         if (props.imageModal) props.closeImageModal();
  //       }
  //     }
  //   }, [orbState]);

  return (
    <div
      style={{background: "black", border: "solid 1px white"}}
      className="container">
      <div className="edit_image mt-2">
        <img src={showImage} alt="profile" />
        <label className="choose_profile_pic custom-file-upload">
          <input
            type="file"
            onChange={e => {
              onImageChange(e);
            }}
          />
          Choose Screenshot Image
        </label>
        <div className="d-flex mb-2" style={{justifyContent: "space-between"}}>
          <button
            type="button"
            className="btn btn-default"
            style={{border: "solid 1px red", color: "white"}}
            onClick={uploadImage}>
            Upload Image
          </button>
          <button
            type="button"
            className="btn btn-default"
            style={{background: "white", color: "black"}}
            onClick={() => {
              props.closeImageModal();
            }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScreenShotUpload;
