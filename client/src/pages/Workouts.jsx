import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"; // make sure App.css has the styles below

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,16),
    name: "", sets: "", reps: "", duration: "", calories: ""
  });
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId"); // logged-in user

  // Fetch workouts
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/workouts?userId=${userId}`)
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function addWorkout(e) {
    e.preventDefault();
    if (!form.name) return;

    axios.post("http://localhost:5000/api/workouts", { ...form, userId })
      .then(res => {
        setWorkouts([res.data, ...workouts]);
        setForm({ date: new Date().toISOString().slice(0,16), name: "", sets: "", reps: "", duration: "", calories: "" });
        setMessage("✅ Workout added!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error(err);
        setMessage("❌ Failed to add workout.");
        setTimeout(() => setMessage(""), 3000);
      });
  }

  function remove(id) {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    axios.delete(`http://localhost:5000/api/workouts/${id}?userId=${userId}`)
      .then(() => {
        setWorkouts(workouts.filter(w => w._id !== id));
        setMessage("✅ Workout deleted!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h2>Workouts</h2>

      {/* Workout Form Card */}
      <form className="progress-card" onSubmit={addWorkout}>
        <label>Date & Time</label>
        <input type="datetime-local" name="date" value={form.date} onChange={onChange} required />

        <label>Exercise</label>
        <input name="name" value={form.name} onChange={onChange} placeholder="Exercise" required />

        <label>Sets</label>
        <input name="sets" value={form.sets} onChange={onChange} type="number" min="0" />

        <label>Reps</label>
        <input name="reps" value={form.reps} onChange={onChange} type="number" min="0" />

        <label>Duration (min)</label>
        <input name="duration" value={form.duration} onChange={onChange} type="number" min="0" />

        <label>Calories Burned</label>
        <input name="calories" value={form.calories} onChange={onChange} type="number" min="0" />

        <button type="submit">Add Workout</button>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>

      {/* Workout Table */}
      <table className="progress-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Dur (min)</th>
            <th>Cal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map(w => (
            <tr key={w._id}>
              <td>{(w.date || "").replace("T"," ").slice(0,16)}</td>
              <td>{w.name}</td>
              <td>{w.sets}</td>
              <td>{w.reps}</td>
              <td>{w.duration}</td>
              <td>{w.calories}</td>
              <td>
                <button className="delete-btn" onClick={() => remove(w._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
