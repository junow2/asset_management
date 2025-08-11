import React, { useState, useEffect } from 'react';
import './css/Manage.css';

export default function Manage() {
  const [name, setName] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState([]);

  const [editingEmployee, setEditingEmployee] = useState(null); // 수정 모드용 상태

  // 직원 목록 조회
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('직원 목록 조회 오류:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 신규 등록 & 수정 공용 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEmployee = { name, joinDate, position };

    try {
      let response;
      if (editingEmployee) {
        // 수정 모드 → PUT 요청
        response = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
        });
      } else {
        // 신규 등록 → POST 요청
        response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
        });
      }

      if (response.ok) {
        alert(editingEmployee ? '수정 완료' : '등록 완료');
        setName('');
        setJoinDate('');
        setPosition('');
        setEditingEmployee(null);
        fetchEmployees(); // ✅ 목록 갱신
      } else {
        alert('처리 실패');
      }
    } catch (error) {
      console.error('저장 오류:', error);
      alert('서버 연결 오류');
    }
  };

  // 수정 모드 전환
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setJoinDate(employee.joinDate);
    setPosition(employee.position);
  };

  // 직원 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('삭제 완료');
        fetchEmployees();
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  return (
    <div className="manage-container">
      <div className="page-title">
        인원관리 페이지
      </div>

      {/* 등록 / 수정 폼 */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="month" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} required />
          <select value={position} onChange={(e) => setPosition(e.target.value)} required>
            <option value="">직급 선택</option>
            <option value="수석">수석</option>
            <option value="책임">책임</option>
            <option value="차장">차장</option>
            <option value="사원">사원</option>
          </select>
          <button type="submit">{editingEmployee ? '수정하기' : '등록하기'}</button>
        </form>
      </div>

      {/* 직원 목록 테이블 */}
      <h3 style={{ marginTop: '30px', textAlign: 'center' }}>직원 목록</h3>
      <table className="employee-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>직급</th>
            <th>입사년월</th>
            <th>납부개월수</th>
            <th>납부금액</th>
            <th>미납금액</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.joinDate}</td>
              <td>{emp.paidMonths ?? 0}</td>
              <td>{emp.paidAmount?.toLocaleString() ?? 0}</td>
              <td>{emp.unpaidAmount?.toLocaleString() ?? 0}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>수정</button>
                <button onClick={() => handleDelete(emp.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
