package com.sebastian.backend.gymapp.backend_gestorgympro.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.TrainerAvailability;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TrainerAvailabilityRepository extends JpaRepository<TrainerAvailability, Long> {

    List<TrainerAvailability> findByTrainerId(Long trainerId);

    @Query("SELECT t FROM TrainerAvailability t WHERE t.trainer.id = :trainerId AND t.day BETWEEN :startDay AND :endDay")
    List<TrainerAvailability> findByTrainerIdAndDayBetween(@Param("trainerId") Long trainerId,
                                                           @Param("startDay") LocalDate startDay,
                                                           @Param("endDay") LocalDate endDay);

                                                           @Query("SELECT COUNT(t) > 0 FROM TrainerAvailability t WHERE t.trainer.id = :trainerId AND t.day = :day AND t.startTime <= :endTime AND t.endTime >= :startTime")
boolean isTrainerAvailable(@Param("trainerId") Long trainerId,
                           @Param("day") LocalDate day,
                           @Param("startTime") LocalTime startTime,
                           @Param("endTime") LocalTime endTime);

        // En TrainerAvailabilityRepository
@Query("SELECT t FROM TrainerAvailability t " +
"WHERE t.trainer.id = :trainerId AND t.day = :day")
List<TrainerAvailability> findByTrainerIdAndDay(@Param("trainerId") Long trainerId,
                                         @Param("day") LocalDate day);
            
}
