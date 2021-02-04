import axios from "axios";
import swal from "sweetalert";
export const getFollowing = (id) => (dispatch) => {
  console.log(
    "${process.env.REACT_APP_API_URL}api/community/getFollowing/${id}",
    `${process.env.REACT_APP_API_URL}api/community/getFollowing/${id}`
  );
  axios
    .get(`${process.env.REACT_APP_API_URL}api/community/getFollowing/${id}`)
    .then((res) => {
      console.log("following API=--=-=-=", res);
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
  console.log(
    "${process.env.REACT_APP_API_URL}api/community/getFollowing/${id}",
    `${process.env.REACT_APP_API_URL}api/community/getFollowing/${id}`
  );
  axios
    .get(`${process.env.REACT_APP_API_URL}api/community/getFollowers/${id}`)
    .then((res) => {
      console.log("following API=--=-=-=", res);
      let data = {
        message: res.data.message.following,
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
