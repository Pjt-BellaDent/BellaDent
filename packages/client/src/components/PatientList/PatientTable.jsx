// PatientTable.jsx — 나이 대신 생년월일(birth) 컬럼 출력, age 제거
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
  .edit { background-color: #ffc107; }
  .delete { background-color: #dc3545; }
`;

const PatientTable = ({ data, onProcedureClick, onEditClick, onDeleteClick }) => {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>성별</th>
            <th>생년월일</th>
            <th>전화번호</th>
            <th>진료과</th>
            <th>최근 방문</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? data.map(p => (
            <tr key={p.id || p.name}>
              <td data-label="이름" onClick={() => onProcedureClick(p.name)}>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.birth || '-'}</td>
              <td>{p.phone}</td>
              <td>{p.dept}</td>
              <td>{p.lastVisit}</td>
              <td>
                <button className="edit" onClick={() => onEditClick(p.name)}>수정</button>
                <button className="delete" onClick={() => onDeleteClick(p.id)}>삭제</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7">환자 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default PatientTable;
