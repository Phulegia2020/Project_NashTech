package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Customer;
import com.example.nashtechproject.exception.CustomerException;
import com.example.nashtechproject.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<Customer> getAllCustomers()
    {
        List<Customer> customers = customerService.retrieveCustomers();
        return customers;
    }

    @GetMapping("/{customerId}")
    public Customer findCustomer(@PathVariable Long customerId)
    {
        Customer cus = customerService.getCustomer(customerId);
        if (cus == null)
        {
            throw new CustomerException(customerId);
        }
        return customerService.getCustomer(customerId);
    }

    @PostMapping
    public Customer saveCustomer(@RequestBody Customer customer)
    {
//        List<Customer> customers = customerService.retrieveCustomers();
//        for (Customer emp:categories) {
//            if (Customer.getName().equals(emp.getName()))
//            {
//                throw new CustomerException(Customer.getName());
//            }
//        }
        return customerService.saveCustomer(customer);
    }

    @PutMapping("/{customerId}")
    public Customer updateCustomer(@PathVariable(name = "customerId") Long customerId, @Validated @RequestBody Customer CustomerDetails)
    {
        Customer customer = customerService.getCustomer(customerId);
        if (customer == null)
        {
            throw new CustomerException(customerId);
        }
        else
        {
            customer.setName(CustomerDetails.getName());
            customer.setGender(CustomerDetails.getGender());
            customer.setAddress(CustomerDetails.getAddress());
            customer.setEmail(CustomerDetails.getEmail());
            customer.setPhone(CustomerDetails.getPhone());
            customer.setAccount(CustomerDetails.getAccount());
            customer.setPassword(CustomerDetails.getPassword());
            customer.setActive_status(CustomerDetails.getActive_status());
            customerService.updateCustomer(customer);
        }
        return customer;
    }

    @DeleteMapping("/{customerId}")
    public HashMap<String, String> deleteCustomer(@PathVariable(name = "customerId") Long customerId)
    {
        Customer customer = customerService.getCustomer(customerId);
        if (customer == null)
        {
            throw new CustomerException(customerId);
        }
        customerService.deleteCustomer(customerId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }
}
