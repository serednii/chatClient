import userEvent from "@testing-library/user-event";
import DateComponent from "../DateComponent";
import GeneratorAvatar from "../generatorAvatar/GeneratorAvatar";
import { ILastUserVisitTime, IUsersName, IUserWrite } from "../interface";
import TypingIndicator from "../TypingIndicator";
import styles from "./users.module.scss";

interface IUserProps {
  user: IUsersName;
  lastDateVisit: ILastUserVisitTime | undefined;
  classStatus: string | undefined;
  findUser: IUserWrite | undefined;
}

const User = (props: IUserProps) => {
  const { user, lastDateVisit, classStatus, findUser } = props;
  return (
    <li className={styles.user__message}>
      <div className={styles.message__inner_top}>
        {!lastDateVisit?.avatar ? (
          <div className={styles.message__inner_user_avatar}>
            <GeneratorAvatar userName={user.name} />
          </div>
        ) : (
          <img
            className={styles.message__inner_user_avatar}
            src={`/user_foto/${lastDateVisit?.avatar}`}
            alt="foto user"
          />
        )}

        <div
          className={`${styles.message__inner_user} ${
            styles[classStatus || ""]
          }`}
        >
          <span> {user.name}</span>
          {findUser && <TypingIndicator />}
        </div>

        <span>{<DateComponent date={lastDateVisit?.last_visit_date} />}</span>
      </div>
    </li>
  );
};

export default User;
