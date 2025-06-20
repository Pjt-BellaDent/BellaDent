// src/controllers/statsController.js
import { db } from '../config/firebase.js';

// 대시보드 예약 및 시술 통계 차트 데이터 반환
export const getChartStats = async (req, res) => {
  try {
    // 실제 DB에서 데이터 조회
    const appointmentsSnapshot = await db.collection('appointments').get();
    const proceduresSnapshot = await db.collection('procedures').get();
    
    // 예약 트렌드 (최근 7일)
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const reservationTrend = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayAppointments = appointmentsSnapshot.docs.filter(doc => 
        doc.data().date === dateStr
      ).length;
      reservationTrend.push(dayAppointments);
    }
    
    // 시술 통계
    const procedureCounts = {};
    proceduresSnapshot.docs.forEach(doc => {
      const procedure = doc.data().title || '기타';
      procedureCounts[procedure] = (procedureCounts[procedure] || 0) + 1;
    });
    
    const stats = {
      reservationTrend,
      procedureLabels: Object.keys(procedureCounts),
      procedureCounts: Object.values(procedureCounts)
    };
    
    res.json(stats);
  } catch (err) {
    console.error('통계 조회 오류:', err);
    res.status(500).json({ error: err.message });
  }
};
