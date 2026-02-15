"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { specs, type SpecTable as SpecTableType } from "./specs-data";

function SpecTable({ table }: { table: SpecTableType }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {table.headers.map((h) => (
              <th
                key={h}
                className="py-2 pr-4 text-left font-semibold text-charcoal-900 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2 pr-4 ${
                    j === 0
                      ? "font-medium text-charcoal-900"
                      : "text-muted-foreground"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SpecsAccordion() {
  return (
    <Accordion.Root type="multiple" className="space-y-3">
      {specs.map((section) => (
        <Accordion.Item
          key={section.id}
          value={section.id}
          className="bg-white rounded-xl border border-border overflow-hidden"
        >
          <Accordion.Trigger className="flex items-center gap-4 w-full px-6 py-5 text-left hover:bg-muted transition-colors group cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <section.icon className="text-green-700" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-charcoal-900">{section.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {section.description}
              </p>
            </div>
            <ChevronDown
              size={20}
              className="text-charcoal-600 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-6 space-y-6">
              {section.content.map((block, i) => (
                <div key={i}>
                  {block.subtitle && (
                    <h4 className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-3">
                      {block.subtitle}
                    </h4>
                  )}
                  {block.text && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {block.text}
                    </p>
                  )}
                  {block.table && <SpecTable table={block.table} />}
                  {block.note && (
                    <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                      {block.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
