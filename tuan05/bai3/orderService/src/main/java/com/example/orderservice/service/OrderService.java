package com.example.orderservice.service;

import com.example.orderservice.entity.Order;
import com.example.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order getById(String id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order create(Order order) {
        return orderRepository.save(order);
    }

    public Order update(String id, Order order) {
        order.setId(id);
        return orderRepository.save(order);
    }

    public void delete(String id) {
        orderRepository.deleteById(id);
    }
}