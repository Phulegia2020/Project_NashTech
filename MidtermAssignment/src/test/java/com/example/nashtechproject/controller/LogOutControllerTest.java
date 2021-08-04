package com.example.nashtechproject.controller;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.payload.request.LoginRequest;
import com.example.nashtechproject.restcontroller.UserController;
import com.example.nashtechproject.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@RunWith(MockitoJUnitRunner.class)
public class LogOutControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @InjectMocks
    private UserController userController;

    @MockBean
    private UserService userService;

    private LoginRequest user;

    List<User> userList;

    @BeforeEach
    void setUp()
    {
        this.userList = new ArrayList<>();
        this.userList.add(new User("Champion", "Male", "HCM City", "champion@gmail.com", "0123456789", "Champion", "123456"));
        this.userList.add(new User("Program", "Male", "HCM City", "program@gmail.com", "0123456987", "Program", "123456"));
        this.userList.add(new User("Test", "Male", "HCM City", "test@gmail.com", "0123645987", "Test", "123456"));
        this.userList.add(new User("Test1", "Male", "HCM City", "test1@gmail.com", "0321645987", "Test1", "123456"));
        user = new LoginRequest();
//        user.setUsername("Admin");
//        user.setPassword("123456");
    }

    @Test
    @WithMockUser(username = "admin")
    public void logOutTest() throws Exception
    {
        Mockito.when(userService.retrieveUsers()).thenReturn(this.userList);
        this.mockMvc.perform(get("/api/users")).andExpect(status().isOk()).andExpect(jsonPath("$.size()", is(userList.size())));
        //user.setUsername(userList.get(0).getAccount());
        //user.setPassword("123456");
        //mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signin").content(new ObjectMapper().writeValueAsString(user))).andExpect(status().isOk());
        //mockMvc.perform(get("/api/auth/logout")).andExpect(status().isUnauthorized());
    }
}
