package entity;
import enums.EmployeeStatus;
import enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.support.BeanDefinitionDsl;

import java.time.LocalDate;

@Entity
@Table(name="employees")
@Getter                 // Lombok automatically generates all getters
@Setter                 // Lombok automatically generates all setters
@NoArgsConstructor      // Lombok automatically generates the empty constructor
@AllArgsConstructor     // Lombok automatically generates the constructor with all fields

public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Add this primary key back!
    private String name;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private String designation;
    private LocalDate joiningDate;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;


}
