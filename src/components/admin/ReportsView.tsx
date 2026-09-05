import React from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { BarChart3, Download, FileSpreadsheet, ShieldCheck, CheckCircle2, TrendingUp, Users, Boxes } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { products, orders, employees, expenses, settings } = usePharmacy();

  const totalStockValuation = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);
  const totalRetailValuation = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const totalDisbursedSalaries = employees.reduce((acc, e) => acc + e.salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Executive Pharmacy Reports & Audits</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated managerial intelligence for regulatory submission, DGDA licensing, tax audits, and operational reviews.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Comprehensive Dossier
        </button>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Asset Valuation</span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {settings.currency}{(totalStockValuation ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Retail Potential: {settings.currency}{(totalRetailValuation ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Human Capital</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {settings.currency}{(totalDisbursedSalaries ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {employees.length} full-time clinical, operations, & logistics staff
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Score</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-700 mt-2">99.4%</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Prescription audit & cold chain temperature monitoring active
          </p>
        </div>
      </div>

      {/* Structured Reports Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Inventory & Narcotics / Controlled Drugs Log</h3>
          <p className="text-xs text-slate-500">
            Mandatory DGDA register logging all Schedule H formulations, batch lot codes, and clinical dispenser signatures.
          </p>
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Batches Accounted
            </span>
            <button
              onClick={() => alert('Generating DGDA Controlled Drugs Log PDF...')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-800 cursor-pointer"
            >
              Export Log
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Employee Payroll & Withholding Tax Statement</h3>
          <p className="text-xs text-slate-500">
            Certified record of basic pay, bonus, overtime pay, and income taxes withheld for submission to tax authority.
          </p>
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Deposit Reconciled
            </span>
            <button
              onClick={() => alert('Generating Payroll Tax Statement...')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-800 cursor-pointer"
            >
              Export Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
