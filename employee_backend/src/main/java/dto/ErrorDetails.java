package dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDetails {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // 👈 Formats LocalDateTime cleanly
    private LocalDateTime timestamp;
    private String message;
    private String details;
    private String status;
}

