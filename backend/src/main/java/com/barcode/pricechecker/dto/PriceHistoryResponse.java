package com.barcode.pricechecker.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceHistoryResponse {
    private BigDecimal price;
    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveTo;
}
