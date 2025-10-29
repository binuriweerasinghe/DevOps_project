import React, { useEffect, useState } from "react";
import axios from "axios";

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
  if (totalWorkoutsAllTime >= 1) badges.push("✅ First workout");
  if (totalWorkoutsAllTime >= 5) badges.push("🏅 5 workouts");
  if (totalWorkoutsAllTime >= 10) badges.push("🏋️ 10 workouts");
  if (streak >= 3) badges.push("🔥 3-day streak");
  if (streak >= 7) badges.push("🔥🔥 7-day streak");
  if (waterGoal && todayWater >= waterGoal) badges.push("💧 Hydration goal met");
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
      // If not authenticated, redirect to login
      window.location.href = "/login";
      return;
    }

    // Fetch workouts
    axios.get(`/api/workouts?userId=${userId}`)
      .then(res => setWorkouts(res.data))
      .catch(err => console.error("Error fetching workouts:", err));

    // Fetch hydrations
    axios.get(`/api/hydrations?userId=${userId}`)
      .then(res => setHydrations(res.data))
      .catch(err => console.error("Error fetching hydrations:", err));

    // Fetch weights
    axios.get(`/api/weights?userId=${userId}`)
      .then(res => setWeights(res.data))
      .catch(err => console.error("Error fetching weights:", err));

    // If you don’t have a backend for goals, remove this block
    axios.get(`/api/goals?userId=${userId}`)
      .then(res => {
        setWaterGoal(res.data.waterGoal || 2000);
        setWorkoutGoal(res.data.workoutGoal || 3);
        setTargetWeight(res.data.targetWeight || "");
      })
      .catch(() => {});
  }, []);

  // Derived data
  const todayKey = getISODateKey();
  const todayWorkouts = workouts.filter(w => (w.date || "").slice(0, 10) === todayKey);
  const todayWater = hydrations
    .filter(h => (h.date || "").slice(0, 10) === todayKey)
    .reduce((s, h) => s + (h.ml || h.amount || 0), 0); // supports both "ml" and "amount"

  const streak = computeStreak(workouts);
  const totalWorkoutsAllTime = workouts.length;
  const badges = getBadges({ totalWorkoutsAllTime, todayWater, waterGoal, streak });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>🏋️ Fitness Dashboard</h2>

      <h3>Today's Summary</h3>
      <p>Workouts today: <b>{todayWorkouts.length}</b></p>
      <p>Water consumed today: <b>{todayWater} ml</b> / {waterGoal} ml</p>

      <h3>Goals</h3>
      <p>Weekly workout goal: <b>{workoutGoal}</b></p>
      <p>Target weight: <b>{targetWeight || "Not set"}</b></p>

      <h3>Progress</h3>
      <p>Current streak: <b>{streak} days</b></p>
      <p>Total workouts (all time): <b>{totalWorkoutsAllTime}</b></p>

      <h3>Badges</h3>
      {badges.length > 0 ? (
        <ul>
          {badges.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      ) : (
        <p>No badges earned yet</p>
      )}
    </div>
  );
}




