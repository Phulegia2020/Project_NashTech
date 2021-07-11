package com.example.nashtechproject.controller;

import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.entity.RoleName;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.restcontroller.UserController;
import com.example.nashtechproject.service.UserService;
import com.example.nashtechproject.service.impl.UserServiceImpl;
import com.fasterxml.jackson.core.io.JsonStringEncoder;
import org.hamcrest.Matchers;
import org.json.JSONString;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.BasicJsonParser;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.CoreMatchers.is;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
//@RunWith(MockitoJUnitRunner.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

//    @MockBean
//    private UserRepository userRepository;
    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    List<User> userList;

    private User user;

    @BeforeEach
    void setUp(){
        this.userList = new ArrayList<>();
        this.userList.add(new User("Champion", "Male", "HCM City", "champion@gmail.com", "0123456789", "Champion", "123456"));
        this.userList.add(new User("Program", "Male", "HCM City", "program@gmail.com", "0123456987", "Program", "123456"));
        this.userList.add(new User("Test", "Male", "HCM City", "test@gmail.com", "0123645987", "Test", "123456"));
        this.userList.add(new User("Test1", "Male", "HCM City", "test1@gmail.com", "0321645987", "Test1", "123456"));
        //user = new User(1L, "Champion", "ChampionWin", "champion@gmail.com", "123456");
        Role role = new Role(3L, RoleName.ROLE_USER);
        user = new User(5L, "Test", "Male", "HCM City", "test@gmail.com", "0123645987", "Test", "123456", "Active");
        user.setRole(role);
    }

    @Test
    @WithMockUser(username = "admin")
    public void getAllUsersTest() throws Exception
    {
        Mockito.when(userService.retrieveUsers()).thenReturn(this.userList);
        //when(userRepository.findAll()).thenReturn(this.userList);

        this.mockMvc.perform(get("/api/users")).andExpect(status().isOk()).andExpect(jsonPath("$.size()", is(userList.size())));

        mockMvc.perform(get("/api/users")).andExpect(status().isOk())
                .andExpect(jsonPath("$[3].name", Matchers.equalTo("Champion")))
                .andExpect(jsonPath("$[3].gender", Matchers.equalTo("Male")))
                .andExpect(jsonPath("$[3].email", Matchers.equalTo("champion@gmail.com")))
                .andExpect(jsonPath("$[3].phone", Matchers.equalTo("0159732468")))
                .andExpect(jsonPath("$[3].account", Matchers.equalTo("Champion")))
                .andExpect(jsonPath("$[3].role_id", Matchers.equalTo("1")));
    }

    @Test
    public void getUserByID() throws Exception
    {
        when(userService.getUser(user.getId())).thenReturn(user);
        mockMvc.perform(get("/api/users/1").contentType(MediaType.APPLICATION_JSON).characterEncoding("UTF-8")
                .accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.equalTo(1)))
                .andExpect(jsonPath("$.name", Matchers.equalTo("Admin")))
                .andExpect(jsonPath("$.account", Matchers.equalTo("Admin")))
                .andExpect(jsonPath("$.email", Matchers.equalTo("Admin@gmail.com")))
                .andExpect(jsonPath("$.role_id", Matchers.equalTo("1")));
    }

    @Test
    @WithMockUser(username = "admin")
    public void postUserTest() throws Exception
    {
        when(userService.saveUser(user)).thenReturn(user);
        mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).characterEncoding("UTF-8")
                .accept(MediaType.APPLICATION_JSON)).andExpect(status().is(400))
                .andExpect(jsonPath("$.id", Matchers.equalTo(5)))
                .andExpect(jsonPath("$.name", Matchers.equalTo("Test")))
                .andExpect(jsonPath("$.account", Matchers.equalTo("Test")))
                .andExpect(jsonPath("$.email", Matchers.equalTo("test@gmail.com")))
                .andExpect(jsonPath("$.role_id", Matchers.equalTo("3")));

//        mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON)
//                .content()
    }
}
