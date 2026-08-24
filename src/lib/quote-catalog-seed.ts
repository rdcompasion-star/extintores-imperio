// Catálogo de productos y servicios del cotizador.
// Fuente: planillas oficiales de Extintores Imperio EIRL
// (Cotizacion Cargas, Cotizacion Extintores Nuevos Standar, Cotizacion Mantencion
// Economica, Cotizacion Mantencion Standar, Cotizacion Repuestos y Accesorios).
// Precios NETOS, IVA 19% aparte (planillas "MAS IVA"). Auditado con el cliente
// el 2026-08-18: se confirmaron los 4 puntos siguientes tal como aparecían en
// las planillas originales, y se corrigió 1 precio:
//  - Mantención Económica = mismo precio que Carga en Polvo ABC y CO2 (confirmado correcto).
//  - Mantención Estándar Clase K = mismo precio que Mantención Económica Clase K (confirmado correcto).
//  - No existe Extintor Nuevo Clase K de 10 KG (confirmado: no se vende en ese tamaño).
//  - Mantención Estándar CO2 2KG: la planilla decía $14.980 → corregido a $14.900 por el cliente.
// No modificar nombres, precios ni tamaños sin confirmar con la empresa.
//
// 2026-08-18 (2da actualización): precios de Carga (CAR-*) y Mantención
// Económica (MTE-*, misma regla de igualdad de arriba) subieron según
// "Cotizacion Cargas (1).xls". Se agregó el catálogo "caf" (grupo CAF-*) con
// los precios específicos del cliente CAF, tomados de "Valores Caf Chile
// 26.xls" — incluye 2 productos que no existen en el catálogo general
// (Extintor y Carga de Agua Presurizada Clase A).

import type { QuoteItemKind } from "@/lib/quote-constants";

export interface QuoteCatalogSeedItem {
  code: string;
  kind: QuoteItemKind;
  category: string;
  name: string;
  unit: string;
  sizeLabel: string;
  netPrice: number;
  notes?: string;
  /** "general" (catálogo estándar) o "caf" (precios del cliente CAF). Default "general". */
  catalogGroup?: "general" | "caf";
}

