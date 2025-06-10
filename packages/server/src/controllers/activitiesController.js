// src/controllers/activitiesController.js

import { db } from '../config/firebase.js';

// 최근 활동 리스트 조회 (예: 최근 20건)
export const getRecentActivities = async (req, res) => {
  try {
    const snapshot = await db.collection('activities')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
