package com.sebastian.backend.gymapp.backend_gestorgympro.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.Category;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.Product;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.CategoryRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.services.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category createCategory(String name) {
        // Verificar si la categoría existe
        categoryRepository.findByName(name).ifPresent(c -> {
            throw new IllegalArgumentException("La categoría ya existe");
        });
        Category category = new Category();
        category.setName(name);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + name));
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findByActiveTrue();
    }

    @Override
    public Category updateCategory(Long id, String newName) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        category.setName(newName);
        return categoryRepository.save(category);
    }

    @Override
public void deleteCategory(Long id) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

    // 1) Marcamos la categoría como inactiva
    category.setActive(false);

    // 2) Marcamos sus productos como inactivos
    for (Product p : category.getProducts()) {
        p.setActive(false);
    }

    // 3) Guardamos la categoría
    categoryRepository.save(category);
}

}


