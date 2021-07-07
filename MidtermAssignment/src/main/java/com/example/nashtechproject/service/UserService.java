package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    public List<User> retrieveUsers();

    public Optional<User> getUserByAccount(String account);

    public User getUser(Long userId);

    public User saveUser(User user);

    public void deleteUser(Long userId);

    public void updateUser(User user);
}
