package mapper;

import dto.LeaveRequestDto;
import entity.LeaveRequest;

public class LeaveRequestMapper {

    // Converts LeaveRequest Entity -> LeaveRequestDto
    public static LeaveRequestDto mapToLeaveRequestDto(LeaveRequest leaveRequest) {
        if (leaveRequest == null) {
            return null;
        }

        return new LeaveRequestDto(
                leaveRequest.getId(),
                leaveRequest.getEmployee() != null ? leaveRequest.getEmployee().getId() : null,
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getReason(),
                leaveRequest.getStatus()
        );
    }

    // Converts LeaveRequestDto -> LeaveRequest Entity
    public static LeaveRequest mapToLeaveRequest(LeaveRequestDto leaveRequestDto) {
        if (leaveRequestDto == null) {
            return null;
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setId(leaveRequestDto.getId());
        leaveRequest.setLeaveType(leaveRequestDto.getLeaveType());
        leaveRequest.setStartDate(leaveRequestDto.getStartDate());
        leaveRequest.setEndDate(leaveRequestDto.getEndDate());
        leaveRequest.setReason(leaveRequestDto.getReason());

        if (leaveRequestDto.getStatus() != null) {
            leaveRequest.setStatus(leaveRequestDto.getStatus());
        }

        return leaveRequest;
    }
}
