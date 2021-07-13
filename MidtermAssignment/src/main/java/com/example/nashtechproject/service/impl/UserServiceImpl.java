package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    public void setUserRepository(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public List<User> retrieveUsers()
    {
        List<User> users = userRepository.findAll();
        return users;
    }

    public Optional<User> getUserByAccount(String account)
    {
//        if (userRepository.existsByAccount(account))
//        {
//            return true;
//        }
//        return false;
        Optional<User> users = userRepository.findByAccount(account);
        return users;
    }

    public User getUser(Long userId)
    {
        User us = userRepository.findById(userId).get();
        return us;
    }

    @Override
    public User saveUser(User us) {
        return userRepository.save(us);
    }

    @Override
    public User deleteUser(Long userId) {
        User us = userRepository.findById(userId).get();

        userRepository.delete(us);

        return us;
    }

    @Override
    public void updateUser(User us) {
        userRepository.save(us);
    }
}
