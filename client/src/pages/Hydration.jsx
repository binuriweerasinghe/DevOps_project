import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

export default function Hydration() {
  const [hydrations, setHydrations] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    date: new Date().toISOString().slice(0, 16)
  });
  const [message, setMessage] = useState('');

  const userId = localStorage.getItem('userId');

  // Fetch hydration entries
  useEffect(() => {
    if (!userId) return;
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/hydrations?userId=${userId}`)
      .then(res => setHydrations(res.data))
      .catch(err => console.error("Error fetching hydrations:", err));
  }, [userId]);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function addHydration(e) {
    e.preventDefault();
    if (!userId || !form.amount) return;

    axios.post(`${process.env.REACT_APP_SERVER_URL}/api/hydrations`, { ...form, userId })
      .then(res => {
        setHydrations([res.data, ...hydrations]);
        setForm({ amount: '', date: new Date().toISOString().slice(0, 16) });
        setMessage('✅ Hydration added!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => {
        console.error("Error adding hydration:", err);
        setMessage('❌ Failed to add hydration.');
        setTimeout(() => setMessage(''), 3000);
      });
  }

  function removeHydration(id) {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/hydrations/${id}`)
      .then(() => {
        setHydrations(hydrations.filter(h => h._id !== id));
        setMessage('✅ Hydration deleted!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h2>Hydration Tracker</h2>

      {/* Form */}
      <form className="progress-card" onSubmit={addHydration}>
        <label>Amount (ml)</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={onChange}
          placeholder="Enter amount"
          required
        />

        <label>Date & Time</label>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={onChange}
          required
        />

        <button type="submit">Add Hydration</button>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>

      {/* Table */}
      <table className="progress-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {hydrations.map(h => (
            <tr key={h._id}>
              <td>{(h.date || "").replace("T", " ").slice(0, 16)}</td>
              <td>{h.amount} ml</td>
              <td>
                <button className="delete-btn" onClick={() => removeHydration(h._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
