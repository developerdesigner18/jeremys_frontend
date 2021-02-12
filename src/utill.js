import axios from "axios";

export const isAuthenticate = async () => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}api/user/getUserData`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
      {
        id: localStorage.getItem("id"),
      }
    )
    .then(result => {
      if (result.status === 201) {
        return true;
      } else {
        console.log("error while retriving api ", result);
        return false;
      }
    })
    .catch(error => {
      console.log("error in get user api ", error);
      return false;
    });
};
