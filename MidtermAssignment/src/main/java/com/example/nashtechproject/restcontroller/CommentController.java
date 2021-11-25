package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.CommentDTO;
import com.example.nashtechproject.entity.Comment;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.CommentService;
import com.example.nashtechproject.service.ProductService;
import com.example.nashtechproject.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<CommentDTO> getAllComments()
    {
        List<Comment> comments = commentService.retrieveComments();
        return comments.stream().map(this::convertToDTO).sorted(Comparator.comparing(CommentDTO::getId).reversed()).collect(Collectors.toList());
    }

    @GetMapping("/{commentId}")
    public CommentDTO findComment(@PathVariable(name = "commentId") Long commentId)
    {
        if (commentService.getComment(commentId) == null)
        {
            throw new ObjectNotFoundException("Could not find comment with id = " + commentId);
        }
        return convertToDTO(commentService.getComment(commentId));
    }

    @GetMapping("/product/{productId}")
    public List<CommentDTO> getCommentByProduct(@PathVariable(name = "productId") Long productId)
    {
        Product pro = productService.getProduct(productId);
        if (pro == null)
        {
            return null;
        }
        List<Comment> comments = commentService.getCommentsByProduct(productId);
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/page")
    public ResponseEntity<List<CommentDTO>> getProductsPages(ProductPage productPage)
    {
        return new ResponseEntity<>(commentService.getCommentsPage(productPage).stream().map(this::convertToDTO).collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping("/name")
    public int getCommentByProductName(@RequestParam String name)
    {
        List<Comment> comments = commentService.getCommentsByProductName(name);
        return comments.size();
    }

    @GetMapping("/namePage")
    public ResponseEntity<List<CommentDTO>> getCommentByProductNamePage(ProductPage productPage, @RequestParam String name)
    {
        return new ResponseEntity<>(commentService.getCommentsByProductNamePage(name, productPage).stream().map(this::convertToDTO).collect(Collectors.toList()), HttpStatus.OK);
    }

    @PostMapping
    public CommentDTO saveComment(@RequestBody CommentDTO commentDTO)
    {
        User u = userService.getUser(Long.valueOf(commentDTO.getUser_id()));
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        Product pro = productService.getProduct(Long.valueOf(commentDTO.getProduct_id()));
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        Comment comment = convertToEntity(commentDTO);
        comment.setDate_comment(LocalDateTime.now());
        return convertToDTO(commentService.saveComment(comment));
    }

    @PutMapping("/{commentId}")
    public CommentDTO updateComment(@PathVariable(name = "commentId") Long commentId, @RequestBody CommentDTO commentDTO)
    {
        Comment comment = commentService.getComment(commentId);
        if (comment == null)
        {
            throw new ObjectNotFoundException("Could not find comment with id = " + commentId);
        }
        comment.setContent(commentDTO.getContent().trim());
        comment.setDate_comment(LocalDateTime.now());
        commentService.updateComment(comment);
        return convertToDTO(comment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable(name = "commentId") Long commentId)
    {
        Comment comment = commentService.getComment(commentId);
        if (comment == null)
        {
            throw new ObjectNotFoundException("Could not find comment with id = " + commentId);
        }
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private CommentDTO convertToDTO(Comment comment)
    {
        CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
        commentDTO.setProduct_id(String.valueOf(comment.getProduct().getId()));
        commentDTO.setUser_id(String.valueOf(comment.getUser().getId()));
        commentDTO.setUsername(comment.getUser().getAccount());
        commentDTO.setProductImg(comment.getProduct().getUrl_image());
        commentDTO.setProductName(comment.getProduct().getName());
        return commentDTO;
    }

    private Comment convertToEntity(CommentDTO commentDTO)
    {
        Comment comment = modelMapper.map(commentDTO, Comment.class);
        User u = userService.getUser(Long.valueOf(commentDTO.getUser_id()));
        Product p = productService.getProduct(Long.valueOf(commentDTO.getProduct_id()));
        comment.setUser(u);
        comment.setProduct(p);
        return comment;
    }
}
