// src/controllers/statsController.js
import { db } from '../config/firebase.js';

// 대시보드 예약 및 시술 통계 차트 데이터 반환
export const getChartStats = async (req, res) => {
  try {
    // 예시 데이터 - 실제 DB 쿼리로 변경 필요
    const stats = {
      reservationTrend: [10, 12, 8, 15, 9, 5, 7], // 요일별 예약 건수
      procedureLabels: ['라미네이트', '스케일링', '잇몸성형'],
      procedureCounts: [3, 5, 2]
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
