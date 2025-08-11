import React, { useState, useEffect } from 'react';
import './css/Manage.css'; // Assuming you reuse styles

export default function UnpaidStatus() {
    const [unpaidCount, setUnpaidCount] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [reportDate, setReportDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the summary data from the new, efficient endpoint.
    const fetchUnpaidStatus = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/employees/unpaid-summary');
            if (!response.ok) {
                throw new Error('Failed to fetch unpaid summary');
            }
            const data = await response.json();

            // Set state directly from the API response. No client-side calculation needed.
            setUnpaidCount(data.unpaidCount);
            setTotalUnpaid(data.totalUnpaidAmount);
            setReportDate(data.reportDate);

        } catch (error) {
            console.error('🚨 Error fetching unpaid status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnpaidStatus();
    }, []);

    if (isLoading) {
        return <div className="card"><p>현황을 불러오는 중...</p></div>;
    }

    return (
        <div className="card">
            <h3>전체 미납 현황</h3>
            <p><strong>기준 날짜:</strong> {reportDate}</p>
            <p><strong>미납 인원 수:</strong> {unpaidCount} 명</p>
            <p><strong>총 미납 금액:</strong> {totalUnpaid.toLocaleString()} 원</p>
        </div>
    );
}
