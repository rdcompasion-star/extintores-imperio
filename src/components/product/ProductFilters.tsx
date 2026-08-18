"use client";

import { useState } from "react";
import {
  AgentCategory,
  agentFilterOptions,
  capacityFilterOptions,
  classificationFilterOptions,
} from "@/lib/product-constants";
import { Button } from "@/components/ui/Button";
import { FilterIcon, CloseIcon } from "@/components/ui/icons";

export interface FilterState {
  agents: AgentCategory[];
  capacities: string[];
  classifications: string[];
}

export const emptyFilterState: FilterState = {
  agents: [],
  capacities: [],
  classifications: [],
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-ink-900">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
        active
          ? "border-red-700 bg-red-700 text-white"
          : "border-border-strong bg-surface text-ink-700 hover:border-ink-400"
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroups({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <FilterGroup title="Tipo de agente">
        {agentFilterOptions.map((opt) => (
          <Chip
            key={opt.value}
            active={filters.agents.includes(opt.value)}
            onClick={() => setFilters({ ...filters, agents: toggle(filters.agents, opt.value) })}
          >
            {opt.label}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Capacidad">
        {capacityFilterOptions.map((opt) => (
          <Chip
            key={opt}
            active={filters.capacities.includes(opt)}
            onClick={() => setFilters({ ...filters, capacities: toggle(filters.capacities, opt) })}
          >
            {opt}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Clasificación">
        {classificationFilterOptions.map((opt) => (
          <Chip
            key={opt.value}
            active={filters.classifications.includes(opt.value)}
            onClick={() =>
              setFilters({ ...filters, classifications: toggle(filters.classifications, opt.value) })
            }
          >
            {opt.label}
          </Chip>
        ))}
      </FilterGroup>
    </div>
  );
}

export function ProductFilters({
  filters,
  setFilters,
  resultCount,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  resultCount: number;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount =
    filters.agents.length + filters.capacities.length + filters.classifications.length;

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface text-[15px] font-medium text-ink-900"
        >
          <FilterIcon className="h-4 w-4" />
          Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => setFilters(emptyFilterState)}
            className="text-sm font-medium text-red-700"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden rounded-xl border border-border bg-surface p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Filtrar catálogo</h2>
          {activeCount > 0 && (
            <button type="button" onClick={() => setFilters(emptyFilterState)} className="text-sm font-medium text-red-700">
              Limpiar
            </button>
          )}
        </div>
        <FilterGroups filters={filters} setFilters={setFilters} />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-(--z-modal) lg:hidden">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 z-(--z-modal-backdrop) bg-ink-950/50"
          />
          <div className="absolute inset-x-0 bottom-0 z-(--z-modal) flex max-h-[85vh] flex-col rounded-t-2xl bg-bg">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-ink-950">Filtros</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2"
                aria-label="Cerrar"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterGroups filters={filters} setFilters={setFilters} />
            </div>
            <div className="flex gap-3 border-t border-border px-5 py-4">
              <Button variant="secondary" size="lg" className="flex-1" onClick={() => setFilters(emptyFilterState)}>
                Limpiar
              </Button>
              <Button size="lg" className="flex-1" onClick={() => setDrawerOpen(false)}>
                Ver {resultCount} resultado{resultCount === 1 ? "" : "s"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
