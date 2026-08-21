package com.barcode.pricechecker.service;

import com.barcode.pricechecker.dto.*;
import com.barcode.pricechecker.entity.*;
import com.barcode.pricechecker.exception.*;
import com.barcode.pricechecker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;

    public ProductResponse getProductByBarcode(String barcode) {
        validateBarcode(barcode);

        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ProductNotFoundException(barcode));

        BigDecimal currentPrice = productPriceRepository.findCurrentPrice(product.getId())
                .map(ProductPrice::getPrice)
                .orElse(BigDecimal.ZERO);

        return ProductResponse.builder()
                .id(product.getId())
                .barcode(product.getBarcode())
                .name(product.getName())
                .price(currentPrice)
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .build();
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        if (productRepository.existsByBarcode(request.getBarcode())) {
            throw new DuplicateBarcodeException(request.getBarcode());
        }

        Product product = Product.builder()
                .barcode(request.getBarcode())
                .name(request.getName())
                .unit(request.getUnit())
                .imageUrl(request.getImageUrl())
                .status(true)
                .build();

        product = productRepository.save(product);

        // Create initial price
        ProductPrice price = ProductPrice.builder()
                .product(product)
                .price(request.getPrice())
                .effectiveFrom(LocalDateTime.now())
                .build();

        productPriceRepository.save(price);

        return ProductResponse.builder()
                .id(product.getId())
                .barcode(product.getBarcode())
                .name(product.getName())
                .price(request.getPrice())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .build();
    }

    @Transactional
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(String.valueOf(id)));

        product.setName(request.getName());
        product.setUnit(request.getUnit());
        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());

        product = productRepository.save(product);

        BigDecimal currentPrice = productPriceRepository.findCurrentPrice(product.getId())
                .map(ProductPrice::getPrice)
                .orElse(BigDecimal.ZERO);

        return ProductResponse.builder()
                .id(product.getId())
                .barcode(product.getBarcode())
                .name(product.getName())
                .price(currentPrice)
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .build();
    }

    @Transactional
    public void updatePrice(Long productId, UpdatePriceRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(String.valueOf(productId)));

        // Close current price
        productPriceRepository.findCurrentPrice(productId)
                .ifPresent(currentPrice -> {
                    currentPrice.setEffectiveTo(LocalDateTime.now());
                    productPriceRepository.save(currentPrice);
                });

        // Create new price
        ProductPrice newPrice = ProductPrice.builder()
                .product(product)
                .price(request.getPrice())
                .effectiveFrom(LocalDateTime.now())
                .build();

        productPriceRepository.save(newPrice);
    }

    public List<PriceHistoryResponse> getPriceHistory(Long productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(String.valueOf(productId)));

        return productPriceRepository.findByProductIdOrderByEffectiveFromDesc(productId)
                .stream()
                .map(pp -> PriceHistoryResponse.builder()
                        .price(pp.getPrice())
                        .effectiveFrom(pp.getEffectiveFrom())
                        .effectiveTo(pp.getEffectiveTo())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> {
                    BigDecimal currentPrice = productPriceRepository.findCurrentPrice(product.getId())
                            .map(ProductPrice::getPrice)
                            .orElse(BigDecimal.ZERO);

                    return ProductResponse.builder()
                            .id(product.getId())
                            .barcode(product.getBarcode())
                            .name(product.getName())
                            .price(currentPrice)
                            .unit(product.getUnit())
                            .imageUrl(product.getImageUrl())
                            .status(product.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private void validateBarcode(String barcode) {
        if (barcode == null || barcode.isBlank()) {
            throw new InvalidBarcodeException("Barcode is required");
        }
        if (!barcode.matches("^[0-9]{8,20}$")) {
            throw new InvalidBarcodeException("Barcode must be 8-20 numeric characters");
        }
    }
}
