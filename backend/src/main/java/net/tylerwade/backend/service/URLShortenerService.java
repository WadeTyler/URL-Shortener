package net.tylerwade.backend.service;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import net.tylerwade.backend.model.ShortenedURL;
import net.tylerwade.backend.repository.ShortenedURLRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
public class URLShortenerService {

    @Getter
    private int minCodeLength = 3;

    @Getter
    private int maxCodeLength = 8;

    private int maxPossibleCodes = calculateMaxPossibleCodes();

    private int maxRecentURLSize = 5000;
    private HashMap<String, ShortenedURL> recentURLs = new HashMap<>();     // <code, shortenedURL>

    private int maxMostUsedURLSize = 5000;
    private HashMap<String, ShortenedURL> mostUsedURLs = new HashMap<>();   // <code, shortenedURL>

    @Autowired
    ShortenedURLRepository shortenedURLRepo;

    public String generateCode() {

        if (shortenedURLRepo.count() >= calculateMaxPossibleCodes()) {
            // Max amount of unique codes reached, delete some. (This should never happen)
            throw new RuntimeException("Max amount of unique codes reached.");  // TODO: Change this later to delete codes
        }

        StringBuilder code = new StringBuilder();
        Random random = new Random();

        do {
            // Generate random A-Z and append to code
            char character = (char) (random.nextInt(26) + 'A');
            code.append(character);

            // Check if code does not exist if not return the code value
            if (!shortenedURLRepo.existsShortenedURLByCode(code.toString()) && code.length() >= minCodeLength) {
                break;
            }

            // Check code length
            if (code.length() >= maxCodeLength) {
                code.setLength(0);
            }
        } while (
                code.length() < minCodeLength   // must be minCodeLength
                        || code.isEmpty()   // Must not be empty
                        || shortenedURLRepo.existsShortenedURLByCode(code.toString())   // Must not already exist
        );

        return code.toString();

    }

    public ShortenedURL getFromMemory(String code) {
        // Check if in mostUsed
        ShortenedURL shortenedURL = mostUsedURLs.get(code);

        if (shortenedURL == null) {
            // Check if in recents if not
            shortenedURL = recentURLs.get(code);
        }

        return shortenedURL;
    }

    public void removeFromMemory(String code) {
        recentURLs.remove(code);
        mostUsedURLs.remove(code);
    }

    public void addToRecentUrls(ShortenedURL shortenedURL) {
        // Check if max hashmap size is reached
        if (recentURLs.size() >= maxRecentURLSize) {
            recentURLs.clear();
        }
        recentURLs.put(shortenedURL.getCode(), shortenedURL);
    }

    // Used to calculate and set mostUsedURLs hashmap
    public void calculateMostUsedUrls() {

        // Clear Hashmap
        mostUsedURLs.clear();

        List<ShortenedURL> mostUsedList = shortenedURLRepo.findFirstOrderByUses(maxMostUsedURLSize);
        // Convert list to hashmap
        for (ShortenedURL shortenedURL : mostUsedList) {
            mostUsedURLs.put(shortenedURL.getCode(), shortenedURL);
        }
    }

    // -------------- Private --------------

    private int calculateMaxPossibleCodes() {
        int val = 0;
        for (int i = minCodeLength; i <= maxCodeLength; i++) {
            val += Math.pow(26, i);
        }

        return val;
    }

}
