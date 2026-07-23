package com.example.employeemanagement.services;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.Page;
import java.util.List;

public interface IEmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(String empId);
    Employee createEmployee(Employee employee);
    Employee deleteEmployee(int id);
    Page<Employee> getEmployeesWithPaging(int page, int size, String sortBy);
    Employee updateEmployee(String empId, Employee employee);
}
