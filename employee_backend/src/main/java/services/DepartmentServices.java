package services;
import entity.Department;
import dto.DepartmentDto;
import exception.ResourceNotFound;
import mapper.DepartmentMapper;
import repositary.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServices {
    private final DepartmentRepo departmentRepository;

    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = DepartmentMapper.mapToDepartment(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }
    // 2. Get Department by ID
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Department not found with id: " + id));
        return DepartmentMapper.mapToDepartmentDto(department);
    }

    // 3. Get All Departments
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(DepartmentMapper::mapToDepartmentDto)
                .collect(Collectors.toList());
    }
    // 4. Update Department
    public DepartmentDto updateDepartment(Long id, DepartmentDto updatedDto) {
        Department existingDept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Cannot update. Department not found with id: " + id));

        existingDept.setDepartmentName(updatedDto.getDepartmentName());
        existingDept.setDepartmentDescription(updatedDto.getDepartmentDescription());

        Department savedDept = departmentRepository.save(existingDept);
        return DepartmentMapper.mapToDepartmentDto(savedDept);
    }

    // 4. Delete a department
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }
}