package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProductId(Long productId);

    List<Comment> findByProductNameContains(String name);

    Page<Comment> findByProductNameContains(String name, Pageable pageable);
}
