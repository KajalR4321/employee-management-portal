package controller;
import entity.LeaveRequest;
import enums.LeaveStatus;
import services.LeaveRequestServices; // Matches your plural naming style
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {
    private final LeaveRequestServices leaveRequestServices;

    // 1. Submit a new leave request (Fixed: calls applyForLeave)
    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        LeaveRequest created = leaveRequestServices.applyForLeave(leaveRequest);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 2. Get all leave requests (Fixed: calls getAllLeaves)
    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestServices.getAllLeaves());
    }

    // 3. Approve or Reject a leave request (Fixed: safely converts String to Enum)
    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        LeaveStatus enumStatus = LeaveStatus.valueOf(status.toUpperCase());
        LeaveRequest updated = leaveRequestServices.updateLeaveStatus(id, enumStatus);
        return ResponseEntity.ok(updated);
    }
}
