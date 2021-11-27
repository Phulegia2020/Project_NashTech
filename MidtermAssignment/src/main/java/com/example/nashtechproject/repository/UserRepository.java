package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByOrderByIdAsc();

    List<User> findAllByRoleIdAndActivestatus(Long id, String active);

    List<User> findAllByRoleIdNotAndActivestatus(Long id, String active);

    Optional<User> findByAccount(String account);

    Optional<User> findByAccountAndActivestatusNot(String account, String activestatus);

    Boolean existsByAccount(String account);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    User findByEmailAndActivestatus(String email, String status);

    Page<User> findByActivestatus(String status, Pageable pageable);

    List<User> findByActivestatus(String status);

    Page<User> findByAccountContains(String account, Pageable pageable);

    List<User> findByAccountContains(String account);
}
