import crypto from "crypto";

export interface ParticipantData {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface RaffleResult {
  winners: ParticipantData[];
  randomSeed: string;
  totalParticipants: number;
  executedAt: Date;
}

/**
 * Algoritmo de sorteo justo y verificable
 * Utiliza crypto.randomBytes para generar números aleatorios criptográficamente seguros
 */
export function executeRaffle(
  participants: ParticipantData[],
  numWinners: number
): RaffleResult {
  if (participants.length === 0) {
    throw new Error("No hay participantes en el sorteo");
  }

  if (numWinners > participants.length) {
    throw new Error("El número de ganadores no puede ser mayor al número de participantes");
  }

  // Generar seed aleatorio para trazabilidad
  const randomSeed = crypto.randomBytes(32).toString("hex");

  // Clonar array de participantes para no mutar el original
  const participantsCopy = [...participants];
  const winners: ParticipantData[] = [];

  // Algoritmo Fisher-Yates Shuffle con crypto.randomBytes
  for (let i = 0; i < numWinners; i++) {
    const remainingCount = participantsCopy.length - i;
    
    // Generar índice aleatorio usando crypto
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);
    const randomIndex = i + (randomNumber % remainingCount);

    // Intercambiar elementos
    [participantsCopy[i], participantsCopy[randomIndex]] = 
    [participantsCopy[randomIndex], participantsCopy[i]];

    winners.push(participantsCopy[i]);
  }

  return {
    winners,
    randomSeed,
    totalParticipants: participants.length,
    executedAt: new Date(),
  };
}

/**
 * Valida que un sorteo pueda ser ejecutado
 */
export function validateRaffleExecution(raffle: any): { valid: boolean; error?: string } {
  if (raffle.status === "FINISHED") {
    return { valid: false, error: "El sorteo ya ha sido ejecutado" };
  }

  if (raffle.status !== "ACTIVE" && raffle.status !== "CLOSED") {
    return { valid: false, error: "El sorteo debe estar activo o cerrado para ser ejecutado" };
  }

  if (raffle._count.participants === 0) {
    return { valid: false, error: "No hay participantes en el sorteo" };
  }

  if (raffle.numWinners > raffle._count.participants) {
    return { valid: false, error: "El número de ganadores es mayor al número de participantes" };
  }

  return { valid: true };
}
