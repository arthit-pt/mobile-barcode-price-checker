package com.barcode.pricechecker.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String barcode;
    private String name;
    private BigDecimal price;
    private String unit;
    private String imageUrl;
    private Boolean status;
}
