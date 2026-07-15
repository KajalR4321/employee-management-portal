package services;
import entity.Department;
import repositary.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServices {
    private final DepartmentRepo departmentRepository;

    // 1. Create a new department
    public Department createDepartment(Department department){
        return departmentRepository.save(department);
    }

    // 2. Get all departments (FIXED NAME HERE)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // 3. Find a department by ID
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    // 4. Delete a department
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }
}