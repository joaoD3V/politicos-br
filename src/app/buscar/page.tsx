'use client';

import { Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchPageWrapper } from "@/components/deputies/SearchPageWrapper";

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={<div>Carregando...</div>}>
        <SearchPageWrapper />
      </Suspense>
    </Layout>
  );
}