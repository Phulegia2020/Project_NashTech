package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.entity.RoleName;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.UserPage;
import com.example.nashtechproject.repository.RoleRepository;
import com.example.nashtechproject.service.RoleService;
import com.example.nashtechproject.service.UserService;
import com.fasterxml.jackson.databind.util.JSONPObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.print.attribute.standard.Media;
import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/users")
@Api(tags = "Users Rest Controller")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private ModelMapper modelMapper;

    final private PasswordEncoder encoder;

    public UserController(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    @GetMapping()
    @ApiOperation(value = "Get all users")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public List<UserDTO> getAllUsers()
    {
        List<UserDTO> usersDTO = new ArrayList<>();
        List<User> users = userService.retrieveUsers();
        for (int i = 0; i < users.size(); i++) {
            UserDTO u = convertToDTO(users.get(i));
            usersDTO.add(u);
        }
        //return usersDTO.stream().sorted(Comparator.comparingLong(UserDTO::getId)).collect(Collectors.toList());
        return usersDTO;
    }

    @GetMapping("/{userId}")
    @ApiOperation(value = "Get User By ID")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public UserDTO findUser(@PathVariable Long userId)
    {
        User us = userService.getUser(userId);
        if (us == null)
        {
            throw new UserException(userId);
        }
        return convertToDTO(userService.getUser(userId));
    }

    @GetMapping("/page")
    @ApiOperation(value = "Get User By Pages")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<UserDTO>> getUsersPages(UserPage userPage)
    {
        //Page<User> users = userService.getUsersPage(userPage);
        //Page<UserDTO> usersDTO = users.
//        for (int i = 0; i < users.getSize(); i++) {
//            UserDTO u = convertToDTO(users.getContent().get(i));
//            usersDTO.;
//        }
        return new ResponseEntity<>(userService.getUsersPage(userPage), HttpStatus.OK);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Create User")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
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
    @ApiOperation(value = "Update User")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public UserDTO updateUser(@PathVariable(name = "userId") Long userId, @Valid @RequestBody UserDTO userDetails)
    {
        User user = userService.getUser(userId);
        if (user == null)
        {
            throw new UserException(userId);
        }
        else
        {
            UserUpdate(user, userDetails);
            userService.updateUser(user);
        }
        return convertToDTO(user);
    }

    @DeleteMapping("/{userId}")
    @ApiOperation(value = "Delete User")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public HashMap<String, String> deleteUser(@PathVariable(name = "userId") Long userId)
    {
        User user = userService.getUser(userId);
        if (user == null)
        {
            throw new UserException(userId);
        }
        userService.deleteUser(userId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
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

    private void UserUpdate(User user, UserDTO userDetails)
    {
        user.setName(userDetails.getName());
        user.setGender(userDetails.getGender());
        user.setAddress(userDetails.getAddress());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setAccount(userDetails.getAccount());
//            if (!userDetails.getPassword().equals(""))
//            {
//                user.setPassword(encoder.encode(userDetails.getPassword()));
//            }
        user.setActive_status(userDetails.getActive_status());
        //user.setRole(userDetails.getRole());

        Role r = roleService.getRole(Long.valueOf(userDetails.getRole_id()));
        user.setRole(r);
    }

//    public Page<UserDTO> getUsersPage(UserPage userPage)
//    {
//        Sort sort = Sort.by(userPage.getSortDirection(), userPage.getSortBy());
//        Pageable pageable = PageRequest.of(userPage.getPageNumber(), userPage.getPageSize(), sort);
//        return convertToDTO(userRepository.findAll(pageable));
//    }
}
