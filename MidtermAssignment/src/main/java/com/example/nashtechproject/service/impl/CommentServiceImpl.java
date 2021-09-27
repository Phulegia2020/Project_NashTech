package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.CommentDTO;
import com.example.nashtechproject.entity.Comment;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.CommentRepository;
import com.example.nashtechproject.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public void setCommentRepository(CommentRepository commentRepository)
    {
        this.commentRepository = commentRepository;
    }

    public List<Comment> retrieveComments()
    {
        List<Comment> comments = commentRepository.findAll();
        return comments;
    }

    public Comment getComment(Long id)
    {
        Comment com = commentRepository.findById(id).get();
        return com;
    }

    public List<Comment> getCommentsByProduct(Long productId)
    {
        List<Comment> comments = commentRepository.findByProductId(productId);
        return comments;
    }

    public List<Comment> getCommentsPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Comment> list = commentRepository.findAll(pageable).getContent();
        return list;
    }

    public List<Comment> getCommentsByProductName(String productName)
    {
        List<Comment> comments = commentRepository.findByProductNameContains(productName);
        return comments;
    }

    public List<Comment> getCommentsByProductNamePage(String productName, ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Comment> list = commentRepository.findByProductNameContains(productName, pageable).getContent();
        return list;
    }

    @Override
    public Comment saveComment(Comment com) {
        return commentRepository.save(com);
    }

    @Override
    public void deleteComment(Long id) {
        Comment com = commentRepository.findById(id).get();

        commentRepository.delete(com);
    }

    @Override
    public void updateComment(Comment rat) {
        commentRepository.save(rat);
    }
}
