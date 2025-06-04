package com.web.n7.util;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    // pour commencer, une simple Map en memoire:
    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();
    
    public void addToBlacklist(String token, Date expiryDate) {
        blacklistedTokens.put(token, expiryDate);
    }
    
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }
    
    // Méthode à exécuter périodiquement pour nettoyer les jetons expirés
    @Scheduled(fixedRate = 3600000) // Toutes les heures
    public void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}