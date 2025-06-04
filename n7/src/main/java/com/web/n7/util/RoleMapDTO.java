package com.web.n7.util;

import com.web.n7.dto.users.AdminDTO;
import com.web.n7.dto.users.CoachDTO;
import com.web.n7.dto.users.OrganizerDTO;
import com.web.n7.dto.users.PlayerDTO;
import com.web.n7.dto.users.UserDTO;
import com.web.n7.model.enumeration.player.PlayerPosition;
import com.web.n7.model.users.*;
import org.springframework.stereotype.Component;

@Component
public class RoleMapDTO {
    public static Object ToDTO(User user){

        Object userEntity;

        switch (user.getRole()) {
            case COACH:
                if (user instanceof Coach coach) {
                    userEntity = CoachDTO.builder()
                            .id(coach.getId())
                            .email(coach.getEmail())
                            .userName(coach.getUserName())
                            .firstName(coach.getFirstName())
                            .lastName(coach.getLastName())
                            .phone(coach.getPhone())
                            .profilePicture(coach.getProfilePicture())
                            .licenseNumber(coach.getLicenseNumber())
                            .yearsOfExperience(coach.getYearsOfExperience())
                            .numberOfTeams(coach.getTeams() != null ? coach.getTeams().size() : 0)
                            .contactDetails(coach.getContactDetails())
                            .specialization(coach.getSpecialization())
                            .organization(coach.getOrganization())
                            .role(coach.getRole().name())
                            .createdAt(String.valueOf(coach.getCreatedAt()))
                            .updatedAt(String.valueOf(coach.getUpdatedAt()))
                            .biography(coach.getBiography())
                            .build();
                } else {
                    // Fallback vers UserDTO si le type ne correspond pas au rôle
                    userEntity = createDefaultUserDTO(user);
                }
                break;
            case  PLAYER:
                if (user instanceof Player player) {
                    userEntity = PlayerDTO.builder()
                            .id(player.getId())
                            .email(player.getEmail())
                            .phone(player.getPhone())
                            .userName(player.getUserName())
                            .firstName(player.getFirstName())
                            .lastName(player.getLastName())
                            .address(player.getAddress())
                            .profilePicture(player.getProfilePicture())
                            .role(player.getRole().name())
                            .createdAt(String.valueOf(player.getCreatedAt()))
                            .updatedAt(String.valueOf(player.getUpdatedAt()))
                            .licenseNumber(player.getLicenseNumber())
                            .dateOfBirth(player.getDateOfBirth())
                            .position(player.getPosition() != null ? PlayerPosition.valueOf(player.getPosition().toUpperCase()) : null)
                            .status(player.getStatus())
                            .teamId(player.getTeam() != null ? player.getTeam().getId() : null)
                            .teamName(player.getTeam() != null ? player.getTeam().getName() : null)
                            .build();
                } else {
                    userEntity = createDefaultUserDTO(user);
                }
                break;


            case  ORGANIZER:
                if (user instanceof Organizer organizer) {
                    userEntity = OrganizerDTO.builder()
                            .id(organizer.getId())
                            .email(organizer.getEmail())
                            .userName(organizer.getUserName())
                            .firstName(organizer.getFirstName())
                            .lastName(organizer.getLastName())
                            .phone(organizer.getPhone())
                            .profilePicture(organizer.getProfilePicture())
                            .organization(organizer.getOrganization())
                            .activeCompetitionsCount(organizer.getCompetitions() != null ? organizer.getCompetitions().size() : 0)
                            .contactDetails(organizer.getContactDetails())
                            .address(organizer.getAddress())
                            .role(organizer.getRole().name())
                            .createdAt(String.valueOf(organizer.getCreatedAt()))
                            .updatedAt(String.valueOf(organizer.getUpdatedAt()))
                            .build();
                } else {
                    userEntity = createDefaultUserDTO(user);
                }
                break;
            case ADMIN :
                if (user instanceof Admin admin) {
                    userEntity = AdminDTO.builder()
                            .id(admin.getId())
                            .email(admin.getEmail())
                            .userName(admin.getUserName())
                            .firstName(admin.getFirstName())
                            .lastName(admin.getLastName())
                            .phone(admin.getPhone())
                            .address(admin.getAddress())
                            .profilePicture(admin.getProfilePicture())
                            .contactDetails(admin.getContactDetails())
                            .role(admin.getRole().name())
                            .createdAt(String.valueOf(admin.getCreatedAt()))
                            .updatedAt(String.valueOf(admin.getUpdatedAt()))
                            .build();
                }
                else {
                    userEntity = createDefaultUserDTO(user);
                }
                break;

            default:
                userEntity = createDefaultUserDTO(user);
        }

        return userEntity ;
    }

    public static UserDTO createDefaultUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .profilePicture(user.getProfilePicture())
                .address(user.getAddress())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                .build();
    }
}
