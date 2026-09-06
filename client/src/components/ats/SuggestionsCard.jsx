function SuggestionsCard() {
  const suggestions = [
    "Add more technical skills.",
    "Improve project descriptions.",
    "Include internship experience.",
    "Use more ATS keywords.",
    "Add measurable achievements.",
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >
      <h2>Suggestions</h2>

      <ul style={{ marginTop: "20px" }}>
        {suggestions.map((item) => (
          <li
            key={item}
            style={{
              marginBottom: "12px",
              color: "#555",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionsCard;