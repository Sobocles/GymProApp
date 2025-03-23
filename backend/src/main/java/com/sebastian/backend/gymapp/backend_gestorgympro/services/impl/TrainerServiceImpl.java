package com.sebastian.backend.gymapp.backend_gestorgympro.services.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.ActiveClientInfoDTO;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.BodyMeasurementDto;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.PersonalTrainerDto;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.TrainerAssignmentRequest;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.TrainerUpdateRequest;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.UserDto;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.dto.mappear.DtoMapperUser;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.BodyMeasurement;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.PersonalTrainer;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.PersonalTrainerSubscription;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.Role;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.Subscription;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.TrainerClient;
import com.sebastian.backend.gymapp.backend_gestorgympro.models.entities.User;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.BodyMeasurementRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.BookingRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.PersonalTrainerRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.RoleRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.TrainerAvailabilityRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.TrainerClientRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.repositories.UserRepository;
import com.sebastian.backend.gymapp.backend_gestorgympro.services.CloudinaryService;
import com.sebastian.backend.gymapp.backend_gestorgympro.services.PersonalTrainerSubscriptionService;
import com.sebastian.backend.gymapp.backend_gestorgympro.services.SubscriptionService;
import com.sebastian.backend.gymapp.backend_gestorgympro.services.TrainerService;
import org.springframework.web.multipart.MultipartFile;



import jakarta.persistence.EntityNotFoundException;

@Service
public class TrainerServiceImpl implements TrainerService{
   @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PersonalTrainerRepository personalTrainerRepository;

    @Autowired
    private TrainerClientRepository trainerClientRepository;


    @Autowired
    private PersonalTrainerSubscriptionService personalTrainerSubscriptionService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private BodyMeasurementRepository bodyMeasurementRepository;

    @Autowired
    private BookingRepository bookingRepository;


    @Autowired
    private TrainerAvailabilityRepository trainerAvailabilityRepository;

     @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public void assignTrainerRoleWithFile(Long userId,
                                          TrainerAssignmentRequest request,
                                          MultipartFile certificationFile) throws IOException {
    
        // (1) Verificar si el usuario existe
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Usuario no encontrado con ID: " + userId
            ));
    
        // (2) Obtener el rol "ROLE_TRAINER"
        Role trainerRole = roleRepository.findByName("ROLE_TRAINER")
            .orElseThrow(() -> new IllegalArgumentException("Rol 'ROLE_TRAINER' no existe"));
    
        // *** SECCIÓN CLAVE: forzar a que quede solo el rol de entrenador ***
        user.getRoles().clear();              // Eliminamos todos los roles actuales (incluyendo ROLE_USER, si existe)
        user.getRoles().add(trainerRole);     // Agregamos únicamente ROLE_TRAINER
        userRepository.save(user);
        // *** FIN SECCIÓN CLAVE ***
    
        // (3) Verificar si ya existe un PersonalTrainer para este userId
        if (personalTrainerRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException(
                "Este usuario ya está registrado como PersonalTrainer."
            );
        }
    
        // (4) Crear la entidad PersonalTrainer con los datos del request
        PersonalTrainer pt = new PersonalTrainer();
        pt.setUser(user);
        pt.setSpecialization(request.getSpecialization());
        pt.setExperienceYears(request.getExperienceYears());
        pt.setAvailability(request.getAvailability());
        pt.setMonthlyFee(request.getMonthlyFee());
        pt.setTitle(request.getTitle());
        pt.setStudies(request.getStudies());
        pt.setCertifications(request.getCertifications());
        pt.setDescription(request.getDescription());
        pt.setInstagramUrl(request.getInstagramUrl());
        pt.setWhatsappNumber(request.getWhatsappNumber());
    
        // (5) Subir archivo a Cloudinary (opcional) y guardar la URL
        if (certificationFile != null && !certificationFile.isEmpty()) {
            String fileUrl = cloudinaryService.uploadFile(certificationFile);
            pt.setCertificationFileUrl(fileUrl);
        }
    
        // (6) Guardar PersonalTrainer
        personalTrainerRepository.save(pt);
    }
    
        



        @Override
        @Transactional
        public void addClientToTrainer(Long trainerId, Long clientId) {
            // Recuperar el PersonalTrainer por su ID
            PersonalTrainer trainer = personalTrainerRepository.findById(trainerId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + trainerId));
        
            // Recuperar el cliente por su ID
            User client = userRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID: " + clientId));
        
            // Verificar que el entrenador tiene el rol 'ROLE_TRAINER'
            boolean isTrainer = trainer.getUser().getRoles().stream()
                    .anyMatch(role -> role.getName().equals("ROLE_TRAINER"));
        
            if (!isTrainer) {
                throw new IllegalArgumentException("El usuario no es un entrenador");
            }
        
            // Verificar si ya existe la relación
            if (trainerClientRepository.existsByTrainerIdAndClientId(trainerId, clientId)) {
                throw new IllegalArgumentException("El cliente ya está asignado a este entrenador");
            }
        
            // Crear y guardar la relación
            TrainerClient trainerClient = new TrainerClient();
            trainerClient.setTrainer(trainer); // Ahora 'trainer' es un PersonalTrainer
            trainerClient.setClient(client);
        
            trainerClientRepository.save(trainerClient);
        }
        
        
        

@Override
@Transactional(readOnly = true)
public List<UserDto> getAssignedClients(Long trainerId) {
    List<TrainerClient> trainerClients = trainerClientRepository.findByTrainerId(trainerId);
    List<UserDto> clients = trainerClients.stream()
        .map(tc -> DtoMapperUser.builder().setUser(tc.getClient()).build())
        .filter(clientDto -> {
            Long clientId = clientDto.getId();
            // Verificar si el cliente tiene suscripción activa con este entrenador
            boolean hasTrainerOnly = personalTrainerSubscriptionService.hasActiveTrainerSubscription(clientId, trainerId);
            // Verificar si el cliente tiene un plan activo que incluya al entrenador
            boolean hasPlanWithTrainer = subscriptionService.hasActivePlanWithTrainer(clientId, trainerId);
            return hasTrainerOnly || hasPlanWithTrainer;
        })
        .collect(Collectors.toList());
    return clients;
}



    @Override
    @Transactional(readOnly = true)
    public List<PersonalTrainerDto> getAvailableTrainers() {
        List<PersonalTrainer> trainers = personalTrainerRepository.findByAvailability(true);
        return trainers.stream()
            .map(trainer -> {
                User user = trainer.getUser();
                return new PersonalTrainerDto(
                    trainer.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    trainer.getSpecialization(),
                    trainer.getExperienceYears(),
                    trainer.getAvailability(),
                    user.getProfileImageUrl(),
                    trainer.getTitle(),
                    trainer.getStudies(),
                    trainer.getCertifications(),
                    trainer.getDescription(),
                    trainer.getMonthlyFee(),
                    trainer.getInstagramUrl(),     // nuevo
                    trainer.getWhatsappNumber(),   // nuevo
                    trainer.getCertificationFileUrl() // nuevo
                );
            })
            .collect(Collectors.toList());
    }

    @Override
@Transactional
public void updateTrainerDetails(String email, TrainerUpdateRequest request) {
    User user = userRepository.findByEmailAndActiveTrue(email)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

    // Verificar si existe un registro de PersonalTrainer para este usuario
    PersonalTrainer pt = personalTrainerRepository.findByUserId(user.getId())
        .orElseThrow(() -> new IllegalArgumentException("Este usuario no está registrado como entrenador"));

    // Actualizar campos del entrenador
    if (request.getTitle() != null) pt.setTitle(request.getTitle());
    if (request.getStudies() != null) pt.setStudies(request.getStudies());
    if (request.getCertifications() != null) pt.setCertifications(request.getCertifications());
    if (request.getDescription() != null) pt.setDescription(request.getDescription());
    if (request.getMonthlyFee() != null) pt.setMonthlyFee(request.getMonthlyFee());

    personalTrainerRepository.save(pt);
}

@Override
public Optional<PersonalTrainer> findByUserId(Long userId) {
    return personalTrainerRepository.findByUserId(userId);
}

@Override
@Transactional(readOnly = true)
public Optional<PersonalTrainer> findPersonalTrainerById(Long trainerId) {
    return personalTrainerRepository.findById(trainerId);
}

@Override
@Transactional
public void addBodyMeasurement(Long trainerId, Long clientId, BodyMeasurementDto measurementDto) {
    User client = userRepository.findById(clientId)
        .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
    User trainer = userRepository.findById(trainerId)
        .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado"));

    BodyMeasurement measurement = new BodyMeasurement();
    measurement.setClient(client);
    measurement.setTrainer(trainer);

  
    measurement.setClientName(measurementDto.getClientName());

    measurement.setAge(measurementDto.getAge());
    measurement.setWeight(measurementDto.getWeight());
    measurement.setHeight(measurementDto.getHeight());
    measurement.setBodyFatPercentage(measurementDto.getBodyFatPercentage());
    measurement.setDate(measurementDto.getDate());

    measurement.setInjuries(measurementDto.getInjuries());
    measurement.setMedications(measurementDto.getMedications());
    measurement.setOtherHealthInfo(measurementDto.getOtherHealthInfo());

    measurement.setCurrentlyExercising(measurementDto.getCurrentlyExercising());
    measurement.setSportsPracticed(measurementDto.getSportsPracticed());

    measurement.setCurrentWeight(measurementDto.getCurrentWeight());
    measurement.setBmi(measurementDto.getBmi());

    measurement.setRelaxedArm(measurementDto.getRelaxedArm());
    measurement.setWaist(measurementDto.getWaist());
    measurement.setMidThigh(measurementDto.getMidThigh());
    measurement.setFlexedArm(measurementDto.getFlexedArm());
    measurement.setHips(measurementDto.getHips());
    measurement.setCalf(measurementDto.getCalf());

    measurement.setTricepFold(measurementDto.getTricepFold());
    measurement.setSubscapularFold(measurementDto.getSubscapularFold());
    measurement.setBicepFold(measurementDto.getBicepFold());
    measurement.setSuprailiacFold(measurementDto.getSuprailiacFold());

    measurement.setSumOfFolds(measurementDto.getSumOfFolds());
    measurement.setPercentageOfFolds(measurementDto.getPercentageOfFolds());
    measurement.setFatMass(measurementDto.getFatMass());
    measurement.setLeanMass(measurementDto.getLeanMass());
    measurement.setMuscleMass(measurementDto.getMuscleMass());

    measurement.setIdealMinWeight(measurementDto.getIdealMinWeight());
    measurement.setIdealMaxWeight(measurementDto.getIdealMaxWeight());
    measurement.setTrainerRecommendations(measurementDto.getTrainerRecommendations());

    bodyMeasurementRepository.save(measurement);
}


@Override
@Transactional(readOnly = true)
public List<BodyMeasurement> getClientBodyMeasurements(Long clientId) {
    return bodyMeasurementRepository.findByClientId(clientId);
}

@Override
@Transactional(readOnly = true)
public List<ActiveClientInfoDTO> getActiveClientsInfoForTrainer(Long personalTrainerId) {
    // 1. Listar los TrainerClient de este entrenador
    List<TrainerClient> trainerClients = trainerClientRepository.findByTrainerId(personalTrainerId);

    // 2. Para cada cliente, revisamos:
    //    - Si tiene un plan activo (en la tabla subscriptions)
    //    - Si tiene una suscripción de entrenador personal (tabla personal_trainer_subscriptions) con este entrenador
    return trainerClients.stream().map(tc -> {
        User client = tc.getClient();

        ActiveClientInfoDTO dto = new ActiveClientInfoDTO();
        dto.setClientId(client.getId());
        dto.setClientName(client.getUsername());
        dto.setClientEmail(client.getEmail());

        // (A) Revisar si el cliente tiene ALGÚN plan activo (sin importar el entrenador)
        List<Subscription> subs = subscriptionService.getSubscriptionsByUserId(client.getId());
        // Basta con encontrar la primera suscripción activa
        Optional<Subscription> planSub = subs.stream()
            .filter(Subscription::getActive)
            .findFirst();

        // Si existe plan activo, llenamos planName y planStart/End
        planSub.ifPresent(s -> {
            dto.setPlanName(s.getPlan().getName());
            dto.setPlanStart(s.getStartDate());
            dto.setPlanEnd(s.getEndDate());
        });

        // (B) Revisar la suscripción personal con ESTE entrenador
        List<PersonalTrainerSubscription> ptSubs =
            personalTrainerSubscriptionService.getSubscriptionsByUserId(client.getId());

        Optional<PersonalTrainerSubscription> personalSub = ptSubs.stream()
            .filter(pts -> pts.getActive() != null && pts.getActive())
            .filter(pts -> pts.getPersonalTrainer().getId().equals(personalTrainerId))
            .findFirst();

        personalSub.ifPresent(pts -> {
            dto.setTrainerStart(pts.getStartDate());
            dto.setTrainerEnd(pts.getEndDate());
        });

        return dto;
    })
    // Filtramos: sólo mostrar si tiene plan o tiene sub de entrenador
    .filter(dto -> dto.getPlanName() != null || dto.getTrainerStart() != null)
    .collect(Collectors.toList());
}
    // src/main/java/com/sebastian/backend/gymapp/backend_gestorgympro/services/impl/TrainerServiceImpl.java

@Override
@Transactional(readOnly = true)
public List<PersonalTrainerDto> getAvailableTrainersForSlot(LocalDate day, LocalTime startTime, LocalTime endTime) {
    // Convertir a LocalDateTime
    LocalDateTime startDateTime = LocalDateTime.of(day, startTime);
    LocalDateTime endDateTime = LocalDateTime.of(day, endTime);

    // Obtener entrenadores que estén disponibles y no tengan reservas en ese rango
    List<PersonalTrainer> allAvailableTrainers = personalTrainerRepository.findByAvailability(true);

    // Filtrar entrenadores que no tienen reservas que se solapen con el rango de tiempo
    List<PersonalTrainer> availableTrainers = allAvailableTrainers.stream()
            .filter(trainer -> {
                boolean hasOverlap = bookingRepository.hasOverlappingBookings(trainer.getId(), startDateTime, endDateTime);
                boolean isAvailableForClass = trainerAvailabilityRepository.isTrainerAvailable(trainer.getId(), day, startTime, endTime);
                return !hasOverlap && isAvailableForClass;
            })
            .collect(Collectors.toList());

    // Convertir a DTO
    return availableTrainers.stream()
            .map(trainer -> {
                User user = trainer.getUser();
                return new PersonalTrainerDto(
                        trainer.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        trainer.getSpecialization(),
                        trainer.getExperienceYears(),
                        trainer.getAvailability(),
                        user.getProfileImageUrl(),
                        trainer.getTitle(),
                        trainer.getStudies(),
                        trainer.getCertifications(),
                        trainer.getDescription(),
                        trainer.getMonthlyFee(),
                        trainer.getInstagramUrl(),     // nuevo
                        trainer.getWhatsappNumber(),   // nuevo
                        trainer.getCertificationFileUrl() // nuevo
                );
            })
            .collect(Collectors.toList());
}


}
