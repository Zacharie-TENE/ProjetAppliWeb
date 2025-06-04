package com.web.n7.service;

import com.web.n7.dto.users.AdminDTO;
import com.web.n7.dto.users.CoachDTO;
import com.web.n7.dto.users.OrganizerDTO;
import com.web.n7.model.users.Admin;
import com.web.n7.model.users.Coach;
import com.web.n7.model.users.Organizer;
import com.web.n7.util.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.web.n7.dto.users.UserDTO;
import com.web.n7.model.users.User;
import com.web.n7.model.enumeration.Role;
import com.web.n7.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements com.web.n7.serviceInterface.UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateUser(UserDTO userDTO) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }

    @Override
    public List<User> searchUsers(String keyword) {
        //fera offfice de getAllUsers si keyword est vide, ou admin, coach, organizer , user ,palyer selon le roles
        return List.of();
    }

    @Override
    public User getUserByEmail(String email) {
        return null;
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {

    }

    @Override
    public User register(UserDTO userDTO) {

        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .userName(userDTO.getUserName())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .phone(userDTO.getPhone())
                .role(Role.valueOf(userDTO.getRole()))
                .address(userDTO.getAddress())
                .profilePicture(userDTO.getProfilePicture())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        

        return userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    public User update(User user) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public List<User> findAllNonAdminUsers() {
        return List.of();
    }


    @Override
    public void initiatePasswordReset(String email) {

    }

    @Override
    public void resetPassword(String token, String newPassword) {

    }

    @Override
    public void verifyEmail(String token) {

    }

    @Override
    public CustomUserDetails getCurrentUserDetails() {
        return null;
    }


    @Override
    public CoachDTO updateCoach(CoachDTO coachDTO) {
        return null;
    }


    @Override
    public OrganizerDTO updateOrganizer(OrganizerDTO organizerDTO) {
        return null;
    }


    //à des fin de tests
    public User register(CoachDTO coachDTO) {
        if (userRepository.findByEmail(coachDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(coachDTO.getEmail())
                .password(passwordEncoder.encode(coachDTO.getPassword()))
                .userName(coachDTO.getUserName())
                .firstName(coachDTO.getFirstName())
                .lastName(coachDTO.getLastName())
                .phone(coachDTO.getPhone())
                .role(Role.COACH)
                .address(coachDTO.getContactDetails()) 
                .profilePicture(coachDTO.getProfilePicture())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);


        Coach coach = new Coach();
        coach.setId(savedUser.getId());
        coach.setEmail(savedUser.getEmail());
        coach.setPassword(savedUser.getPassword());
        coach.setUserName(savedUser.getUserName());
        coach.setFirstName(savedUser.getFirstName());
        coach.setLastName(savedUser.getLastName());
        coach.setPhone(savedUser.getPhone());
        coach.setRole(savedUser.getRole());
        coach.setAddress(savedUser.getAddress());
        coach.setProfilePicture(savedUser.getProfilePicture());
        coach.setCreatedAt(savedUser.getCreatedAt());
        coach.setUpdatedAt(savedUser.getUpdatedAt());



        coach.setLicenseNumber(coachDTO.getLicenseNumber());
        coach.setSpecialization(coachDTO.getSpecialization());
        coach.setYearsOfExperience(coachDTO.getYearsOfExperience());
        coach.setContactDetails(coachDTO.getContactDetails());
        coach.setOrganization(coachDTO.getOrganization());
        coach.setBiography(coachDTO.getBiography());

        return userRepository.save(coach);
    }

    public User register(AdminDTO adminDTO) {
        if (userRepository.findByEmail(adminDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(adminDTO.getEmail())
                .password(passwordEncoder.encode(adminDTO.getPassword()))
                .userName(adminDTO.getUserName())
                .firstName(adminDTO.getFirstName())
                .lastName(adminDTO.getLastName())
                .phone(adminDTO.getPhone())
                .role(Role.ADMIN)
                .address(adminDTO.getAddress())
                .profilePicture(adminDTO.getProfilePicture())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);


        Admin admin = new Admin();
        admin.setId(savedUser.getId());
        admin.setEmail(savedUser.getEmail());
        admin.setPassword(savedUser.getPassword());
        admin.setUserName(savedUser.getUserName());
        admin.setFirstName(savedUser.getFirstName());
        admin.setLastName(savedUser.getLastName());
        admin.setPhone(savedUser.getPhone());
        admin.setRole(savedUser.getRole());
        admin.setAddress(savedUser.getAddress());
        admin.setContactDetails(adminDTO.getContactDetails());
        admin.setProfilePicture(savedUser.getProfilePicture());
        admin.setCreatedAt(savedUser.getCreatedAt());
        admin.setUpdatedAt(savedUser.getUpdatedAt());


        admin.setContactDetails(adminDTO.getContactDetails());

        return userRepository.save(admin);
    }

    public User register(OrganizerDTO organizerDTO) {
        if (userRepository.findByEmail(organizerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(organizerDTO.getEmail())
                .password(passwordEncoder.encode(organizerDTO.getPassword()))
                .userName(organizerDTO.getUserName())
                .firstName(organizerDTO.getFirstName())
                .lastName(organizerDTO.getLastName())
                .phone(organizerDTO.getPhone())
                .role(Role.ORGANIZER)
                .address(organizerDTO.getAddress())
                .profilePicture(organizerDTO.getProfilePicture())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);


        Organizer organizer = new Organizer();
        organizer.setId(savedUser.getId());
        organizer.setEmail(savedUser.getEmail());
        organizer.setPassword(savedUser.getPassword());
        organizer.setUserName(savedUser.getUserName());
        organizer.setFirstName(savedUser.getFirstName());
        organizer.setLastName(savedUser.getLastName());
        organizer.setPhone(savedUser.getPhone());
        organizer.setRole(savedUser.getRole());
        organizer.setAddress(savedUser.getAddress());
        organizer.setProfilePicture(savedUser.getProfilePicture());
        organizer.setCreatedAt(savedUser.getCreatedAt());
        organizer.setUpdatedAt(savedUser.getUpdatedAt());


        organizer.setSpecialization(organizerDTO.getSpecialization());
        organizer.setOrganization(organizerDTO.getOrganization());
        organizer.setContactDetails(organizerDTO.getContactDetails());

        return userRepository.save(organizer);
    }
}