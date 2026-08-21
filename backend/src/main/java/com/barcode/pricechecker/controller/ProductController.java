package com.barcode.pricechecker.controller;

import com.barcode.pricechecker.dto.*;
import com.barcode.pricechecker.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Public: Get product by barcode
    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ProductResponse> getProductByBarcode(@PathVariable String barcode) {
        ProductResponse product = productService.getProductByBarcode(barcode);
        return ResponseEntity.ok(product);
    }

    // Admin: Get all products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Admin: Create product
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    // Admin: Update product
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    // Admin: Update product price
    @PostMapping("/{id}/prices")
    public ResponseEntity<Void> updatePrice(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePriceRequest request) {
        productService.updatePrice(id, request);
        return ResponseEntity.ok().build();
    }

    // Admin: Get price history
    @GetMapping("/{id}/prices")
    public ResponseEntity<List<PriceHistoryResponse>> getPriceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getPriceHistory(id));
    }
}
