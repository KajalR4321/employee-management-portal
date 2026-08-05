package dto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class DepartmentDto {
    private Long id;

    @NotBlank(message = "Department name must not be blank")
    private String departmentName;

    @NotBlank(message = "Department description must not be blank")
    private String departmentDescription;
}
