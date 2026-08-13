package mapper;

import dto.EmployeeDto;
import entity.Employee;

public class EmployeeMapper {

    // Employee Entity -> EmployeeDto
    public static EmployeeDto mapToEmployeeDto(Employee employee) {

        if (employee == null) {
            return null;
        }

        EmployeeDto dto = new EmployeeDto();

        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setDesignation(employee.getDesignation());
        dto.setJoiningDate(employee.getJoiningDate());

        // Department details
        if (employee.getDepartment() != null) {
            dto.setDepartmentId(employee.getDepartment().getId());
            dto.setDepartmentName(
                    employee.getDepartment().getDepartmentName()
            );
        } else {
            dto.setDepartmentId(null);
            dto.setDepartmentName(null);
        }

        return dto;
    }

    // EmployeeDto -> Employee Entity
    public static Employee mapToEmployee(EmployeeDto employeeDto) {

        if (employeeDto == null) {
            return null;
        }

        Employee employee = new Employee();

        employee.setId(employeeDto.getId());
        employee.setName(employeeDto.getName());
        employee.setEmail(employeeDto.getEmail());
        employee.setPhone(employeeDto.getPhone());
        employee.setDesignation(employeeDto.getDesignation());
        employee.setJoiningDate(employeeDto.getJoiningDate());

        /*
         * Department is NOT set here.
         *
         * EmployeeServices finds the existing Department
         * and sets it using:
         *
         * employee.setDepartment(department);
         */

        return employee;
    }
}