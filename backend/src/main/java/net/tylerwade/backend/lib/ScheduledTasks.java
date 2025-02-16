package net.tylerwade.backend.lib;

import lombok.extern.slf4j.Slf4j;
import net.tylerwade.backend.repository.ShortenedURLRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ScheduledTasks {

    @Autowired
    ShortenedURLRepository shortenedURLRepo;

    @Scheduled(fixedRate = 86400000)
    public void clearExpiredShortenedURLs() {
        shortenedURLRepo.deleteExpiredURLs();
        log.info("Expired URLs deleted.");
    }

}
