import {  UserInterface } from "../../Auth/Interfaces/UserInterface";

export interface BodyMeasurement {
    id: number;
    client: UserInterface;
    trainer: UserInterface; // Cambiado a UserInterface
    clientName: string | null;
    weight: number | null;
    height: number | null;
    bodyFatPercentage: number | null;
    date: string; // ISO string
    injuries: string;
    medications: string;
    otherHealthInfo: string;
    currentlyExercising: boolean | null;
    sportsPracticed: string;
    currentWeight: number | null;
    bmi: number | null;
    relaxedArm: number | null;
    waist: number | null;
    midThigh: number | null;
    flexedArm: number | null;
    hips: number | null;
    calf: number | null;
    tricepFold: number | null;
    subscapularFold: number | null;
    bicepFold: number | null;
    suprailiacFold: number | null;
    sumOfFolds: number | null;
    percentageOfFolds: number | null;
    fatMass: number | null;
    leanMass: number | null;
    muscleMass: number | null;
    idealMinWeight: number | null;
    idealMaxWeight: number | null;
    trainerRecommendations: string;
    age: number | null;
    
}
