package com.example.shippingservice.service;

import com.example.shippingservice.repository.ShippingRepository;
import com.example.shippingservice.entity.Shipping;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShippingService {

    private final ShippingRepository shippingRepository;

    public List<Shipping> getAll() {
        return shippingRepository.findAll();
    }

    public Shipping getById(String id) {
        return shippingRepository.findById(id).orElse(null);
    }

    public Shipping create(Shipping shipping) {
        return shippingRepository.save(shipping);
    }

    public Shipping update(String id, Shipping shipping) {
        shipping.setId(id);
        return shippingRepository.save(shipping);
    }

    public void delete(String id) {
        shippingRepository.deleteById(id);
    }
}