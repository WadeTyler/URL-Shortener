package net.tylerwade.backend.controller;

import net.tylerwade.backend.lib.classes.ResponseMessage;
import net.tylerwade.backend.lib.StatusTypes;
import net.tylerwade.backend.model.ShortenedURL;
import net.tylerwade.backend.repository.ShortenedURLRepository;
import net.tylerwade.backend.service.URLShortenerService;
import org.apache.commons.validator.routines.UrlValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController @RequestMapping("/api/url")
@CrossOrigin(origins = "*")
public class URLShortenerController {

    @Autowired
    URLShortenerService urlShortenerService;

    @Autowired
    ShortenedURLRepository shortenedURLRepo;

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenURL(@RequestBody ShortenedURL shortenRequest) {

        // Check for url
        if (shortenRequest.getUrl() == null || shortenRequest.getUrl().isEmpty()) {
            return new ResponseEntity<>(new ResponseMessage(StatusTypes.BAD_REQUEST, "URL is required."), HttpStatus.BAD_REQUEST);
        }

        // Check valid expiration
        if (shortenRequest.getExpires() == null || shortenRequest.getExpires().before(new Date())) {
            return new ResponseEntity<>(new ResponseMessage<>(StatusTypes.BAD_REQUEST, "Expiration must be in the future"), HttpStatus.BAD_REQUEST);
        }

        // Check if is valid url
        UrlValidator urlValidator = new UrlValidator();
        if (!urlValidator.isValid(shortenRequest.getUrl())) {
            return new ResponseEntity<>(new ResponseMessage<>(StatusTypes.BAD_REQUEST, "Invalid URL."), HttpStatus.BAD_REQUEST);
        }

        // Check if url already exists
        Optional<ShortenedURL> shortenedURLOptional = shortenedURLRepo.findShortenedURLByUrl(shortenRequest.getUrl());
        if (shortenedURLOptional.isPresent()) {

            ShortenedURL shortenedURL = shortenedURLOptional.get();

            // Check if expiration needs to be updated
            if (shortenRequest.getExpires().after(shortenedURL.getExpires())) {
                shortenedURL.setExpires(shortenRequest.getExpires());
                // Save change
                shortenedURLRepo.save(shortenedURL);
            }

            // Add to memory
            urlShortenerService.addToRecentUrls(shortenedURL);

            // Return existing shortenedURL
            return new ResponseEntity<>(new ResponseMessage<>(shortenedURL, StatusTypes.SUCCESS, "Existing Shortened URL Found!"), HttpStatus.OK);
        }

        // Generate code
        String code = urlShortenerService.generateCode();

        shortenRequest.setCode(code);
        shortenRequest.setCreatedAt(new Date());
        shortenedURLRepo.save(shortenRequest);

        // Add to memory
        urlShortenerService.addToRecentUrls(shortenRequest);

        return new ResponseEntity<>(new ResponseMessage<>(shortenRequest,StatusTypes.SUCCESS, "URL Shortened!"), HttpStatus.OK);


    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateURL(@PathVariable String code) {

        if (code == null || code.isEmpty()) {
            return new ResponseEntity<>(new ResponseMessage<>(StatusTypes.BAD_REQUEST, "Code is required."), HttpStatus.BAD_REQUEST);
        }

        // Convert to uppercase
        code = code.toUpperCase().trim();

        // Check if code is correct length
        if (code.length() < urlShortenerService.getMinCodeLength() || code.length() > urlShortenerService.getMaxCodeLength()) {
            return new ResponseEntity<>(new ResponseMessage<>(StatusTypes.BAD_REQUEST, "Invalid Code"), HttpStatus.BAD_REQUEST);
        }

        // Check if shortenedURL exists in memory
        ShortenedURL  shortenedURL = urlShortenerService.getFromMemory(code);

        // If it does not exist in memory
        if (shortenedURL == null) {
            // Check if code exists in db
            Optional<ShortenedURL> shortenedURLOptional = shortenedURLRepo.findShortenedURLByCode(code);
            // Code not found in db
            if (shortenedURLOptional.isEmpty()) {
                return new ResponseEntity<>(new ResponseMessage<>(StatusTypes.BAD_REQUEST, "Invalid Code"), HttpStatus.BAD_REQUEST);
            }

            shortenedURL = shortenedURLOptional.get();
        }

        // Check if expired
        if (shortenedURL.getExpires().before(new Date())) {

            // Remove from repo
            shortenedURLRepo.delete(shortenedURL);
            // Remove from memory
            urlShortenerService.removeFromMemory(code);

            return new ResponseEntity<>(new ResponseMessage<>(StatusTypes.BAD_REQUEST, "This code has expired and is now invalid."), HttpStatus.BAD_REQUEST);
        }

        // Add to memory
        urlShortenerService.addToRecentUrls(shortenedURL);

        // Update uses
        shortenedURL.setUses(shortenedURL.getUses() + 1);
        shortenedURLRepo.save(shortenedURL);

        // Return the shortenedURL
        return new ResponseEntity<>(new ResponseMessage<>(shortenedURL, StatusTypes.SUCCESS, "Code is valid!"), HttpStatus.OK);
    }

}
