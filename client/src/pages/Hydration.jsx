import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Hydration() {
  const [hydrations, setHydrations] = useState([]);
  const [form, setForm] = useState({
    amount: '', date: new Date().toISOString().slice(0, 16)
  });
  const [message, setMessage] = useState('');

  const userId = localStorage.getItem('userId'); // make sure this exists

  // Fetch user's hydration entries
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/hydrations?userId=${userId}`)
      .then(res => setHydrations(res.data))
      .catch(err => console.error("Error fetching hydrations:", err));
  }, [userId]);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function addHydration(e) {
    e.preventDefault();
    if (!userId || !form.amount) return;

    axios.post('http://localhost:5000/api/hydrations', { ...form, userId })
      .then(res => {
        setHydrations([res.data, ...hydrations]);
        setForm({ amount: '', date: new Date().toISOString().slice(0, 16) });
        setMessage('✅ Hydration added!');
      })
      .catch(err => {
        console.error("Error adding hydration:", err);
        setMessage('❌ Failed to add hydration.');
      });
  }

  function removeHydration(id) {
    axios.delete(`/api/hydrations/${id}`)
      .then(() => {
        setHydrations(hydrations.filter(h => h._id !== id));
        setMessage('✅ Hydration deleted!');
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h2>Hydration Tracker</h2>
      <form onSubmit={addHydration}>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={onChange}
          placeholder="Amount (ml)"
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={onChange}
        />
        <button type="submit">Add Hydration</button>
      </form>

      {message && <p>{message}</p>}

      <table>
        <thead>
          <tr><th>Date</th><th>Amount</th><th></th></tr>
        </thead>
        <tbody>
          {hydrations.map(h => (
            <tr key={h._id}>
              <td>{(h.date || "").replace("T", " ").slice(0, 16)}</td>
              <td>{h.amount} ml</td>
              <td>
                <button onClick={() => removeHydration(h._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
