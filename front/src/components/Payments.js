import React, { useState, useEffect } from 'react';
import './css/Manage.css';

export default function Payments() {
  const [searchName, setSearchName] = useState('');
  const [payments, setPayments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // 🔹 이름으로 직원 검색
  const handleSearch = async () => {
    if (!searchName.trim()) return;

    try {
      const response = await fetch(`/api/employees/search?name=${encodeURIComponent(searchName)}`);
      const data = await response.json();
      console.log("📦 서버 응답 데이터 타입:", typeof data);
      console.log("📦 서버 응답 데이터 내용:", data);
      setPayments(Array.isArray(data) ? data : []);

      // 검색 결과 상태 갱신
      setEmployees(data);
      setSelectedEmployee(null);
      setPayments([]);
    } catch (error) {
      console.error("직원 검색 오류: ", error);
    }
  };

  // 🔹 직원 선택 시 납부 내역 조회
  const handleEmployeeSelect = async (id) => {
    const emp = employees.find(e => e.id === parseInt(id));
    setSelectedEmployee(emp);
    setPayments([]); // 초기화
  
    try {
      const response = await fetch(`/api/payments/employee/${id}`);
      if (!response.ok) {
        console.warn("⚠️ 서버에서", response.status, "응답을 받음");
        setPayments([]); 
        return;
      }
    
      const data = await response.json();
      console.log("📦 서버 응답:", data);
    
      // ✅ 배열 보장 처리
      const arr = Array.isArray(data) ? data : Object.values(data);
      setPayments(arr);
    
    } catch (error) {
      console.error("납부 내역 조회 오류", error);
      setPayments([]);
    }
  };

  // 🔹 employees 상태가 1명일 때 자동 선택
  useEffect(() => {
    if (employees.length === 1) {
      handleEmployeeSelect(employees[0].id);
    }
  }, [employees]);

  return (
    <div className="manage-container">
      <h2 className="title">개인별 납부 내역 조회</h2>

      {/* 이름 검색 */}
      <div className="form-card">
        <input
          type="text"
          placeholder="직원 이름 검색"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 중복 이름 선택 */}
      {employees.length > 1 && (
        <div className="form-card">
          <p>중복된 이름이 있습니다. 정확한 직원을 선택하세요.</p>
          <select onChange={(e) => handleEmployeeSelect(e.target.value)}>
            <option value="">직원 선택</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.position}, {emp.joinDate})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 직원 납부 내역 테이블 */}
      {selectedEmployee && (
        <>
          <h3>{selectedEmployee.name} 님의 납부 내역</h3>
          {payments.length === 0 ? (
            <p>납부 내역이 없습니다.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>납부 월</th>
                  <th>납부 금액</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(pay => (
                  <tr key={pay.id}>
                    <td>{pay.paymentMonth}</td>
                    <td style={{ textAlign: 'right' }}>
                      {pay.amount.toLocaleString()} 원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
