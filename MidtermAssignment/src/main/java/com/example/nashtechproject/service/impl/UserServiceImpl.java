package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.UserPage;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

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
        List<User> users = userRepository.findAllByOrderByIdAsc();
        return users;
    }

    public List<User> getUsersActive()
    {
        List<User> users = userRepository.findByActivestatus("Active");
        return users;
    }

    public List<User> getUsers()
    {
        List<User> users = userRepository.findAllByRoleIdAndActivestatus(3L, "Active");
        return users;
    }

    public List<User> getEmployee()
    {
        List<User> users = userRepository.findAllByRoleIdNotAndActivestatus(3L, "Active");
        return users;
    }

    public Optional<User> getUserByAccount(String account)
    {
        Optional<User> users = userRepository.findByAccount(account);
        return users;
    }

    public User getUser(Long userId)
    {
        User us = userRepository.findById(userId).get();
        return us;
    }

    public List<User> getUsersPage(UserPage userPage)
    {
        Sort sort = Sort.by(userPage.getSortDirection(), userPage.getSortBy());
        Pageable pageable = PageRequest.of(userPage.getPageNumber(), userPage.getPageSize(), sort);
        Page<User> page = userRepository.findByActivestatus("Active", pageable);
        List<User> list = page.getContent();
        return list;
    }

    public List<User> getUserAccount(String account)
    {
        List<User> users = userRepository.findByAccountContains(account);
        return users;
    }

    public List<User> getUserAccountPage(UserPage userPage, String account)
    {
        Sort sort = Sort.by(userPage.getSortDirection(), userPage.getSortBy());
        Pageable pageable = PageRequest.of(userPage.getPageNumber(), userPage.getPageSize(), sort);
        Page<User> page = userRepository.findByAccountContains(account, pageable);
        List<User> list = page.getContent();
        return list;
    }

    public boolean existUsername(String username)
    {
        if (userRepository.existsByAccount(username))
        {
            return true;
        }
        return false;
    }

    public boolean existEmail(String email)
    {
        if (userRepository.existsByEmail(email))
        {
            return true;
        }
        return false;
    }

    public boolean existPhone(String phone)
    {
        if (userRepository.existsByPhone(phone))
        {
            return true;
        }
        return false;
    }
    @Override
    public User saveUser(User us) {
        return userRepository.save(us);
    }

    @Override
    public void deleteUser(Long userId) {
        User us = userRepository.findById(userId).get();

        userRepository.delete(us);
    }

    @Override
    public void updateUser(User us) {
        userRepository.save(us);
    }
}
