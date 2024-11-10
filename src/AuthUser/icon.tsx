import { IconContext } from "react-icons";
import { RiAdminFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";

const iconColor = "black"; // Колір іконки (за потреби)

export const svgAdmin = (
  <IconContext.Provider value={{ size: "24", color: iconColor }}>
    <RiAdminFill />
  </IconContext.Provider>
);

export const svgLogOut = (
  <IconContext.Provider value={{ size: "24", color: iconColor }}>
    <MdLogout />
  </IconContext.Provider>
);
