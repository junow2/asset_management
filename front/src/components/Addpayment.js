import React, { useState, useEffect } from 'react';
import './css/Manage.css'; // Assuming you want to reuse the same styles

// This map translates the English enum name from the backend to Korean for display.
const positionDisplayMap = {
    SUSEOK: "수석",
    CHAEKIM: "책임",
    CHAJANG: "차장",
    SAWON: "사원"
};

export default function AddPayment() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [paymentMonth, setPaymentMonth] = useState('');
    const [amount, setAmount] = useState('');

    // Fetch the list of employees when the component mounts.
    useEffect(() => {
        fetch('/api/employees')
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error("Error fetching employee list:", err));
    }, []);

    // Handle the form submission to create a new payment.
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEmployee || !paymentMonth || !amount) {
            alert("모든 항목을 입력하세요.");
            return;
        }

        // The backend expects the payment data in this format.
        const newPayment = {
            employee: { id: parseInt(selectedEmployee) },
            paymentMonth: paymentMonth,
            amount: parseInt(amount)
        };

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayment),
            });

            if (response.ok) {
                alert('납부 내역이 등록되었습니다.');
                // Clear the form for the next entry
                setSelectedEmployee('');
                setPaymentMonth('');
                setAmount('');
            } else {
                const errorText = await response.text();
                alert(`등록 실패: ${errorText}`);
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
            alert("서버 연결 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="manage-container">
            <h2 className="page-title">납부 내역 등록</h2>

            <form className="form-card" onSubmit={handleSubmit}>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
                    <option value="">직원 선택</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {/* FIX: Display the translated Korean name */}
                            {emp.name} ({positionDisplayMap[emp.position] || emp.position})
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
