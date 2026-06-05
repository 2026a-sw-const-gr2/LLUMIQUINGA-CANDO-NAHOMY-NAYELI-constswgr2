import { IsString, IsIn, IsObject, IsOptional } from 'class-validator';

// 1. Definición estricta de la interfaz para Materias Primas
export interface RawMaterialPayload {
  lote_codigo: string;          // Ej: "LOT-2026-HARI01"
  insumo_nombre: string;        // Ej: "Harina de Trigo Industrial"
  categoria: 'HARINAS' | 'LACTEOS' | 'AZUCARES' | 'LEVA_ADITIVOS';
  cantidad_movida: number;      // Stock que entra o sale
  unidad_medida: 'KG' | 'LITROS' | 'UNIDADES';
  costo_unitario: number;       
  fecha_ingreso: string;        // ISO String UTC
  fecha_caducidad: string;      // ISO String UTC
  proveedor_id: string;         
  bodega_destino_id: string;    
  especificaciones_extras?: Record<string, unknown>; // Sustituye al type 'any'
}

// 2. DTO de Eventos de Auditoría adaptado a Materia Prima
export class CreateEventDto {
  @IsString()
  source!: string; // Componente o módulo que genera el movimiento (ej: "INVENTARIO_SERVICE")

  @IsString()
  entity!: string; // Tipo de entidad afectada (ej: "MATERIA_PRIMA")

  @IsIn(['CREATE', 'UPDATE', 'DELETE', 'QUERY'])
  action!: string; // Acción realizada sobre el stock

  @IsOptional()
  @IsObject()
  payload?: RawMaterialPayload; // Objeto Type-Safe en lugar de 'any'
}