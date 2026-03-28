package com.example.paymentservice.controller;

import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAll() {
        return paymentService.getAll();
    }

    @GetMapping("/{id}")
    public Payment getById(@PathVariable String id) {
        return paymentService.getById(id);
    }

    @PostMapping
    public Payment create(@RequestBody Payment payment) {
        return paymentService.create(payment);
    }

    @PutMapping("/{id}")
    public Payment update(@PathVariable String id, @RequestBody Payment payment) {
        return paymentService.update(id, payment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        paymentService.delete(id);
    }
}