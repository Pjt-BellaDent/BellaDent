// src/app/patients/components/Charts.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Charts = ({ proceduresData }) => {
  const procedureRef = useRef(null);
  const surveyRef = useRef(null);
  const procedureChartRef = useRef(null);
  const surveyChartRef = useRef(null);

  useEffect(() => {
    const counts = {};
    for (const list of Object.values(proceduresData)) {
      for (const item of list) {
        counts[item.title] = (counts[item.title] || 0) + 1;
      }
    }
    if (procedureChartRef.current) procedureChartRef.current.destroy();
    procedureChartRef.current = new Chart(procedureRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: '시술 횟수',
          data: Object.values(counts),
          backgroundColor: '#007bff'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    if (surveys.length > 0) {
      const avg = ['q1', 'q2', 'q3'].map(q => (
        (surveys.reduce((sum, s) => sum + Number(s[q]), 0) / surveys.length).toFixed(2)
      ));
      if (surveyChartRef.current) surveyChartRef.current.destroy();
      surveyChartRef.current = new Chart(surveyRef.current, {
        type: 'bar',
        data: {
          labels: ['설명 만족', '대기 시간', '전반적 만족'],
          datasets: [{
            label: '평균 점수',
            data: avg,
            backgroundColor: '#28a745'
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true, max: 5 } }
        }
      });
    }

    return () => {
      procedureChartRef.current?.destroy();
      surveyChartRef.current?.destroy();
    };
  }, [proceduresData]);

  return (
    <div className="flex flex-wrap gap-6 mt-8">
      <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow p-4">
        <h4 className="font-bold text-gray-700 mb-2">📊 시술 통계</h4>
        <canvas ref={procedureRef}></canvas>
      </div>
      <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow p-4">
        <h4 className="font-bold text-gray-700 mb-2">😊 만족도 평균</h4>
        <canvas ref={surveyRef}></canvas>
      </div>
    </div>
  );
};

export default Charts;
