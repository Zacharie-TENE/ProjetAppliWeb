package com.web.n7.service;

import com.web.n7.util.CustomUserDetails;
import com.web.n7.util.JwtUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter implements Filter {

        private final JwtUtil jwtUtil;
        private final CustomUserDetailsService customUserDetailsService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String authHeader = httpRequest.getHeader("Authorization");

        // Check if the Authorization header has a valid Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Extract token
            
            try {
                String email = jwtUtil.extractUsername(token); // Extract email from token

                // Ensure the user is not already authenticated
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);

                    // Validate token and set authentication
                    if (jwtUtil.validateToken(token)) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        // Token is blacklisted or invalid but not expired
                        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        httpResponse.setContentType("application/json");
                        httpResponse.getWriter().write("{\"error\":\"Invalid token\",\"status\":401}");
                        return;
                    }
                }
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                // Catch specifically expired tokens
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\":\"Token expired\",\"status\":401}");
                return;
            } catch (Exception e) {
                // Other JWT exceptions
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\":\"" + e.getMessage() + "\",\"status\":401}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}