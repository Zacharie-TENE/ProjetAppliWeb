   package com.web.n7.util;

   import io.jsonwebtoken.Claims;
   import io.jsonwebtoken.JwtException;
   import io.jsonwebtoken.Jwts;
   import io.jsonwebtoken.SignatureAlgorithm;
   import io.jsonwebtoken.security.Keys;
   import jakarta.annotation.PostConstruct;
   import lombok.AllArgsConstructor;
   import lombok.Data;
   import lombok.RequiredArgsConstructor;
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.stereotype.Component;

   import javax.crypto.SecretKey;
   import java.security.Key;
   import java.util.Date;


   @Component
   @Data
   @RequiredArgsConstructor
   public class JwtUtil {

       private final TokenBlacklistService tokenBlacklistService;


       @Value("${security.jwt.secret}")
       private String secretKey;

       @Value("${security.jwt.expiration}")
       private Long expirationTime;


       @Value("${security.jwt.algorithm}")
       private String algorithm;


       private  Key key;

       @PostConstruct
       public void init() {
           this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
       }




       public void addTokenToBlacklist(String token, Date expiryDate) {
           tokenBlacklistService.addToBlacklist(token, expiryDate);
       }

       public String generateToken(String email,Long userId ,String role) {
           return Jwts.builder()
                   .setSubject(email)
                   .claim("id", userId)
                   .claim("role", role)
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis() +expirationTime ))
                   .signWith(key, SignatureAlgorithm.HS256)
                   .compact();
       }


       public String extractUsername(String token) {
           return Jwts.parserBuilder()
                   .setSigningKey(key)
                   .build()
                   .parseClaimsJws(token)
                   .getBody()
                   .getSubject();
       }


       public boolean validateToken(String token) {
           try {
               Jwts.parserBuilder()
                       .setSigningKey(key)
                       .build()
                       .parseClaimsJws(token);
               
               // Check if token is blacklisted
               if (tokenBlacklistService.isBlacklisted(token)) {
                   return false;
               }
               
               // Check if token is expired
               Date expiration = getExpirationDateFromToken(token);
               if (expiration.before(new Date())) {
                   return false;
               }
               
               return true;
           } catch (JwtException | IllegalArgumentException e) {
               return false;
           }
       }
       
       /**
        * Vérifie si un token est expiré
        * @param token le token JWT à vérifier
        * @return true si le token est expiré, false sinon
        */
       public boolean isTokenExpired(String token) {
           try {
               Date expiration = getExpirationDateFromToken(token);
               return expiration.before(new Date());
           } catch (Exception e) {
               return true;
           }
       }


       public String refreshToken(String refreshToken) {
           if (validateToken(refreshToken)) {
               String username = extractUsername(refreshToken);
               Long userId = extractUserId(refreshToken);
               String role = extractUserRole(refreshToken);
               return generateToken(username, userId, role);
           } else {
               throw new IllegalArgumentException("Invalid or expired refresh token.");
           }
       }


       public String extractUserRole(String token) {
           Claims claims = Jwts.parserBuilder()
                   .setSigningKey(key)
                   .build()
                   .parseClaimsJws(token)
                   .getBody();
           return (String) claims.get("role");
       }

       private Long extractUserId(String token) {
           Claims claims = Jwts.parserBuilder()
                   .setSigningKey(key)
                   .build()
                   .parseClaimsJws(token)
                   .getBody();
           return ((Number) claims.get("id")).longValue();
       }

       public Date getExpirationDateFromToken(String token) {
           Claims claims = Jwts.parserBuilder()
                   .setSigningKey(key)
                   .build()
                   .parseClaimsJws(token)
                   .getBody();
           return claims.getExpiration();
       }


   }