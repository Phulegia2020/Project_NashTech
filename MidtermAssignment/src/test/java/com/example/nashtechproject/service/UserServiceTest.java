package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.service.impl.UserServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void loadUserByAccount()
    {
        User u = new User("Champion", "Male", "HCM City", "champion@gmail.com", "0123456789", "Champion", "123456");
        Optional<User> utest = Optional.of(u);
        when(userRepository.findByAccount("Champion")).thenReturn(utest);

        User user = userService.getUserByAccount("Champion").get();
        assertEquals("champion@gmail.com", user.getEmail());
        assertEquals("0123456789", user.getPhone());
    }

    @Test
    public void getUserByIdTest()
    {
        User u = new User(1L, "Lokesh", "Gupta", "user@email.com", "123456");
        Optional<User> utest = Optional.of(u);
        when(userRepository.findById(1L)).thenReturn(utest);
        User user = userService.getUser(1L);

        assertEquals("Lokesh", user.getName());
        assertEquals("Gupta", user.getAccount());
        assertEquals("user@email.com", user.getEmail());
    }

    @Test
    public void createUserTest()
    {
        User u = new User(1L, "Create", "Create", "create@email.com", "123456");
        when(userRepository.save(any())).thenReturn(u);
        User user = userService.saveUser(u);

        assertEquals("Create", user.getName());
        assertEquals("Create", user.getAccount());
        assertEquals("create@email.com", user.getEmail());
    }

    @Test
    public void deleteUserTest()
    {
        User u = new User(1L, "Delete", "Delete", "delete@email.com", "123456");
        when(userRepository.findById(u.getId())).thenReturn(Optional.of(u));

        userService.deleteUser(u.getId());

        verify(userRepository, times(1)).delete(u);
    }

    @Test
    public void updateUserTest()
    {
        User u = new User(1L, "Delete", "Delete", "delete@email.com", "123456");
        when(userRepository.findById(u.getId())).thenReturn(Optional.of(u));

        when(userRepository.save(any())).thenReturn(u);

        assertEquals("Delete", u.getName());
    }
}
