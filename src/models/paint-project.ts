import { calculatePaint, type CalculationInputs, type CalculationResults } from '../utils/paint-calculator';

export const PAINT_PROJECT_SCHEMA_VERSION = 1 as const;

export interface PaintRoom {
  id: string;
  name: string;
  inputs: CalculationInputs;
  paint: {
    name: string;
    sheen: string;
  };
  ceilingPaint: {
    name: string;
    sheen: string;
  };
  estimate?: CalculationResults;
}

export interface PaintProject {
  schemaVersion: typeof PAINT_PROJECT_SCHEMA_VERSION;
  id: string;
  name: string;
  rooms: PaintRoom[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectBuyingSummary {
  lowGallons: number;
  likelyGallons: number;
  highGallons: number;
  purchaseGallons: number;
}

export interface FinishPaintGroup extends ProjectBuyingSummary {
  key: string;
  name: string;
  sheen: string;
  quality: CalculationInputs['paintQuality'];
  roomNames: string[];
  roomIds: string[];
  surfaces: string[];
}

export interface PaintProjectSummary {
  roomCount: number;
  totalPaintableArea: number;
  totalCeilingArea: number;
  finish: ProjectBuyingSummary;
  primer: ProjectBuyingSummary;
  finishGroups: FinishPaintGroup[];
  primerGroups: Array<ProjectBuyingSummary & { key: string; name: string; roomNames: string[] }>;
  rooms: Array<PaintRoom & { estimate: CalculationResults }>;
}

const defaultRoomInputs: CalculationInputs = {
  length: 12,
  width: 10,
  height: 8,
  doors: 1,
  frenchDoors: 0,
  closetDoors: 0,
  windows: 2,
  largeWindows: 0,
  smallWindows: 0,
  surfaceType: 'walls',
  numCoats: 2,
  paintQuality: 'standard',
  includeWaste: true,
  wallTexture: 'smooth',
  ceilingTexture: 'smooth',
  surfaceCondition: 'good',
  roomType: 'bedroom',
  needsPrimer: false,
};

export function createPaintProject(name = 'My paint project'): PaintProject {
  const now = new Date().toISOString();

  return {
    schemaVersion: PAINT_PROJECT_SCHEMA_VERSION,
    id: crypto.randomUUID(),
    name,
    rooms: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createPaintRoom(name = 'Room 1', inputs: Partial<CalculationInputs> = {}): PaintRoom {
  return {
    id: crypto.randomUUID(),
    name,
    inputs: {
      ...defaultRoomInputs,
      ...inputs,
    },
    paint: {
      name: `${name} finish paint`,
      sheen: 'eggshell',
    },
    ceilingPaint: {
      name: `${name} ceiling paint`,
      sheen: 'flat',
    },
  };
}

export function isPaintProject(value: unknown): value is PaintProject {
  if (!value || typeof value !== 'object') return false;
  const project = value as Partial<PaintProject>;

  return project.schemaVersion === PAINT_PROJECT_SCHEMA_VERSION
    && typeof project.id === 'string'
    && typeof project.name === 'string'
    && Array.isArray(project.rooms)
    && typeof project.createdAt === 'string'
    && typeof project.updatedAt === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function toFiniteNumber(value: unknown, fallback: number, minimum = 0, maximum = Number.POSITIVE_INFINITY): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum ? value : fallback;
}

function toWholeNumber(value: unknown, fallback: number, minimum = 0, maximum = Number.POSITIVE_INFINITY): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum ? value : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback;
}

function normalizeRoomInputs(value: unknown): CalculationInputs {
  if (!isRecord(value)) {
    return { ...defaultRoomInputs };
  }

  return {
    ...defaultRoomInputs,
    ...value,
    length: toFiniteNumber(value.length, defaultRoomInputs.length, 1),
    width: toFiniteNumber(value.width, defaultRoomInputs.width, 1),
    height: toFiniteNumber(value.height, defaultRoomInputs.height, 6),
    doors: toWholeNumber(value.doors, defaultRoomInputs.doors),
    frenchDoors: toWholeNumber(value.frenchDoors, defaultRoomInputs.frenchDoors),
    closetDoors: toWholeNumber(value.closetDoors, defaultRoomInputs.closetDoors),
    windows: toWholeNumber(value.windows, defaultRoomInputs.windows),
    largeWindows: toWholeNumber(value.largeWindows, defaultRoomInputs.largeWindows),
    smallWindows: toWholeNumber(value.smallWindows, defaultRoomInputs.smallWindows),
    numCoats: toFiniteNumber(value.numCoats, defaultRoomInputs.numCoats, 1, 3),
    surfaceType: oneOf(value.surfaceType, ['walls', 'walls-ceiling', 'ceiling', 'trim'] as const, defaultRoomInputs.surfaceType),
    paintQuality: oneOf(value.paintQuality, ['budget', 'standard', 'premium'] as const, defaultRoomInputs.paintQuality),
    wallTexture: oneOf(value.wallTexture, ['smooth', 'light', 'medium', 'heavy'] as const, defaultRoomInputs.wallTexture),
    ceilingTexture: oneOf(value.ceilingTexture, ['smooth', 'light', 'popcorn'] as const, defaultRoomInputs.ceilingTexture),
    surfaceCondition: oneOf(value.surfaceCondition, ['good', 'fair', 'new-drywall', 'stained', 'glossy'] as const, defaultRoomInputs.surfaceCondition),
    roomType: typeof value.roomType === 'string' && value.roomType.trim() ? value.roomType : defaultRoomInputs.roomType,
    includeWaste: typeof value.includeWaste === 'boolean' ? value.includeWaste : defaultRoomInputs.includeWaste,
    needsPrimer: typeof value.needsPrimer === 'boolean' ? value.needsPrimer : defaultRoomInputs.needsPrimer,
    primerType: oneOf(value.primerType, ['standard', 'high-hide', 'pva'] as const, 'standard'),
    primerCoats: toFiniteNumber(value.primerCoats, 1, 1, 2),
    trimHeight: toFiniteNumber(value.trimHeight, 6, 1, 24),
    customCoverageRate: toFiniteNumber(value.customCoverageRate, 0, 1) || undefined,
  };
}

export function normalizePaintProject(value: unknown): PaintProject {
  if (!isPaintProject(value)) {
    return createPaintProject();
  }

  return {
    ...value,
    rooms: value.rooms
      .filter((room): room is PaintRoom => isRecord(room) && typeof room.id === 'string' && typeof room.name === 'string')
      .map((room) => ({
        ...room,
        inputs: normalizeRoomInputs(room.inputs),
        paint: isRecord(room.paint)
          ? {
              name: typeof room.paint.name === 'string' && room.paint.name.trim() ? room.paint.name.trim().replace(/\s+/g, ' ') : `${room.name} finish paint`,
              sheen: oneOf(room.paint.sheen, ['flat', 'matte', 'eggshell', 'satin', 'semi-gloss', 'gloss'] as const, 'eggshell'),
            }
          : { name: `${room.name} finish paint`, sheen: 'eggshell' },
        ceilingPaint: isRecord(room.ceilingPaint)
          ? {
              name: typeof room.ceilingPaint.name === 'string' && room.ceilingPaint.name.trim() ? room.ceilingPaint.name.trim().replace(/\s+/g, ' ') : `${room.name} ceiling paint`,
              sheen: oneOf(room.ceilingPaint.sheen, ['flat', 'matte', 'eggshell', 'satin', 'semi-gloss', 'gloss'] as const, 'flat'),
            }
          : { name: `${room.name} ceiling paint`, sheen: 'flat' },
        estimate: undefined,
      })),
  };
}

export function hydratePaintRoom(room: PaintRoom): PaintRoom & { estimate: CalculationResults } {
  const estimate = calculatePaint(room.inputs);

  return {
    ...room,
    estimate,
  };
}

export function summarizePaintProject(project: PaintProject): PaintProjectSummary {
  const rooms = project.rooms.map(hydratePaintRoom);

  const finishGroupMap = new Map<string, FinishPaintGroup>();
  const primerGroupMap = new Map<string, ProjectBuyingSummary & { key: string; name: string; roomNames: string[] }>();

  function addFinishGroup(room: PaintRoom, paint: PaintRoom['paint'], estimate: CalculationResults, surface: string) {
    const normalizedPaintName = paint.name.trim().replace(/\s+/g, ' ').toLowerCase();
    const finishKey = `${normalizedPaintName}|${paint.sheen.toLowerCase()}|${room.inputs.paintQuality}`;
    const finish = finishGroupMap.get(finishKey) ?? {
      key: finishKey,
      name: paint.name,
      sheen: paint.sheen,
      quality: room.inputs.paintQuality,
      roomNames: [],
      roomIds: [],
      surfaces: [],
      lowGallons: 0,
      likelyGallons: 0,
      highGallons: 0,
      purchaseGallons: 0,
    };
    if (!finish.roomIds.includes(room.id)) {
      finish.roomIds.push(room.id);
      finish.roomNames.push(room.name);
    }
    if (!finish.surfaces.includes(surface)) finish.surfaces.push(surface);
    finish.lowGallons += estimate.estimateRange.low.gallonsWithWaste;
    finish.likelyGallons += estimate.estimateRange.likely.gallonsWithWaste;
    finish.highGallons += estimate.estimateRange.high.gallonsWithWaste;
    finish.purchaseGallons = Math.ceil(finish.likelyGallons);
    finishGroupMap.set(finishKey, finish);
  }

  rooms.forEach((room) => {
    if (room.inputs.surfaceType === 'walls-ceiling') {
      addFinishGroup(room, room.paint, calculatePaint({ ...room.inputs, surfaceType: 'walls' }), 'Walls');
      addFinishGroup(room, room.ceilingPaint, calculatePaint({ ...room.inputs, surfaceType: 'ceiling' }), 'Ceilings');
    } else {
      const surface = room.inputs.surfaceType === 'ceiling' ? 'Ceilings' : room.inputs.surfaceType === 'trim' ? 'Trim' : 'Walls';
      addFinishGroup(room, room.paint, room.estimate, surface);
    }

    if (room.inputs.needsPrimer) {
      const primerName = room.inputs.primerType === 'pva' ? 'PVA drywall primer' : room.inputs.primerType === 'high-hide' ? 'High-hide primer' : 'Standard primer';
      const primerKey = room.inputs.primerType || 'standard';
      const primer = primerGroupMap.get(primerKey) ?? {
        key: primerKey,
        name: primerName,
        roomNames: [],
        lowGallons: 0,
        likelyGallons: 0,
        highGallons: 0,
        purchaseGallons: 0,
      };
      primer.roomNames.push(room.name);
      primer.lowGallons += room.estimate.primerGallonsExact;
      primer.likelyGallons += room.estimate.primerGallonsExact;
      primer.highGallons += room.estimate.primerGallonsExact;
      primer.purchaseGallons = Math.ceil(primer.likelyGallons);
      primerGroupMap.set(primerKey, primer);
    }
  });

  const totals = rooms.reduce(
    (acc, room) => {
      const estimate = room.estimate;
      acc.totalPaintableArea += estimate.paintableArea + estimate.ceilingPaintableArea;
      acc.totalCeilingArea += estimate.ceilingPaintableArea;
      acc.finish.lowGallons += estimate.estimateRange.low.gallonsWithWaste;
      acc.finish.likelyGallons += estimate.estimateRange.likely.gallonsWithWaste;
      acc.finish.highGallons += estimate.estimateRange.high.gallonsWithWaste;
      acc.finish.purchaseGallons = Math.ceil(acc.finish.likelyGallons);
      acc.primer.lowGallons += estimate.primerGallonsExact;
      acc.primer.likelyGallons += estimate.primerGallonsExact;
      acc.primer.highGallons += estimate.primerGallonsExact;
      acc.primer.purchaseGallons = Math.ceil(acc.primer.likelyGallons);
      return acc;
    },
    {
      totalPaintableArea: 0,
      totalCeilingArea: 0,
      finish: {
        lowGallons: 0,
        likelyGallons: 0,
        highGallons: 0,
        purchaseGallons: 0,
      },
      primer: {
        lowGallons: 0,
        likelyGallons: 0,
        highGallons: 0,
        purchaseGallons: 0,
      },
    },
  );

  return {
    roomCount: rooms.length,
    totalPaintableArea: Math.round(totals.totalPaintableArea),
    totalCeilingArea: Math.round(totals.totalCeilingArea),
    finish: {
      lowGallons: roundToOneDecimal(totals.finish.lowGallons),
      likelyGallons: roundToOneDecimal(totals.finish.likelyGallons),
      highGallons: roundToOneDecimal(totals.finish.highGallons),
      purchaseGallons: totals.finish.purchaseGallons,
    },
    primer: {
      lowGallons: roundToOneDecimal(totals.primer.lowGallons),
      likelyGallons: roundToOneDecimal(totals.primer.likelyGallons),
      highGallons: roundToOneDecimal(totals.primer.highGallons),
      purchaseGallons: totals.primer.purchaseGallons,
    },
    finishGroups: Array.from(finishGroupMap.values()).map(roundGroup),
    primerGroups: Array.from(primerGroupMap.values()).map(roundGroup),
    rooms,
  };
}

function roundGroup<T extends ProjectBuyingSummary>(group: T): T {
  return {
    ...group,
    lowGallons: roundToOneDecimal(group.lowGallons),
    likelyGallons: roundToOneDecimal(group.likelyGallons),
    highGallons: roundToOneDecimal(group.highGallons),
  };
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function encodeUtf8(value: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf8').toString('base64');
  }

  let binary = '';
  const bytes = new TextEncoder().encode(value);
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeUtf8(value: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64').toString('utf8');
  }

  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodePaintProject(project: PaintProject): string {
  const json = JSON.stringify(project);
  return encodeUtf8(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}

export function decodePaintProject(value: string): PaintProject | null {
  if (!value) return null;

  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const remainder = padded.length % 4;
  const base64 = remainder === 0 ? padded : `${padded}${'='.repeat(4 - remainder)}`;

  try {
    const project = JSON.parse(decodeUtf8(base64));
    return normalizePaintProject(project);
  } catch {
    return null;
  }
}

export function createRoomFromTemplate(roomNumber: number, inputs?: Partial<CalculationInputs>): PaintRoom {
  return createPaintRoom(`Room ${roomNumber}`, inputs);
}
