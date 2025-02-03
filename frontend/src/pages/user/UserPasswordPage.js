import UserPasswordPageComponent from "./components/UserPasswordPageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setReduxUserState } from "../../redux/actions/userActions";
import UserLinksComponent from "../../components/user/UserLinksComponent";

const updateUserApiRequest = async (
  password,
) => {
  const { data } = await axios.put("/api/users/password", {
    password,
  });
  return data;
};

const fetchUser = async (id) => {
  const { data } = await axios.get("/api/users/password/" + id);
  return data;
};

const UserPasswordPage = () => {
  const reduxDispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);

  return (
    <div>
      <div>
        <UserLinksComponent />
      </div>
      <UserPasswordPageComponent
        updateUserApiRequest={updateUserApiRequest}
        fetchUser={fetchUser}
        userInfoFromRedux={userInfo}
        setReduxUserState={setReduxUserState}
        reduxDispatch={reduxDispatch}
        localStorage={window.localStorage}
        sessionStorage={window.sessionStorage}
      />
    </div>
  );
};

export default UserPasswordPage;
