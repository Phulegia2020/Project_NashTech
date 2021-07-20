package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.User;
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

    @Autowired
    private ModelMapper modelMapper;

    public void setUserRepository(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public List<User> retrieveUsers()
    {
        List<User> users = userRepository.findAllByOrderByIdAsc();
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

    public List<UserDTO> getUsersPage(UserPage userPage)
    {
        Sort sort = Sort.by(userPage.getSortDirection(), userPage.getSortBy());
        Pageable pageable = PageRequest.of(userPage.getPageNumber(), userPage.getPageSize(), sort);
        //Page<User> users = userRepository.findAll(pageable);
        List<User> list = userRepository.findAll(pageable).getContent();
        List<UserDTO> usersDTO = new ArrayList<>();
        list.forEach(u -> {
            UserDTO udto = modelMapper.map(u, UserDTO.class);
            String role_id = String.valueOf(u.getRole().getId());
            udto.setRole_id(role_id);
            usersDTO.add(udto);
        });
        //return userRepository.findAll(pageable);
        return usersDTO;
    }

    @Override
    public User saveUser(User us) {
        return userRepository.save(us);
    }

    @Override
    public void deleteUser(Long userId) {
        User us = userRepository.findById(userId).get();

        userRepository.delete(us);

        //return us;
    }

    @Override
    public void updateUser(User us) {
        userRepository.save(us);
    }
}
