import React, { useState, useEffect } from 'react';
import './css/Manage.css';

export default function UnpaidStatus() {
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  // 전체 미납 현황 불러오기
  const fetchUnpaidStatus = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('직원 조회 실패');

      const data = await response.json();

      // 미납 현황 계산
      const unpaidEmployees = data.filter(emp => (emp.unpaidAmount ?? 0) > 0);
      const totalUnpaidAmount = unpaidEmployees.reduce(
        (sum, emp) => sum + (emp.unpaidAmount ?? 0),
        0
      );

      setUnpaidCount(unpaidEmployees.length);
      setTotalUnpaid(totalUnpaidAmount);
    } catch (error) {
      console.error('🚨 미납 현황 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchUnpaidStatus();
  }, []);

  return (
    <div className="card">
      <p>기준 날짜: </p><br></br>
      <p>미납 인원 수: <strong>{unpaidCount} 명</strong></p>
      <p>총 미납 금액: <strong>{totalUnpaid.toLocaleString()} 원</strong></p>
    </div>
  );
}
