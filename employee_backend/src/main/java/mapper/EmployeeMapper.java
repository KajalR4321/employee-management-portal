package mapper;

import dto.EmployeeDto;
import entity.Employee;

public class EmployeeMapper {

    // 1. Converts Employee Entity -> EmployeeDto
    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        if (employee == null) {
            return null;
        }

        return new EmployeeDto(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getDepartment() != null ? employee.getDepartment().getId() : null
        );
    }

    // 2. Converts EmployeeDto -> Employee Entity
    public static Employee mapToEmployee(EmployeeDto employeeDto) {
        if (employeeDto == null) {
            return null;
        }

        Employee employee = new Employee();
        employee.setId(employeeDto.getId());
        employee.setName(employeeDto.getName());
        employee.setEmail(employeeDto.getEmail());
        employee.setPhone(employeeDto.getPhone());

        return employee;
    }
}