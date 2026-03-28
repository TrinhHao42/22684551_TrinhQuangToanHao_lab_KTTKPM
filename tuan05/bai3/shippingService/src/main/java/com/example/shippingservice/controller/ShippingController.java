package com.example.shippingservice.controller;

import com.example.shippingservice.entity.Shipping;
import com.example.shippingservice.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shippings")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @GetMapping
    public List<Shipping> getAll() {
        return shippingService.getAll();
    }

    @GetMapping("/{id}")
    public Shipping getById(@PathVariable String id) {
        return shippingService.getById(id);
    }

    @PostMapping
    public Shipping create(@RequestBody Shipping shipping) {
        return shippingService.create(shipping);
    }

    @PutMapping("/{id}")
    public Shipping update(@PathVariable String id, @RequestBody Shipping shipping) {
        return shippingService.update(id, shipping);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        shippingService.delete(id);
    }
}