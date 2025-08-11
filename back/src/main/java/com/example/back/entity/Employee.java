package com.example.back.entity;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.YearMonth;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  // @Convert(converter = YearMonthAttributeConverter.class)
  // private YearMonth joinDate;
  @JsonFormat(pattern = "yyyy-MM")
  private YearMonth joinDate;

  @Enumerated(EnumType.STRING)
  // private Position position;     // 직급

  private Integer paidMonths;    // 납부 개월 수 (수정 가능)
  private Integer paidAmount;    // 납부 금액 (수정 가능)
  private Integer unpaidAmount;  // 미납 금액 (계산값)

  @PrePersist
  @PreUpdate
  public void calculateUnpaidAmount() {
      int positionFee = getPositionFee(position);
      int calculatedPaidMonths = (paidMonths != null) ? paidMonths : calcDefaultPaidMonths();
      int calculatedUnpaid = (positionFee * calculatedPaidMonths) - (paidAmount != null ? paidAmount : 0);
      this.unpaidAmount = Math.max(calculatedUnpaid, 0);
  }
  
  private int calcDefaultPaidMonths() {
      YearMonth now = YearMonth.now();
      return (int) (joinDate.until(now, java.time.temporal.ChronoUnit.MONTHS) + 1);
  }  

  private int getPositionFee(String position) {
    return switch (position) {
        case "수석" -> 20000;
        case "책임" -> 20000;
        case "차장" -> 15000;
        
        default -> 10000; // 사원 등 
    };
  }


}
