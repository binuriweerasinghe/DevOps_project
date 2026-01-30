import React, { useEffect, useState } from "react";
import axios from "axios";

// Helper functions
function getISODateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function computeStreak(workouts) {
  const days = new Set(workouts.map(w => (w.date || "").slice(0, 10)));
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = getISODateKey(d);
    if (days.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function getBadges({ totalWorkoutsAllTime, todayWater, waterGoal, streak }) {
  const badges = [];
  if (totalWorkoutsAllTime >= 1) badges.push({ label: "First workout", color: "#6a11cb" });
  if (totalWorkoutsAllTime >= 5) badges.push({ label: "5 workouts", color: "#2575fc" });
  if (totalWorkoutsAllTime >= 10) badges.push({ label: "10 workouts", color: "#f39c12" });
  if (streak >= 3) badges.push({ label: "3-day streak", color: "#e74c3c" });
  if (streak >= 7) badges.push({ label: "7-day streak", color: "#16a085" });
  if (waterGoal && todayWater >= waterGoal) badges.push({ label: "Hydration goal met", color: "#3498db" });
  return badges;
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [hydrations, setHydrations] = useState([]);
  const [weights, setWeights] = useState([]);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [workoutGoal, setWorkoutGoal] = useState(3);
  const [targetWeight, setTargetWeight] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    axios.get(`/api/workouts?userId=${userId}`).then(res => setWorkouts(res.data)).catch(err => console.error(err));
    axios.get(`/api/hydrations?userId=${userId}`).then(res => setHydrations(res.data)).catch(err => console.error(err));
    axios.get(`/api/weights?userId=${userId}`).then(res => setWeights(res.data)).catch(err => console.error(err));
    axios.get(`/api/goals?userId=${userId}`)
      .then(res => {
        setWaterGoal(res.data.waterGoal || 2000);
        setWorkoutGoal(res.data.workoutGoal || 3);
        setTargetWeight(res.data.targetWeight || "");
      })
      .catch(() => {});
  }, []);

  const todayKey = getISODateKey();
  const todayWorkouts = workouts.filter(w => (w.date || "").slice(0, 10) === todayKey);
  const todayWater = hydrations
    .filter(h => (h.date || "").slice(0, 10) === todayKey)
    .reduce((sum, h) => sum + (h.ml || h.amount || 0), 0);

  const streak = computeStreak(workouts);
  const totalWorkoutsAllTime = workouts.length;
  const badges = getBadges({ totalWorkoutsAllTime, todayWater, waterGoal, streak });

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ marginBottom: "20px" }}>🏋️ Fitness Dashboard</h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div className="dashboard-card">
          <h4>Workouts Today</h4>
          <p>{todayWorkouts.length}</p>
        </div>
        <div className="dashboard-card">
          <h4>Water Consumed</h4>
          <p>{todayWater} ml / {waterGoal} ml</p>
        </div>
        <div className="dashboard-card">
          <h4>Workout Goal</h4>
          <p>{workoutGoal} per week</p>
        </div>
        <div className="dashboard-card">
          <h4>Target Weight</h4>
          <p>{targetWeight || "Not set"}</p>
        </div>
        <div className="dashboard-card">
          <h4>Current Streak</h4>
          <p>{streak} days</p>
        </div>
        <div className="dashboard-card">
          <h4>Total Workouts</h4>
          <p>{totalWorkoutsAllTime}</p>
        </div>
      </div>

      {/* Badges */}
      <h3>Badges</h3>
      {badges.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {badges.map((b, i) => (
            <span key={i} style={{
              backgroundColor: b.color,
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              {b.label}
            </span>
          ))}
        </div>
      ) : (
        <p>No badges earned yet</p>
      )}
    </div>
  );
}
