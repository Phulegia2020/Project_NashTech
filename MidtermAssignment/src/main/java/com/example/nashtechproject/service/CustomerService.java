package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Customer;

import java.util.List;

public interface CustomerService {
    public List<Customer> retrieveCustomers();

    public Customer getCustomer(Long customerId);

    public Customer saveCustomer(Customer customer);

    public void deleteCustomer(Long customerId);

    public void updateCustomer(Customer customer);
}
