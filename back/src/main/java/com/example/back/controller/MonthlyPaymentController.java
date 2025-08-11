package com.example.back.controller;

import com.example.back.dto.EmployeeStatusDTO;
import com.example.back.entity.Employee;
import com.example.back.entity.MonthlyPayment;
import com.example.back.repository.EmployeeRepository;
import com.example.back.repository.MonthlyPaymentRepository;
import com.example.back.service.EmployeeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class MonthlyPaymentController {

    private final MonthlyPaymentRepository paymentRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    @GetMapping
    public List<MonthlyPayment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Retrieves the raw payment history for a specific employee.
     * This method has been updated to be more robust.
     * @param employeeId The ID of the employee.
     * @return A list of MonthlyPayment entities for that employee.
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<MonthlyPayment>> getPaymentsByEmployee(@PathVariable Long employeeId) {
        // First, fetch the actual Employee object to ensure it exists.
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // FIX: Use the findByEmployee method from your repository, passing the
        // entire Employee object. This is more reliable than findByEmployee_Id.
        List<MonthlyPayment> payments = paymentRepository.findByEmployee(employeeOpt.get());
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/employee/{employeeId}/status")
    public ResponseEntity<EmployeeStatusDTO> getEmployeePaymentStatus(@PathVariable Long employeeId) {
        EmployeeStatusDTO statusDTO = employeeService.getEmployeePaymentStatus(employeeId);
        return ResponseEntity.ok(statusDTO);
    }

    @PostMapping
    public ResponseEntity<MonthlyPayment> createPayment(@RequestBody MonthlyPayment payment) {
        if (payment.getEmployee() == null || payment.getEmployee().getId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<Employee> employeeOpt = employeeRepository.findById(payment.getEmployee().getId());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        payment.setEmployee(employeeOpt.get());
        MonthlyPayment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.ok(savedPayment);
    }
}
