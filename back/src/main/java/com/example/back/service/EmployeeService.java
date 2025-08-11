package com.example.back.service;

import com.example.back.dto.EmployeeStatusDTO;
import com.example.back.dto.UnpaidSummaryDTO;
import com.example.back.entity.Employee;
import com.example.back.entity.MonthlyPayment;
import com.example.back.repository.EmployeeRepository;
import com.example.back.repository.MonthlyPaymentRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor // Lombok annotation to create a constructor for final fields
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final MonthlyPaymentRepository monthlyPaymentRepository; // Added repository for payments

    /**
     * Saves a new employee or updates an existing one.
     * @param employee The employee entity to save.
     * @return The saved employee entity.
     */
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    /**
     * Retrieves all employees from the database.
     * @return A list of all employee entities.
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Calculates the payment status for a single employee on-demand.
     * This method reads data from repositories but does not save any changes,
     * so it's a good candidate for a read-only transaction.
     * @param employeeId The ID of the employee to check.
     * @return A DTO containing the calculated payment status.
     */
    @Transactional(readOnly = true) // Good practice for methods that only read data
    public EmployeeStatusDTO getEmployeePaymentStatus(Long employeeId) {
        // 1. Fetch the employee entity or throw an error if not found.
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

        // 2. Fetch all payment records for this specific employee.
        List<MonthlyPayment> payments = monthlyPaymentRepository.findByEmployee_Id(employeeId);

        // 3. Calculate summary data from the list of payments.
        int totalPaidAmount = payments.stream()
                                      .mapToInt(MonthlyPayment::getAmount)
                                      .sum();
        int totalPaidMonths = payments.size();

        // 4. Get the expected monthly fee from the employee's position enum.
        int positionFee = employee.getPosition().getFee();

        // 5. Calculate the total number of months the employee should have paid for.
        // Using a specific ZoneId makes the calculation consistent regardless of server location.
        long totalMonthsSinceJoin = ChronoUnit.MONTHS.between(employee.getJoinDate(), YearMonth.now(ZoneId.of("Asia/Seoul"))) + 1;

        // 6. Calculate the total amount that was expected to be paid.
        int totalExpectedAmount = positionFee * (int)totalMonthsSinceJoin;

        // 7. Calculate the final unpaid amount, ensuring it cannot be negative.
        int unpaidAmount = Math.max(0, totalExpectedAmount - totalPaidAmount);

        // 8. Create and return the DTO with the calculated, up-to-date information.
        return new EmployeeStatusDTO(
            employee.getId(),
            employee.getName(),
            totalPaidAmount,
            totalPaidMonths,
            unpaidAmount
        );
    }

    @Transactional(readOnly = true)
    public UnpaidSummaryDTO getUnpaidSummary() {
        List<Employee> employees = employeeRepository.findAll();
        
        long totalUnpaidAmount = 0;
        int unpaidCount = 0;

        // Loop through all employees and calculate their status
        for (Employee employee : employees) {
            // We can reuse our existing logic to get the status for each employee
            EmployeeStatusDTO status = getEmployeePaymentStatus(employee.getId());
            if (status.getUnpaidAmount() > 0) {
                unpaidCount++;
                totalUnpaidAmount += status.getUnpaidAmount();
            }
        }

        String reportDate = LocalDate.now(ZoneId.of("Asia/Seoul")).toString();

        return new UnpaidSummaryDTO(unpaidCount, totalUnpaidAmount, reportDate);
    }

    public List<Employee> searchEmployessByName(String name) {
        return employeeRepository.findByName(name);
    }
}
