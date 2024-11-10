interface IInput {
  value: string;
  style: string;
  name: string;
  placeholder: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<IInput> = ({
  value,
  handleChange,
  style,
  name,
  placeholder,
}) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      placeholder={placeholder}
      className={style}
      onChange={handleChange}
      autoComplete="off"
      required
    />
  );
};

export default Input;
