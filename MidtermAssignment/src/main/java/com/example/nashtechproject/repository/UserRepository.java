package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByOrderByIdAsc();

    Optional<User> findByAccount(String account);

    Boolean existsByAccount(String account);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    User findByEmail(String email);
}
