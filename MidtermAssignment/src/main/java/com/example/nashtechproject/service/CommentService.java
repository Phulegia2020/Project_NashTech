package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Comment;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface CommentService {
    public List<Comment> retrieveComments();

    public Comment getComment(Long id);

    public List<Comment> getCommentsByProduct(Long productId);

    public List<Comment> getCommentsPage(ProductPage productPage);

    public List<Comment> getCommentsByProductName(String productName);

    public List<Comment> getCommentsByProductNamePage(String productName, ProductPage productPage);

    public Comment saveComment(Comment comment);

    public void deleteComment(Long id);

    public void updateComment(Comment comment);
}
