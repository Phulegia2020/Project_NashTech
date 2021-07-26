package com.example.nashtechproject.service;

import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.page.UserPage;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface UserService {
    public List<User> retrieveUsers();

//    public boolean getUserByAccount(String account);
    public Optional<User> getUserByAccount(String account);

    public User getUser(Long userId);

    public List<UserDTO> getUsersPage(UserPage userPage);

    public User saveUser(User user);

    public void deleteUser(Long userId);

    public void updateUser(User user);

    public boolean existUsername(String username);

    public boolean existEmail(String email);

    public boolean existPhone(String phone);
}
