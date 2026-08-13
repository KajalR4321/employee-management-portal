package controller;

import dto.LeaveRequestDto;
import enums.LeaveStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.LeaveRequestServices;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestServices leaveRequestService;

    // POST http://localhost:8000/api/leaves
    @PostMapping
    public ResponseEntity<LeaveRequestDto> applyLeave(@Valid @RequestBody LeaveRequestDto leaveRequestDto) {
        LeaveRequestDto createdLeave = leaveRequestService.applyLeave(leaveRequestDto);
        return new ResponseEntity<>(createdLeave, HttpStatus.CREATED);
    }

    // GET http://localhost:8000/api/leaves
    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    // GET http://localhost:8000/api/leaves/1
    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestDto> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    // GET http://localhost:8000/api/leaves/employee/1
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequestDto>> getLeavesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveRequestService.getLeavesByEmployee(employeeId));
    }

    // PUT http://localhost:8000/api/leaves/1/status?status=APPROVED
    @PutMapping("/{leaveId}/status")
    public ResponseEntity<LeaveRequestDto> updateLeaveStatus(
            @PathVariable Long leaveId,
            @RequestParam LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveStatus(leaveId, status));
    }
    // =====================================================
    // 5. EDIT / UPDATE LEAVE REQUEST
    // PUT http://localhost:8000/api/leaves/1
    // =====================================================

    @PutMapping("/{leaveId}")
    public ResponseEntity<LeaveRequestDto>
    updateLeaveRequest(
            @PathVariable Long leaveId,
            @Valid @RequestBody LeaveRequestDto leaveRequestDto) {

        LeaveRequestDto updatedLeave =
                leaveRequestService.updateLeaveRequest(
                        leaveId,
                        leaveRequestDto
                );

        return ResponseEntity.ok(updatedLeave);
    }





    // =====================================================
    // 7. DELETE LEAVE REQUEST
    // DELETE http://localhost:8000/api/leaves/1
    // =====================================================

    @DeleteMapping("/{leaveId}")
    public ResponseEntity<String>
    deleteLeaveRequest(
            @PathVariable Long leaveId) {

        leaveRequestService.deleteLeaveRequest(leaveId);

        return ResponseEntity.ok(
                "Leave request deleted successfully with id: "
                        + leaveId
        );
    }
}