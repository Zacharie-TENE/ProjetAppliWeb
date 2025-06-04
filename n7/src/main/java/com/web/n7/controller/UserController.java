package com.web.n7.controller;

import com.web.n7.dto.users.CoachDTO;
import com.web.n7.dto.users.OrganizerDTO;
import com.web.n7.model.users.User;
import com.web.n7.service.UserServiceImpl;
import com.web.n7.util.RoleMapDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

    @GetMapping("/{userId}")

    //COACHDTO, ORGANIZERDTO, PLAYERDTO, USERDTO,ADMINDTO EN SORTIE
    public ResponseEntity<Object> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);

        return ResponseEntity.ok(RoleMapDTO.ToDTO(user));
    }


    @PutMapping("/coaches")
    public ResponseEntity<CoachDTO> updateCoachProfile(@RequestBody CoachDTO coachDTO) {
        try {
            CoachDTO updatedCoach = userService.updateCoach(coachDTO);
            return ResponseEntity.ok(updatedCoach);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    

    @PutMapping("/organizers")
    public ResponseEntity<OrganizerDTO> updateOrganizerProfile(@RequestBody OrganizerDTO organizerDTO) {
        try {
            OrganizerDTO updatedOrganizer = userService.updateOrganizer(organizerDTO);
            return ResponseEntity.ok(updatedOrganizer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }



}