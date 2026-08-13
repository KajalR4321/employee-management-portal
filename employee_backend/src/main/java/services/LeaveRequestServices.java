package services;

import dto.LeaveRequestDto;
import entity.Employee;
import entity.LeaveRequest;
import enums.LeaveStatus;
import exception.ResourceNotFound;
import lombok.RequiredArgsConstructor;
import mapper.LeaveRequestMapper;
import org.springframework.stereotype.Service;
import repositary.EmployeeRepo;
import repositary.LeaveRequestRepo;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveRequestServices {

    private final LeaveRequestRepo leaveRequestRepository;
    private final EmployeeRepo employeeRepository;

    // 1. Submit a Leave Request
    public LeaveRequestDto applyLeave(LeaveRequestDto dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFound("Employee not found with id: " + dto.getEmployeeId()));

        LeaveRequest leaveRequest = LeaveRequestMapper.mapToLeaveRequest(dto);
        leaveRequest.setEmployee(employee);

        // Default status is PENDING when first applied
        if (leaveRequest.getStatus() == null) {
            leaveRequest.setStatus(LeaveStatus.PENDING);
        }

        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        return LeaveRequestMapper.mapToLeaveRequestDto(savedRequest);
    }

    // 2. Get All Leave Requests
    public List<LeaveRequestDto> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(LeaveRequestMapper::mapToLeaveRequestDto)
                .collect(Collectors.toList());
    }

    // 3. Get Leave Request by ID
    public LeaveRequestDto getLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Leave request not found with id: " + id));
        return LeaveRequestMapper.mapToLeaveRequestDto(leaveRequest);
    }

    // 4. Get Leave Requests for a Specific Employee
    public List<LeaveRequestDto> getLeavesByEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFound("Employee not found with id: " + employeeId);
        }
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(LeaveRequestMapper::mapToLeaveRequestDto)
                .collect(Collectors.toList());
    }

    // 5. Update Leave Status (APPROVE / REJECT)
    public LeaveRequestDto updateLeaveStatus(Long leaveId, LeaveStatus status) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFound("Leave request not found with id: " + leaveId));

        leaveRequest.setStatus(status);
        LeaveRequest updatedRequest = leaveRequestRepository.save(leaveRequest);
        return LeaveRequestMapper.mapToLeaveRequestDto(updatedRequest);
    }
    // =====================================================
    // 6. EDIT / UPDATE LEAVE REQUEST
    // =====================================================

    public LeaveRequestDto updateLeaveRequest(
            Long leaveId,
            LeaveRequestDto dto) {

        // Find existing leave
        LeaveRequest existingLeave =
                leaveRequestRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new ResourceNotFound(
                                        "Leave request not found with id: "
                                                + leaveId
                                )
                        );

        // Only PENDING leave can be edited
        if (existingLeave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave requests can be edited"
            );
        }

        // Validate dates
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new RuntimeException(
                    "End date cannot be before start date"
            );
        }

        // Find employee
        Employee employee =
                employeeRepository.findById(dto.getEmployeeId())
                        .orElseThrow(() ->
                                new ResourceNotFound(
                                        "Employee not found with id: "
                                                + dto.getEmployeeId()
                                )
                        );

        // Update leave information
        existingLeave.setLeaveType(dto.getLeaveType());
        existingLeave.setStartDate(dto.getStartDate());
        existingLeave.setEndDate(dto.getEndDate());
        existingLeave.setReason(dto.getReason());

        // Set employee
        existingLeave.setEmployee(employee);

        // Keep status PENDING
        existingLeave.setStatus(LeaveStatus.PENDING);

        LeaveRequest updatedLeave =
                leaveRequestRepository.save(existingLeave);

        return LeaveRequestMapper
                .mapToLeaveRequestDto(updatedLeave);
    }


    // =====================================================
    // 7. DELETE LEAVE REQUEST
    // =====================================================

    public void deleteLeaveRequest(Long leaveId) {

        // Find leave first
        LeaveRequest existingLeave =
                leaveRequestRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new ResourceNotFound(
                                        "Leave request not found with id: "
                                                + leaveId
                                )
                        );

        // Only PENDING leave can be deleted
        if (existingLeave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending leave requests can be deleted"
            );
        }

        leaveRequestRepository.delete(existingLeave);
    }
}
