import { useState, useEffect } from "react";
import axios from "axios";

export default function Goals() {
  const [waterGoal, setWaterGoal] = useState(2000);
  const [workoutGoal, setWorkoutGoal] = useState(3);
  const [weightGoal, setWeightGoal] = useState("");
  const [message, setMessage] = useState("");

  // Fetch goals from backend on mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/goals")
      .then(res => {
        const data = res.data || {};
        setWaterGoal(data.waterGoal || 2000);
        setWorkoutGoal(data.workoutGoal || 3);
        setWeightGoal(data.targetWeight || "");
      })
      .catch(err => console.error("Error fetching goals:", err));
  }, []);

  // Save goals
  function saveGoals() {
    axios.post("http://localhost:5000/api/goals", {
      waterGoal,
      workoutGoal,
      targetWeight: weightGoal
    })
    .then(() => {
      setMessage("✅ Goals saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    })
    .catch(err => {
      console.error("Error saving goals:", err);
      setMessage("❌ Failed to save goals.");
      setTimeout(() => setMessage(""), 3000);
    });
  }

  return (
    <div>
      <h2>Goals</h2>

      {/* Card for goals form */}
      <div className="progress-card">
        <label>Daily Water Goal (ml)</label>
        <input
          type="number"
          value={waterGoal}
          onChange={e => setWaterGoal(+e.target.value || 0)}
        />

        <label>Weekly Workouts Goal</label>
        <input
          type="number"
          value={workoutGoal}
          onChange={e => setWorkoutGoal(+e.target.value || 0)}
        />

        <label>Target Weight (kg)</label>
        <input
          type="number"
          value={weightGoal}
          onChange={e => setWeightGoal(+e.target.value || "")}
        />

        <div style={{ marginTop: "10px" }}>
          <button onClick={saveGoals}>Save Goals</button>
        </div>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
