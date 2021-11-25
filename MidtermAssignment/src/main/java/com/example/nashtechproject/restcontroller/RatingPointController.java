package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.RatingDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.Rating;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.entity.embedded.RateKey;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.exception.RatingPointException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.ProductService;
import com.example.nashtechproject.service.RatingPointService;
import com.example.nashtechproject.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
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
        return ratings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{userId}-{productId}")
    public RatingDTO findRating(@PathVariable(name = "userId") Long userId, @PathVariable(name = "productId") Long productId) throws RatingPointException
    {
        if (ratingPointService.getRatingByUserIdAndProductId(userId, productId) == null)
        {
            throw new ObjectNotFoundException("Could not find rating with user_id = " + userId + " and product_id = " + productId);
        }
        return convertToDTO(ratingPointService.getRatingByUserIdAndProductId(userId, productId));
    }

    @GetMapping("/product/{productId}")
    public List<RatingDTO> getRatingByProduct(@PathVariable(name = "productId") Long productId)
    {
        Product pro = productService.getProduct(productId);
        if (pro == null)
        {
            return null;
        }
        List<Rating> ratings = ratingPointService.getRatingByProduct(productId);
        return ratings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/search")
    public float getRatingByUserAndProduct(@RequestParam Long userId, @RequestParam Long productId)
    {
        Rating rating = ratingPointService.getRatingByUserIdAndProductId(userId, productId);
        if (rating == null)
        {
            return 0;
        }
        return rating.getRatingPoint();
    }

    @PostMapping
    public RatingDTO saveRating(@RequestBody RatingDTO rating)
    {
        User u = userService.getUser(Long.valueOf(rating.getUser_id()));
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        Product pro = productService.getProduct(Long.valueOf(rating.getProduct_id()));
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        Rating check = ratingPointService.getRatingByUserIdAndProductId(u.getId(), pro.getId());
        if (check != null)
        {
            throw new RatingPointException(u.getId(), pro.getId());
        }
        Rating r = convertToEntity(rating);
        return convertToDTO(ratingPointService.saveRating(r));
    }

    @PutMapping("/{userId}-{productId}")
    public RatingDTO updateRating(@PathVariable(name = "userId") Long userId, @PathVariable(name = "productId") Long productId, @Valid @RequestBody RatingDTO newRating)
    {
        Rating rating = ratingPointService.getRatingByUserIdAndProductId(userId, productId);
        if (rating == null)
        {
            throw new ObjectNotFoundException("Could not find rating with user_id = " + userId + " and product_id = " + productId);
        }
        rating.setRatingPoint(newRating.getRatingPoint());
        ratingPointService.updateRating(rating);
        return convertToDTO(rating);
    }

    @DeleteMapping("/{userId}-{productId}")
    public ResponseEntity<?> deleteRating(@PathVariable(name = "userId") Long userId, @PathVariable(name = "productId") Long productId)
    {
        Rating rid = ratingPointService.getRatingByUserIdAndProductId(userId, productId);
        if (rid == null)
        {
            throw new ObjectNotFoundException("Could not find rating with user_id = " + userId + " and product_id = " + productId);
        }
        ratingPointService.deleteRating(userId, productId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private RatingDTO convertToDTO(Rating rating)
    {
        RatingDTO ratingDTO = modelMapper.map(rating, RatingDTO.class);
        ratingDTO.setProduct_id(String.valueOf(rating.getKey().getProductId()));
        ratingDTO.setUser_id(String.valueOf(rating.getKey().getUserId()));
        return ratingDTO;
    }

    private Rating convertToEntity(RatingDTO ratingDTO)
    {
        Rating rating = modelMapper.map(ratingDTO, Rating.class);
        User u = userService.getUser(Long.valueOf(ratingDTO.getUser_id()));
        Product p = productService.getProduct(Long.valueOf(ratingDTO.getProduct_id()));
        rating.setUser(u);
        rating.setProduct(p);
        rating.setKey(new RateKey(u.getId(), p.getId()));
        return rating;
    }
}
