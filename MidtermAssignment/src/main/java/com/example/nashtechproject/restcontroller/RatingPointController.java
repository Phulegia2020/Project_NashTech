package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.RatingDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.Rating;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.exception.RatingPointException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.service.ProductService;
import com.example.nashtechproject.service.RatingPointService;
import com.example.nashtechproject.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/ratings")
public class RatingPointController {
    @Autowired
    private RatingPointService ratingPointService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<RatingDTO> getAllRatings() throws RatingPointException
    {
        List<Rating> ratings = ratingPointService.retrieveRatings();
        return ratings.stream().map(this::convertToDTO).sorted(Comparator.comparing(RatingDTO::getId).reversed()).collect(Collectors.toList());
    }

    @GetMapping("/{ratingId}")
    public RatingDTO findRating(@PathVariable(name = "ratingId") Long ratingId) throws RatingPointException
    {
        if (ratingPointService.getRating(ratingId) == null)
        {
            throw new RatingPointException(ratingId);
        }
        return convertToDTO(ratingPointService.getRating(ratingId));
    }

    @PostMapping
    public RatingDTO saveCategory(@RequestBody Rating rating)
    {
        User u = userService.getUser(rating.getUser().getId());
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        Product pro = productService.getProduct(rating.getProduct().getId());
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        Rating check = ratingPointService.getRatingByUserIdAndProductId(u.getId(), pro.getId());
        if (check != null)
        {
            throw new RatingPointException(u.getId(), pro.getId());
        }
        rating.setUser(u);
        rating.setProduct(pro);
        return convertToDTO(ratingPointService.saveRating(rating));
    }

    @PutMapping("/{ratingId}")
    public RatingDTO updateCategory(@PathVariable(name = "ratingId") Long ratingId, @Valid @RequestBody Rating newRating)
    {
        Rating rating = ratingPointService.getRating(ratingId);
        if (rating == null)
        {
            throw new RatingPointException(ratingId);
        }
        User u = userService.getUser(rating.getUser().getId());
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        Product pro = productService.getProduct(rating.getProduct().getId());
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        rating.setUser(u);
        rating.setProduct(pro);
        rating.setRatingPoint(newRating.getRatingPoint());
        ratingPointService.updateRating(rating);
        return convertToDTO(rating);
    }

    @DeleteMapping("/{ratingId}")
    public HashMap<String, String> deleteCategory(@PathVariable(name = "ratingId") Long ratingId)
    {
        Rating rid = ratingPointService.getRating(ratingId);
        if (rid == null)
        {
            throw new RatingPointException(ratingId);
        }
        ratingPointService.deleteRating(ratingId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }

    private RatingDTO convertToDTO(Rating rating)
    {
        RatingDTO ratingDTO = modelMapper.map(rating, RatingDTO.class);
        ratingDTO.setProduct_id(String.valueOf(rating.getProduct().getId()));
        ratingDTO.setUser_id(String.valueOf(rating.getUser().getId()));
        return ratingDTO;
    }
}
