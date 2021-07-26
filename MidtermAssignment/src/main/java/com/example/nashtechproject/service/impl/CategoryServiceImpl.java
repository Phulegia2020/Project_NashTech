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

    public boolean existByName(String name)
    {
        if (categoryRepository.existsByName(name))
        {
            return true;
        }
        return false;
    }

    @Override
    public Category saveCategory(Category cate) {
        return categoryRepository.save(cate);
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
