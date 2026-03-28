package com.example.shippingservice.repository;

import com.example.shippingservice.entity.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingRepository extends JpaRepository<Shipping, String> {
}