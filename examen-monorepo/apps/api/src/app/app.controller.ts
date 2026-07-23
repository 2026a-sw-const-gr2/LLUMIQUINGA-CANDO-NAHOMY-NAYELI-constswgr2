import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  validateCompoundInterestInput,
  calculateCompoundInterest,
  formatResult,
} from '@examen-monorepo/shared';
import type { CompoundInterestInput } from '@examen-monorepo/shared';

const VALID_API_KEY = 'clave-secreta-123';

@ApiTags('Interés Compuesto')
@Controller()
export class AppController {

  // ========================
  // V1 — Sin autenticación, respuesta cruda
  // ========================
  @Post('v1/compound-interest')
  @ApiOperation({
    summary: 'Calcular interés compuesto (v1 - abierta)',
    description: 'No requiere autenticación. Devuelve los valores numéricos crudos sin formato.',
  })
  @ApiBody({
    schema: {
      example: {
        principal: 1000,
        annualRate: 5,
        monthlyContribution: 100,
        years: 10,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Resultado crudo (números sin formato)' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  calculateV1(@Body() body: CompoundInterestInput) {
    const error = validateCompoundInterestInput(body);
    if (error) throw new BadRequestException(error);

    const result = calculateCompoundInterest(body);
    return result; // Devuelve números crudos
  }

  // ========================
  // V2 — Requiere x-api-key, respuesta formateada
  // ========================
  @Post('v2/compound-interest')
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Calcular interés compuesto (v2 - segura)',
    description: 'Requiere el header x-api-key. Devuelve los valores ya formateados como moneda.',
  })
  @ApiBody({
    schema: {
      example: {
        principal: 1000,
        annualRate: 5,
        monthlyContribution: 100,
        years: 10,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Resultado formateado en USD' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'API Key inválida o ausente' })
  calculateV2(
    @Body() body: CompoundInterestInput,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (apiKey !== VALID_API_KEY) {
      throw new UnauthorizedException('API Key inválida o ausente.');
    }

    const error = validateCompoundInterestInput(body);
    if (error) throw new BadRequestException(error);

    const result = calculateCompoundInterest(body);
    return formatResult(result); // Devuelve valores formateados
  }
}
