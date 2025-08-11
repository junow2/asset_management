import React, { useState, useEffect } from 'react';
import './css/Manage.css';

// This map translates the English enum name from the backend to Korean for display.
const positionDisplayMap = {
    SUSEOK: "수석",
    CHAEKIM: "책임",
    CHAJANG: "차장",
    SAWON: "사원"
};

export default function Payments() {
    const [searchName, setSearchName] = useState('');
    const [payments, setPayments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    // Search for employees by name
    const handleSearch = async () => {
        if (!searchName.trim()) {
            setEmployees([]);
            setSelectedEmployee(null);
            setPayments([]);
            return;
        }

        try {
            const response = await fetch(`/api/employees/search?name=${encodeURIComponent(searchName)}`);
            const data = await response.json();
            setEmployees(Array.isArray(data) ? data : []);
            
            // Reset selections
            setSelectedEmployee(null);
            setPayments([]);
        } catch (error) {
            console.error("Employee search error: ", error);
        }
    };

    // Fetch payment history when an employee is selected
    const handleEmployeeSelect = async (id) => {
        if (!id) {
            setSelectedEmployee(null);
            setPayments([]);
            return;
        }

        const emp = employees.find(e => e.id === parseInt(id));
        setSelectedEmployee(emp);
        setPayments([]); // Clear previous results
    
        try {
            const response = await fetch(`/api/payments/employee/${id}`);
            if (!response.ok) {
                console.warn("Server responded with status:", response.status);
                setPayments([]); 
                return;
            }
        
            const data = await response.json();
            setPayments(Array.isArray(data) ? data : []);
        
        } catch (error) {
            console.error("Error fetching payment history:", error);
            setPayments([]);
        }
    };

    // Automatically select an employee if the search returns only one result
    useEffect(() => {
        if (employees.length === 1) {
            handleEmployeeSelect(employees[0].id);
        }
    }, [employees]);

    return (
        <div className="manage-container">
            <h2 className="page-title">개인별 납부 내역 조회</h2>

            <div className="form-card">
                <input
                    type="text"
                    placeholder="직원 이름 검색"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            {/* Dropdown for selecting between employees with the same name */}
            {employees.length > 1 && (
                <div className="form-card">
                    <p>중복된 이름이 있습니다. 정확한 직원을 선택하세요.</p>
                    <select onChange={(e) => handleEmployeeSelect(e.target.value)} defaultValue="">
                        <option value="">직원 선택</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({positionDisplayMap[emp.position] || emp.position}, {emp.joinDate})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Payment history table */}
            {selectedEmployee && (
                <div style={{marginTop: '20px'}}>
                    <h3>{selectedEmployee.name} 님의 납부 내역</h3>
                    {payments.length === 0 ? (
                        <p>납부 내역이 없습니다.</p>
                    ) : (
                        <table className="employee-table">
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
                </div>
            )}
        </div>
    );
}
