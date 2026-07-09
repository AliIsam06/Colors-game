import type { Cell, Level, LevelBlueprint, PatternName, TransformName } from './types'

const palette = [
  '#ff5f5f',
  '#37c4ff',
  '#f8e45c',
  '#9d6bff',
  '#3df29f',
  '#ff4fa3',
  '#ff9f43',
  '#65f25f',
  '#00e0c7',
  '#ff7ac6',
  '#6fd0ff',
  '#c3ff5a',
  '#ffc857',
  '#7d8bff',
  '#ff8b5e',
  '#7af0d0',
]

const blueprints: LevelBlueprint[] = [
  {
    id: 'pulse-01',
    title: 'النبضة الأولى',
    subtitle: 'تعريف سريع بالشبكة',
    size: 5,
    pattern: 'rows',
    lengths: [5, 4, 6, 3, 7],
  },
  {
    id: 'pulse-02',
    title: 'ممرات ملتفة',
    subtitle: 'انعطافات عمودية',
    size: 5,
    pattern: 'columns',
    lengths: [4, 5, 4, 6, 6],
    transform: 'mirror-y',
  },
  {
    id: 'pulse-03',
    title: 'الحلزون الخفيف',
    subtitle: 'ابدأ من الحواف',
    size: 6,
    pattern: 'spiral',
    lengths: [6, 4, 5, 7, 5, 9],
  },
  {
    id: 'pulse-04',
    title: 'نقل الزوايا',
    subtitle: 'المسار ينعكس بسرعة',
    size: 6,
    pattern: 'rows',
    lengths: [5, 6, 4, 7, 6, 8],
    transform: 'rotate90',
  },
  {
    id: 'pulse-05',
    title: 'حقول مزدحمة',
    subtitle: 'أوقف التقاطعات قبل أن تبدأ',
    size: 6,
    pattern: 'columns',
    lengths: [8, 4, 7, 5, 6, 6],
    transform: 'mirror-x',
  },
  {
    id: 'pulse-06',
    title: 'مجرة ضيقة',
    subtitle: 'المنتصف ليس آمنًا',
    size: 7,
    pattern: 'spiral',
    lengths: [8, 6, 5, 7, 9, 6, 8],
  },
  {
    id: 'pulse-07',
    title: 'تردد معكوس',
    subtitle: 'كل حركة تقفل مساحة',
    size: 7,
    pattern: 'rows',
    lengths: [7, 5, 8, 6, 7, 8, 8],
    transform: 'rotate180',
  },
  {
    id: 'pulse-08',
    title: 'خطوط عالية',
    subtitle: 'طول المسار يخدعك',
    size: 7,
    pattern: 'columns',
    lengths: [6, 9, 5, 8, 7, 5, 9],
  },
  {
    id: 'pulse-09',
    title: 'الدائرة العميقة',
    subtitle: 'طبقات فوق طبقات',
    size: 8,
    pattern: 'spiral',
    lengths: [10, 7, 8, 5, 9, 6, 8, 11],
  },
  {
    id: 'pulse-10',
    title: 'شبكة صلبة',
    subtitle: 'الخطأ هنا مكلف',
    size: 8,
    pattern: 'rows',
    lengths: [9, 6, 7, 8, 5, 10, 8, 11],
    transform: 'mirror-y',
  },
  {
    id: 'pulse-11',
    title: 'منعطفات باردة',
    subtitle: 'حافظ على الأطراف مفتوحة',
    size: 8,
    pattern: 'columns',
    lengths: [8, 9, 6, 7, 10, 5, 8, 11],
    transform: 'rotate270',
  },
  {
    id: 'pulse-12',
    title: 'اللوحة الكبرى',
    subtitle: 'نهاية الحزمة الأولى',
    size: 9,
    pattern: 'rows',
    lengths: [11, 8, 10, 6, 7, 9, 8, 12, 10],
  },
  {
    id: 'pulse-13',
    title: 'ضغط داخلي',
    subtitle: 'ابدأ من الأزواج الطويلة',
    size: 9,
    pattern: 'spiral',
    lengths: [12, 6, 9, 8, 10, 7, 11, 5, 13],
  },
  {
    id: 'pulse-14',
    title: 'قلب متشعب',
    subtitle: 'المسارات الوسطى تخدعك',
    size: 9,
    pattern: 'columns',
    lengths: [11, 8, 10, 6, 12, 7, 9, 5, 13],
    transform: 'rotate90',
  },
  {
    id: 'pulse-15',
    title: 'التيار المعاكس',
    subtitle: 'اترك الحواف لوقت مناسب',
    size: 9,
    pattern: 'rows',
    lengths: [10, 9, 7, 12, 6, 11, 8, 5, 13],
    transform: 'mirror-x',
  },
  {
    id: 'pulse-16',
    title: 'مجال مزدوج',
    subtitle: 'كل خط طويل يقفل مساحتين',
    size: 10,
    pattern: 'spiral',
    lengths: [13, 7, 10, 8, 11, 9, 12, 6, 14, 10],
  },
  {
    id: 'pulse-17',
    title: 'التواء صلب',
    subtitle: 'الأطراف لم تعد سهلة',
    size: 10,
    pattern: 'rows',
    lengths: [12, 9, 11, 7, 13, 8, 10, 6, 14, 10],
    transform: 'rotate180',
  },
  {
    id: 'pulse-18',
    title: 'حافة مشحونة',
    subtitle: 'الفراغات الصغيرة خطر مباشر',
    size: 10,
    pattern: 'columns',
    lengths: [11, 10, 8, 13, 7, 12, 9, 6, 14, 10],
    transform: 'mirror-y',
  },
  {
    id: 'pulse-19',
    title: 'دوامة شرسة',
    subtitle: 'لا تلمس المركز مبكرًا',
    size: 10,
    pattern: 'spiral',
    lengths: [14, 8, 12, 7, 11, 9, 13, 6, 10, 10],
    transform: 'rotate270',
  },
  {
    id: 'pulse-20',
    title: 'حزام مغلق',
    subtitle: 'كل لون يحتاج ممره الخاص',
    size: 11,
    pattern: 'rows',
    lengths: [14, 9, 11, 8, 12, 10, 13, 7, 15, 6, 16],
  },
  {
    id: 'pulse-21',
    title: 'شحنة متداخلة',
    subtitle: 'فكر ثلاثة حركات للأمام',
    size: 11,
    pattern: 'columns',
    lengths: [13, 10, 12, 9, 14, 8, 11, 7, 15, 6, 16],
    transform: 'rotate90',
  },
  {
    id: 'pulse-22',
    title: 'متاهة نبضية',
    subtitle: 'التقارب هنا خادع',
    size: 11,
    pattern: 'spiral',
    lengths: [12, 11, 9, 14, 10, 13, 8, 7, 15, 6, 16],
  },
  {
    id: 'pulse-23',
    title: 'انعكاس مطبق',
    subtitle: 'أحد الألوان سيجبر الحل',
    size: 11,
    pattern: 'rows',
    lengths: [15, 8, 13, 9, 12, 10, 14, 7, 11, 6, 16],
    transform: 'mirror-x',
  },
  {
    id: 'pulse-24',
    title: 'حاجز بارد',
    subtitle: 'المسارات القصيرة أهم من الطويلة',
    size: 11,
    pattern: 'columns',
    lengths: [16, 7, 12, 10, 14, 8, 13, 9, 11, 6, 15],
    transform: 'rotate180',
  },
  {
    id: 'pulse-25',
    title: 'الساحة الثقيلة',
    subtitle: 'بداية القسم القاسي',
    size: 12,
    pattern: 'spiral',
    lengths: [15, 10, 12, 9, 13, 11, 14, 8, 16, 7, 17, 12],
  },
  {
    id: 'pulse-26',
    title: 'فصل التيارات',
    subtitle: 'أغلق كل ممر بحذر شديد',
    size: 12,
    pattern: 'rows',
    lengths: [14, 11, 13, 10, 15, 9, 12, 8, 16, 7, 17, 12],
    transform: 'mirror-y',
  },
  {
    id: 'pulse-27',
    title: 'شبكة خانقة',
    subtitle: 'المركز مليء بالفخاخ',
    size: 12,
    pattern: 'columns',
    lengths: [13, 12, 10, 15, 9, 14, 11, 8, 16, 7, 17, 12],
    transform: 'rotate270',
  },
  {
    id: 'pulse-28',
    title: 'قفل حلزوني',
    subtitle: 'تحرير لون واحد يفتح الباقي',
    size: 12,
    pattern: 'spiral',
    lengths: [16, 9, 14, 10, 13, 11, 15, 8, 12, 7, 17, 12],
    transform: 'mirror-x',
  },
  {
    id: 'pulse-29',
    title: 'مجرة صامتة',
    subtitle: 'لا يوجد مسار مجاني هنا',
    size: 12,
    pattern: 'rows',
    lengths: [17, 8, 13, 11, 15, 9, 14, 10, 12, 7, 16, 12],
    transform: 'rotate90',
  },
  {
    id: 'pulse-30',
    title: 'النهاية الكهربائية',
    subtitle: 'أصعب لوحة في الحزمة',
    size: 12,
    pattern: 'columns',
    lengths: [15, 11, 14, 9, 13, 10, 16, 8, 12, 7, 17, 12],
    transform: 'rotate180',
  },
]

