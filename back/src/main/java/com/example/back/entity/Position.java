package com.example.back.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Position {
    SUSEOK("수석", 20000),
    CHAEKIM("책임", 20000),
    CHAJANG("차장", 15000),
    SAWON("사원", 10000);

    private final String koreanName;
    private final int fee;
}