package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.service.impl.UserServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;

import javax.swing.text.html.Option;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
//@SpringBootTest
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void loadUserByAccount()
    {
        User u = new User("Champion", "Male", "HCM City", "champion@gmail.com", "0123456789", "Champion", "123456");
//        u.setActive_status("Active");
//        u.setRole(null);
        Optional<User> utest = Optional.of(u);
        when(userRepository.findByAccount("Champion")).thenReturn(utest);

        User user = userService.getUserByAccount("Champion").get();
        assertEquals("champion@gmail.com", user.getEmail());
        assertEquals("0123456789", user.getPhone());
    }

//    @Test
//    public void getUserByIdTest()
//    {
//        when(userRepository.getById(Long.valueOf(1))).thenReturn(new User(Long.valueOf(1), "Lokesh", "Gupta", "user@email.com", "123456"));
//        Optional<User> u = Optional.of(userService.getUser(Long.valueOf(1)));
//        if (u.isPresent())
//        {
//            assertEquals("Lokesh", u.get().getName());
//        }
//
//    }
}
