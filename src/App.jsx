import React, { useState, useEffect } from 'react';
import { Home, Car, Calculator, Wallet, TrendingUp, PlusCircle, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // --- ESTADO DEL CRÉDITO HIPOTECARIO ---
  const [precioDepa, setPrecioDepa] = useState(460000);
  const [precioCochera, setPrecioCochera] = useState(55000);
  const [pctInicialDepa, setPctInicialDepa] = useState(10);
  const [pctInicialCochera, setPctInicialCochera] = useState(10);
  const [plazoAnios, setPlazoAnios] = useState(13);
  const [tasaTEA, setTasaTEA] = useState(8.5); // Tasa Efectiva Anual promedio en Perú (%)

  // --- ESTADO DEL PRESUPUESTO FAMILIAR ---
  const [ingresos, setIngresos] = useState([
    { id: 1, descripcion: 'Sueldo Principal', monto: 8000 },
    { id: 2, descripcion: 'Ingreso Extra', monto: 3500 }
  ]);
  
  const [gastos, setGastos] = useState([
    { id: 1, descripcion: 'Alimentación', monto: 2000 },
    { id: 2, descripcion: 'Servicios (Luz, Agua, Internet)', monto: 400 },
    { id: 3, descripcion: 'Transporte / Gasolina', monto: 600 },
    { id: 4, descripcion: 'Educación', monto: 1500 }
  ]);

  // Nuevos items temporales
  const [nuevoIngresoDesc, setNuevoIngresoDesc] = useState('');
  const [nuevoIngresoMonto, setNuevoIngresoMonto] = useState('');
  const [nuevoGastoDesc, setNuevoGastoDesc] = useState('');
  const [nuevoGastoMonto, setNuevoGastoMonto] = useState('');

  // --- CÁLCULOS DEL CRÉDITO ---
  const montoInicialDepa = precioDepa * (pctInicialDepa / 100);
  const montoInicialCochera = precioCochera * (pctInicialCochera / 100);
  const totalInicial = montoInicialDepa + montoInicialCochera;
  const montoPrestamo = (precioDepa + precioCochera) - totalInicial;
  
  // Cálculo de cuota mensual (Sistema Francés)
  const meses = plazoAnios * 12;
  const tasaMensual = Math.pow(1 + (tasaTEA / 100), 1 / 12) - 1; // Conversión TEA a TEM
  const cuotaMensual = tasaMensual > 0 
    ? montoPrestamo * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1)
    : montoPrestamo / meses;

  const totalPagarBanco = cuotaMensual * meses;
  const totalIntereses = totalPagarBanco - montoPrestamo;

  // --- CÁLCULOS DEL PRESUPUESTO ---
  const totalIngresos = ingresos.reduce((acc, curr) => acc + curr.monto, 0);
  const totalGastos = gastos.reduce((acc, curr) => acc + curr.monto, 0);
  const flujoLibreAntesDeCuota = totalIngresos - totalGastos;
  const saldoFinalMensual = flujoLibreAntesDeCuota - cuotaMensual;
  const porcentajeCompromiso = (cuotaMensual / totalIngresos) * 100 || 0;

  // --- FUNCIONES DE FORMATO Y MANEJO ---
  const formatoMoneda = (monto) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto);
  };

  const agregarIngreso = () => {
    if (nuevoIngresoDesc && nuevoIngresoMonto) {
      setIngresos([...ingresos, { id: Date.now(), descripcion: nuevoIngresoDesc, monto: parseFloat(nuevoIngresoMonto) }]);
      setNuevoIngresoDesc('');
      setNuevoIngresoMonto('');
    }
  };

  const eliminarIngreso = (id) => setIngresos(ingresos.filter(i => i.id !== id));

  const agregarGasto = () => {
    if (nuevoGastoDesc && nuevoGastoMonto) {
      setGastos([...gastos, { id: Date.now(), descripcion: nuevoGastoDesc, monto: parseFloat(nuevoGastoMonto) }]);
      setNuevoGastoDesc('');
      setNuevoGastoMonto('');
    }
  };

  const eliminarGasto = (id) => setGastos(gastos.filter(g => g.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-blue-600">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Home size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Planificador Inmobiliario Familiar</h1>
            <p className="text-slate-500">Calcula la cuota de tu depa + cochera y evalúa tu presupuesto</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DEL CRÉDITO */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-3">
                <Calculator className="text-blue-500" />
                Datos del Inmueble y Crédito
              </h2>

              <div className="space-y-4">
                {/* Precios */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Precio Depa (S/)</label>
                    <input type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={precioDepa} onChange={(e) => setPrecioDepa(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Precio Cochera (S/)</label>
                    <input type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={precioCochera} onChange={(e) => setPrecioCochera(Number(e.target.value))} />
                  </div>
                </div>

                {/* Porcentajes Inicial */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">% Inicial Depa</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" className="w-full"
                        value={pctInicialDepa} onChange={(e) => setPctInicialDepa(Number(e.target.value))} />
                      <span className="font-bold w-12 text-right">{pctInicialDepa}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">% Inicial Cochera</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" className="w-full"
                        value={pctInicialCochera} onChange={(e) => setPctInicialCochera(Number(e.target.value))} />
                      <span className="font-bold w-12 text-right">{pctInicialCochera}%</span>
                    </div>
                  </div>
                </div>

                {/* Condiciones del Banco */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Plazo (Años)</label>
                    <input type="number" min="1" max="30" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={plazoAnios} onChange={(e) => setPlazoAnios(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Tasa Bancaria (TEA %)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={tasaTEA} onChange={(e) => setTasaTEA(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>

            {/* RESUMEN DEL CRÉDITO */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-800 text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={100} /></div>
              <h2 className="text-xl font-bold mb-4">Resumen del Crédito</h2>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-blue-100">Precio Total:</span>
                  <span className="font-bold">{formatoMoneda(precioDepa + precioCochera)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-blue-100">Cuota Inicial Total a pagar ahora:</span>
                  <span className="font-bold text-green-400">{formatoMoneda(totalInicial)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-blue-100">Monto a Financiar (Préstamo):</span>
                  <span className="font-bold">{formatoMoneda(montoPrestamo)}</span>
                </div>
                
                <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                  <span className="block text-sm text-blue-200 text-center mb-1">Cuota Mensual Estimada</span>
                  <span className="block text-4xl font-extrabold text-center text-yellow-400">
                    {formatoMoneda(cuotaMensual)}
                  </span>
                  <span className="block text-xs text-center text-blue-200 mt-2">
                    *Por {meses} meses. No incluye seguro de desgravamen ni seguro de inmueble (aprox. S/ 100 - S/ 200 extras al mes).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PRESUPUESTO Y ANÁLISIS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Presupuesto */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-3">
                <Wallet className="text-green-500" />
                Presupuesto Familiar Mensual
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ingresos */}
                <div>
                  <h3 className="font-semibold text-green-600 mb-3 flex items-center justify-between">
                    Ingresos Mensuales
                    <span className="text-sm bg-green-100 px-2 py-1 rounded-full">{formatoMoneda(totalIngresos)}</span>
                  </h3>
                  <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                    {ingresos.map(ing => (
                      <div key={ing.id} className="flex justify-between items-center p-2 bg-slate-50 border rounded text-sm">
                        <span>{ing.descripcion}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{formatoMoneda(ing.monto)}</span>
                          <button onClick={() => eliminarIngreso(ing.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ej. Bono" className="w-1/2 p-2 border rounded text-sm"
                      value={nuevoIngresoDesc} onChange={(e) => setNuevoIngresoDesc(e.target.value)} />
                    <input type="number" placeholder="Monto" className="w-1/3 p-2 border rounded text-sm"
                      value={nuevoIngresoMonto} onChange={(e) => setNuevoIngresoMonto(e.target.value)} />
                    <button onClick={agregarIngreso} className="w-1/6 bg-green-500 text-white rounded flex justify-center items-center hover:bg-green-600">
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>

                {/* Gastos */}
                <div>
                  <h3 className="font-semibold text-red-500 mb-3 flex items-center justify-between">
                    Gastos Actuales
                    <span className="text-sm bg-red-100 px-2 py-1 rounded-full">{formatoMoneda(totalGastos)}</span>
                  </h3>
                  <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                    {gastos.map(gas => (
                      <div key={gas.id} className="flex justify-between items-center p-2 bg-slate-50 border rounded text-sm">
                        <span>{gas.descripcion}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{formatoMoneda(gas.monto)}</span>
                          <button onClick={() => eliminarGasto(gas.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ej. Compras" className="w-1/2 p-2 border rounded text-sm"
                      value={nuevoGastoDesc} onChange={(e) => setNuevoGastoDesc(e.target.value)} />
                    <input type="number" placeholder="Monto" className="w-1/3 p-2 border rounded text-sm"
                      value={nuevoGastoMonto} onChange={(e) => setNuevoGastoMonto(e.target.value)} />
                    <button onClick={agregarGasto} className="w-1/6 bg-red-500 text-white rounded flex justify-center items-center hover:bg-red-600">
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ANÁLISIS DE VIABILIDAD */}
            <div className={`rounded-2xl shadow-sm p-6 border-2 ${saldoFinalMensual >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {saldoFinalMensual >= 0 ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                ¿Es viable esta compra?
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <span className="block text-xs text-slate-500 uppercase font-bold">Saldo Actual</span>
                  <span className="block text-lg font-bold text-slate-800">{formatoMoneda(flujoLibreAntesDeCuota)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center border-b-4 border-yellow-400">
                  <span className="block text-xs text-slate-500 uppercase font-bold">- Cuota Depa</span>
                  <span className="block text-lg font-bold text-slate-800">{formatoMoneda(cuotaMensual)}</span>
                </div>
                <div className={`bg-white p-4 rounded-xl shadow-sm text-center border-b-4 ${saldoFinalMensual >= 0 ? 'border-green-500' : 'border-red-500'}`}>
                  <span className="block text-xs text-slate-500 uppercase font-bold">Sobrará a fin de mes</span>
                  <span className={`block text-xl font-black ${saldoFinalMensual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatoMoneda(saldoFinalMensual)}
                  </span>
                </div>
              </div>

              {/* Barra de compromiso financiero */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">Compromiso de sus ingresos (Cuota / Ingresos)</span>
                  <span className="font-bold">{porcentajeCompromiso.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${porcentajeCompromiso <= 30 ? 'bg-green-500' : porcentajeCompromiso <= 45 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(porcentajeCompromiso, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 text-right mt-1">
                  *Los bancos recomiendan que la cuota no supere el 30% - 40% de los ingresos netos.
                </p>
                {porcentajeCompromiso > 40 && (
                  <div className="mt-3 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p><strong>Cuidado:</strong> La cuota representa una porción muy alta de los ingresos. El banco podría pedir una inicial más grande o extender los años de pago para aprobar el crédito.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}