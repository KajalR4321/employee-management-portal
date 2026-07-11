package entity;

import enums.LeaveStatus;
import enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name="leave_requests")
@Getter                 // Lombok automatically generates all getters
@Setter                 // Lombok automatically generates all setters
@NoArgsConstructor      // Lombok automatically generates the empty constructor
@AllArgsConstructor     // Lombok automatically generates the constructor with all fiel
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;    // Creates column: leaveType (CASUAL / SICK / EARNED)

    private LocalDate startDate;    // Creates column: startDate (LocalDate)
    private LocalDate endDate;      // Creates column: endDate (LocalDate)
    private String reason;          // Creates column: reason (String)

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;     // Creates column: s
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
