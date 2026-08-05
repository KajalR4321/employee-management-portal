package employee.employee_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "employee.employee_backend",
        "controller",
        "services",
        "entity",
        "repository",
        "dto",
        "mapper",
        "exception",
        "enums",
        "util",
        "config"
})
@EnableJpaRepositories(basePackages = "repositary") // <-- Add this!
@EntityScan(basePackages = "entity")

public class EmployeeBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeBackendApplication.class, args);
    }

}
