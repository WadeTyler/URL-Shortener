package net.tylerwade.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Getter @Setter @NoArgsConstructor @ToString
public class ShortenedURL {

    @Id
    private String id;

    private String code;

    private String url;

    private Date createdAt;

    private Date expires;

    @JsonIgnore
    private Long uses = 0L;

}
