import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Chart from 'chart.js/auto';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
`;

const ChartBox = styled.div`
  flex: 1 1 48%;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-width: 300px;

  canvas {
    width: 100% !important;
    height: 250px !important;
  }
`;

const Charts = ({ proceduresData }) => {
  const procedureRef = useRef(null);
  const surveyRef = useRef(null);

  useEffect(() => {
    const counts = {};
    for (const list of Object.values(proceduresData)) {
      for (const item of list) {
        counts[item.title] = (counts[item.title] || 0) + 1;
      }
    }

    new Chart(procedureRef.current, {
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
      const avg = ['q1', 'q2', 'q3'].map(q =>
        (surveys.reduce((sum, s) => sum + Number(s[q]), 0) / surveys.length).toFixed(2)
      );

      new Chart(surveyRef.current, {
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
  }, [proceduresData]);

  return (
    <Container>
      <ChartBox>
        <h4>📊 시술 통계</h4>
        <canvas ref={procedureRef}></canvas>
      </ChartBox>
      <ChartBox>
        <h4>😊 만족도 평균</h4>
        <canvas ref={surveyRef}></canvas>
      </ChartBox>
    </Container>
  );
};

export default Charts;
