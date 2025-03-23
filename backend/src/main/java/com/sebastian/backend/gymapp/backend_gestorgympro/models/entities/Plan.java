package com.sebastian.backend.gymapp.backend_gestorgympro.models.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String name; // Ejemplo: "Mensual", "Trimestral", "Anual"

    private BigDecimal price; // Precio del plan

    private String description;

    @Column(nullable = true)
    private Integer discount; // Porcentaje de descuento

    // Un Plan tiene muchos Payment. Un Payment pertenece a un Plan.
    @OneToMany(mappedBy = "plan")
    @JsonIgnore
    private List<Payment> payments;
    
    // Relación uno a muchos con Subscription
    @OneToMany(mappedBy = "plan")
    @JsonIgnore 
    private List<Subscription> subscriptions;

        // Relación Many-to-Many con PersonalTrainer
        @ManyToMany
        @JoinTable(
            name = "plans_trainers",
            joinColumns = @JoinColumn(name = "plan_id"),
            inverseJoinColumns = @JoinColumn(name = "trainer_id")
        )
        @JsonIgnore // Evita recursión infinita al serializar
        private List<PersonalTrainer> includedTrainers;


        @Column(name = "active", nullable = false)
        private boolean active = true;  // true => disponible, false => inactivo/archivado
    


        @Column(name = "version_number", nullable = false)
        private int versionNumber = 1; // Empezamos en 1

    
        @Column(name = "discount_reason", nullable = true)
        private String discountReason; 

        @Column(name = "duration_months")
        private Integer durationMonths;

    public Integer getDurationMonths() {
            return durationMonths;
        }

        public void setDurationMonths(Integer durationMonths) {
            this.durationMonths = durationMonths;
        }

    public String getDiscountReason() {
            return discountReason;
        }

        public void setDiscountReason(String discountReason) {
            this.discountReason = discountReason;
        }

    public List<PersonalTrainer> getIncludedTrainers() {
            return includedTrainers;
        }

        public void setIncludedTrainers(List<PersonalTrainer> includedTrainers) {
            this.includedTrainers = includedTrainers;
        }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public  BigDecimal getPrice() {
        return price;
    }

    public void setPrice( BigDecimal price) {
        this.price = price;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }

    public List<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(int versionNumber) {
        this.versionNumber = versionNumber;
    }
    
}
