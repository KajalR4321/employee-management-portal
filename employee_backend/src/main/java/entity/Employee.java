package entity;

import enums.EmployeeStatus;
import enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String lastName;

    @NotBlank(message = "Employee email must not be blank")
    @Email(message = "Email should be valid (e.g. user@example.com)")
    private String email;

    private String password;

    private String phone;

    private String designation;

    private LocalDate joiningDate;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;

    // Employee belongs to one Department
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "department_id")
    private Department department;
}