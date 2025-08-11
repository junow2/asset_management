package com.example.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// The @Data annotation from Lombok creates getters, setters, toString(), etc.
@Data 
// The @AllArgsConstructor annotation creates a constructor with all fields.
@AllArgsConstructor 
@NoArgsConstructor
public class EmployeeStatusDTO {

    private Long employeeId;
    private String employeeName;
    private int totalPaidAmount;
    private int totalPaidMonths;
    private int unpaidAmount;

}