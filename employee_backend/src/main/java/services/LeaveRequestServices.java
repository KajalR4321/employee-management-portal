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
}
