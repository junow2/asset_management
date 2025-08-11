package com.example.back.service;

import com.example.back.entity.Employee;
import com.example.back.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

  private final EmployeeRepository employeeRepository;  

  public Employee saveEmployee(Employee employee) {
      return employeeRepository.save(employee);
  }
  
  public List<Employee> getAllEmployees() {
    return employeeRepository.findAll();
    }
}
