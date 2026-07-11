package entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="departments")
@Getter                 // Lombok automatically generates all getters
@Setter                 // Lombok automatically generates all setters
@NoArgsConstructor      // Lombok automatically generates the empty constructor
@AllArgsConstructor     // Lombok automatically generates the constructor with all fields
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String departmentName;


}
