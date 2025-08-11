import React, { useState, useEffect } from 'react';
import './css/Manage.css';

export default function PaymentRegister() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [amount, setAmount] = useState('');

  // ✅ 전체 직원 목록 조회
  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('직원 목록 조회 오류:', err));
  }, []);

  // ✅ 납부 내역 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId || !paymentMonth || !amount) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const newPayment = {
      employee: { id: parseInt(selectedEmployeeId) },
      paymentMonth,  // 예: "2025-08"
      amount: parseInt(amount)
    };

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment)
      });

      if (response.ok) {
        alert('납부 내역이 등록되었습니다!');
        // 입력 초기화
        setSelectedEmployeeId('');
        setPaymentMonth('');
        setAmount('');
      } else {
        alert('등록 실패');
      }
    } catch (error) {
      console.error('납부 내역 등록 오류:', error);
      alert('서버 연결 오류');
    }
  };

  return (
    <div className="manage-container">
      <h2 className="title">월별 납부 내역 등록</h2>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* 직원 선택 */}
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            required
          >
            <option value="">직원 선택</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.position} {emp.joinDate})
              </option>
            ))}
          </select>

          {/* 납부 월 */}
          <input
            type="month"
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(e.target.value)}
            required
          />

          {/* 납부 금액 */}
          <input
            type="number"
            placeholder="납부 금액"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit">등록하기</button>
        </form>
      </div>
    </div>
  );
}
