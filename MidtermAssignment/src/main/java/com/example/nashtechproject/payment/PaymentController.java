package com.example.nashtechproject.payment;

import com.example.nashtechproject.payload.response.MessageResponse;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.base.rest.PayPalRESTException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/payment")
public class PaymentController {
    public static final String URL_PAYPAL_SUCCESS = "/success";
    public static final String URL_PAYPAL_CANCEL = "/cancel";
    private Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private PaypalService paypalService;

//    @GetMapping("/")
//    public String index(){
//        return "index";
//    }

    @PostMapping("/pay")
    public String pay(HttpServletRequest request, @RequestParam("price") double price ){
//        String cancelUrl = "http://localhost:8080/api/payment" + URL_PAYPAL_CANCEL;
        String cancelUrl = "http://localhost:3000/WebPlayStation/order";
        String successUrl = "http://localhost:8080/api/payment" + URL_PAYPAL_SUCCESS;
        try {
            Payment payment = paypalService.createPayment(
                    price,
                    "USD",
                    "paypal",
                    "sale",
                    "payment description",
                    cancelUrl,
                    successUrl);
            for(Links links : payment.getLinks()){
                if(links.getRel().equals("approval_url")){
//                    return "redirect:" + links.getHref();
                    return links.getHref();
                }
            }
        } catch (PayPalRESTException e) {
            log.error(e.getMessage());
        }
        return "redirect:/";
    }

    @GetMapping(URL_PAYPAL_CANCEL)
    public String cancelPay(){
        return "cancel";
    }

    @GetMapping(URL_PAYPAL_SUCCESS)
    public ResponseEntity<Void> successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId){
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if(payment.getState().equals("approved")){
                //return "success";
                //RedirectUrls redirectUrls = new RedirectUrls();
                //redirectUrls.setReturnUrl("http://localhost:3000/WebPlayStation");
                //System.out.println("success");
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:3000/WebPlayStation/success")).build();
            }

        }
        catch (PayPalRESTException e) {
            log.error(e.getMessage());
        }
        //return "redirect:/";
        //return;
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).location(URI.create("http://localhost:3000/WebPlayStation/404")).build();
    }
}
