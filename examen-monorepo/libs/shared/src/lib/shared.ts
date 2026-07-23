// ========================
// INTERFACES / TIPOS
// ========================

export interface CompoundInterestInput {
  principal: number;       // Capital inicial
  annualRate: number;      // Tasa de interés anual (%)
  monthlyContribution: number; // Aportación mensual
  years: number;           // Plazo en años
}

export interface CompoundInterestResult {
  finalAmount: number;     // Monto final
  totalContributions: number; // Total aportado
  totalInterest: number;   // Interés generado
}

// ========================
// VALIDACIONES
// ========================

export function validateCompoundInterestInput(input: CompoundInterestInput): string | null {
  if (input.principal < 0) return 'El capital inicial no puede ser negativo.';
  if (input.principal === 0 && input.monthlyContribution === 0)
    return 'Debes ingresar un capital inicial o una aportación mensual.';
  if (input.annualRate <= 0 || input.annualRate > 100)
    return 'La tasa anual debe estar entre 0.01% y 100%.';
  if (input.years <= 0 || input.years > 50)
    return 'El plazo debe estar entre 1 y 50 años.';
  if (input.monthlyContribution < 0)
    return 'La aportación mensual no puede ser negativa.';
  return null; // null = válido
}

// ========================
// FÓRMULA PRINCIPAL
// ========================

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const monthlyRate = input.annualRate / 100 / 12;
  const totalMonths = input.years * 12;

  // Crecimiento del capital inicial
  const principalGrowth = input.principal * Math.pow(1 + monthlyRate, totalMonths);

  // Crecimiento de las aportaciones mensuales
  const contributionsGrowth =
    monthlyRate === 0
      ? input.monthlyContribution * totalMonths
      : input.monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

  const finalAmount = principalGrowth + contributionsGrowth;
  const totalContributions = input.principal + input.monthlyContribution * totalMonths;
  const totalInterest = finalAmount - totalContributions;

  return {
    finalAmount: parseFloat(finalAmount.toFixed(2)),
    totalContributions: parseFloat(totalContributions.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
  };
}

// ========================
// FORMATEADOR
// ========================

export function formatResult(result: CompoundInterestResult): Record<string, string> {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n);

  return {
    finalAmount: fmt(result.finalAmount),
    totalContributions: fmt(result.totalContributions),
    totalInterest: fmt(result.totalInterest),
  };
}

// ========================
// VALIDADOR DE RESPUESTA FORMATEADA (para el frontend con v2)
// ========================

export function validateFormattedResult(data: Record<string, string>): boolean {
  const keys = ['finalAmount', 'totalContributions', 'totalInterest'];
  return keys.every((k) => typeof data[k] === 'string' && data[k].startsWith('$'));
}