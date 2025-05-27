const BASE = "http://localhost:3000";

export const fetchAllPatients = async () => {
  const res = await fetch(`${BASE}/patients`);
  if (!res.ok) throw new Error("환자 목록 불러오기 실패");
  return await res.json();
};

export const fetchProceduresByName = async (name) => {
  const res = await fetch(`${BASE}/procedures?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("시술 이력 불러오기 실패");
  return await res.json();
};

export const addProcedure = async (data) => {
  const res = await fetch(`${BASE}/procedures`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("시술 등록 실패");
  return await res.json();
};

export const updatePatient = async (id, data) => {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("환자 정보 수정 실패");
  return await res.json();
};
