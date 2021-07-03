package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.repository.CategoryRepository;
import com.example.nashtechproject.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public void setCategoryRepository(CategoryRepository categoryRepository)
    {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> retrieveCategories()
    {
        List<Category> categories = categoryRepository.findAll();
        return categories;
    }

    public Category getCategory(Long categoryId)
    {
        Category cate = categoryRepository.findById(categoryId).get();
        return cate;
    }

    @Override
    public Category saveCategory(Category employee) {
        return categoryRepository.save(employee);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category cate = categoryRepository.findById(categoryId).get();

        categoryRepository.delete(cate);
    }

    @Override
    public void updateCategory(Category cate) {
        categoryRepository.save(cate);
    }
}
