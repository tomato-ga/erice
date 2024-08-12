'use client';

import { useEffect } from 'react';
import { fetchitembycontentid } from '../api/dmmItemApi';
import { DMMItemDetails } from '../types/dmmTypes';

interface DMMItemDetailsFetcherProps {
  contentId: string;
  onDetailsFetched: (details: DMMItemDetails) => void;
}

export default function DMMItemDetailsFetcher({ contentId, onDetailsFetched }: DMMItemDetailsFetcherProps) {
  useEffect(() => {
    fetchitembycontentid(contentId)
      .then(onDetailsFetched)
      .catch((error) => {
        console.error('Error fetching item details:', error);
      });
  }, [contentId, onDetailsFetched]);

  return <div>Fetching item details...</div>;
}