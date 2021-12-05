package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.JsonGenerator;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.dialogflow.v2beta1.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.StringWriter;
import java.util.*;

import static java.util.Arrays.asList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class DialogflowController {
    @Autowired
    private final JacksonFactory jacksonFactory;

    @Autowired
    private ProductService productService;

    public DialogflowController(JacksonFactory jacksonFactory) {
        this.jacksonFactory = jacksonFactory;
    }

    @PostMapping(value = "/dialogflow-webhook", produces = {MediaType.APPLICATION_JSON_VALUE})
    public String webhook(@RequestBody String rawData, HttpServletRequest rq) throws IOException
    {
        GoogleCloudDialogflowV2WebhookRequest request = jacksonFactory
                .createJsonParser(rawData)
                .parse(GoogleCloudDialogflowV2WebhookRequest.class);

        String displayName = request.getQueryResult().getIntent().getDisplayName();
        GoogleCloudDialogflowV2IntentMessage msg = new GoogleCloudDialogflowV2IntentMessage();
        GoogleCloudDialogflowV2IntentMessageText text = new GoogleCloudDialogflowV2IntentMessageText();
        ProductDTO products;
        List<String> chat = new ArrayList<>();

        switch (displayName)
        {
            case "Info-Intent":
            {
                if (request.getQueryResult().getParameters().get("product").toString().equals("PS"))
                {
                    chat.add("Hiện tại cửa hàng chưa kinh doanh máy này. Bạn có thể tham khảo về máy Playstation 4 và Playstation 5 tại shop !");
                }
                else
                {
                    products = productService.getProductChatBot(request.getQueryResult().getParameters().get("product").toString());
                    if (products == null)
                    {
                        chat.add("Hiện tại cửa hàng chưa kinh doanh máy này. Bạn có thể tham khảo về máy Playstation 4 và Playstation 5 tại shop !");
                    }
                    else
                    {
                        if (products.getQuantity() > 0)
                        {
                            chat.add("Hiện tại máy " + products.getName() + " vẫn còn hàng bạn nhé!");
                        }
                        else
                        {
                            chat.add("Hiện tại máy " + products.getName() + " đã hết hàng! Bạn có thể tham khảo thêm một số loại máy khác nhé.");
                        }
                    }
                }
                break;
            }
            case "Price-PS-Intent":
            {
                if (request.getQueryResult().getParameters().get("product").toString().equals("PS"))
                {
                    chat.add("Hiện tại cửa hàng chưa kinh doanh máy này. Bạn có thể tham khảo về máy Playstation 4 và Playstation 5 tại shop !");
                }
                else {
                    products = productService.getProductChatBot(request.getQueryResult().getParameters().get("product").toString());
                    if (products == null) {
                        chat.add("Hiện tại cửa hàng chưa kinh doanh máy này. Bạn có thể tham khảo về máy Playstation 4 và Playstation 5 tại shop !");
                    } else {
                        chat.add("Máy " + products.getName() + " có giá " + String.format("%,d", products.getPrice()) + " VNĐ \uD83D\uDCB8. Nếu bạn là một người đam mê playstation thì máy " + products.getName() + " là bộ máy hợp lý trong thời điểm hiện tại và cung cấp trải nghiệm chơi game hiệu quả cho nhiều người dùng");
                    }
                }
                break;
            }
        }

        text.setText(chat);
        msg.setText(text);
        GoogleCloudDialogflowV2WebhookResponse response = new GoogleCloudDialogflowV2WebhookResponse();
        response.setFulfillmentMessages(asList(msg));

        StringWriter stringWriter = new StringWriter();
        JsonGenerator jsonGenerator = jacksonFactory.createJsonGenerator(stringWriter);
        jsonGenerator.enablePrettyPrint();
        jsonGenerator.serialize(response);
        jsonGenerator.flush();

        return stringWriter.toString();
    }
}
