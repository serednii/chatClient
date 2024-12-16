import styles from "./GeneratorAvatar.module.scss";
interface AvatarProps {
  userName: string;
}
// Функція для генерації кольору з тексту
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // Генеруємо числове значення
  }

  const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
    (hash >> 16) &
    0xff
  )
    .toString(16)
    .padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;
  return color.slice(0, 7); // Повертаємо колір у форматі HEX
};

const GeneratorAvatar = ({ userName }: AvatarProps) => {
  const firstName = userName.split(" ")[0];
  const lastName = userName.split(" ")[1] || "";
  // Генеруємо ініціали
  const initials = `${firstName[0]?.toUpperCase() || ""}${
    lastName[0]?.toUpperCase() || ""
  }`;

  const backgroundColor = stringToColor(`${firstName} ${lastName}`);
  // Стили аватара
  const avatarStyle: React.CSSProperties = {
    backgroundColor,
  };

  return (
    <div className={styles.avatar} style={avatarStyle}>
      {initials}
    </div>
  );
};

export default GeneratorAvatar;
