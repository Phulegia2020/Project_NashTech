package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.MailRequestDTO;
import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.page.UserPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.BillService;
import com.example.nashtechproject.service.RoleService;
import com.example.nashtechproject.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

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
    private BillService billService;

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
        return usersDTO;
    }

    @GetMapping("/active")
    @ApiOperation(value = "Get all users active")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public int getAllUsersActive()
    {
        List<User> users = userService.getUsersActive();
        return users.size();
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

    @GetMapping("/email/{email}")
    @ApiOperation(value = "Get User By Email")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public UserDTO getUserEmail(@PathVariable String email)
    {
        User us = userService.getUserEmail(email.trim());
        if (us == null)
        {
            throw new ObjectNotFoundException("The email does not exist!");
        }
        return convertToDTO(us);
    }

    @GetMapping("/forgetPassword")
    @ApiOperation(value = "Forget Password")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public int forgetPassword (@RequestParam String email)
    {
        if (!userService.existEmail(email))
        {
            throw new ObjectNotFoundException("The email is not correct.");
        }
        Random rnd = new Random();
        int otp = 100000 + rnd.nextInt(900000);
        MailRequestDTO mailRequestDTO = new MailRequestDTO();
        mailRequestDTO.setFrom("ps4gamemachine@gmail.com");
        mailRequestDTO.setTo(email.trim());
        mailRequestDTO.setSubject("THE PLAYSTATION SHOP - Quên Mật Khẩu");
        mailRequestDTO.setContent("Mã OTP xác nhận: <b>" + otp + "</b>");
        billService.sendEmail(mailRequestDTO);
        return otp;
    }

    @GetMapping("/page")
    @ApiOperation(value = "Get Users By Pages")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<User>> getUsersPages(UserPage userPage)
    {
        return new ResponseEntity<>(userService.getUsersPage(userPage), HttpStatus.OK);
    }

    @GetMapping("/customer")
    public List<UserDTO> getAllCustomers()
    {
        List<UserDTO> usersDTO = new ArrayList<>();
        List<User> users = userService.getUsers();
        for (int i = 0; i < users.size(); i++) {
            UserDTO u = convertToDTO(users.get(i));
            usersDTO.add(u);
        }
        return usersDTO;
    }

    @GetMapping("/employee")
    public List<UserDTO> getAllEmployees()
    {
        List<UserDTO> usersDTO = new ArrayList<>();
        List<User> users = userService.getEmployee();
        for (int i = 0; i < users.size(); i++) {
            UserDTO u = convertToDTO(users.get(i));
            usersDTO.add(u);
        }
        return usersDTO;
    }

    @GetMapping("/username")
    public int getUsername(@RequestParam String username)
    {
        List<User> users = userService.getUserAccount(username);
        return users.size();
    }

    @GetMapping("/usernamePage")
    public ResponseEntity<List<User>> getUsernamePages(@RequestParam String username, UserPage userPage)
    {
        return new ResponseEntity<>(userService.getUserAccountPage(userPage, username), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Create User")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public UserDTO saveUser(@RequestBody User user)
    {
        Optional<User> users = userService.getUserByAccount(user.getAccount());
        if (users.isPresent())
        {
            throw new UserException(user.getAccount());
        }
        if (userService.existEmail(user.getEmail()))
        {
            throw new UserException(user.getEmail());
        }
        if (userService.existPhone(user.getPhone()))
        {
            throw new UserException(user.getPhone());
        }
        user.setActive_status(STATE.ACTIVE);
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
    public ResponseEntity<?> deleteUser(@PathVariable(name = "userId") Long userId)
    {
        User user = userService.getUser(userId);
        if (user == null)
        {
            throw new UserException(userId);
        }
        user.setActive_status(STATE.INACTIVE);
        userService.updateUser(user);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private UserDTO convertToDTO(User u)
    {
        UserDTO udto = modelMapper.map(u, UserDTO.class);
        String role_id = String.valueOf(u.getRole().getId());
        udto.setRole_id(role_id);
        return udto;
    }

    private void UserUpdate(User user, UserDTO userDetails)
    {
        user.setName(userDetails.getName().trim());
        user.setGender(userDetails.getGender());
        user.setAddress(userDetails.getAddress().trim());
        user.setEmail(userDetails.getEmail().trim());
        user.setPhone(userDetails.getPhone());
        user.setAccount(userDetails.getAccount());
        user.setActive_status(userDetails.getActive_status());
        Role r = roleService.getRole(Long.valueOf(userDetails.getRole_id()));
        user.setRole(r);
    }
}
