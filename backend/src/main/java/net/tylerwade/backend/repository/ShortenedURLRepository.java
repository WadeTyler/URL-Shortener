package net.tylerwade.backend.repository;

import jakarta.transaction.Transactional;
import net.tylerwade.backend.model.ShortenedURL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShortenedURLRepository extends JpaRepository<ShortenedURL, Integer> {

    public boolean existsShortenedURLByCode(String code);
    public Optional<ShortenedURL> findShortenedURLByUrl(String url);
    public Optional<ShortenedURL> findShortenedURLByCode(String code);


    @Modifying
    @Transactional
    @Query("DELETE FROM ShortenedURL s WHERE s.expires <= CURRENT_TIMESTAMP")
    public void deleteExpiredURLs();


}
