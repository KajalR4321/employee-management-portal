package repositary;


import entity.LeaveRequest;
import enums.LeaveStatus; // Double-check if your enums package is just 'enums'
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepo extends JpaRepository<LeaveRequest, Long> {

    // Finds all leave requests belonging to a specific employee
    List<LeaveRequest> findByEmployeeId(Long employeeId);

    // Finds all leave requests matching a specific status
    List<LeaveRequest> findByStatus(LeaveStatus status);
}


