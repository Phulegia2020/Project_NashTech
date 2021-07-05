package com.example.nashtechproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.entity.RoleName;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName roleName);
}
