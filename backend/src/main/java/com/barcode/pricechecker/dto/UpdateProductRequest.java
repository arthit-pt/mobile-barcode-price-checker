package com.barcode.pricechecker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String imageUrl;

    @NotNull(message = "Status is required")
    private Boolean status;
}
