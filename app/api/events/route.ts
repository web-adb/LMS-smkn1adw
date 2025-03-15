import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST: Create a new event
export async function POST(request: Request) {
  try {
    const { title, startDate, endDate, level } = await request.json();

    const newEvent = await prisma.event.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        level,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing event
export async function PUT(request: Request) {
  try {
    const { id, title, startDate, endDate, level } = await request.json();

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        level,
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an event
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}