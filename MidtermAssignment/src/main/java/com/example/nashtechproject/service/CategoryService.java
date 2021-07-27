package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface CategoryService {
    public List<Category> retrieveCategories();

    public List<Category> getCategoriesPage(ProductPage productPage);

    public Category getCategory(Long categoryId);

    public Category saveCategory(Category category);

    public void deleteCategory(Long categoryId);

    public void updateCategory(Category category);

    public boolean existByName(String name);
}
