import axios from "axios";
import swal from "sweetalert";
export const getFollowing = (id) => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}api/community/getFollowing/${id}`)
    .then((res) => {
      let data = {
        message: res.data.message.following,
        followerId: id,
      };
      dispatch({
        type: "GET_FOLLOWING",
        payload: data,
      });
    })
    .catch((err) => {
      console.log("Err response for getFollowing-=-=-=-=", err.response.data);
    });
};

export const getFollowers = (id) => (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}api/community/getFollowers/${id}`)
    .then((res) => {
      let data = {
        message: res.data.message.followers,
        followingId: id,
      };
      dispatch({
        type: "GET_FOLLOWERS",
        payload: data,
      });
    })
    .catch((err) => {
      console.log("Err response for getFollowing-=-=-=-=", err.response.data);
    });
};
