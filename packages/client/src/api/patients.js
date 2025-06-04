const BASE = "http://localhost:3000";

// 전체 환자 조회
export const fetchAllPatients = async () => {
  const res = await fetch(`${BASE}/patients`);
  if (!res.ok) throw new Error("환자 목록 불러오기 실패");
  return await res.json();
};

// ✅ 시술 이력 조회: 이름+생년월일 모두 필요
export const fetchProceduresByName = async (name, birth) => {
  if (!name || !birth) throw new Error("이름과 생년월일이 필요합니다.");
  const res = await fetch(
    `${BASE}/procedures?name=${encodeURIComponent(name)}&birth=${encodeURIComponent(birth)}`
  );
  if (!res.ok) throw new Error("시술 이력 불러오기 실패");
  return await res.json();
};

// 시술 추가 (body에 반드시 name, birth 등 포함)
export const addProcedure = async (data) => {
  const res = await fetch(`${BASE}/procedures`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("시술 등록 실패");
  return await res.json();
};

// 환자 정보 수정
export const updatePatient = async (id, data) => {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("환자 정보 수정 실패");
  return await res.json();
};

// 환자 삭제
export const deletePatient = async (id) => {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("환자 삭제 실패");
  return true;
};
