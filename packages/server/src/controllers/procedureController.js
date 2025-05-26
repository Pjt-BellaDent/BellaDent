import { db } from "../config/firebase.js";

export const getProcedureStats = async (req, res) => {
  try {
    const snapshot = await db.collection("procedures").get();
    const counts = {};

    snapshot.docs.forEach(doc => {
      const { type } = doc.data();
      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
