package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.exception.CategoryException;
import com.example.nashtechproject.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories()
    {
        List<Category> categories = categoryService.retrieveCategories();
        return categories;
    }

    @GetMapping("/{categoryId}")
    public Category findCategory(@PathVariable Long categoryId)
    {
        Category cate = categoryService.getCategory(categoryId);
        if (cate == null)
        {
            throw new CategoryException(categoryId);
        }
        return categoryService.getCategory(categoryId);
    }

    @PostMapping
    public Category saveCategory(@RequestBody Category category)
    {
        List<Category> categories = categoryService.retrieveCategories();
//        for (Category emp:categories) {
//            if (category.getName().equals(emp.getName()))
//            {
//                throw new CategoryException(category.getName());
//            }
//        }
        return categoryService.saveCategory(category);
    }

    @PutMapping("/{categoryId}")
    public Category updateCategory(@PathVariable(name = "categoryId") Long categoryId, @Validated @RequestBody Category categoryDetails)
    {
        Category category = categoryService.getCategory(categoryId);
        if (category == null)
        {
            throw new CategoryException(categoryId);
        }
        else
        {
            category.setName(categoryDetails.getName());
            category.setDescription(categoryDetails.getDescription());
            categoryService.updateCategory(category);
        }
        return category;
    }

    @DeleteMapping("/{categoryId}")
    public HashMap<String, String> deleteCategory(@PathVariable(name = "categoryId") Long categoryId)
    {
        Category category = categoryService.getCategory(categoryId);
        if (category == null)
        {
            throw new CategoryException(categoryId);
        }
        categoryService.deleteCategory(categoryId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }
}
