package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Role;

import java.util.List;

public interface RoleService {
    public List<Role> retrieveRoles();

    public Role getRole(Long RoleId);

    public Role saveRole(Role Role);

    public void deleteRole(Long RoleId);

    public void updateRole(Role Role);
}
