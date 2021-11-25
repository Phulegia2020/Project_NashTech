package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.repository.CategoryRepository;
import com.example.nashtechproject.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public List<Category> getCategoryByStatus()
    {
        List<Category> list = categoryRepository.findByStatus(STATE.SALE);
        return list;
    }

    public List<Category> getCategoriesPage(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Category> categories = categoryRepository.findByStatus(STATE.SALE, pageable).getContent();
        return categories;
    }

    public Category getCategory(Long categoryId)
    {
        Category cate = categoryRepository.findById(categoryId).get();
        return cate;
    }

    public List<Category> getCategoryByName(String name)
    {
        List<Category> list = categoryRepository.findByNameContainsAndStatus(name, STATE.SALE);
        return list;
    }

    public List<Category> getCategoryByNamePage(String name, ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Category> categories = categoryRepository.findByNameContainsAndStatus(name, STATE.SALE, pageable).getContent();
        return categories;
    }

    public boolean existByName(String name)
    {
        if (categoryRepository.existsByNameAndStatus(name, STATE.SALE))
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
