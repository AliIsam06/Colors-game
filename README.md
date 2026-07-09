# Colors Flow

لعبة ألغاز موبايل شبيهة بـ Flow Free، مبنية بـ `React + TypeScript + Vite` ومجهزة للتغليف على أندرويد عبر `Capacitor`.

النسخة الحالية تحتوي على `30` مرحلة مع تدرج صعوبة حتى شبكة `12x12`، بالإضافة إلى شعار وأيقونات مخصصة للويب وأندرويد.

## التشغيل

```bash
npm install
npm run dev
```

## البناء

```bash
npm run build
```

## الأيقونة والشعار

- شعار اللعبة الرئيسي: [public/brand/colors-flow-logo.png](/home/aliisam06/Desktop/color%20game/public/brand/colors-flow-logo.png)
- نسخة الأيقونة الأصلية: [public/brand/colors-flow-icon-1024.png](/home/aliisam06/Desktop/color%20game/public/brand/colors-flow-icon-1024.png)
- `favicon`: [public/favicon.png](/home/aliisam06/Desktop/color%20game/public/favicon.png)

## أندرويد

أول مرة:

```bash
npm run android:add
```

بعد أي تعديل على الواجهة أو منطق اللعبة:

```bash
npm run android:sync
```

لفتح المشروع داخل Android Studio:

```bash
npm run android:open
```

## مكان إضافة المراحل

أضف أو عدّل المراحل في:

- [src/game/levels.ts](/home/aliisam06/Desktop/color%20game/src/game/levels.ts)

كل مرحلة تعرف بهذا الشكل:

```ts
{
  id: 'pulse-13',
  title: 'اسم المرحلة',
  subtitle: 'وصف قصير',
  size: 10,
  pattern: 'rows',
  lengths: [12, 9, 11, 7, 13, 8, 10, 6, 14, 10],
  transform: 'rotate90',
}
```

## كيف تعمل بيانات المرحلة

- `size`: حجم الشبكة.
- `pattern`: نوع المسار المولد أساسيًا. القيم الحالية: `rows`, `columns`, `spiral`.
- `lengths`: تقسيم اللوحة إلى مسارات ألوان. مجموع الأرقام يجب أن يساوي `size * size`.
- `transform`: تدوير أو عكس اختياري للشبكة.

## الملفات الأساسية

- [src/App.tsx](/home/aliisam06/Desktop/color%20game/src/App.tsx): الواجهة الرئيسية ومنطق السحب باللمس.
- [src/App.css](/home/aliisam06/Desktop/color%20game/src/App.css): التصميم والحركات والستايل المخصص للموبايل.
- [src/game/logic.ts](/home/aliisam06/Desktop/color%20game/src/game/logic.ts): قواعد الربط والتحقق من اكتمال المرحلة.
- [src/game/types.ts](/home/aliisam06/Desktop/color%20game/src/game/types.ts): الأنواع الأساسية.

## ملاحظات

- التقدم يُحفظ في `localStorage`.
- المراحل تُفتح تدريجيًا.
- اللوحة مبنية لتعمل باللمس و`pointer events` بشكل مناسب على الموبايل.
- أصول أندرويد داخل [android](</home/aliisam06/Desktop/color game/android>) تُحدّث عبر `npm run android:sync`.
