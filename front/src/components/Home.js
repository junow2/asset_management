import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import './css/Home.css';
import Payments from './Payments';
import UnpaidStatus from './UnpaidStatus';

export default function Home() {

  return (
    <>

      <div className = "main-container">

        <div className = "page-title">
          모임통장 월별 납부확인 시스템
        </div>

        <div className = "card">
          <div className = "section-title"> 납부 기준 </div>

          <p>
            - 수석급 이상: 20,000원 <br></br>
            - 책임/차장급: 15,000원 <br></br>
            - 그 외: 10,000원       <br></br>
            <br></br>
            (참고) 24.10월부터 부비 계산식이 바뀌어, 25년 새로 입사한 사람들 -> 입사 년/월 맞춤. 
            <br></br>그 외, 모두 2023.10으로 통일
          </p>
        </div>

        {/* 미납 현황 */}
        <section classNmae="card-section">
          <h2 className="page-title">전체 미납금액 현황</h2>
          <UnpaidStatus />
        </section>

        {/* 개인별 납부 조회 */}
        <section className="payments-section">
          <Payments />
        </section>


      </div>
    
    </>
  )
}