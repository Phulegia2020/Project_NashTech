package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.BillStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/billstatuses")
public class BillStatusController {
    @Autowired
    private BillStatusService billStatusService;

    @GetMapping
    public List<BillStatus> getAllBillStatuses()
    {
        List<BillStatus> bs = billStatusService.retrieveBillStatuses();
        return bs.stream().sorted(Comparator.comparing(BillStatus::getId)).collect(Collectors.toList());
    }

    @GetMapping("/{billStatusId}")
    public BillStatus findBillStatus(@PathVariable Long billStatusId)
    {
        BillStatus bs = billStatusService.getBillStatus(billStatusId);
        if (bs == null)
        {
            throw new BillStatusException(billStatusId);
        }
        return billStatusService.getBillStatus(billStatusId);
    }

    @PostMapping
    public BillStatus saveBillStatus(@RequestBody BillStatus billStatus)
    {
        return billStatusService.saveBillStatus(billStatus);
    }

    @PutMapping("/{billStatusId}")
    public BillStatus updateBillStatus(@PathVariable(name = "billStatusId") Long billStatusId, @Valid @RequestBody BillStatus billStatusDetails)
    {
        BillStatus billStatus = billStatusService.getBillStatus(billStatusId);
        if (billStatus == null)
        {
            throw new BillStatusException(billStatusId);
        }
        else
        {
            billStatus.setDescription(billStatusDetails.getDescription());
            billStatusService.updateBillStatus(billStatus);
        }
        return billStatus;
    }

    @DeleteMapping("/{billStatusId}")
    public ResponseEntity<?> deleteBillStatus(@PathVariable(name = "billStatusId") Long billStatusId)
    {
        BillStatus billStatus = billStatusService.getBillStatus(billStatusId);
        if (billStatus == null)
        {
            throw new BillStatusException(billStatusId);
        }
        billStatusService.deleteBillStatus(billStatusId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
