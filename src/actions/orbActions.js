import swal from "sweetalert";
import axios from "axios";

export const storeScreenShot = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/user/saveScreenShot`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: "STORE_SCREENSHOT",
          });
          swal(
            "Success",
            "Screen shot saved successfully",
            "success"
          ).then(() => window.scrollTo());
        }
      })
      .catch(error => console.log("error while storing ss", error));
  };
};

export const storeChefOrbDetails = data => {
  return dispatch => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/stream/addDetailsChefStream`,
        data
      )
      .then(result => {
        console.log("result ", result.data);
        if (result.status === 201) {
          dispatch({
            type: "STORE_CHEF_ORB_DETAILS",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error while storing ss", error));
  };
};

export const storeFanStatus = data => {
  return dispatch => {
    dispatch({
      type: "FAN_GO_LIVE",
      payload: data,
    });
  };
};

export const getUserToken = data => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${data}`)
      .then(result => {
        console.log("api response ", result);
        if (result.data.code == 201) {
          dispatch({
            type: "USER_TOKEN",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error while fetching data", error));
  };
};

export const getStreamDetails = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/stream/getStreamdata`, data)
      .then(result => {
        console.log("result ", result.data);
        if (result.status === 201) {
          dispatch({
            type: "GET_STREAM_DETAILS",
            payload: result.data,
          });
        }
      })
      .catch(error => console.log("error while storing ss", error));
  };
};

export const storeRateReview = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/reviews/addRatings`, data)
      .then(result => {
        if (result.data.success) {
          dispatch({
            type: "STORE_RATE_REVIEW",
            payload: result.data.success,
          });
          window.location.replace("/fanHomePage");
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};

export const storeOnlineUser = () => {
  return dispatch => {
    const data = {
      userId: localStorage.getItem("id"),
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/online/storeOnlineUserId`,
        data
      )
      .then(result => {
        if (result.data.success) {
          dispatch({
            type: "STORE_ONLINE_USER",
          });
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};

export const getOnlineUserList = (category, subCategory) => {
  console.log("get from community parameter ", category, subCategory);
  let type;
  if (category == "music") {
    type = "star";
  } else if (category == "food") {
    type = "chef";
  } else if (category == "style") {
    type = "stylist";
  } else if (category == "body") {
    type = "trainer";
  }
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/online/getOnlineUsers?type=${type}&subCategory=${subCategory}`
      )
      .then(async result => {
        if (result.data.success) {
          await dispatch({
            type: "GET_ONLINE_USERS",
            payload: result.data.message,
          });
        }
      })
      .catch(error => {
        console.log("error........", error);
      });
  };
};

export const removeOnlineUser = () => {
  return dispatch => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}api/online/removeUser`, {
        data: {userId: localStorage.getItem("id")},
      })
      .then(result => {
        if (result.data.code === 201) {
          dispatch({
            type: "REMOVE_USER",
          });

          window.location.replace("/userHomepage");
        }
      })
      .catch(error => {
        console.log("error.......", error);
      });
  };
};

export const checkUserOnline = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/online/checkOnlineUser?id=${data}`
      )
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "CHECK_ONLNIE_USER",
            payload: result.data.success,
          });
        }
      })
      .catch(err => {
        console.log("error in check user online ", err);
      });
  };
};

export const joinedFan = data => {
  return dispatch => {
    axios
      .put(`${process.env.REACT_APP_API_URL}api/online/storeJoinedFan`, data)
      .then(result => {
        if (result.data.code === 201) {
          dispatch({
            type: "STORE_JOINED_FAN",
          });
        }
      })
      .catch(error => {
        console.log("error.........", error);
      });
  };
};

export const removedJoinFan = data => {
  return dispatch => {
    axios
      .put(`${process.env.REACT_APP_API_URL}api/online/removeFan`, data)
      .then(result => {
        if (result.data.code === 201) {
          dispatch({
            type: "REMOVE_FAN",
          });
        }
      })
      .catch(error => {
        console.log("error........", error);
      });
  };
};

export const getJoinedFanList = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/online/getJoinedFans?id=${data}`
      )
      .then(result => {
        console.log("result.data", result.data, data);
        if (result.data.code === 201) {
          dispatch({
            type: "JOINED_FAN",
            payload: result.data.data,
          });
        }
      })
      .catch(error => {
        console.log("error in get fans list", error);
      });
  };
};

export const deleteGeneratedStream = () => {
  return dispatch => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}api/stream/deleteStreamData`, {
        data: {userId: localStorage.getItem("id")},
      })
      .then(result => {
        if (result.data.code === 200 || result.data.success) {
          dispatch({
            type: "DELETE_STREAM",
          });
        }
      })
      .catch(error => {
        console.log(" error........", error);
      });
  };
};

export const changeUserStatus = () => {
  return dispatch => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }api/online/updateUserStatus?userId=${localStorage.getItem("id")}`
      )
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "CHANGE_STATUS",
          });
        }
      })
      .catch(err => {
        console.log("error in api callinkg ", err);
      });
  };
};

export const getUserStatus = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/online/getUserStatus?userId=${data}`
      )
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "GET_USER_STATUS",
            payload: result.data.data,
          });
        }
      })
      .catch(err => console.log("error........ ", err));
  };
};

export const onlineUserCheck = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/online/checkOnlineUser?id=${data}`
      )
      .then(result => {
        if (result.data.success) {
          dispatch({
            type: "CHECK_ONLNIE_USER",
            payload: result.data.success,
          });
        }
      })
      .catch(err => console.log("error..........", err));
  };
};

export const storeLiveStream = data => {
  return dispatch => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/liveStream/storeLiveStreamData`,
        data
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "STORE_LIVE_STREAM",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error in storelivestram api...... ", error));
  };
};

export const getLiveStream = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/liveStream/getLiveStreamData?userId=${data}`
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "GET_LIVE_STREAM_DATA",
            payload: result.data.data,
          });
        }
      })
      .catch(err => console.log("err in get live stream ", err));
  };
};

export const deleteStream = () => {
  return dispatch => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}api/liveStream/deleteLiveStreamData`,
        {
          data: {userId: localStorage.getItem("id")},
        }
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "DELETE_LIVE_STREAM",
          });
        }
      })
      .catch(error => console.log("eror.. ", error));
  };
};

export const storeHostUId = uid => {
  return dispatch => {
    const data = {
      userId: localStorage.getItem("id"),
      hostUid: uid,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}api/online/storeHostUId`, data)
      .then(result => {
        if (result.data.success) {
          dispatch({
            type: "STORE_HOST_UID",
          });
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};
