import { describe, expect, it } from 'vitest';
import {
  createPaintProject,
  createPaintRoom,
  decodePaintProject,
  encodePaintProject,
  normalizePaintProject,
  summarizePaintProject,
} from './paint-project';

describe('paint project helpers', () => {
  it('round-trips a project through the share payload', () => {
    const project = createPaintProject('Test plan');
    project.rooms.push(createPaintRoom('Living room', { length: 14, width: 12 }));

    const encoded = encodePaintProject(project);
    const decoded = decodePaintProject(encoded);

    expect(decoded?.name).toBe('Test plan');
    expect(decoded?.rooms).toHaveLength(1);
    expect(decoded?.rooms[0].name).toBe('Living room');
    expect(decoded?.rooms[0].inputs.length).toBe(14);
  });

  it('fills missing room fields when normalizing older data', () => {
    const normalized = normalizePaintProject({
      schemaVersion: 1,
      id: 'project-1',
      name: 'Legacy project',
      rooms: [
        {
          id: 'room-1',
          name: 'Room 1',
          inputs: {
            length: 10,
            width: 11,
            height: 8,
          },
        },
      ],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });

    expect(normalized.rooms[0].inputs.numCoats).toBe(2);
    expect(normalized.rooms[0].inputs.paintQuality).toBe('standard');
    expect(normalized.rooms[0].inputs.includeWaste).toBe(true);
  });

  it('summarizes the combined finish and primer totals', () => {
    const project = createPaintProject('Two room plan');
    project.rooms.push(
      createPaintRoom('Room 1', { length: 12, width: 12, needsPrimer: true }),
      createPaintRoom('Room 2', { length: 10, width: 10, paintQuality: 'premium' }),
    );

    const summary = summarizePaintProject(project);

    expect(summary.roomCount).toBe(2);
    expect(summary.finish.likelyGallons).toBeGreaterThan(0);
    expect(summary.primer.purchaseGallons).toBeGreaterThanOrEqual(1);
  });

  it('keeps different paints separate and combines matching selections', () => {
    const project = createPaintProject('Grouped shopping list');
    const room1 = createPaintRoom('Living room');
    const room2 = createPaintRoom('Hallway');
    const room3 = createPaintRoom('Bedroom');
    room1.paint = { name: 'Warm white', sheen: 'eggshell' };
    room2.paint = { name: 'Warm white', sheen: 'eggshell' };
    room3.paint = { name: 'Blue', sheen: 'matte' };
    project.rooms.push(room1, room2, room3);

    const summary = summarizePaintProject(project);

    expect(summary.finishGroups).toHaveLength(2);
    const warmWhite = summary.finishGroups.find((group) => group.name === 'Warm white');
    expect(warmWhite?.roomNames).toEqual(['Living room', 'Hallway']);
    expect(warmWhite?.quality).toBe('standard');
    expect(warmWhite?.surfaces).toEqual(['Walls']);
  });

  it('creates separate wall and ceiling shopping groups', () => {
    const project = createPaintProject('Wall and ceiling plan');
    const room = createPaintRoom('Living room', { surfaceType: 'walls-ceiling' });
    room.paint = { name: 'Wall white', sheen: 'eggshell' };
    room.ceilingPaint = { name: 'Ceiling white', sheen: 'flat' };
    project.rooms.push(room);

    const summary = summarizePaintProject(project);

    expect(summary.finishGroups.map((group) => group.name)).toEqual(['Wall white', 'Ceiling white']);
    expect(summary.finishGroups.map((group) => group.surfaces)).toEqual([['Walls'], ['Ceilings']]);
  });

  it('repairs invalid values loaded from a shared or saved plan', () => {
    const project = createPaintProject('Invalid values');
    const room = createPaintRoom('Room 1');
    room.inputs.length = 0;
    room.inputs.customCoverageRate = 0;
    room.inputs.paintQuality = 'unknown' as 'standard';
    room.inputs.doors = 1.5;
    room.paint.sheen = 'unknown';
    project.rooms.push(room);

    const normalized = normalizePaintProject(project);

    expect(normalized.rooms[0].inputs.length).toBe(12);
    expect(normalized.rooms[0].inputs.customCoverageRate).toBeUndefined();
    expect(normalized.rooms[0].inputs.paintQuality).toBe('standard');
    expect(normalized.rooms[0].inputs.doors).toBe(1);
    expect(normalized.rooms[0].paint.sheen).toBe('eggshell');
  });

  it('keeps separate rooms with the same name in a paint group', () => {
    const project = createPaintProject('Repeated room names');
    const room1 = createPaintRoom('Bedroom');
    const room2 = createPaintRoom('Bedroom');
    room1.paint = { name: 'Soft white', sheen: 'eggshell' };
    room2.paint = { name: 'Soft white', sheen: 'eggshell' };
    project.rooms.push(room1, room2);

    const summary = summarizePaintProject(project);

    expect(summary.finishGroups[0].roomNames).toEqual(['Bedroom', 'Bedroom']);
    expect(summary.finishGroups[0].roomIds).toHaveLength(2);
  });
});
