package com.example.back.controller;

import com.example.back.entity.Employee;
import com.example.back.entity.MonthlyPayment;
import com.example.back.repository.EmployeeRepository;
import com.example.back.repository.MonthlyPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class MonthlyPaymentController {

    private final MonthlyPaymentRepository paymentRepository;
    private final EmployeeRepository employeeRepository;

    // 1️⃣ 전체 납부 내역 조회
    @GetMapping
    public List<MonthlyPayment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // 2️⃣ 특정 직원 납부 내역 조회
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<MonthlyPayment>> getPaymentsByEmployee(@PathVariable Long employeeId) {
        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<MonthlyPayment> payments = paymentRepository.findByEmployee_Id(employeeId);
        return ResponseEntity.ok(payments);
    }

    // 3️⃣ 납부 내역 추가
    @PostMapping
    public ResponseEntity<MonthlyPayment> createPayment(@RequestBody MonthlyPayment payment) {
        if (payment.getEmployee() == null || payment.getEmployee().getId() == null) {
            return ResponseEntity.badRequest().build(); // 직원 정보 필요
        }

        Optional<Employee> employeeOpt = employeeRepository.findById(payment.getEmployee().getId());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = employeeOpt.get();
        payment.setEmployee(employee);

        // 납부 내역 저장
        MonthlyPayment savedPayment = paymentRepository.save(payment);

        // 💰 납부 후 직원의 총 납부 금액/미납금액 계산
        updateEmployeePaymentStatus(employee);

        return ResponseEntity.ok(savedPayment);
    }

    // 🔹 직원의 납부 상태 갱신 (총 납부액, 납부 개월수, 미납금액)
    private void updateEmployeePaymentStatus(Employee employee) {
        List<MonthlyPayment> payments = paymentRepository.findByEmployee_Id(employee.getId());

        int totalAmount = payments.stream().mapToInt(MonthlyPayment::getAmount).sum();
        int paidMonths = payments.size();

        // 입사월부터 현재월까지 몇 개월 지났는지 계산
        YearMonth now = YearMonth.now();
        long expectedMonths = ChronoUnit.MONTHS.between(employee.getJoinDate(), now) + 1;
        if (expectedMonths < 0) expectedMonths = 0;

        // 직급별 월 납부 금액
        int positionFee = switch (employee.getPosition()) {
            case "사원" -> 10000;
            case "차장" -> 20000;
            case "책임" -> 30000;
            case "수석" -> 40000;
            default -> 10000;
        };

        // 💰 미납금액 계산
        int unpaidAmount = (int) (expectedMonths * positionFee - totalAmount);
        if (unpaidAmount < 0) unpaidAmount = 0; // 음수 방지

        // 🔹 직원 정보 업데이트
        employee.setPaidAmount(totalAmount);
        employee.setPaidMonths(paidMonths);
        employee.setUnpaidAmount(unpaidAmount);

        employeeRepository.save(employee);
    }
}