export const quoteCatalogSeed: QuoteCatalogSeedItem[] = [
  // ---------- EXTINTORES NUEVOS ----------
  { code: "NEW-PQS-01KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "1 KG", netPrice: 10000 },
  { code: "NEW-PQS-02KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "2 KG", netPrice: 15000 },
  { code: "NEW-PQS-04KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "4 KG", netPrice: 27900 },
  { code: "NEW-PQS-06KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "6 KG", netPrice: 30900 },
  { code: "NEW-PQS-10KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "10 KG", netPrice: 39900 },
  { code: "NEW-PQS-25KG-CARRO", kind: "producto", category: "pqs-abc", name: "Carro Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "25 KG", netPrice: 196900 },
  { code: "NEW-PQS-50KG-CARRO", kind: "producto", category: "pqs-abc", name: "Carro Extintor Nuevo Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "50 KG", netPrice: 249900 },
  { code: "NEW-CO2-02KG", kind: "producto", category: "co2", name: "Extintor Nuevo Gas CO₂ Dióxido de Carbono", unit: "unidad", sizeLabel: "2 KG", netPrice: 34900 },
  { code: "NEW-CO2-05KG", kind: "producto", category: "co2", name: "Extintor Nuevo Gas CO₂ Dióxido de Carbono", unit: "unidad", sizeLabel: "5 KG", netPrice: 44900 },
  { code: "NEW-CO2-10KG-CARRO", kind: "producto", category: "co2", name: "Carro Extintor Nuevo Gas CO₂ Dióxido de Carbono", unit: "unidad", sizeLabel: "10 KG", netPrice: 129900 },
  { code: "NEW-K-02KG", kind: "producto", category: "clase-k", name: "Extintor Nuevo Acetato de Potasio Clase K", unit: "unidad", sizeLabel: "2 KG", netPrice: 80900 },
  { code: "NEW-K-04KG", kind: "producto", category: "clase-k", name: "Extintor Nuevo Acetato de Potasio Clase K", unit: "unidad", sizeLabel: "4 KG", netPrice: 90900 },
  { code: "NEW-K-06KG", kind: "producto", category: "clase-k", name: "Extintor Nuevo Acetato de Potasio Clase K", unit: "unidad", sizeLabel: "6 KG", netPrice: 119900 },

  // ---------- CARGAS / RECARGAS ----------
  { code: "CAR-PQS-01KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "1 KG", netPrice: 4900 },
  { code: "CAR-PQS-02KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "2 KG", netPrice: 6900 },
  { code: "CAR-PQS-04KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "4 KG", netPrice: 10900 },
  { code: "CAR-PQS-06KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "6 KG", netPrice: 15900 },
  { code: "CAR-PQS-10KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "10 KG", netPrice: 20900 },
  { code: "CAR-PQS-25KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Carga Carro Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "25 KG", netPrice: 42900 },
  { code: "CAR-PQS-50KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Carga Carro Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "50 KG", netPrice: 78900 },
  { code: "CAR-CO2-02KG", kind: "servicio", category: "co2", name: "Carga Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "2 KG", netPrice: 19900 },
  { code: "CAR-CO2-05KG", kind: "servicio", category: "co2", name: "Carga Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "5 KG", netPrice: 44900 },
  { code: "CAR-CO2-10KG-CARRO", kind: "servicio", category: "co2", name: "Carga Carro Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "10 KG", netPrice: 73900 },
  { code: "CAR-K-02KG", kind: "servicio", category: "clase-k", name: "Carga Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "2 KG", netPrice: 29900 },
  { code: "CAR-K-04KG", kind: "servicio", category: "clase-k", name: "Carga Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "4 KG", netPrice: 49900 },
  { code: "CAR-K-06KG", kind: "servicio", category: "clase-k", name: "Carga Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "6 KG", netPrice: 54900 },
  { code: "CAR-K-10KG", kind: "servicio", category: "clase-k", name: "Carga Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "10 KG", netPrice: 69900 },

  // ---------- MANTENCIÓN ECONÓMICA ----------
  { code: "MTE-PQS-01KG", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "1 KG", netPrice: 4900 },
  { code: "MTE-PQS-02KG", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "2 KG", netPrice: 6900 },
  { code: "MTE-PQS-04KG", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "4 KG", netPrice: 10900 },
  { code: "MTE-PQS-06KG", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "6 KG", netPrice: 15900 },
  { code: "MTE-PQS-10KG", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "10 KG", netPrice: 20900 },
  { code: "MTE-PQS-25KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Carro Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "25 KG", netPrice: 42900 },
  { code: "MTE-PQS-50KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Mantención Económica Carro Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "50 KG", netPrice: 78900 },
  { code: "MTE-CO2-02KG", kind: "servicio", category: "co2", name: "Mantención Económica Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "2 KG", netPrice: 19900 },
  { code: "MTE-CO2-05KG", kind: "servicio", category: "co2", name: "Mantención Económica Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "5 KG", netPrice: 44900 },
  { code: "MTE-CO2-10KG-CARRO", kind: "servicio", category: "co2", name: "Mantención Económica Carro Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "10 KG", netPrice: 73900 },
  { code: "MTE-K-06KG", kind: "servicio", category: "clase-k", name: "Mantención Económica Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "6 KG", netPrice: 54900 },
  { code: "MTE-K-10KG", kind: "servicio", category: "clase-k", name: "Mantención Económica Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "10 KG", netPrice: 69900 },

  // ---------- MANTENCIÓN ESTÁNDAR ----------
  { code: "MTS-PQS-01KG", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "1 KG", netPrice: 5000 },
  { code: "MTS-PQS-02KG", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "2 KG", netPrice: 6000 },
  { code: "MTS-PQS-04KG", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "4 KG", netPrice: 7200 },
  { code: "MTS-PQS-06KG", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "6 KG", netPrice: 8900 },
  { code: "MTS-PQS-10KG", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "10 KG", netPrice: 10900 },
  { code: "MTS-PQS-25KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Carro Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "25 KG", netPrice: 24900 },
  { code: "MTS-PQS-50KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Mantención Estándar Carro Extintor Polvo ABC Multipropósito", unit: "servicio", sizeLabel: "50 KG", netPrice: 47900 },
  { code: "MTS-CO2-02KG", kind: "servicio", category: "co2", name: "Mantención Estándar Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "2 KG", netPrice: 14900, notes: "Planilla original decía $14.980; corregido a $14.900 por el cliente el 2026-08-18." },
  { code: "MTS-CO2-05KG", kind: "servicio", category: "co2", name: "Mantención Estándar Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "5 KG", netPrice: 24900 },
  { code: "MTS-CO2-10KG-CARRO", kind: "servicio", category: "co2", name: "Mantención Estándar Carro Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "10 KG", netPrice: 30900 },
  { code: "MTS-K-06KG", kind: "servicio", category: "clase-k", name: "Mantención Estándar Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "6 KG", netPrice: 29900 },
  { code: "MTS-K-10KG", kind: "servicio", category: "clase-k", name: "Mantención Estándar Extintor Acetato de Potasio Clase K", unit: "servicio", sizeLabel: "10 KG", netPrice: 32900 },

  // ---------- REPUESTOS Y ACCESORIOS ----------
  { code: "ACC-DIF-PQS-01", kind: "producto", category: "pqs-abc", name: "Difusor Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 1 KG", netPrice: 480 },
  { code: "ACC-DIF-PQS-02", kind: "producto", category: "pqs-abc", name: "Difusor Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 2 KG", netPrice: 480 },
  { code: "ACC-MNG-PQS-04", kind: "producto", category: "pqs-abc", name: "Manguera Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 4 KG", netPrice: 2900 },
  { code: "ACC-MNG-PQS-06", kind: "producto", category: "pqs-abc", name: "Manguera Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 6 KG", netPrice: 2900 },
  { code: "ACC-MNG-PQS-10", kind: "producto", category: "pqs-abc", name: "Manguera Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 10 KG", netPrice: 2900 },
  { code: "ACC-MNG-PQS-25-CARRO", kind: "producto", category: "pqs-abc", name: "Manguera Carro Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 25 KG", netPrice: 38900 },
  { code: "ACC-MNG-PQS-50-CARRO", kind: "producto", category: "pqs-abc", name: "Manguera Carro Extintor Polvo ABC Multipropósito", unit: "unidad", sizeLabel: "aplica a 50 KG", netPrice: 40900 },
  { code: "ACC-VAL-PQS-M30", kind: "producto", category: "pqs-abc", name: "Válvula M30 Extintor Polvo", unit: "unidad", sizeLabel: "aplica a 4 a 10 KG", netPrice: 7900 },
  { code: "ACC-VAL-PQS-CARRO", kind: "producto", category: "pqs-abc", name: "Válvula Carro Polvo", unit: "unidad", sizeLabel: "aplica a 25 y 50 KG", netPrice: 29900 },
  { code: "ACC-VAL-K", kind: "producto", category: "clase-k", name: "Válvula Extintor Acetato de Potasio", unit: "unidad", sizeLabel: "aplica a 2 a 10 Lts", netPrice: 22900 },
  { code: "ACC-DIF-CO2-02", kind: "producto", category: "co2", name: "Difusor Extintor Gas CO₂ Dióxido de Carbono", unit: "unidad", sizeLabel: "aplica a 2 KG", netPrice: 5900 },
  { code: "ACC-MNG-CO2-05", kind: "producto", category: "co2", name: "Manguera Extintor Gas CO₂ Dióxido de Carbono", unit: "unidad", sizeLabel: "aplica a 5 KG", netPrice: 14900 },
  { code: "ACC-MNG-CO2-10-CARRO", kind: "producto", category: "co2", name: "Manguera Carro Extintor Gas CO₂ Dióxido de Carbono", unit: "unidad", sizeLabel: "aplica a 10 KG", netPrice: 16900 },
  { code: "ACC-MNG-K-02", kind: "producto", category: "clase-k", name: "Manguera Extintor Acetato de Potasio Clase K", unit: "unidad", sizeLabel: "aplica a 2 KG", netPrice: 14900 },
  { code: "ACC-MNG-K-04", kind: "producto", category: "clase-k", name: "Manguera Extintor Acetato de Potasio Clase K", unit: "unidad", sizeLabel: "aplica a 4 KG", netPrice: 15900 },
  { code: "ACC-MNG-K-06", kind: "producto", category: "clase-k", name: "Manguera Extintor Acetato de Potasio Clase K", unit: "unidad", sizeLabel: "aplica a 6 KG", netPrice: 16900 },
  { code: "ACC-SOP-TRIPODE", kind: "producto", category: "general", name: "Soporte Trípode Extintor PQS o CO₂", unit: "unidad", sizeLabel: "aplica a 2 a 10 KG", netPrice: 22900 },
  { code: "ACC-SOP-CAMION", kind: "producto", category: "general", name: "Soporte Camión Reforzado", unit: "unidad", sizeLabel: "aplica a 4 a 10 KG", netPrice: 34900 },
  { code: "ACC-GAB-PVC-04-06", kind: "producto", category: "general", name: "Gabinete PVC", unit: "unidad", sizeLabel: "aplica a 4 a 6 KG", netPrice: 35900 },
  { code: "ACC-GAB-PVC-10", kind: "producto", category: "general", name: "Gabinete PVC", unit: "unidad", sizeLabel: "aplica a 10 KG", netPrice: 47900 },
  { code: "ACC-GAB-MET-VIDRIADA", kind: "producto", category: "general", name: "Gabinete Metálico Puerta Vidriada o Malla Metálica", unit: "unidad", sizeLabel: "aplica a 2 a 10 KG", netPrice: 42900 },
  { code: "ACC-GAB-MET-ROMPER", kind: "producto", category: "general", name: "Gabinete Metálico Vidrio a Romper", unit: "unidad", sizeLabel: "aplica a 2 a 10 KG", netPrice: 41900 },
  { code: "ACC-GAB-RH-VIDRIADA", kind: "producto", category: "red-humeda", name: "Gabinete Metálico Puerta Vidriada Red Húmeda 70x70", unit: "unidad", sizeLabel: "aplica a 25 y 30 m", netPrice: 96900 },
  { code: "ACC-GAB-RH-MALLA", kind: "producto", category: "red-humeda", name: "Gabinete Metálico Puerta Malla Metálica Red Húmeda 70x70", unit: "unidad", sizeLabel: "aplica a 25 y 30 m", netPrice: 99900 },
  { code: "ACC-CARRETE-RH-25", kind: "producto", category: "red-humeda", name: "Carrete Manguera Red Húmeda 1\" 25 metros", unit: "unidad", sizeLabel: "25 m", netPrice: 129900 },
  { code: "ACC-CARRETE-RH-30", kind: "producto", category: "red-humeda", name: "Carrete Manguera Red Húmeda 1\" 30 metros", unit: "unidad", sizeLabel: "30 m", netPrice: 149900 },
  { code: "ACC-CINTILLO", kind: "producto", category: "general", name: "Cintillo Plástico Portamanguera", unit: "unidad", sizeLabel: "aplica a 2 a 10 KG", netPrice: 1400 },
  { code: "ACC-MANOM-M22", kind: "producto", category: "general", name: "Manómetro M22", unit: "unidad", sizeLabel: "aplica a 1 a 2 KG", netPrice: 1900 },
  { code: "ACC-MANOM-M30", kind: "producto", category: "general", name: "Manómetro M30", unit: "unidad", sizeLabel: "aplica a 1 a 50 KG", netPrice: 2300 },
  { code: "ACC-SOP-L-PQS", kind: "producto", category: "pqs-abc", name: "Soporte Metálico Tipo L Extintor Polvo", unit: "unidad", sizeLabel: "aplica a 4 a 10 KG", netPrice: 1300 },
  { code: "ACC-SOP-L-CO2", kind: "producto", category: "co2", name: "Soporte Metálico Tipo L Extintor CO₂", unit: "unidad", sizeLabel: "aplica a 2 a 5 KG", netPrice: 1800 },

  // ---------- CATÁLOGO CAF (precios específicos cliente CAF) ----------
  { code: "CAF-NEW-PQS75-01KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Certificado PQS 75% ABC Multipropósito", unit: "unidad", sizeLabel: "1 Kilo", netPrice: 10924, catalogGroup: "caf" },
  { code: "CAF-NEW-PQS75-02KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Certificado PQS 75% ABC Multipropósito", unit: "unidad", sizeLabel: "2 Kilos", netPrice: 19980, catalogGroup: "caf" },
  { code: "CAF-NEW-PQS75-04KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Certificado PQS 75% ABC Multipropósito", unit: "unidad", sizeLabel: "4 Kilos", netPrice: 27980, catalogGroup: "caf" },
  { code: "CAF-NEW-PQS75-06KG", kind: "producto", category: "pqs-abc", name: "Extintor Nuevo Certificado PQS 75% ABC Multipropósito", unit: "unidad", sizeLabel: "6 Kilos", netPrice: 39980, catalogGroup: "caf" },
  { code: "CAF-NEW-AGUA-06L", kind: "producto", category: "agua-a", name: "Extintor Nuevo Certificado Agua Presurizada Clase A", unit: "unidad", sizeLabel: "6 Litros", netPrice: 59980, catalogGroup: "caf" },
  { code: "CAF-CAR-AGUA-06L", kind: "servicio", category: "agua-a", name: "Carga Extintor Agua Presurizada Fuegos Clase A", unit: "servicio", sizeLabel: "6 Litros", netPrice: 17980, catalogGroup: "caf" },
  { code: "CAF-CAR-PQS75-01KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Certificado PQS 75% ABC Multipropósito", unit: "servicio", sizeLabel: "1 Kilo", netPrice: 4980, catalogGroup: "caf" },
  { code: "CAF-CAR-PQS75-02KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Certificado PQS 75% ABC Multipropósito", unit: "servicio", sizeLabel: "2 Kilos", netPrice: 6980, catalogGroup: "caf" },
  { code: "CAF-CAR-PQS75-04KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Certificado PQS 75% ABC Multipropósito", unit: "servicio", sizeLabel: "4 Kilos", netPrice: 11980, catalogGroup: "caf" },
  { code: "CAF-CAR-PQS75-06KG", kind: "servicio", category: "pqs-abc", name: "Carga Extintor Certificado PQS 75% ABC Multipropósito", unit: "servicio", sizeLabel: "6 Kilos", netPrice: 15750, catalogGroup: "caf" },
  { code: "CAF-CAR-PQS75-25KG-CARRO", kind: "servicio", category: "pqs-abc", name: "Carga Carro Extintor Certificado PQS 75% ABC Multipropósito", unit: "servicio", sizeLabel: "25 Kilos", netPrice: 54980, catalogGroup: "caf" },
  { code: "CAF-CAR-CO2-02KG", kind: "servicio", category: "co2", name: "Carga Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "2 Kilos", netPrice: 22980, catalogGroup: "caf" },
  { code: "CAF-CAR-CO2-05KG", kind: "servicio", category: "co2", name: "Carga Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "5 Kilos", netPrice: 44980, catalogGroup: "caf" },
  { code: "CAF-CAR-CO2-10KG-CARRO", kind: "servicio", category: "co2", name: "Carga Carro Extintor Gas CO₂ Dióxido de Carbono", unit: "servicio", sizeLabel: "10 Kilos", netPrice: 73900, catalogGroup: "caf" },
  { code: "CAF-MNG-AGUA-06L", kind: "producto", category: "agua-a", name: "Manguera Extintor Agua Presurizada", unit: "unidad", sizeLabel: "6 Litros", netPrice: 20200, catalogGroup: "caf" },
  { code: "CAF-MNG-PQS", kind: "producto", category: "pqs-abc", name: "Manguera Extintor Polvo", unit: "unidad", sizeLabel: "aplica a 4, 6, 10 Kilos", netPrice: 9980, catalogGroup: "caf" },
  { code: "CAF-CINTILLO", kind: "producto", category: "general", name: "Cintillo Plástico", unit: "unidad", sizeLabel: "aplica a 4, 6, 10 Kilos", netPrice: 2980, catalogGroup: "caf" },
  { code: "CAF-MANOM-137", kind: "producto", category: "general", name: "Manómetro 13.7", unit: "unidad", sizeLabel: "6 Litros", netPrice: 4980, catalogGroup: "caf" },
  { code: "CAF-MNG-PQS-25-CARRO", kind: "producto", category: "pqs-abc", name: "Manguera Carro Extintor Polvo", unit: "unidad", sizeLabel: "25 Kilos", netPrice: 54980, catalogGroup: "caf" },
  { code: "CAF-MNG-CO2-10-CARRO", kind: "producto", category: "co2", name: "Manguera Carro Extintor CO₂", unit: "unidad", sizeLabel: "10 Kilos", netPrice: 21980, catalogGroup: "caf" },
  { code: "CAF-MNG-CO2-05KG", kind: "producto", category: "co2", name: "Manguera Extintor CO₂", unit: "unidad", sizeLabel: "5 Kilos", netPrice: 21980, catalogGroup: "caf" },
  { code: "CAF-DIF-CO2-02KG", kind: "producto", category: "co2", name: "Difusor Extintor CO₂", unit: "unidad", sizeLabel: "2 Kilos", netPrice: 9980, catalogGroup: "caf" },
  { code: "CAF-GAB-MET", kind: "producto", category: "general", name: "Gabinete Metálico Puerta Vidriada o Puerta Malla Metálica", unit: "unidad", sizeLabel: "aplica a 2, 4, 6 y 10", netPrice: 42500, catalogGroup: "caf" },
];
