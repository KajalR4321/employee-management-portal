package repositary;


import entity.Department; // Double-check if your entity package is just 'entity' or 'com.example.hrms.entity'
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepo extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentName(String departmentName);
}

