package com.example.employeemanagement.services;

import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.repositories.IEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService implements IEmployeeService {

    private final IEmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(IEmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.getAllEmployees();
    }

    @Override
    public Employee getEmployeeById(String empId) {
        return employeeRepository.getEmployeeById(empId);
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.create(employee);
    }

    @Override
    public Employee deleteEmployee(int id) {
        return employeeRepository.delete(id);
    }

    @Override
    public Page<Employee> getEmployeesWithPaging(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return employeeRepository.findAll(pageable);
    }

    @Override
    public Employee updateEmployee(String empId, Employee employee) {
        return employeeRepository.update(empId, employee);
    }
}
