function Badge({ text, type }) {
  let color = "";

  switch (type) {
    case "success":
      color = "bg-green-100 text-green-700";
      break;

    case "danger":
      color = "bg-red-100 text-red-700";
      break;

    case "warning":
      color = "bg-yellow-100 text-yellow-700";
      break;

    default:
      color = "bg-blue-100 text-blue-700";
  }

  return (
    <span className={`${color} px-4 py-2 rounded-full text-sm font-semibold`}>
      {text}
    </span>
  );
}

export default Badge;