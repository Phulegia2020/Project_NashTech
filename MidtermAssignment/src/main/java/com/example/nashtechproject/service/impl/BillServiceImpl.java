package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.dto.MailRequestDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.repository.BillRepository;
import com.example.nashtechproject.repository.BillStatusRepository;
import com.example.nashtechproject.service.BillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private BillRepository billRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void setBillRepository(BillRepository billRepository)
    {
        this.billRepository = billRepository;
    }

    public List<Bill> retrieveBills()
    {
        List<Bill> bills = billRepository.findAll();
        return bills;
    }

    public List<Bill> getBillsPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Bill> bills = billRepository.findAll(pageable).getContent();
        return bills;
    }

    public Bill getBill(Long billId)
    {
        Bill bill = billRepository.findById(billId).get();
        return bill;
    }

    public List<Bill> getBillByUsername(String name)
    {
        List<Bill> bills = billRepository.findByUserNameContains(name);
        return bills;
    }

    public List<Bill> getBillByUsernamePage(String name, ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Bill> bills = billRepository.findByUserNameContains(name, pageable).getContent();
        return bills;
    }

    public List<Bill> getBillByStatusPage()
    {
        List<Bill> bills = billRepository.findByStatusNot(STATE.CANCEL);
        return bills;
    }

    public List<Bill> getBillByStatusPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Bill> bills = billRepository.findByStatusNot(STATE.CANCEL, pageable).getContent();
        return bills;
    }

    @Override
    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    public void deleteBill(Long billId) {
        Bill bill = billRepository.findById(billId).get();

        billRepository.delete(bill);
    }

    @Override
    public void updateBill(Bill bill) {
        billRepository.save(bill);
    }

    @Override
    public void sendEmail(MailRequestDTO mail) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            mimeMessageHelper.setSubject(mail.getSubject());
            mimeMessageHelper.setFrom(mail.getFrom());
            mimeMessageHelper.setTo(mail.getTo());
            mimeMessageHelper.setText(mail.getContent(), true);

            mailSender.send(mimeMessageHelper.getMimeMessage());

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public List<Bill> getBillsDone()
    {
        List<Bill> bills = billRepository.findAllByStatus(STATE.DONE);
        return bills;
    }
}
