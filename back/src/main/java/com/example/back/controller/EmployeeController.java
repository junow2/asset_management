package com.example.back.controller;

import com.example.back.entity.Employee;
import com.example.back.repository.EmployeeRepository;
import com.example.back.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    /** ✅ 전체 직원 조회 */
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /** ✅ 직원 등록 */
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.saveEmployee(employee);
    }

    /** ✅ 직원 이름으로 검색 (부분 일치) */
    @GetMapping("/search")
    public List<Employee> searchEmployeesByName(@RequestParam String name) {
        // 이름에 name이 포함된 직원 리스트 반환
        return employeeRepository.findByName(name);
    }

    /** ✅ 직원 단일 조회 (선택적) */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** ✅ 직원 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return employeeRepository.findById(id)
                .map(existing -> {
                    existing.setName(employee.getName());
                    existing.setJoinDate(employee.getJoinDate());
                    existing.setPosition(employee.getPosition());
                    Employee updated = employeeRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** ✅ 직원 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
