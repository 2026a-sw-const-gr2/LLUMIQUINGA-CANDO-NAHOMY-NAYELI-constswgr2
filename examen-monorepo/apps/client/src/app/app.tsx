import { useState } from 'react';
import {
  validateCompoundInterestInput,
  validateFormattedResult,
  type CompoundInterestInput,
  type CompoundInterestResult,
} from '@examen-monorepo/shared';
import './app.module.css';

const API_BASE = 'http://localhost:3000/api';
const API_KEY = 'clave-secreta-123';

export function App() {
  const [form, setForm] = useState<CompoundInterestInput>({
    principal: 0,
    annualRate: 0,
    monthlyContribution: 0,
    years: 0,
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [resultV1, setResultV1] = useState<CompoundInterestResult | null>(null);
  const [resultV2, setResultV2] = useState<Record<string, string> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) || 0 });
    setValidationError(null);
    setErrorMsg(null);
  };

  const handleV1 = async () => {
    const error = validateCompoundInterestInput(form);
    if (error) { setValidationError(error); return; }

    setLoading(true);
    setResultV1(null);
    setResultV2(null);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/v1/compound-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.message); return; }
      setResultV1(data);
    } catch {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleV2 = async (withKey: boolean) => {
    const error = validateCompoundInterestInput(form);
    if (error) { setValidationError(error); return; }

    setLoading(true);
    setResultV1(null);
    setResultV2(null);
    setErrorMsg(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (withKey) headers['x-api-key'] = API_KEY;

      const res = await fetch(`${API_BASE}/v2/compound-interest`, {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(`Error ${res.status}: ${data.message}`); return; }

      // Validar estructura de respuesta usando shared
      if (!validateFormattedResult(data)) {
        setErrorMsg('La respuesta del servidor no cumple el formato esperado.');
        return;
      }
      setResultV2(data);
    } catch {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Formateador local para v1 (usando Intl directamente)
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', color: '#1a1a2e' }}>📈 Proyección de Interés Compuesto</h1>

      {/* FORMULARIO */}
      <div style={{ background: '#f5f5f5', padding: 24, borderRadius: 12, marginBottom: 24 }}>
        <label>Capital inicial ($)</label>
        <input type="number" name="principal" value={form.principal} onChange={handleChange} style={inputStyle} />

        <label>Tasa de interés anual (%)</label>
        <input type="number" name="annualRate" value={form.annualRate} onChange={handleChange} style={inputStyle} />

        <label>Aportación mensual ($)</label>
        <input type="number" name="monthlyContribution" value={form.monthlyContribution} onChange={handleChange} style={inputStyle} />

        <label>Plazo (años)</label>
        <input type="number" name="years" value={form.years} onChange={handleChange} style={inputStyle} />

        {/* Error de validación local */}
        {validationError && (
          <div style={{ color: 'red', marginTop: 8, fontWeight: 'bold' }}>
            ⚠️ {validationError}
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button onClick={handleV1} style={btnStyle('#2196f3')} disabled={loading}>
            Calcular con v1 (sin auth)
          </button>
          <button onClick={() => handleV2(false)} style={btnStyle('#f44336')} disabled={loading}>
            Calcular con v2 (sin API Key)
          </button>
          <button onClick={() => handleV2(true)} style={btnStyle('#4caf50')} disabled={loading}>
            Calcular con v2 (con API Key)
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Calculando...</p>}

      {/* Error del servidor */}
      {errorMsg && (
        <div style={{ background: '#ffebee', border: '1px solid #f44336', padding: 16, borderRadius: 8, color: '#c62828' }}>
          ❌ {errorMsg}
        </div>
      )}

      {/* Resultado v1 — datos crudos formateados en el cliente */}
      {resultV1 && (
        <div style={{ background: '#e3f2fd', padding: 20, borderRadius: 12 }}>
          <h2>Resultado v1 <span style={{ fontSize: 14, color: '#555' }}>(datos crudos, formateados en el cliente)</span></h2>
          <p>💰 Monto final: <strong>{fmt(resultV1.finalAmount)}</strong></p>
          <p>📥 Total aportado: <strong>{fmt(resultV1.totalContributions)}</strong></p>
          <p>📈 Interés generado: <strong>{fmt(resultV1.totalInterest)}</strong></p>
        </div>
      )}

      {/* Resultado v2 — datos ya formateados por el servidor */}
      {resultV2 && (
        <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 12 }}>
          <h2>Resultado v2 <span style={{ fontSize: 14, color: '#555' }}>(formateado por el servidor)</span></h2>
          <p>💰 Monto final: <strong>{resultV2.finalAmount}</strong></p>
          <p>📥 Total aportado: <strong>{resultV2.totalContributions}</strong></p>
          <p>📈 Interés generado: <strong>{resultV2.totalInterest}</strong></p>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '8px 12px',
  margin: '6px 0 16px', borderRadius: 6, border: '1px solid #ccc',
  fontSize: 16, boxSizing: 'border-box',
};

const btnStyle = (color: string): React.CSSProperties => ({
  background: color, color: 'white', border: 'none',
  padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
  fontSize: 14, fontWeight: 'bold',
});

export default App;