package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.exception.CategoryException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.CategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("api/categories")
@Api(tags = "Category Rest Controller")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @ApiOperation(value = "Get all category")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public List<Category> getAllCategories()
    {
        List<Category> categories = categoryService.getCategoryByStatus();
        return categories.stream().sorted(Comparator.comparingLong(Category::getId)).collect(Collectors.toList());
    }

    @GetMapping("/page")
    @ApiOperation(value = "Get all category By Page")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<Category>> getCategoriesPages(ProductPage productPage)
    {
        return new ResponseEntity<>(categoryService.getCategoriesPage(productPage), HttpStatus.OK);
    }

    @GetMapping("/{categoryId}")
    @ApiOperation(value = "Get Category By Id")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public Category findCategory(@PathVariable Long categoryId)
    {
        Category cate = categoryService.getCategory(categoryId);
        if (cate == null)
        {
            throw new CategoryException(categoryId);
        }
        return categoryService.getCategory(categoryId);
    }

    @GetMapping("/name")
    public int getCategoryByName(@RequestParam String name)
    {
        List<Category> categories = categoryService.getCategoryByName(name);
        return categories.size();
    }

    @GetMapping("/namePage")
    public ResponseEntity<List<Category>> getCategoryByNamePages(ProductPage productPage, @RequestParam String name)
    {
        return new ResponseEntity<>(categoryService.getCategoryByNamePage(name, productPage), HttpStatus.OK);
    }

    @PostMapping
    @ApiOperation(value = "Create Category")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public Category saveCategory(@RequestBody Category category)
    {
        if (categoryService.existByName(category.getName()))
        {
            throw new CategoryException(category.getName());
        }
        category.setStatus(STATE.SALE);
        return categoryService.saveCategory(category);
    }

    @PutMapping("/{categoryId}")
    @ApiOperation(value = "Update Category")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public Category updateCategory(@PathVariable(name = "categoryId") Long categoryId, @Valid @RequestBody Category categoryDetails)
    {
        Category category = categoryService.getCategory(categoryId);
        if (category == null)
        {
            throw new CategoryException(categoryId);
        }
        else
        {
            category.setName(categoryDetails.getName().trim());
            category.setDescription(categoryDetails.getDescription().trim());
            categoryService.updateCategory(category);
        }
        return category;
    }

    @DeleteMapping("/{categoryId}")
    @ApiOperation(value = "Delete Category")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<?> deleteCategory(@PathVariable(name = "categoryId") Long categoryId)
    {
        Category category = categoryService.getCategory(categoryId);
        if (category == null)
        {
            throw new CategoryException(categoryId);
        }
        category.setStatus(STATE.STOP);
        categoryService.updateCategory(category);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
