package net.tylerwade.backend.lib;

import lombok.extern.slf4j.Slf4j;
import net.tylerwade.backend.repository.ShortenedURLRepository;
import net.tylerwade.backend.service.URLShortenerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class ScheduledTasks {

    @Autowired
    ShortenedURLRepository shortenedURLRepo;

    @Autowired
    URLShortenerService shortenerService;

    @Scheduled(fixedRate = 86400000)
    public void clearExpiredShortenedURLs() {
        shortenedURLRepo.deleteAllByExpiresBefore(new Date());
        log.info("Expired URLs deleted.");
    }

    @Scheduled(fixedRate = 86400000)
    public void updateMostUsedURLCache() {
        shortenerService.calculateMostUsedUrls();
        log.info("Most used URLs Cache Updated.");
    }

}
