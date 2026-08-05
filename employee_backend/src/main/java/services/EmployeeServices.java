package services;

import dto.EmployeeDto;
import entity.Department;
import entity.Employee;
import exception.ResourceNotFound;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mapper.EmployeeMapper;
import org.springframework.stereotype.Service;
import repositary.DepartmentRepo;
import repositary.EmployeeRepo;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServices {

    private final EmployeeRepo employeeRepository;
    private final DepartmentRepo departmentRepository;

    // 1. Create a new Employee using DTO
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        // Check if email already exists
        if (employeeRepository.findByEmail(employeeDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email address is already taken: " + employeeDto.getEmail());
        }

        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);

        // Verify and attach department if departmentId is provided
        if (employeeDto.getDepartmentId() != null) {
            Long deptId = employeeDto.getDepartmentId();
            Department dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new ResourceNotFound("Assigned department not found with id: " + deptId));
            employee.setDepartment(dept);
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    // 2. Get list of all employees as DTOs
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(EmployeeMapper::mapToEmployeeDto)
                .collect(Collectors.toList());
    }

    // 3. Find a specific employee by ID returning DTO
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Employee not found with id: " + id));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    // 4. Find all employees working in a specific department
    public List<EmployeeDto> getEmployeesByDepartment(Long departmentId) {
        List<Employee> employees = employeeRepository.findByDepartmentId(departmentId);
        return employees.stream()
                .map(EmployeeMapper::mapToEmployeeDto)
                .collect(Collectors.toList());
    }

    // 5. Update Employee Details accepting and returning DTO
    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto updatedDto) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Cannot update. Employee not found with id: " + id));

        // Check if email belongs to another employee
        employeeRepository.findByEmail(updatedDto.getEmail())
                .ifPresent(emp -> {
                    if (!emp.getId().equals(id)) {
                        throw new RuntimeException("Email address is already taken by another employee: " + updatedDto.getEmail());
                    }
                });

        existingEmployee.setName(updatedDto.getName());
        existingEmployee.setEmail(updatedDto.getEmail());
        existingEmployee.setPhone(updatedDto.getPhone());

        Employee savedEmployee = employeeRepository.save(existingEmployee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    // 6. Assign Department to Employee returning DTO
    public EmployeeDto assignDepartmentToEmployee(Long employeeId, Long departmentId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFound("Employee not found with id: " + employeeId));

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFound("Department not found with id: " + departmentId));

        employee.setDepartment(department);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    // 7. Delete an employee
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFound("Cannot delete. Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }
}