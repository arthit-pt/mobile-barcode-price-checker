package com.barcode.pricechecker.repository;

import com.barcode.pricechecker.entity.ProductPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {

    @Query("SELECT pp FROM ProductPrice pp WHERE pp.product.id = :productId AND pp.effectiveTo IS NULL ORDER BY pp.effectiveFrom DESC")
    Optional<ProductPrice> findCurrentPrice(@Param("productId") Long productId);

    @Query("SELECT pp FROM ProductPrice pp WHERE pp.product.id = :productId ORDER BY pp.effectiveFrom DESC")
    List<ProductPrice> findByProductIdOrderByEffectiveFromDesc(@Param("productId") Long productId);
}
