package com.example.back.repository;

import com.example.back.entity.Employee;
import com.example.back.entity.MonthlyPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonthlyPaymentRepository extends JpaRepository<MonthlyPayment, Long> {

    // 직원 이름으로 납부내역 조회
    List<MonthlyPayment> findByEmployee_Name(String name);

    // 직원 ID로 납부내역 조회
    List<MonthlyPayment> findByEmployee_Id(Long employeeId);    

    List<MonthlyPayment> findByEmployee(Employee employee);
}
