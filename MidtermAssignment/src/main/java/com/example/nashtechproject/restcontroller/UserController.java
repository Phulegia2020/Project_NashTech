package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers()
    {
        List<User> users = userService.retrieveUsers();
        return users;
    }

    @GetMapping("/{userId}")
    public User findUser(@PathVariable Long userId)
    {
        User us = userService.getUser(userId);
        if (us == null)
        {
            throw new UserException(userId);
        }
        return userService.getUser(userId);
    }

    @PostMapping
    public User saveUser(@RequestBody User user)
    {
//        List<User> Users = UserService.retrieveUsers();
//        for (User emp:categories) {
//            if (User.getName().equals(emp.getName()))
//            {
//                throw new UserException(User.getName());
//            }
//        }
        Optional<User> users = userService.getUserByAccount(user.getAccount());
        if (users != null)
        {
            throw new UserException(user.getAccount());
        }
        user.setActive_status("Active");
        return userService.saveUser(user);
    }

    @PutMapping("/{userId}")
    public User updateUser(@PathVariable(name = "userId") Long userId, @Valid @RequestBody User userDetails)
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
            user.setPassword(userDetails.getPassword());
            user.setActive_status(userDetails.getActive_status());
            userService.updateUser(user);
        }
        return user;
    }

    @DeleteMapping("/{userId}")
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
}
