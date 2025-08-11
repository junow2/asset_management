package com.example.back.test;

import java.util.Date;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/test")
public class Test {

  @RequestMapping(value = "/getNow", method = RequestMethod.GET)
  public String getNow() {
    return "현재 시간은" + new Date() + "입니다.";
  }

}
