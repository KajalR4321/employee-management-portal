package controller;

import entity.Employee;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repositary.EmployeeRepo;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final EmployeeRepo employeeRepository;

    public AuthController(EmployeeRepo employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        System.out.println("========== LOGIN REQUEST ==========");

        System.out.println("Email received: " + email);

        System.out.println(
                "Password received: "
                        + (password != null ? "YES" : "NO")
        );

        // ==============================
        // EMAIL VALIDATION
        // ==============================

        if (email == null || email.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Email is required"
                            )
                    );
        }

        // ==============================
        // PASSWORD VALIDATION
        // ==============================

        if (password == null || password.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Password is required"
                            )
                    );
        }

        email = email.trim();

        // ==============================
        // FIND EMPLOYEE BY EMAIL
        // ==============================

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {

            System.out.println(
                    "LOGIN FAILED: Email not registered: "
                            + email
            );

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Email not registered"
                            )
                    );
        }

        System.out.println(
                "Employee found: "
                        + employee.getName()
        );

        // ==============================
        // CHECK PASSWORD
        // ==============================

        if (employee.getPassword() == null
                || employee.getPassword().isEmpty()) {

            System.out.println(
                    "LOGIN FAILED: Password not set"
            );

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Password is not set for this account"
                            )
                    );
        }

        if (!employee.getPassword().equals(password)) {

            System.out.println(
                    "LOGIN FAILED: Incorrect password"
            );

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Incorrect password"
                            )
                    );
        }

        // ==============================
        // CHECK ROLE
        // ==============================

        if (employee.getRole() == null) {

            System.out.println(
                    "LOGIN FAILED: Role not configured"
            );

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Employee role is not configured"
                            )
                    );
        }

        // ==============================
        // CREATE USER RESPONSE
        // ==============================

        Map<String, Object> user = Map.of(
                "id", employee.getId(),
                "name", employee.getName(),
                "email", employee.getEmail(),
                "role", employee.getRole().name()
        );

        System.out.println(
                "LOGIN SUCCESS: "
                        + employee.getEmail()
        );

        System.out.println(
                "==================================="
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Login successful",

                        "user",
                        user
                )
        );
    }
}