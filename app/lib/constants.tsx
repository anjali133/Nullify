const friends_split_options = [
  { value: "split_equally", label: "You paid, split equally" },
  { value: "owed_full", label: "You are owed the full amount" },
  { value: "xyz_split_equally", label: "XYZ paid, split equally" },
  { value: "xyz_owed_full", label: "XYZ is owed the full amount" },
];

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


export default friends_split_options;
