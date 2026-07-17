package services;
import entity.Employee;
import entity.Department;
import repositary.EmployeeRepo;
import repositary.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor // Lombok handles injecting both repositories automatically

public class EmployeeServices {
    private final EmployeeRepo employeeRepository;
    private final DepartmentRepo departmentRepository;
   // 1. Create a new Employee with business rules
    public Employee createEmployee(Employee employee) {
        // Rule A: Check if the email is already in use
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new RuntimeException("Email address is already taken: " + employee.getEmail());
        }

        // Rule B: Verify that the assigned department actually exists in the database
        if (employee.getDepartment() != null && employee.getDepartment().getId() != null) {
            Long deptId = employee.getDepartment().getId();
            Department dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Assigned department not found with id: " + deptId));
            employee.setDepartment(dept); // Attach the validated department
        }

        return employeeRepository.save(employee);
    }

    // 2. Get a list of all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // 3. Find a specific employee by ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    // 4. Find all employees working in a specific department
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }
    // ⬇️ PASTE THIS NEW METHOD HERE ⬇️
    public Employee assignDepartmentToEmployee(Long employeeId, Long departmentId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));

        employee.setDepartment(department);
        return employeeRepository.save(employee);
    }

    // 5. Delete an employee
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }
}