function buildRowSnake(size: number): Cell[] {
  const cells: Cell[] = []

  for (let y = 0; y < size; y += 1) {
    if (y % 2 === 0) {
      for (let x = 0; x < size; x += 1) {
        cells.push({ x, y })
      }
    } else {
      for (let x = size - 1; x >= 0; x -= 1) {
        cells.push({ x, y })
      }
    }
  }

  return cells
}

function buildColumnSnake(size: number): Cell[] {
  const cells: Cell[] = []

  for (let x = 0; x < size; x += 1) {
    if (x % 2 === 0) {
      for (let y = 0; y < size; y += 1) {
        cells.push({ x, y })
      }
    } else {
      for (let y = size - 1; y >= 0; y -= 1) {
        cells.push({ x, y })
      }
    }
  }

  return cells
}

function buildSpiral(size: number): Cell[] {
  const cells: Cell[] = []
  let minX = 0
  let minY = 0
  let maxX = size - 1
  let maxY = size - 1

  while (minX <= maxX && minY <= maxY) {
    for (let x = minX; x <= maxX; x += 1) {
      cells.push({ x, y: minY })
    }
    minY += 1

    for (let y = minY; y <= maxY; y += 1) {
      cells.push({ x: maxX, y })
    }
    maxX -= 1

    if (minY <= maxY) {
      for (let x = maxX; x >= minX; x -= 1) {
        cells.push({ x, y: maxY })
      }
      maxY -= 1
    }

    if (minX <= maxX) {
      for (let y = maxY; y >= minY; y -= 1) {
        cells.push({ x: minX, y })
      }
      minX += 1
    }
  }

  return cells
}

