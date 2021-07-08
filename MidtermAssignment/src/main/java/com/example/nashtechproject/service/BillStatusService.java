package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.BillStatus;

import java.util.List;

public interface BillStatusService {
    public List<BillStatus> retrieveBillStatuses();

    public BillStatus getBillStatus(Long billStatusId);

    public BillStatus saveBillStatus(BillStatus billStatus);

    public void deleteBillStatus(Long billStatusId);

    public void updateBillStatus(BillStatus billStatus);
}
