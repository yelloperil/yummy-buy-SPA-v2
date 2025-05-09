Parents:
- Needs explicit "grid declaration" i.e. "grid grid-cols-12"
- Child position: "col-start-x" "col-span-x"

Justify Content (Horizontal alignment)
<div class="grid content-start">Start</div>
<div class="grid content-end">End</div>
<div class="grid content-center">Center</div>
<div class="grid content-between">Space Between</div>
<div class="grid content-around">Space Around</div>
<div class="grid content-evenly">Space Evenly</div>

Align Content (Vertical alignment)
<div class="grid content-start">Start</div>
<div class="grid content-end">End</div>
<div class="grid content-center">Center</div>
<div class="grid content-between">Space Between</div>
<div class="grid content-around">Space Around</div>
<div class="grid content-evenly">Space Evenly</div>

Justify Items (Horizontal alignment within grid cells)
<div class="grid justify-items-start">Start</div>
<div class="grid justify-items-end">End</div>
<div class="grid justify-items-center">Center</div>
<div class="grid justify-items-stretch">Stretch</div>

Align Items (Vertical alignment within grid cells)
<div class="grid items-start">Start</div>
<div class="grid items-end">End</div>
<div class="grid items-center">Center</div>
<div class="grid items-stretch">Stretch</div>

Horizontal Alignment (justify-self)
<div class="grid grid-cols-3 gap-4">
  <div class="justify-self-start">Aligned to start</div>
  <div class="justify-self-center">Centered</div>
  <div class="justify-self-end">Aligned to end</div>
  <div class="justify-self-stretch">Stretched (default)</div>
</div>

Vertical Alignment (align-self)
<div class="grid grid-cols-3 grid-rows-3 gap-4">
  <div class="self-start">Aligned to top</div>
  <div class="self-center">Centered</div>
  <div class="self-end">Aligned to bottom</div>
  <div class="self-stretch">Stretched (default)</div>
</div>

Shorthand for Both (place-self)
<div class="place-self-center">Centered both horizontally and vertically</div>
<div class="place-self-end">Aligned bottom-right</div>