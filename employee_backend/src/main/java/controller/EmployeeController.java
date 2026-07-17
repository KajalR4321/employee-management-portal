package controller;

import entity.Employee;
import services.EmployeeServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    // 1. ADD THIS VARIABLE LINKING TO YOUR SERVICE LAYER
    private final EmployeeServices employeeServices;

    // 2. Register a new Employee
    // POST http://localhost:8080/api/employees
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee){
        // Fixed: changed EmployeeServices to employeeServices
        Employee savedEmployee = employeeServices.createEmployee(employee);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    // 3. Get all Employees
    // GET http://localhost:8080/api/employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        // Fixed: changed EmployeeServices to employeeServices
        return ResponseEntity.ok(employeeServices.getAllEmployees());
    }

    // 4. Get Employee by ID
    // GET http://localhost:8080/api/employees/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        // Fixed: changed EmployeeServices to employeeServices
        return ResponseEntity.ok(employeeServices.getEmployeeById(id));
    }

    // 5. Assign an Employee to a Department
    // PUT http://localhost:8080/api/employees/{employeeId}/department/{departmentId}
    @PutMapping("/{employeeId}/department/{departmentId}")
    public ResponseEntity<Employee> assignDepartmentToEmployee(
            @PathVariable Long employeeId,
            @PathVariable Long departmentId) {
        // Fixed: changed EmployeeServices to employeeServices
        Employee updatedEmployee = employeeServices.assignDepartmentToEmployee(employeeId, departmentId);
        return ResponseEntity.ok(updatedEmployee);
    }

    // 6. Delete an Employee
    // DELETE http://localhost:8080/api/employees/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        // Fixed: changed EmployeeServices to employeeServices
        employeeServices.deleteEmployee(id);
        return ResponseEntity.ok("Employee deleted successfully with id: " + id);
    }
}