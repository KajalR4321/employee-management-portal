package repositary;

import entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepo  extends JpaRepository<Employee, Long> {

    // Finds an employee by email
    Optional<Employee> findByEmail(String email);

    // Finds all employees working in a specific department
    List<Employee> findByDepartmentId(Long departmentId);
}


