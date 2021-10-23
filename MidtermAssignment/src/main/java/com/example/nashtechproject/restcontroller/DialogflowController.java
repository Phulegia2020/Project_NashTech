package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.JsonGenerator;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.dialogflow.v2beta1.model.GoogleCloudDialogflowV2IntentMessage;
import com.google.api.services.dialogflow.v2beta1.model.GoogleCloudDialogflowV2IntentMessageText;
import com.google.api.services.dialogflow.v2beta1.model.GoogleCloudDialogflowV2WebhookRequest;
import com.google.api.services.dialogflow.v2beta1.model.GoogleCloudDialogflowV2WebhookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
//        List<GoogleCloudDialogflowV2IntentMessage> messages = new ArrayList<>();
        GoogleCloudDialogflowV2IntentMessage msg = new GoogleCloudDialogflowV2IntentMessage();
        GoogleCloudDialogflowV2IntentMessageText text = new GoogleCloudDialogflowV2IntentMessageText();
        List<ProductDTO> products = new ArrayList<>();
        List<String> chat = new ArrayList<>();
//        String chat = "";
//        Map<String, Object> map = new HashMap<>();
//        ObjectMapper oMapper = new ObjectMapper();

        switch (displayName)
        {
            case "Info-Intent":
            {
                //System.out.println("chatbot info");
                products = productService.getProductChatBot(request.getQueryResult().getParameters().get("product").toString());
                for (int i = 0; i < products.size(); i++)
                {
                    if (products.get(i).getQuantity() == 0)
                    {
                        chat.add("Hiện tại máy " + products.get(i).getName() + " đã hết hàng! Bạn có thể tham khảo thêm một số loại máy khác nhé.");
                    }
                    else
                    {
                        chat.add("Hiện tại máy " + products.get(i).getName() + " vẫn còn hàng bạn nhé!");
                    }
                }
                break;
            }
            case "Price-PS-Intent":
            {
                //System.out.println("chatbot-price");
                //System.out.println(request.getQueryResult().getParameters().get("product").toString());
//                for (int j = 0; j < request.getQueryResult().getParameters().get("product"))
                products = productService.getProductChatBot(request.getQueryResult().getParameters().get("product").toString());
                System.out.println(products);
                for (int i = 0; i < products.size(); i++)
                {
                    chat.add("Máy " + products.get(i).getName() + " có giá " + String.format("%,d", products.get(i).getPrice()) + " VNĐ. Nếu bạn là một người đam mê playstation thì máy " + products.get(i).getName() + " là bộ máy hợp lý trong thời điểm hiện tại và cung cấp trải nghiệm chơi game hiệu quả cho nhiều người dùng");
                    //chat = chat + "Máy " + products.get(i).getName() + " có giá " + String.format("%,d", products.get(i).getPrice()) + ", ";
                }
                //System.out.println(chat);
                break;
            }
        }

        //System.out.println(chat);
        text.setText(chat);
        msg.setText(text);

//        map = oMapper.convertValue(chat, Map.class);
//        messages.add(new GoogleCloudDialogflowV2IntentMessage().setPayload(map));
        GoogleCloudDialogflowV2WebhookResponse response = new GoogleCloudDialogflowV2WebhookResponse();
//        response.setFulfillmentMessages(messages);
        response.setFulfillmentMessages(asList(msg));

        StringWriter stringWriter = new StringWriter();
        JsonGenerator jsonGenerator = jacksonFactory.createJsonGenerator(stringWriter);
        jsonGenerator.enablePrettyPrint();
        jsonGenerator.serialize(response);
        jsonGenerator.flush();

        return stringWriter.toString();
    }
}
