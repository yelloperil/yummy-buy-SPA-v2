Here’s a complete list of Tailwind CSS text size utilities:

| Class      | Font Size  | Line Height |
|------------|------------|------------|
| `text-xs`  | 0.75rem (12px) | 1 |
| `text-sm`  | 0.875rem (14px) | 1.25 |
| `text-base` | 1rem (16px) | 1.5 |
| `text-lg`  | 1.125rem (18px) | 1.75 |
| `text-xl`  | 1.25rem (20px) | 1.75 |
| `text-2xl` | 1.5rem (24px) | 2 |
| `text-3xl` | 1.875rem (30px) | 2.25 |
| `text-4xl` | 2.25rem (36px) | 2.5 |
| `text-5xl` | 3rem (48px) | 1 |
| `text-6xl` | 3.75rem (60px) | 1 |
| `text-7xl` | 4.5rem (72px) | 1 |
| `text-8xl` | 6rem (96px) | 1 |
| `text-9xl` | 8rem (128px) | 1 |

You can also define custom sizes using `text-[value]`, where `value` is any valid CSS font-size value.

Check out the official [Tailwind documentation](https://tailwindcss.com/docs/font-size) for additional details!


---


### 1. Tailwind Default Font Weights for `font-zen-maru-gothic`

Tailwind CSS provides a set of default font weight utilities that map to numerical CSS `font-weight` values. These can be applied to any font, including `font-zen-maru-gothic`. However, the actual appearance of these weights depends on whether the font (Zen Maru Gothic) supports those weights. According to Google Fonts, Zen Maru Gothic supports the following weights: **400 (Regular), 500 (Medium), 700 (Bold), 900 (Black)**.

Here are Tailwind’s default font weight utilities and their applicability to Zen Maru Gothic:

| Tailwind Class         | CSS `font-weight` | Supported by Zen Maru Gothic? |
|------------------------|-------------------|------------------------------|
| `font-thin`            | 100               | No (falls back to 400)       |
| `font-extralight`      | 200               | No (falls back to 400)       |
| `font-light`           | 300               | No (falls back to 400)       |
| `font-normal`          | 400               | Yes (Regular)                |
| `font-medium`          | 500               | Yes (Medium)                 |
| `font-semibold`        | 600               | No (falls back to 500 or 700)|
| `font-bold`            | 700               | Yes (Bold)                   |
| `font-extrabold`       | 800               | No (falls back to 700 or 900)|
| `font-black`           | 900               | Yes (Black)                  |

**Notes**:
- **Supported Weights**: You can reliably use `font-normal` (400), `font-medium` (500), `font-bold` (700), and `font-black` (900) with Zen Maru Gothic, as these match the font’s available weights.
- **Unsupported Weights**: For weights like `font-thin` (100), `font-light` (300), `font-semibold` (600), or `font-extrabold` (800), the browser will fallback to the closest available weight (likely 400, 500, 700, or 900), which may not visually differ as expected.
- **Usage Example**: Apply weights like `<h1 class="font-zen-maru-gothic font-bold">Text</h1>` for 700 or `<h1 class="font-zen-maru-gothic font-black">Text</h1>` for 900.

To ensure all weights are available, you can explicitly load them in your Google Fonts `<link>` by specifying `wght@400;500;700;900`. Your current `<link>` (from the previous response) already includes Zen Maru Gothic with default weights, but you can confirm or update it to:

```html
<link
  href="https://fonts.googleapis.com/css2?...&family=Zen+Maru+Gothic:wght@400;500;700;900&...&display=swap"
  rel="stylesheet"
>
```

If you want to test different weights, try applying classes like `font-normal`, `font-medium`, `font-bold`, or `font-black` to your `<h1>` and inspect the result.