function applyTransform(cell: Cell, size: number, transform: TransformName): Cell {
  switch (transform) {
    case 'rotate90':
      return { x: size - 1 - cell.y, y: cell.x }
    case 'rotate180':
      return { x: size - 1 - cell.x, y: size - 1 - cell.y }
    case 'rotate270':
      return { x: cell.y, y: size - 1 - cell.x }
    case 'mirror-x':
      return { x: size - 1 - cell.x, y: cell.y }
    case 'mirror-y':
      return { x: cell.x, y: size - 1 - cell.y }
    case 'none':
    default:
      return cell
  }
}

function getPatternCells(pattern: PatternName, size: number): Cell[] {
  switch (pattern) {
    case 'columns':
      return buildColumnSnake(size)
    case 'spiral':
      return buildSpiral(size)
    case 'rows':
    default:
      return buildRowSnake(size)
  }
}

function createLevel(blueprint: LevelBlueprint): Level {
  const orderedCells = getPatternCells(blueprint.pattern, blueprint.size).map((cell) =>
    applyTransform(cell, blueprint.size, blueprint.transform ?? 'none'),
  )

  const totalLength = blueprint.lengths.reduce((sum, length) => sum + length, 0)
  if (totalLength !== blueprint.size * blueprint.size) {
    throw new Error(`Level ${blueprint.id} does not cover the board`)
  }

  let cursor = 0
  const pairs = blueprint.lengths.map((length, index) => {
    const segment = orderedCells.slice(cursor, cursor + length)
    cursor += length

    if (segment.length < 2) {
      throw new Error(`Level ${blueprint.id} has a path shorter than 2 cells`)
    }

    return {
      id: `${blueprint.id}-pair-${index + 1}`,
      color: palette[index % palette.length],
      endpoints: [segment[0], segment.at(-1)!] as [Cell, Cell],
    }
  })

  return {
    ...blueprint,
    pairs,
  }
}

export const levels = blueprints.map(createLevel)
