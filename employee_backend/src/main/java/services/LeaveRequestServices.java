package services;


import entity.LeaveRequest;
import entity.Employee;
import enums.LeaveStatus;
import repositary.LeaveRequestRepo;
import repositary.EmployeeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

public class LeaveRequestServices {
    private final LeaveRequestRepo leaveRequestRepository;
    private final EmployeeRepo employeeRepository;
    // 1. Submit a new leave request
    public LeaveRequest applyForLeave(LeaveRequest request){
        // Verify the employee applying actually exists
        Long employeeId = request.getEmployee().getId();
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
       // if request identify is pending or not
        request.setEmployee(employee);
        request.setStatus(LeaveStatus.PENDING); // New requests always start as PENDING

        return leaveRequestRepository.save(request);
    }
    // 2. Update status (Approve or Reject a leave)
    public LeaveRequest updateLeaveStatus(Long leaveId, LeaveStatus newStatus) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + leaveId));

        request.setStatus(newStatus);
        return leaveRequestRepository.save(request);
    }
    // 3. Get all leave requests for a single employee
    public List<LeaveRequest> getLeaveHistoryByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    // 4. Get all leave requests by status (e.g., show HR all PENDING items)
    public List<LeaveRequest> getLeavesByStatus(LeaveStatus status) {
        return leaveRequestRepository.findByStatus(status);
    }

    // 5. Get all leave requests in the system
    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }
}
