package net.tylerwade.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Entity @Getter @Setter @NoArgsConstructor @ToString
@Table(name = "shortened_url")
public class ShortenedURL {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false, unique = true)
    private String url;

    private Date createdAt;

    private Date expires;

    @JsonIgnore
    @Column(nullable = false)
    private Long uses = 0L;

}
