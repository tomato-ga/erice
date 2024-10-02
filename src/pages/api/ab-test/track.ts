import type { NextApiRequest, NextApiResponse } from 'next'
import { ABTestEvent } from '@/types/abTestTypes'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const event: ABTestEvent = req.body

  try {
    await pool.query(
      'INSERT INTO ab_test_events (event_type, test_name, variant, timestamp, additional_data) VALUES ($1, $2, $3, $4, $5)',
      [
        event.eventType,
        event.testName,
        event.variant,
        event.timestamp,
        event.additionalData ? JSON.stringify(event.additionalData) : null,
      ]
    )
    res.status(200).json({ message: 'Event tracked successfully' })
  } catch (error) {
    console.error('Error tracking AB Test event:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}