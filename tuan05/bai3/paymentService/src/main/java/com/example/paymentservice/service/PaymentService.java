package com.example.paymentservice.service;

import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    public Payment getById(String id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public Payment create(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment update(String id, Payment payment) {
        payment.setId(id);
        return paymentRepository.save(payment);
    }

    public void delete(String id) {
        paymentRepository.deleteById(id);
    }
}