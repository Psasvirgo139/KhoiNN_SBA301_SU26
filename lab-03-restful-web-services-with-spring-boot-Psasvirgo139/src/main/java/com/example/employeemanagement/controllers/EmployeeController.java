package com.example.employeemanagement.controllers;

import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.services.IEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.employeemanagement.exceptions.EmployeeNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final IEmployeeService employeeService;

    @Autowired
    public EmployeeController(IEmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<Page<Employee>> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "empId") String sortBy
    ) {
        Page<Employee> employeePage = employeeService.getEmployeesWithPaging(page, size, sortBy);
        return ResponseEntity.ok(employeePage);
    }

    @GetMapping("/{empId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String empId) {
        Employee employee = employeeService.getEmployeeById(empId);
        if (employee == null) {
            throw new EmployeeNotFoundException("Employee not found with ID: " + empId);
        }
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        Employee created = employeeService.createEmployee(employee);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Employee> deleteEmployee(@PathVariable int id) {
        Employee deleted = employeeService.deleteEmployee(id);
        if (deleted == null) {
            throw new EmployeeNotFoundException("Employee not found at index: " + id);
        }
        return ResponseEntity.ok(deleted);
    }

    @PutMapping("/{empId}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String empId, @Valid @RequestBody Employee employee) {
        Employee updated = employeeService.updateEmployee(empId, employee);
        if (updated == null) {
            throw new EmployeeNotFoundException("Employee not found with ID: " + empId);
        }
        return ResponseEntity.ok(updated);
    }
}
