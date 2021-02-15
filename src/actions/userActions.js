import axios from "axios";
import swal from "sweetalert";

export const registration = (data, props) => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/signup`, data)
      .then(result => {
        if (result.data.success === true) {
          dispatch({
            type: "SIGN_UP",
            payload: result.data,
          });
          swal("Info", "Registration done successfully!", "success").then(
            () => {
              localStorage.setItem("name", result.data.data.firstName);
              localStorage.setItem("token", result.data.authToken);
              localStorage.setItem("type", result.data.data.type);
              localStorage.setItem("id", result.data.data._id);
              if (data.type === "Fan" || data.type === "fan") {
                window.location.replace("/artistProfile");
                // window.location.replace("/fanHomePage");
              } else {
                window.location.replace("/artistProfile");
                // props.history.push("/userHomepage", { type: data.type });
              }
            }
          );
          //   props.history.push('/profile', {
          //     name: result.data.data.firstName,
          //   });
        } else {
          swal("Error!", result.data.message, "error");
        }
      })
      .catch(err => {
        console.log("error ", err);
        swal("Error!", err.toString(), "error");
      });
  };
};

export const login = (data, props) => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/signin`, data)
      .then(result => {
        if (result.data.success === true) {
          dispatch({
            type: "SIGN_IN",
            payload: result.data,
          });
          localStorage.setItem("token", result.data.authToken);
          localStorage.setItem("name", result.data.data.firstName);
          localStorage.setItem("type", result.data.data.type);
          localStorage.setItem("id", result.data.data._id);
          if (result.data.data.type === "Fan" || data.type === "fan") {
            window.location.replace("/fanHomePage");
          } else {
            props.history.push("/userHomepage", { type: result.data.type });
          }
        } else {
          swal("!Oops", result.data.message, "error");
        }
      })
      .catch(err => swal("Error!", err.toString(), "error"));
  };
};

export const getUser = () => {
  return dispatch => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }api/user/getUserData?id=${localStorage.getItem("id")}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then(result => {
        if (result.status === 201) {
          dispatch({
            type: "GET_USER",
            payload: result.data,
          });
        } else {
          console.log("error while retriving api ", result);
        }
      })
      .catch(error => console.log("error in get user api ", error));
  };
};

export const updateProfile = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/user/updateProfile`, data, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: "UPDATE_PROFILE",
            payload: result.data,
          });
          swal("Info", "User details updated successfully!", "success");
        }
      })
      .catch(err => console.log("error ", err));
  };
};

export const forgotPassword = data => {
  return dispatch => {
    swal({
      title: "processing...",
      text: "Plase wait for some time",
      icon: "warning",
      dangerMode: true,
      closeOnClickOutside: false,
      buttons: false,
    });
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/forgetpassword`, data)
      .then(result => {
        console.log("result ", result);
        if (result.data.success === true) {
          dispatch({
            type: "FORGOT_PASSWORD",
          });
          swal({
            title: "Success",
            text: result.data.message,
            icon: "success",
            closeOnClickOutside: false,
            dangerMode: false,
          });
        } else {
          swal({
            title: "Oops!",
            text: result.data.message,
            icon: "error",
            closeOnClickOutside: false,
            dangerMode: false,
          });
        }
      })
      .catch(err => {
        swal("oops!", err.toString(), "error");
      });
  };
};

export const resetPassword = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/resetpassword`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: "RESET_PASSWORD",
          });
          swal("Info", result.data.message).then(() =>
            window.location.replace("/login")
          );
        }
      })
      .catch(err => {
        swal("Error", err.toString());
      });
  };
};

export const logout = data => {
  return dispatch => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}auth/logout`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: "LOGOUT",
          });
        }
      })
      .catch(err => {
        swal("Error", err.toString());
      });
  };
};

export const getUserWithId = data => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_URL}auth/getUserWithId?id=${data}`)
    .then(result => {
      if (result.status === 200) {
        dispatch({
          type: "USER_INFO",
          payload: result.data,
        });
      }
    })
    .catch(err => {
      swal("Error", err.toString());
    });
};

export const deactivateUserAccount = data => {
  return dispatch => {
    console.log("fn called ", data);
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/accountDeactivation`, data)
      .then(result => {
        console.log("result ", result);
        if (result.status === 200) {
          dispatch({
            type: "DEACTIVATE_USER",
          });
          swal("Info", "Account Deactivate successfully", "success").then(
            () => {
              localStorage.clear();
              window.location.replace("/");
            }
          );
        } else {
          swal("Error", "Something went wrong!", "error");
        }
      })
      .catch(error => {
        console.log("error in api ", error);
      });
  };
};

