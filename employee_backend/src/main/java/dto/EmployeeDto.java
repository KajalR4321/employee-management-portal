package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {

    private Long id;

    @NotBlank(message = "Employee name must not be blank")
    @Size(min = 2, message = "Employee name must have at least 2 characters")
    private String name;

    @NotBlank(message = "Employee email must not be blank")
    @Email(message = "Email should be valid (e.g. user@example.com)")
    private String email;

    @NotBlank(message = "Phone number must not be blank")
    @Size(min = 10, message = "Phone number must be at least 10 digits")
    private String phone;

    private String designation;

    private Long departmentId;

    private String departmentName;

    private LocalDate joiningDate;
}