function ATSChecklist() {
  const items = [
    ["Contact Information", true],
    ["Education", true],
    ["Skills", true],
    ["Projects", false],
    ["Experience", false],
    ["Keywords", false],
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
      <h2>ATS Checklist</h2>

      {items.map((item) => (
        <div
          key={item[0]}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <span>{item[0]}</span>

          <span
            style={{
              color: item[1] ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {item[1] ? "✔" : "✖"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ATSChecklist;