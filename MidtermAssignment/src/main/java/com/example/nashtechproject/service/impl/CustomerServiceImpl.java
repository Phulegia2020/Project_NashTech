package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Customer;
import com.example.nashtechproject.exception.CustomerException;
import com.example.nashtechproject.repository.CustomerRepository;
import com.example.nashtechproject.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public void setCustomerRepository(CustomerRepository customerRepository)
    {
        this.customerRepository = customerRepository;
    }

    public List<Customer> retrieveCustomers()
    {
        List<Customer> customers = customerRepository.findAll();
        return customers;
    }

    public List<Customer> getCustomerByAccount(String account)
    {
        List<Customer> customers = customerRepository.findByAccount(account);
        return customers;
    }

    public Customer getCustomer(Long customerId)
    {
        Customer cus = customerRepository.findById(customerId).get();
        return cus;
    }

    @Override
    public Customer saveCustomer(Customer cus) {
        return customerRepository.save(cus);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        Customer cus = customerRepository.findById(customerId).get();

        customerRepository.delete(cus);
    }

    @Override
    public void updateCustomer(Customer cus) {
        customerRepository.save(cus);
    }
}
