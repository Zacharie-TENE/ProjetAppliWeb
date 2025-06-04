package com.web.n7.service;


import com.web.n7.model.users.*;
import com.web.n7.repository.UserRepository;
import com.web.n7.util.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("L'utilsateurr avec  l" + email + " n a pas été trouvé"));


        return new CustomUserDetails(user);
    }
}

