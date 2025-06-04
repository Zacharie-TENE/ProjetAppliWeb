package com.web.n7.serviceInterface;

import com.web.n7.dto.users.CoachDTO;
import com.web.n7.dto.users.OrganizerDTO;
import com.web.n7.dto.users.UserDTO;
import com.web.n7.model.users.User;
import com.web.n7.util.CustomUserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User getUserById(Long id);

    void deleteUser(Long id);
    List<User> searchUsers(String keyword);
    User getUserByEmail(String email);
    void changePassword(Long userId,String oldPassword, String newPassword);

    User updateUser(UserDTO userDTO);
    User register(UserDTO userDTO);
    
    // Méthodes internes
    Optional<User> findById(Long id);
    List<User> findAll();
    User update(User user);
    void delete(Long id);
    List<User> findAllNonAdminUsers();



    void initiatePasswordReset(String email);

    void resetPassword(String token, String newPassword);

    void verifyEmail(String token);

    CustomUserDetails getCurrentUserDetails();



    CoachDTO updateCoach(CoachDTO coachDTO);
    OrganizerDTO updateOrganizer(OrganizerDTO organizerDTO);



}