function ATSScoreCard({ score }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >
      <h2>ATS Resume Score</h2>

      <div
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          margin: "30px auto",
          border: "12px solid #2563EB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "42px",
          fontWeight: "bold",
          color: "#2563EB",
        }}
      >
        {score}%
      </div>

      <h3>Overall ATS Score</h3>
    </div>
  );
}

export default ATSScoreCard;