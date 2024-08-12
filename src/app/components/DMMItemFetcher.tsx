'use client';

import { useEffect } from 'react';
import { fetchData } from '../api/dmmItemApi';
import { DMMItem } from '../types/dmmTypes';

interface DMMItemFetcherProps {
  cid: string;
  onItemFetched: (item: DMMItem) => void;
}

export default function DMMItemFetcher({ cid, onItemFetched }: DMMItemFetcherProps) {
  useEffect(() => {
    fetchData(cid)
      .then(onItemFetched)
      .catch((error) => {
        console.error('Error fetching item:', error);
      });
  }, [cid, onItemFetched]);

  return <div>Fetching item data...</div>;
}