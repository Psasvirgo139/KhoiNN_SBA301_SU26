package com.example.employeemanagement.repositories;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
public class EmployeeRepository implements IEmployeeRepository {
    private final List<Employee> employees = new ArrayList<>();

    public EmployeeRepository() {
        employees.add(new Employee("E01", "Nguyen Van A", "Developer", 1500.0));
        employees.add(new Employee("E02", "Tran Thi B", "Tester", 1200.0));
        employees.add(new Employee("E03", "Le Van C", "Manager", 2500.0));
        employees.add(new Employee("E04", "Pham Thi D", "Designer", 1300.0));
        employees.add(new Employee("E05", "Hoang Van E", "Developer", 1600.0));
    }

    @Override
    public List<Employee> getAllEmployees() {
        return new ArrayList<>(employees);
    }

    @Override
    public Employee getEmployeeById(String empId) {
        for (Employee emp : employees) {
            if (emp.getEmpId().equals(empId)) {
                return emp;
            }
        }
        return null;
    }

    @Override
    public Employee create(Employee employee) {
        employees.add(employee);
        return employee;
    }

    @Override
    public Employee delete(int id) {
        if (id >= 0 && id < employees.size()) {
            return employees.remove(id);
        }
        return null;
    }

    @Override
    public Iterable<Employee> findAll(Sort sort) {
        return getSortedEmployees(sort);
    }

    @Override
    public Page<Employee> findAll(Pageable pageable) {
        if (pageable == null) {
            return new PageImpl<>(employees);
        }
        List<Employee> sortedList = getSortedEmployees(pageable.getSort());
        int pageSize = pageable.getPageSize();
        long offset = pageable.getOffset();

        if (offset >= sortedList.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, sortedList.size());
        }

        int start = (int) offset;
        int end = Math.min(start + pageSize, sortedList.size());
        List<Employee> pageContent = sortedList.subList(start, end);

        return new PageImpl<>(pageContent, pageable, sortedList.size());
    }

    @Override
    public Employee update(String empId, Employee employee) {
        for (int i = 0; i < employees.size(); i++) {
            if (employees.get(i).getEmpId().equals(empId)) {
                Employee existing = employees.get(i);
                existing.setName(employee.getName());
                existing.setDesignation(employee.getDesignation());
                existing.setSalary(employee.getSalary());
                return existing;
            }
        }
        return null;
    }

    private List<Employee> getSortedEmployees(Sort sort) {
        List<Employee> sortedList = new ArrayList<>(employees);
        if (sort != null && sort.isSorted()) {
            sortedList.sort((e1, e2) -> {
                int comparison = 0;
                for (Sort.Order order : sort) {
                    String property = order.getProperty();
                    boolean asc = order.isAscending();
                    int fieldCompare = 0;
                    if ("empId".equals(property)) {
                        fieldCompare = e1.getEmpId().compareTo(e2.getEmpId());
                    } else if ("name".equals(property)) {
                        fieldCompare = e1.getName().compareTo(e2.getName());
                    } else if ("designation".equals(property)) {
                        fieldCompare = e1.getDesignation().compareTo(e2.getDesignation());
                    } else if ("salary".equals(property)) {
                        fieldCompare = Double.compare(e1.getSalary(), e2.getSalary());
                    }
                    comparison = asc ? fieldCompare : -fieldCompare;
                    if (comparison != 0) {
                        break;
                    }
                }
                return comparison;
            });
        }
        return sortedList;
    }
}
