package com.example.nashtechproject.restcontroller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/public")
public class PublicController {

	@RequestMapping({ "/hello" })
	public String firstPage() {
		return "Hello World";
	}

}