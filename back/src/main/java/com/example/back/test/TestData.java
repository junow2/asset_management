package com.example.back.test;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/testdata")
public class TestData {

  @RequestMapping(value = "/getNow", method = RequestMethod.GET)
  public String getNow() {
    return "스프링부트 연결확인";
  }

}
