import UserProfilePageComponent from "./components/UserProfilePageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setReduxUserState } from "../../redux/actions/userActions";
import UserLinksComponent from "../../components/user/UserLinksComponent";


import styles from "../user/components/UserProfilePageComponent.module.css";

const UserProfilePage = () => {
  const reduxDispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const [userUpdated, setUserUpdated] = useState()
  const [userDetails, setUserDetails] = useState()

  const updateUserApiRequest = async (
    name,
    lastName,
    email,
    phone,
    mobile,
    location,
    company,
    role,
    state,
    postCode,
    abn
  ) => {
    const { data } = await axios.put("/api/users/profile", {
      name,
      lastName,
      email,
      phone,
      mobile,
      location,
      company,
      role,
      state,
      postCode,
      abn
    });
    setUserUpdated(data.success)
    setUserDetails({ "_id": userInfo._id, "userName": name + " " + lastName, "company": company, "role": role })

    return data;
  };

  const fetchUser = async (id) => {
    const { data } = await axios.get("/api/users/profile/" + id);
    return data;
  };

  const getdeliveryBooks = async () => {
    const { data } = await axios.get("/api/deliveryBooks/deliveryBook/" + userInfo.email);
    return data;
  };

  return (
    <div className={`${styles.userProfilePageComponentWrapper}`}>
      <div>
        <UserLinksComponent />
      </div>

      <UserProfilePageComponent
        updateUserApiRequest={updateUserApiRequest}
        fetchUser={fetchUser}
        getdeliveryBooks={getdeliveryBooks}
        userInfoFromRedux={userInfo}
        setReduxUserState={setReduxUserState}
        reduxDispatch={reduxDispatch}
        localStorage={window.localStorage}
        sessionStorage={window.sessionStorage}
      />
    </div>
  );
};

export default UserProfilePage;
