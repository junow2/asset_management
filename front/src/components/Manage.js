import React, { useState, useEffect } from 'react';
import './css/Manage.css';

// Central mapping for positions. This is the single source of truth for the UI.
const positionDisplayMap = {
    SUSEOK: "수석",
    CHAEKIM: "책임",
    CHAJANG: "차장",
    SAWON: "사원"
};

// Map for submitting data to the backend
const positionSubmitMap = {
    "수석": "SUSEOK",
    "책임": "CHAEKIM",
    "차장": "CHAJANG",
    "사원": "SAWON"
};


export default function Manage() {
    // State for the form inputs
    const [name, setName] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [position, setPosition] = useState('');

    // State for the list of employees combined with their payment status
    const [employeesWithStatus, setEmployeesWithStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    
    // State to manage the currently editing employee
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Fetches base employee data and then fetches the payment status for each one.
    const fetchEmployeesAndStatus = async () => {
        setIsLoading(true); // Start loading
        try {
            // 1. Fetch the basic list of all employees
            const employeesResponse = await fetch('/api/employees');
            if (!employeesResponse.ok) throw new Error("Failed to fetch employees");
            const employeesData = await employeesResponse.json();

            // 2. For each employee, fetch their calculated payment status
            const employeesWithStatusPromises = employeesData.map(async (employee) => {
                const statusResponse = await fetch(`/api/payments/employee/${employee.id}/status`);
                if (!statusResponse.ok) {
                    console.error(`Could not fetch status for employee ${employee.id}`);
                    return {
                        ...employee,
                        paidMonths: 0,
                        paidAmount: 0,
                        unpaidAmount: 0 
                    };
                }
                const statusData = await statusResponse.json();
                
                // 3. Combine the base employee data with their status data
                return {
                    ...employee, // id, name, joinDate, position (e.g., "SAWON")
                    paidMonths: statusData.totalPaidMonths,
                    paidAmount: statusData.totalPaidAmount,
                    unpaidAmount: statusData.unpaidAmount,
                };
            });

            // 4. Wait for all the status fetches to complete and update the state
            const resolvedData = await Promise.all(employeesWithStatusPromises);
            setEmployeesWithStatus(resolvedData);

        } catch (error) {
            console.error('Error fetching employee list or status:', error);
            setEmployeesWithStatus([]); // Clear list on error
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchEmployeesAndStatus();
    }, []);

    // Handles both creating a new employee and updating an existing one
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert Korean position name from form to the English ENUM name for the backend
        const employeeData = { 
            name, 
            joinDate, 
            position: positionSubmitMap[position] 
        };

        if (!employeeData.position) {
            alert("Invalid position selected.");
            return;
        }

        const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees';
        const method = editingEmployee ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });

            if (response.ok) {
                alert(editingEmployee ? '수정 완료' : '등록 완료');
                // Reset form and exit editing mode
                setName('');
                setJoinDate('');
                setPosition('');
                setEditingEmployee(null);
                fetchEmployeesAndStatus(); // Refresh the list with updated data
            } else {
                const errorData = await response.text();
                alert(`처리 실패: ${errorData}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('서버 연결 오류');
        }
    };

    // Sets the form to edit an existing employee
    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setName(employee.name);
        setJoinDate(employee.joinDate);
        // Use the map to set the Korean name in the dropdown from the English enum name
        setPosition(positionDisplayMap[employee.position] || '');
    };

    // Deletes an employee
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('삭제 완료');
                fetchEmployeesAndStatus(); // Refresh the list
            } else {
                alert('삭제 실패');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="manage-container">
            <div className="page-title">인원관리 페이지</div>

            <div className="form-card">
                <form className="styled-form" onSubmit={handleSubmit}>
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
                    {isLoading ? (
                        <tr><td colSpan="7">로딩 중...</td></tr>
                    ) : (
                        employeesWithStatus.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                {/* Display Korean name from the map */}
                                <td>{positionDisplayMap[emp.position] || emp.position}</td>
                                <td>{emp.joinDate}</td>
                                <td>{emp.paidMonths}</td>
                                <td>{emp.paidAmount.toLocaleString()}</td>
                                <td>{emp.unpaidAmount.toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(emp)}>수정</button>
                                    <button onClick={() => handleDelete(emp.id)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
