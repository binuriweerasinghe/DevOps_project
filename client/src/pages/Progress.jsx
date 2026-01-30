import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Progress() {
  const [weights, setWeights] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    kg: ""
  });
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId"); // Make sure userId exists

  // Fetch user's weight entries
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/weights?userId=${userId}`)
      .then((res) =>
        setWeights(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)))
      )
      .catch((err) => console.error("❌ Error fetching weights:", err));
  }, [userId]);

  // Handle input changes
  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Add new weight entry
  function add(e) {
    e.preventDefault();
    if (!form.kg || !userId) return;

    const newEntry = { date: form.date, kg: +form.kg, userId };

    axios
      .post("http://localhost:5000/api/weights", newEntry)
      .then((res) => {
        setWeights((prev) =>
          [...prev, res.data].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        );
        setForm({
          date: new Date().toISOString().slice(0, 10),
          kg: ""
        });
        setMessage("✅ Weight entry added!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        console.error("❌ Error adding weight:", err.response?.data || err);
        setMessage("❌ Failed to add weight entry.");
        setTimeout(() => setMessage(""), 3000);
      });
  }

  // Delete weight entry
  function remove(id) {
  if (!window.confirm("Are you sure you want to delete this entry?")) return;

  axios.delete(`http://localhost:5000/api/weights/${id}`)  // ← full URL
    .then(() => {
      setWeights(prev => prev.filter(w => w._id !== id));
      setMessage("✅ Weight entry deleted!");
      setTimeout(() => setMessage(""), 3000);
    })
    .catch(err => {
      console.error("❌ Error deleting weight:", err);
      setMessage("❌ Failed to delete weight entry.");
      setTimeout(() => setMessage(""), 3000);
    });
}

  return (
    <div>
  <h2>Progress</h2>

  {/* Form to add weight */}
  <form className="progress-card" onSubmit={add}>
    <label>Date</label>
    <input type="date" name="date" value={form.date} onChange={onChange} required />
    
    <label>Weight (kg)</label>
    <input type="number" step="0.1" name="kg" value={form.kg} onChange={onChange} required />
    
    <button type="submit">Add entry</button>
    {message && <p className="message">{message}</p>}
  </form>

  {/* Line chart */}
  <div className="chart-container">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={weights}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis dataKey="kg" tickFormatter={(v) => v.toFixed(1)} />
        <Tooltip />
        <Line type="monotone" dataKey="kg" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Table of weight entries */}
  <table className="progress-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Weight (kg)</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {[...weights].reverse().map((w) => (
        <tr key={w._id}>
          <td>{w.date.slice(0, 10)}</td>
          <td>{w.kg}</td>
          <td>
            <button onClick={() => remove(w._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}
