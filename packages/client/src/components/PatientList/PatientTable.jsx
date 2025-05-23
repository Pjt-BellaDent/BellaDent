import React from 'react';
import styled from '@emotion/styled';

const TableWrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 40px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #eaf0fa;
  }

  td[data-label="이름"] {
    color: #007bff;
    cursor: pointer;
  }

  td button {
    padding: 6px 10px;
    margin: 2px;
    border-radius: 4px;
    color: white;
    border: none;
    cursor: pointer;
  }

  .view { background-color: #28a745; }
  .edit { background-color: #ffc107; }
  .survey { background-color: #17a2b8; }
`;

const PatientTable = ({ data, onProcedureClick, onSurveyClick, onEditClick }) => {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>성별</th>
            <th>나이</th>
            <th>전화번호</th>
            <th>진료과</th>
            <th>최근 방문</th>
            <th>상태</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.name}>
              <td data-label="이름" onClick={() => onProcedureClick(p.name)}>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.phone}</td>
              <td>{p.dept}</td>
              <td>{p.lastVisit}</td>
              <td>{p.status}</td>
              <td>
                <button className="edit" onClick={() => onEditClick(p.name)}>수정</button>
                <button className="survey" onClick={() => onSurveyClick(p.name)}>설문</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default PatientTable;
