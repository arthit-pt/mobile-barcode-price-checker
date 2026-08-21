package com.barcode.pricechecker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {

    @NotBlank(message = "Barcode is required")
    @Size(min = 8, max = 20, message = "Barcode must be between 8 and 20 characters")
    private String barcode;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String imageUrl;

    @NotNull(message = "Initial price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;
}