export const addInterest = (
  foodChoices,
  styleChoices,
  musicChoices,
  fitnessChoices,
  starType,
  props
) => {
  // ${process.env.REACT_APP_API_URL}

  console.log("foodChoices-=-=-=-", foodChoices);

  console.log("styleChoices-=-=-=-", styleChoices);

  console.log("musicChoices-=-=-=-", musicChoices);
  console.log("starType-=-=-=-", starType);

  console.log("fitnessChoices-=-=-=-", fitnessChoices);

  return dispatch => {
    // http://localhost:8000/
    axios
      .post(
        `${process.env.REACT_APP_API_URL}auth/addInterest`,
        {
          id: localStorage.getItem("id"),
          food: foodChoices,
          music: musicChoices,
          style: styleChoices,
          fitness: fitnessChoices,
          starType: starType,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then(res => {
        console.log("response add Interes.....", res.data);
        let message = res.data.message.toString();
        // console.log("message-=-=", message.toString());
        if (res.data.success == true) {
          swal("", "Your preferences added successfully!", "success").then(
            () => {
              if (
                localStorage.getItem("type") === "Fan" ||
                localStorage.getItem("type") === "fan"
              ) {
                window.location.replace("/fanHomePage");
              } else {
                props.history.push("/userHomepage", {
                  type: localStorage.getItem("type"),
                });
              }
            }
          );
        } else {
          swal("", message.charAt(0).toUpperCase() + message.slice(1), "error");
        }
      })
      .catch(error => {
        console.log("error in api ", error);
        // swal("Error", error.response.data.message, "error");
      });
  };
};

export const storeContactUs = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/contact/storeContactUs`, data)
      .then(result => {
        console.log("result of api ", result);
        if (result.status === 200) {
          dispatch({
            type: "STORE_CONTACT_US",
          });
          swal("Success", "Your Details stored successfully!", "success").then(
            () => {
              if (
                localStorage.getItem("type") == "fan" ||
                localStorage.getItem("type") == "Fan"
              ) {
                window.location.replace("/fanHomePage");
              } else {
                window.location.replace("/userHomepage");
              }
            }
          );
        }
      })
      .catch(error => {
        console.log("error........", error);
      });
  };
};

export const getAllFans = () => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/user/getAllFans`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(result => {
        console.log("result of api ", result);
        if (result.status === 200) {
          dispatch({
            type: "GET_ALL_FANS",
            payload: result.data.message,
          });
          console.log("result DATA of api -=-==--==-=-=", result.data);
        }
      })
      .catch(error => {
        console.log("error........", error);
      });
  };
};

export const getAllFollower = () => {
  return dispatch => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }api/community/getMyFollowers/${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result of api get all followers ", result);
        if (result.status === 200) {
          dispatch({
            type: "GET_ALL_FOLLOWER",
            payload: result.data.data,
          });
          console.log("result DATA of api -=-==--==-=-=", result.data);
        }
      })
      .catch(error => {
        console.log("error........", error);
      });
  };
};

export const getAllArtists = (category, subCategory) => {
  return dispatch => {
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
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/user/getAllArtists`,
        {
          type: type,
          subCategory: subCategory,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then(result => {
        // console.log("result of api ", result);
        if (result.status === 200) {
          dispatch({
            type: "GET_ALL_ARTISTS",
            payload: result.data.message,
          });
          // console.log(
          //   "result DATA of api getAllArtists -=-==--==-=-=",
          //   result.data
          // );
        }
      })
      .catch(error => {
        console.log("error........", error);
      });
  };
};

export const getFromCommunity = (category, subCategory) => dispatch => {
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
  axios
    .post(`${process.env.REACT_APP_API_URL}api/community/getCommunity`, {
      userId: localStorage.getItem("id"),
      type: type,
      subCategory: subCategory,
    })
    .then(res => {
      // console.log("response for getFromCommunity=-=-=-", res.data);
      if (res.data.success == true) {
        dispatch({
          type: "GET_FROM_COMMUNITY_SUCCESS",
          payload: res.data.message,
        });
      } else {
        dispatch({
          type: "GET_FROM_COMMUNITY_ERROR",
          payload: res.data,
        });
      }
    })
    .catch(err => {
      dispatch({
        type: "GET_FROM_COMMUNITY_ERROR",
        payload: err.response.data,
      });
      // console.log(
      //   "Err response for getFromCommnunity-=-=-=-=",
      //   err.response.data
      // );
    });
};
export const addToCommunity = communityId => dispatch => {
  axios
    .post(`${process.env.REACT_APP_API_URL}api/community/addToCommunity`, {
      userId: localStorage.getItem("id"),
      communityId: communityId,
    })
    .then(res => {
      if (res.data.success == true) {
        dispatch({
          type: "ADD_TO_COMMUNITY_SUCCESS",
          payload: res.data.message.msg,
        });
        swal("", res.data.message.msg, "success");
        // console.log("response for addToCommunity=-=-=-", res.data);
      } else {
        dispatch({
          type: "ADD_TO_COMMUNITY_ERROR",
          payload: res.data.message,
        });
        swal("", res.data.message, "warning");
      }
    })
    .catch(err => {
      dispatch({
        type: "ADD_TO_COMMUNITY_ERROR",
        payload: err.response.data.message,
      });
      swal("", err.response.data.message, "warning");

      // console.log("Err response for addToCommunity-=-=-=-=", err.response.data);
    });
};
export const removeFromCommunity = communityId => dispatch => {
  axios
    .post(`${process.env.REACT_APP_API_URL}api/community/removeFromCommunity`, {
      userId: localStorage.getItem("id"),
      communityId: communityId,
    })
    .then(res => {
      if (res.data.success == true) {
        dispatch({
          type: "REMOVE_FROM_COMMUNITY_SUCCESS",
          payload: res.data.message,
        });
        swal("", res.data.message, "success");
      } else {
        dispatch({
          type: "REMOVE_FROM_COMMUNITY_ERROR",
          payload: res.data.message,
        });
        swal("", res.data.message, "warning");
      }
      // console.log("response for remveFromCommunity=-=-=-", res.data);
    })
    .catch(err => {
      dispatch({
        type: "REMOVE_FROM_COMMUNITY_ERROR",
        payload: err.response.data.message,
      });
      swal("", err.response.data.message, "warning");

      // console.log(
      //   "Err response for remveFromCommunity-=-=-=-=",
      //   err.response.data
      // );
    });
};
