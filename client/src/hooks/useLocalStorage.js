// useLocalStorage.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    name: "", sets: "", reps: "", duration: "", calories: ""
  });

  const userId = localStorage.getItem("userId");  // Get userId from localStorage or sessionStorage

  useEffect(() => {
    if (userId) {
      axios.get(`/api/workouts?userId=${userId}`)
        .then(response => setWorkouts(response.data))
        .catch(error => console.error("Error fetching workouts:", error));
    }
  }, [userId]);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function addWorkout(e) {
    e.preventDefault();
    axios.post('/api/workouts', { ...form, userId })
      .then(response => {
        setWorkouts([response.data, ...workouts]);
        setForm({ ...form, name: "", sets: "", reps: "", duration: "", calories: "" });
      })
      .catch(error => console.error("Error adding workout:", error));
  }

  function remove(id) {
    axios.delete(`/api/workouts/${id}`)
      .then(() => {
        setWorkouts(workouts.filter(w => w._id !== id));
      })
      .catch(error => console.error("Error deleting workout:", error));
  }

  return (
    <>
      <h2>Workouts</h2>
      <form className="card" onSubmit={addWorkout}>
        <input type="datetime-local" name="date" value={form.date} onChange={onChange} required />
        <input name="name" value={form.name} onChange={onChange} placeholder="Exercise" required />
        <input name="sets" value={form.sets} onChange={onChange} type="number" min="0" />
        <input name="reps" value={form.reps} onChange={onChange} type="number" min="0" />
        <input name="duration" value={form.duration} onChange={onChange} type="number" min="0" />
        <input name="calories" value={form.calories} onChange={onChange} type="number" min="0" />
        <button type="submit">Add</button>
      </form>

      <table className="table">
        <thead>
          <tr><th>Date</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>Dur</th><th>Cal</th><th></th></tr>
        </thead>
        <tbody>
          {workouts.map(w => (
            <tr key={w._id}>
              <td>{(w.date || "").replace("T", " ").slice(0, 16)}</td>
              <td>{w.name}</td>
              <td>{w.sets}</td>
              <td>{w.reps}</td>
              <td>{w.duration}</td>
              <td>{w.calories}</td>
              <td><button onClick={() => remove(w._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
