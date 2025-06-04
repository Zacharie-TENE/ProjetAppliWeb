package com.web.n7.util;

import com.web.n7.model.users.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
public class CustomUserDetails implements UserDetails {


    private User userEntity;


    public CustomUserDetails(User userEntity) {
        this.userEntity=userEntity;
    }


    @Override
    public String getUsername() {
        return  userEntity.getEmail();
    }

    @Override
    public String getPassword() {
        return  userEntity.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" +  userEntity.getRole().name() ));

    }

//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(
//                new SimpleGrantedAuthority("ROLE_" + role),
//                new SimpleGrantedAuthority("USER_ID_" + id) // Ajouter une autorité spécifique à l'utilisateur
//        );
//    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}