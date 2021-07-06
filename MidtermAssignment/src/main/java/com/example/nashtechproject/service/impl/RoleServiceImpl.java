package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.repository.RoleRepository;
import com.example.nashtechproject.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public void setRoleRepository(RoleRepository roleRepository)
    {
        this.roleRepository = roleRepository;
    }

    public List<Role> retrieveRoles()
    {
        List<Role> roles = roleRepository.findAll();
        return roles;
    }

    public Role getRole(Long RoleId)
    {
        Role ro = roleRepository.findById(RoleId).get();
        return ro;
    }

    @Override
    public Role saveRole(Role ro) {
        return roleRepository.save(ro);
    }

    @Override
    public void deleteRole(Long RoleId) {
        Role ro = roleRepository.findById(RoleId).get();

        roleRepository.delete(ro);
    }

    @Override
    public void updateRole(Role ro) {
        roleRepository.save(ro);
    }
}
