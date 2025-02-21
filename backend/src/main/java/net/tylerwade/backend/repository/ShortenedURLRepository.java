package net.tylerwade.backend.repository;

import net.tylerwade.backend.model.ShortenedURL;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShortenedURLRepository extends MongoRepository<ShortenedURL, String> {

    public boolean existsShortenedURLByCode(String code);
    public Optional<ShortenedURL> findShortenedURLByUrl(String url);
    public Optional<ShortenedURL> findShortenedURLByCode(String code);

    public void deleteAllByExpiresBefore(Date date);

    public List<ShortenedURL> findFirstOrderByUses(int first);


}
