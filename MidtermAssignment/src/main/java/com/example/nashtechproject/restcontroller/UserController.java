package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.print.attribute.standard.Media;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    final private PasswordEncoder encoder;

    public UserController(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    @GetMapping()
    public List<UserDTO> getAllUsers()
    {
        List<UserDTO> usersDTO = new ArrayList<>();
        List<User> users = userService.retrieveUsers();
        for (int i = 0; i < users.size(); i++) {
            UserDTO u = convertToDTO(users.get(i));
            usersDTO.add(u);
        }
        return usersDTO;
    }

    @GetMapping("/{userId}")
    public UserDTO findUser(@PathVariable Long userId)
    {
        User us = userService.getUser(userId);
        if (us == null)
        {
            throw new UserException(userId);
        }
        return convertToDTO(userService.getUser(userId));
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public UserDTO saveUser(@RequestBody User user)
    {
        Optional<User> users = userService.getUserByAccount(user.getAccount());
//        if (userService.getUserByAccount(user.getAccount()) == true)
//        {
//            throw new UserException(user.getAccount());
//        }
        if (users.isPresent())
        {
            throw new UserException(user.getAccount());
        }
        user.setActive_status("Active");
        UserDTO userDTO = convertToDTO(userService.saveUser(user));
        return userDTO;
    }

    @PutMapping("/{userId}")
    public UserDTO updateUser(@PathVariable(name = "userId") Long userId, @Valid @RequestBody User userDetails)
    {
        User user = userService.getUser(userId);
        if (user == null)
        {
            throw new UserException(userId);
        }
        else
        {
            user.setName(userDetails.getName());
            user.setGender(userDetails.getGender());
            user.setAddress(userDetails.getAddress());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setAccount(userDetails.getAccount());
            user.setPassword(encoder.encode(userDetails.getPassword()));
            user.setActive_status(userDetails.getActive_status());
            userService.updateUser(user);
        }
        return convertToDTO(user);
    }

    @DeleteMapping("/{userId}")
    public HashMap<String, String> deleteUser(@PathVariable(name = "userId") Long userId)
    {
        User user = userService.getUser(userId);
        if (user == null)
        {
            throw new UserException(userId);
        }
        User udel = userService.deleteUser(userId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete " + udel.getId() + " Succesfully!");
        return map;
    }

    private UserDTO convertToDTO(User u)
    {
        UserDTO udto = modelMapper.map(u, UserDTO.class);
        if (u.getRole() != null)
        {
            String role_id = String.valueOf(u.getRole().getId());
            udto.setRole_id(role_id);
        }
        else
        {
            udto.setRole_id("");
        }
        return udto;
    }
}
