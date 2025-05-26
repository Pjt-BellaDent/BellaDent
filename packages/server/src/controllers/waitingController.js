import { db } from "../config/firebase.js";

export const getWaitingStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const snapshot = await db
      .collection("appointments")
      .where("reservationDate", "==", today)
      .get();

    const rooms = {};

    snapshot.docs.forEach(doc => {
      const appt = doc.data();
      const { department, doctor, room = `진료실 ${department}`, status, name } = appt;

      if (!rooms[department]) {
        rooms[department] = {
          room: room,
          department,
          doctor,
          current: null,
          waiting: []
        };
      }

      if (status === "진료중") {
        rooms[department].current = name;
      } else if (status === "대기") {
        rooms[department].waiting.push(name);
      }
    });

    res.json(Object.values(rooms));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
