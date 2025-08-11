import React, { useState, useEffect } from 'react';
import './css/Manage.css';

export default function AddPayment() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [amount, setAmount] = useState('');

  // 직원 목록 불러오기
  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("직원 목록 조회 오류:", err));
  }, []);

  // 납부 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !paymentMonth || !amount) {
      alert("모든 항목을 입력하세요.");
      return;
    }

    const newPayment = {
      employee: { id: parseInt(selectedEmployee) },
      paymentMonth: paymentMonth,
      amount: parseInt(amount)
    };
      console.log("보낼 데이터:", newPayment);


    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });

      console.log("💾 서버 응답 코드:", response.status);

      if (response.ok) {
        alert('납부 내역이 등록되었습니다.');
        setPaymentMonth('');
        setAmount('');
      } else {
        alert('등록 실패: ' + response.status);
      }
    } catch (error) {
      console.error("납부 등록 오류:", error);
    }
  };

  return (
    <div className="manage-container">
      <h2 className="title">납부 내역 등록</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
          <option value="">직원 선택</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.position})
            </option>
          ))}
        </select>

        <input
          type="month"
          value={paymentMonth}
          onChange={(e) => setPaymentMonth(e.target.value)}
          required
        />

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
  );
}
