import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "https://pure-savannah-29011.herokuapp.com/api/auth/login",
      userCredential
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    console.log(err);
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
