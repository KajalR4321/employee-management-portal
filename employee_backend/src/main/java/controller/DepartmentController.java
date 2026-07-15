package controller;
import entity.Department;
import services.DepartmentServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor // Injecting DepartmentService via Lombok

public class DepartmentController {
    private final DepartmentServices departmentServices;
    // 1. Create a new Department
    // POST http://localhost:8080/api/departments
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        Department created = departmentServices.createDepartment(department);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    //2. Get all Departments
    // GET http://localhost:8080/api/departments
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentServices.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    // 3. Get a single Department by ID
    // GET http://localhost:8080/api/departments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        Department department = departmentServices.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    // 4. Delete a Department
    // DELETE http://localhost:8080/api/departments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
        departmentServices.deleteDepartment(id);
        return ResponseEntity.ok("Department deleted successfully with id: " + id);
    }
}
