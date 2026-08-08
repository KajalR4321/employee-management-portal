package controller;

import dto.DepartmentDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.DepartmentServices;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*") // Allows React on port 5173/3000 to talk to Java
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentServices departmentService;

    // 1. Create Department
    // POST http://localhost:8000/api/departments
    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto departmentDto) {
        DepartmentDto savedDept = departmentService.createDepartment(departmentDto);
        return new ResponseEntity<>(savedDept, HttpStatus.CREATED);
    }

    // 2. Get Department by ID
    // GET http://localhost:8000/api/departments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    // 3. Get All Departments
    // GET http://localhost:8000/api/departments
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // 4. Update Department
    // PUT http://localhost:8000/api/departments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentDto departmentDto) {
        DepartmentDto updatedDept = departmentService.updateDepartment(id, departmentDto);
        return ResponseEntity.ok(updatedDept);
    }

    // 5. Delete Department
    // DELETE http://localhost:8000/api/departments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok("Department deleted successfully with id: " + id);
    }
}