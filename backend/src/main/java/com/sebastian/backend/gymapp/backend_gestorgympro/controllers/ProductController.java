package com.sebastian.backend.gymapp.backend_gestorgympro.controllers;


import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.ProductDto;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.ProductFilterDto;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.Category;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.sebastian.backend.gymapp.backend_gestorgympro.services.ProductService;


import com.sebastian.backend.gymapp.backend_gestorgympro.services.CloudinaryService;


import jakarta.validation.Valid;

import com.sebastian.backend.gymapp.backend_gestorgympro.services.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;


import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/store")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productoService;

    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> createProduct(
        @Valid @ModelAttribute ProductDto dto, 
        BindingResult result,
        @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        if(result.hasErrors()){
            return validation(result);
        }
        
        try {
            // Se delega la creación del producto al servicio
            Product createdProduct = productService.createProduct(dto, image);
            return ResponseEntity.ok(createdProduct);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error interno al crear producto: " + ex.getMessage());
        }
    }
    
    
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }


      @PutMapping(value = "products/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @ModelAttribute ProductDto dto,
            BindingResult result,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        
        if (result.hasFieldErrors()) {
            return validation(result);
        }
        
        // En el servicio, además del DTO, se enviará el archivo de imagen para manejarlo
        Optional<Product> updatedProduct = productService.updateProduct(id, dto, image);
        if (updatedProduct.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedProduct.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    private ResponseEntity<?> validation(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(err -> {
            errors.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errors);
    }


    

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/products/page/{page}")
    public ResponseEntity<Page<Product>> getProductsPage(
        @PathVariable int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(required = false) String category
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;
    
        if (category != null && !category.isEmpty()) {
            Category cat = categoryService.getCategoryByName(category);
            productPage = productService.findByCategory(cat, pageable);  // solo activos
        } else {
            productPage = productService.findAll(pageable);              // solo activos
        }
        return ResponseEntity.ok(productPage);
    }
    
    

    // ProductController.java
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("term") String term) {
        // Por simplicidad, filtramos solo por nombre. Ajusta según tu lógica.
        List<Product> results = productService.searchProducts(term);
        return ResponseEntity.ok(results);
    }

    // ProductController.java



    
    @GetMapping("/products/brands")
    public ResponseEntity<List<String>> getDistinctBrands() {
        List<String> brands = productService.getDistinctBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/products/flavors")
    public ResponseEntity<List<String>> getDistinctFlavors() {
        List<String> flavors = productService.getDistinctFlavors();
        return ResponseEntity.ok(flavors);
    }

    // ProductController.java

    @GetMapping("/products/search2")
    public ResponseEntity<Page<Product>> searchProducts2(
        ProductFilterDto filter,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "price_asc") String sortBy
    ) {
        System.out.println("Filtros recibidos del frontend: " + filter);
        System.out.println("Ordenamiento: " + sortBy);
    
        Page<Product> productPage = productService.advancedSearch(filter, page, size, sortBy);
        return ResponseEntity.ok(productPage);
    }
    


    
            @GetMapping("/products/offers")
            public ResponseEntity<List<Product>> getDiscountedProducts() {
                List<Product> discounted = productService.getActiveDiscountProducts();
                return ResponseEntity.ok(discounted);
            }
    
     
            @GetMapping("/products/most-sold")
            public ResponseEntity<List<Product>> getMostSoldProducts() {
                List<Product> mostSoldProducts = productService.getMostSoldProducts();
                return ResponseEntity.ok(mostSoldProducts);
            }
            

            @GetMapping("/products")
public ResponseEntity<List<Product>> getAllProductsController() {
    List<Product> productos = productService.getAllProducts();
    return ResponseEntity.ok(productos);
}



}
