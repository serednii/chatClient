// import adminController from "../../../components/AdminPanel/AdminControler/admin-Controller";
import { svgAdmin, svgLogOut } from "../../icon";

import authStore from "../../mobx/AuthStore";
import "./auth_user.scss";

const AuthUser = () => {
  console.log("AuthUser");
  return (
    <div className="auth-user">
      <div className="auth-user__info">
        <h4 className="mb-0">
          {"Hello " +
            authStore.user.lastUserName +
            " " +
            authStore.user.userName}
        </h4>

        <button
          className="user-panel"
          // onClick={() => adminController.openAdminPanel(true)}
        >
          {/* {svgAdmin} */}
        </button>

        <button className="user-exit" onClick={() => authStore.logout()}>
          {svgLogOut}
        </button>
      </div>
      {/* {!authStore.user.isActivated && (
        <h5 className="auth-user__verify">VERIFY ACCOUNT BY MAIL!!!</h5>
      )} */}
    </div>
  );
};

export default AuthUser;
